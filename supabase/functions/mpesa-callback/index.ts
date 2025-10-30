import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.34.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Expected environment variables (pre-populated by Supabase runtime):
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const MPESA_CALLBACK_SECRET = Deno.env.get('MPESA_CALLBACK_SECRET') || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Helper: verify webhook signature using a simple HMAC-SHA256 with shared secret.
async function verifySignature(bodyText: string, signatureHeader?: string) {
  if (!MPESA_CALLBACK_SECRET) return false;
  if (!signatureHeader) return false;
  
  try {
    const enc = new TextEncoder();
    const keyData = enc.encode(MPESA_CALLBACK_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', 
      keyData, 
      { name: 'HMAC', hash: 'SHA-256' }, 
      false, 
      ['verify']
    );
    const signatureBytes = Uint8Array.from(atob(signatureHeader), c => c.charCodeAt(0));
    const data = enc.encode(bodyText);
    return await crypto.subtle.verify('HMAC', cryptoKey, signatureBytes, data);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('M-Pesa callback received:', req.method);
    
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const bodyText = await req.text();
    console.log('Callback payload:', bodyText);
    
    const signature = req.headers.get('x-mpesa-signature') || req.headers.get('x-signature');

    // If you have a callback secret, verify signature
    if (MPESA_CALLBACK_SECRET) {
      const ok = await verifySignature(bodyText, signature || undefined);
      if (!ok) {
        console.error('Invalid signature');
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid signature' }), 
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    const payload = JSON.parse(bodyText);
    console.log('Parsed payload:', payload);

    // Adjust these field names to your M-Pesa provider's payload structure
    const orderId = payload?.metadata?.order_id || payload?.invoice || payload?.order_id || payload?.AccountReference;
    const paidAmount = Number(payload?.amount || payload?.paid_amount || payload?.transactionAmount || payload?.Amount);
    const transactionId = payload?.transaction_id || payload?.checkout_request_id || payload?.txid || payload?.TransID || null;
    const payerPhone = payload?.msisdn || payload?.phone || payload?.customer_msisdn || payload?.MSISDN || null;

    console.log('Extracted data:', { orderId, paidAmount, transactionId, payerPhone });

    if (!orderId || !paidAmount) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing order_id or amount in payload' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Look up order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, total_amount, user_id, status')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      console.error('Order lookup error', orderErr);
      return new Response(
        JSON.stringify({ success: false, message: 'Order not found' }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Found order:', order);

    // Validate amounts: allow small rounding differences
    const diff = Math.abs(Number(order.total_amount) - paidAmount);
    if (diff > 0.5) {
      console.warn('Amount mismatch', { orderAmount: order.total_amount, paidAmount });
      return new Response(
        JSON.stringify({ success: false, message: 'Amount mismatch' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Begin DB updates: insert payment, update order status
    const now = new Date().toISOString();

    const { error: insertErr } = await supabase
      .from('payments')
      .insert([{
        order_id: orderId,
        amount: paidAmount,
        transaction_id: transactionId,
        payer_phone: payerPhone,
        status: 'confirmed',
        created_at: now
      }]);

    if (insertErr) {
      console.error('Insert payment error', insertErr);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to record payment' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status: 'paid', paid_at: now })
      .eq('id', orderId);

    if (updateErr) {
      console.error('Update order error', updateErr);
      // not fatal for the provider; still acknowledge
    }

    // Build prompt to return to customer
    const { data: items, error: itemsErr } = await supabase
      .from('order_items')
      .select('product_id, product_name, quantity, product_price')
      .eq('order_id', orderId);

    const productList = items && items.length 
      ? items.map((it: any) => `${it.quantity} x ${it.product_name} (KSh ${it.product_price} each)`).join(', ') 
      : '';
    
    const prompt = `Thank you for your purchase! Order ${orderId} for ${productList}. Amount paid: KSh ${paidAmount}. Transaction ID: ${transactionId || 'N/A'}.`;

    console.log('Payment processed successfully:', { orderId, paidAmount, transactionId });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed', 
        prompt, 
        order: { id: orderId, paid_amount: paidAmount } 
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (err) {
    console.error('Unhandled error', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});