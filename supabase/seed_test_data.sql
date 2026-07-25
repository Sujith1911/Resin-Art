-- ====================================================================
-- AURELIA — COMPLETE DATABASE RESET + SEED
-- This script DROPS all tables and recreates them fresh.
-- Run this ONE file in Supabase SQL Editor to set up everything.
-- ====================================================================

-- ★ STEP 1: DROP ALL EXISTING TABLES (clean slate)
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- ★ STEP 2: CREATE ALL TABLES
-- ====================================================================

-- ROLES
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.roles (name, description) VALUES
    ('Super Admin', 'Full system access'),
    ('Admin', 'Catalog, orders, user management'),
    ('Inventory Manager', 'Stock management'),
    ('Marketing Manager', 'Banners, coupons, discounts'),
    ('Support Agent', 'Customer tickets'),
    ('Customer', 'Storefront customer');

-- USER ROLES
CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- CATEGORIES
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    tagline TEXT,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    base_price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    compare_at_price_inr NUMERIC(10, 2),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    is_customizable BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Published',
    flower_details TEXT,
    resin_type VARCHAR(100),
    materials TEXT[] DEFAULT '{}',
    care_guide TEXT[] DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCT VARIANTS
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    compare_at_price_inr NUMERIC(10, 2),
    inventory_quantity INT NOT NULL DEFAULT 0,
    metal_color VARCHAR(50),
    size VARCHAR(50),
    shape VARCHAR(50),
    weight_grams NUMERIC(6, 2),
    dimensions_cm VARCHAR(50),
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDERS
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(254) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    subtotal_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_inr NUMERIC(10, 2) DEFAULT 0,
    shipping_inr NUMERIC(10, 2) DEFAULT 0,
    cgst_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sgst_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_inr NUMERIC(10, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    workshop_status VARCHAR(100) DEFAULT '1. Pending',
    tracking_number VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BANNERS
CREATE TABLE public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle TEXT,
    cta_text VARCHAR(100),
    cta_link TEXT,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'Active',
    priority INT DEFAULT 1,
    click_count INT DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COUPONS
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    discount_value VARCHAR(50) NOT NULL,
    min_purchase_inr NUMERIC(10, 2) DEFAULT 0,
    max_usage INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    categories TEXT DEFAULT 'All',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    category VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================================================
-- ★ STEP 3: INDEXES + TRIGGERS
-- ====================================================================

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_orders_status ON public.orders(payment_status);
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_banners_active ON public.banners(is_active);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- ★ STEP 4: ROW LEVEL SECURITY + POLICIES
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Open read/write for testing (tighten these for production)
CREATE POLICY "Allow All" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.coupons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.user_roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- ★ STEP 5: SEED TEST DATA
-- ====================================================================

-- CATEGORIES
INSERT INTO public.categories (name, slug) VALUES
  ('Pendants', 'pendants'),
  ('Earrings', 'earrings'),
  ('Bookmarks', 'bookmarks'),
  ('Coasters', 'coasters'),
  ('Bracelets', 'bracelets'),
  ('Wedding Keepsakes', 'wedding-keepsakes'),
  ('Rings', 'rings'),
  ('Hair Accessories', 'hair-accessories');

-- PRODUCTS
INSERT INTO public.products (slug, name, tagline, description, category_id, base_price_inr, compare_at_price_inr, rating, review_count, is_customizable, is_featured, is_bestseller, status, images)
VALUES
(
  'royal-emerald-fern-pendant',
  'Royal Emerald Fern Pendant',
  'Real Forest Fern in UV-Resistant Crystal Resin with 24K Gold Flakes',
  'Handcrafted luxury pendant with a real forest fern leaf in crystal resin, accented with 24K gold foil flakes on an 18K gold-plated chain.',
  (SELECT id FROM public.categories WHERE slug = 'pendants'),
  2999, 3999, 4.90, 48, TRUE, TRUE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85']
),
(
  'blushing-rose-drop-earrings',
  'Blushing Rose Drop Earrings',
  'Preserved miniature rose buds in teardrop crystal resin with rose gold hooks',
  'Teardrop earrings with preserved pink rose buds in optically clear resin. Hypoallergenic rose gold hooks.',
  (SELECT id FROM public.categories WHERE slug = 'earrings'),
  1899, 2499, 4.80, 32, TRUE, TRUE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85']
),
(
  'oceanic-botanical-coasters-set',
  'Oceanic Botanical Coasters (Set of 4)',
  'Ocean-themed resin coasters with real pressed wildflowers and gold leaf',
  'Set of 4 resin coasters with real wildflowers in teal and blue gradient. Gold leaf accents, cork backing.',
  (SELECT id FROM public.categories WHERE slug = 'coasters'),
  2499, 3499, 4.95, 22, FALSE, TRUE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=85']
),
(
  'lavender-dreams-bookmark',
  'Lavender Dreams Bookmark',
  'Pressed lavender sprigs in slim crystal resin with silver foil',
  'Elegant bookmark with real pressed lavender in crystal-clear resin, silver foil accents and silk tassel.',
  (SELECT id FROM public.categories WHERE slug = 'bookmarks'),
  799, 999, 4.70, 65, FALSE, FALSE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85']
),
(
  'bridal-bouquet-preservation-block',
  'Bridal Bouquet Preservation Block',
  'Your wedding bouquet preserved forever in crystal resin with 24K gold',
  'We preserve your actual wedding bouquet flowers in a crystal-clear resin block with 24K gold flakes and engraved brass plate.',
  (SELECT id FROM public.categories WHERE slug = 'wedding-keepsakes'),
  14999, 19999, 5.00, 18, TRUE, TRUE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85']
),
(
  'wildflower-meadow-bracelet',
  'Wildflower Meadow Bracelet',
  'Adjustable gold-plated bracelet with real wildflower resin charm',
  'Dainty adjustable bracelet with a circular resin charm filled with real pressed wildflowers. 18K gold-plated.',
  (SELECT id FROM public.categories WHERE slug = 'bracelets'),
  1599, 2199, 4.85, 29, TRUE, FALSE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=85']
),
(
  'cherry-blossom-ring',
  'Cherry Blossom Resin Ring',
  'Real cherry blossom petal in adjustable resin ring with gold flakes',
  'Adjustable ring with a real cherry blossom petal in crystal resin, dusted with 24K gold flakes.',
  (SELECT id FROM public.categories WHERE slug = 'rings'),
  1299, 1799, 4.75, 41, TRUE, FALSE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85']
),
(
  'daisy-sunflower-hair-clip',
  'Daisy & Sunflower Hair Clip',
  'Real pressed daisy and sunflower petals in a resin hair barrette',
  'Hair clip with real pressed daisy and sunflower petals in crystal resin on a gold-toned metal barrette.',
  (SELECT id FROM public.categories WHERE slug = 'hair-accessories'),
  999, 1499, 4.60, 17, FALSE, FALSE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1490750967868-88aa4f44baee?auto=format&fit=crop&w=800&q=85']
);

-- PRODUCT VARIANTS (one per product)
INSERT INTO public.product_variants (product_id, sku, title, price_inr, inventory_quantity, metal_color)
SELECT p.id,
  'AUR-' || UPPER(LEFT(REPLACE(p.slug, '-', ''), 6)) || '-STD',
  'Standard',
  p.base_price_inr,
  CASE WHEN p.is_bestseller THEN 15 ELSE 25 END,
  'Gold'
FROM public.products p;

-- BANNERS
INSERT INTO public.banners (type, title, subtitle, cta_text, cta_link, desktop_image_url, is_active, status, priority) VALUES
(
  'Homepage Banner',
  'Handcrafted Eternal Botanicals',
  'Preserving Nature''s Timeless Grace in Premium Optical Resin & 24K Gold',
  'Explore Collection',
  '/#shop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=85',
  TRUE, 'Active', 1
),
(
  'Festival Banner',
  'Bespoke Bridal Bouquet Keepsakes',
  'Turn Your Wedding Flowers into Heirlooms That Last Forever',
  'Book Preservation',
  '/#custom-studio',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=85',
  TRUE, 'Active', 2
),
(
  'Offer Banner',
  'Summer Botanical Collection — 20% OFF',
  'Use code SUMMER20 at checkout. Valid until August 31st.',
  'Shop Now',
  '/#shop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=85',
  TRUE, 'Active', 3
);

-- COUPONS
INSERT INTO public.coupons (code, type, discount_value, min_purchase_inr, max_usage, is_active, categories) VALUES
  ('LUXURY10', 'Percentage', '10', 999, 500, TRUE, 'All'),
  ('FREESHIP', 'Free Shipping', '0', 1499, 1000, TRUE, 'All'),
  ('BRIDAL20', 'Percentage', '20', 5000, 100, TRUE, 'Wedding Keepsakes'),
  ('WELCOME15', 'Percentage', '15', 499, 200, TRUE, 'All');

-- TEST ORDERS
INSERT INTO public.orders (order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal_inr, discount_inr, shipping_inr, cgst_inr, sgst_inr, total_inr, payment_status, workshop_status, tracking_number) VALUES
(
  'AUR-20260001',
  'Priya Sharma',
  'priya.sharma@example.com',
  '+91 98765 43210',
  '{"line1": "42 MG Road", "city": "Bengaluru", "state": "Karnataka", "pincode": "560001"}'::jsonb,
  2999, 300, 0, 243, 243, 3185, 'PAID', '3. Processing', NULL
),
(
  'AUR-20260002',
  'Ananya Roy',
  'ananya.roy@example.com',
  '+91 87654 32109',
  '{"line1": "15 Park Street", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'::jsonb,
  1899, 0, 99, 180, 180, 2358, 'PAID', '5. Shipped', 'BD-90481'
),
(
  'AUR-20260003',
  'Vikram Malhotra',
  'vikram.m@example.com',
  '+91 76543 21098',
  '{"line1": "8 Connaught Place", "city": "New Delhi", "state": "Delhi", "pincode": "110001"}'::jsonb,
  14999, 3000, 0, 1080, 1080, 14159, 'PENDING', '1. Pending', NULL
);

-- ====================================================================
-- ✅ DONE! Your database is now fully set up with test data.
-- Tables: roles, user_roles, categories, products, product_variants,
--         orders, banners, coupons, audit_logs
-- ====================================================================
