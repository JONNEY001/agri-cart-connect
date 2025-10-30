import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CONSUMER_KEY = Deno.env.get('M_PESA_CONSUMER_KEY')!;
const CONSUMER_SECRET = Deno.env.get('M_PESA_CONSUMER_SECRET')!;
const PASSKEY = Deno.env.get('M_PESA_PASSKEY')!;
const SHORTCODE = Deno.env.get('M_PESA_SHORTCODE')!; // e.g., 174379 for sandbox
const ENV = Deno.env.get('M_PESA_ENV') || 'sandbox';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    console.log('M-Pesa STK Push request received');
    
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Request body text:', bodyText);
      
      if (!bodyText.trim()) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }

    const { amount, phone, accountReference } = requestBody;
    if (!amount || !phone) throw new Error('amount and phone are required');

    const baseUrl = ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

    // 1) Get OAuth token
    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`)}`,
      },
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(`Auth error: ${tokenJson.error || tokenRes.statusText}`);
    const accessToken = tokenJson.access_token;

    // 2) Prepare STK push payload
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);

    const payload = {
      BusinessShortCode: Number(SHORTCODE),
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(Number(amount)),
      PartyA: phone,
      PartyB: Number(SHORTCODE),
      PhoneNumber: phone,
      CallBackURL: 'https://example.com/mpesa/callback',
      AccountReference: String(accountReference || 'ORDER'),
      TransactionDesc: 'Order payment',
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const stkJson = await stkRes.json();
    if (!stkRes.ok) throw new Error(stkJson.errorMessage || 'STK push failed');

    return new Response(JSON.stringify(stkJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('mpesa-stk-push error', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
