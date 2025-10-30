-- Create payments table for M-Pesa transactions
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  transaction_id TEXT,
  payer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = (SELECT orders.user_id FROM orders WHERE orders.id = payments.order_id));

CREATE POLICY "System can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (true);

-- Add paid_at column to orders table
ALTER TABLE public.orders 
ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;

-- Create trigger for payments updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();