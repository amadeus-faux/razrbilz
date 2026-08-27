-- Migration: Add shipping order status and retry fields to orders table
-- Date: 2026-08-27

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS shipping_order_error TEXT,
ADD COLUMN IF NOT EXISTS shipping_retry_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS biteship_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS biteship_tracking_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS biteship_status VARCHAR(100);

-- Create ShippingLog table if not already created
CREATE TABLE IF NOT EXISTS public.shipping_logs (
    id TEXT PRIMARY KEY DEFAULT concat('ship_log_', substr(md5(random()::text), 1, 16)),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    event VARCHAR(100) NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    note TEXT,
    raw_payload TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by biteship_order_id and shipping_order_status
CREATE INDEX IF NOT EXISTS idx_orders_biteship_order_id ON public.orders(biteship_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_order_status ON public.orders(shipping_order_status);
