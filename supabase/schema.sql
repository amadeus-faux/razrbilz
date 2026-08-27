-- ==============================================================================
-- RAZRBILZ E-COMMERCE DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT concat('prod_', substr(md5(random()::text), 1, 16)),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL, -- in IDR Rupiah integer
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PRODUCT SIZES TABLE (Variants & Inventory)
CREATE TABLE IF NOT EXISTS public.product_sizes (
    id TEXT PRIMARY KEY DEFAULT concat('size_', substr(md5(random()::text), 1, 16)),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size VARCHAR(20) NOT NULL, -- 'S', 'M', 'L', 'XL'
    stock INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT unique_product_size UNIQUE (product_id, size)
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT concat('ord_', substr(md5(random()::text), 1, 16)),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(10) NOT NULL DEFAULT 'ID',
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT '',
    postal_code VARCHAR(20) NOT NULL DEFAULT '',
    courier VARCHAR(100) NOT NULL,
    shipping_cost INTEGER NOT NULL DEFAULT 0,
    subtotal INTEGER NOT NULL,
    total INTEGER NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, failed, expired, refunded
    order_status VARCHAR(50) NOT NULL DEFAULT 'processing', -- processing, shipped, delivered, cancelled
    biteship_status VARCHAR(100),
    shipping_order_status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CREATED, FAILED
    shipping_order_error TEXT,
    shipping_retry_count INTEGER NOT NULL DEFAULT 0,
    tracking_number VARCHAR(100),
    biteship_order_id VARCHAR(100),
    biteship_tracking_id VARCHAR(100),
    midtrans_order_id VARCHAR(100) UNIQUE,
    snap_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3b. SHIPPING LOGS TABLE
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


-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY DEFAULT concat('item_', substr(md5(random()::text), 1, 16)),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    size VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_buy INTEGER NOT NULL
);

-- 5. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY DEFAULT concat('adm_', substr(md5(random()::text), 1, 16)),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON public.product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public read access policies for storefront
CREATE POLICY "Allow public read active products" 
    ON public.products FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Allow public read product sizes" 
    ON public.product_sizes FOR SELECT 
    USING (true);

-- Allow public order creation
CREATE POLICY "Allow public create orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read own order" 
    ON public.orders FOR SELECT 
    USING (true);

CREATE POLICY "Allow public create order items" 
    ON public.order_items FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read order items" 
    ON public.order_items FOR SELECT 
    USING (true);
