-- ====================================================================
-- AURELIA v3.0 — FULL WORKFLOW, QR MANAGEMENT, ADDRESSES & REALTIME CHAT
-- Run this script in Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. CUSTOMER ADDRESSES TABLE (Multiple Addresses per customer)
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Home', -- e.g., Home, Work, Bridal Venue
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address_line TEXT NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADMIN PAYMENT QR CODES TABLE
CREATE TABLE IF NOT EXISTS public.payment_qrs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g. "Google Pay (Primary)", "PhonePe UPI"
    upi_id VARCHAR(100) NOT NULL, -- e.g. "aureliabotanical@okaxis"
    qr_image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed default GPay QR placeholder
INSERT INTO public.payment_qrs (name, upi_id, qr_image_url, is_active, notes)
VALUES (
  'Google Pay / PhonePe UPI',
  'aurelia.botanical@upi',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=85',
  TRUE,
  'Scan to pay via GPay, PhonePe, Paytm, or BHIM UPI'
) ON CONFLICT DO NOTHING;

-- 3. UPDATE ORDERS TABLE (Payment Verification & Shiprocket Logistics)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_screenshot_url') THEN
    ALTER TABLE public.orders ADD COLUMN payment_screenshot_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_uploaded_at') THEN
    ALTER TABLE public.orders ADD COLUMN payment_uploaded_at TIMESTAMP WITH TIME ZONE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_verification_status') THEN
    ALTER TABLE public.orders ADD COLUMN payment_verification_status VARCHAR(50) DEFAULT 'PENDING_VERIFICATION';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='delivery_partner') THEN
    ALTER TABLE public.orders ADD COLUMN delivery_partner VARCHAR(50) DEFAULT 'Shiprocket';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shiprocket_order_id') THEN
    ALTER TABLE public.orders ADD COLUMN shiprocket_order_id VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shiprocket_shipment_id') THEN
    ALTER TABLE public.orders ADD COLUMN shiprocket_shipment_id VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='estimated_delivery_date') THEN
    ALTER TABLE public.orders ADD COLUMN estimated_delivery_date DATE;
  END IF;
END $$;

-- 4. REALTIME CHAT MESSAGES TABLE (With 1-Month Retention Policy)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_role VARCHAR(50) NOT NULL DEFAULT 'Customer', -- 'Customer' | 'Admin' | 'Support Agent'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast chat loading
CREATE INDEX IF NOT EXISTS idx_chat_messages_order ON public.chat_messages(order_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- Enable Supabase Realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- 30-DAY CHAT AUTO-PURGE FUNCTION (Keeps database lightweight)
CREATE OR REPLACE FUNCTION purge_old_chat_messages()
RETURNS void AS $$
BEGIN
    DELETE FROM public.chat_messages
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- 5. RLS POLICIES FOR NEW TABLES
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_qrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='customer_addresses' AND policyname='Allow All Addresses') THEN
    CREATE POLICY "Allow All Addresses" ON public.customer_addresses FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='payment_qrs' AND policyname='Allow All Payment QRs') THEN
    CREATE POLICY "Allow All Payment QRs" ON public.payment_qrs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='chat_messages' AND policyname='Allow All Chat Messages') THEN
    CREATE POLICY "Allow All Chat Messages" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
