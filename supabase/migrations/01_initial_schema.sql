-- ====================================================================
-- AURELIA LUXURY BOTANICAL ART & RESIN JEWELLERY PLATFORM
-- PRODUCTION SUPABASE POSTGRESQL MIGRATION SCHEMA v2.0
-- Security hardened: RLS, CHECK constraints, coupons table, triggers
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & PERMISSIONS (RBAC)
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.roles (name, description) VALUES
    ('Super Admin', 'Full system access and settings management'),
    ('Admin', 'Catalog, order processing, and user management'),
    ('Inventory Manager', 'Stock level management and supplier logs'),
    ('Marketing Manager', 'Banners, coupons, and discount campaigns'),
    ('Support Agent', 'Customer ticket moderation and inquiries'),
    ('Customer', 'Retail storefront customer')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 2. PRODUCTS & VARIANTS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL CHECK (length(name) >= 2),
    tagline TEXT,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    base_price_inr NUMERIC(10, 2) NOT NULL CHECK (base_price_inr >= 0),
    compare_at_price_inr NUMERIC(10, 2) CHECK (compare_at_price_inr IS NULL OR compare_at_price_inr >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    is_customizable BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
    flower_details TEXT,
    resin_type VARCHAR(100),
    materials TEXT[],
    care_guide TEXT[],
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL CHECK (price_inr >= 0),
    compare_at_price_inr NUMERIC(10, 2) CHECK (compare_at_price_inr IS NULL OR compare_at_price_inr >= 0),
    inventory_quantity INT NOT NULL DEFAULT 0 CHECK (inventory_quantity >= 0),
    metal_color VARCHAR(50),
    size VARCHAR(50),
    shape VARCHAR(50),
    weight_grams NUMERIC(6, 2) CHECK (weight_grams IS NULL OR weight_grams >= 0),
    dimensions_cm VARCHAR(50),
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS & CUSTOMIZATIONS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL CHECK (length(customer_name) >= 2),
    customer_email VARCHAR(254) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal_inr NUMERIC(10, 2) NOT NULL CHECK (subtotal_inr >= 0),
    discount_inr NUMERIC(10, 2) DEFAULT 0 CHECK (discount_inr >= 0),
    shipping_inr NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_inr >= 0),
    cgst_inr NUMERIC(10, 2) NOT NULL CHECK (cgst_inr >= 0),
    sgst_inr NUMERIC(10, 2) NOT NULL CHECK (sgst_inr >= 0),
    total_inr NUMERIC(10, 2) NOT NULL CHECK (total_inr >= 0),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    workshop_status VARCHAR(100) DEFAULT '1. Pending',
    tracking_number VARCHAR(100),
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BANNERS & CMS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL CHECK (length(title) >= 2),
    subtitle TEXT,
    cta_text VARCHAR(100),
    cta_link TEXT,
    desktop_image_url TEXT NOT NULL,
    mobile_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Draft', 'Scheduled', 'Active', 'Archived')),
    priority INT DEFAULT 1 CHECK (priority >= 0),
    click_count INT DEFAULT 0 CHECK (click_count >= 0),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COUPONS & DISCOUNTS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL CHECK (length(code) >= 2),
    type VARCHAR(50) NOT NULL CHECK (type IN ('Percentage', 'Flat INR', 'Free Shipping', 'Free Packaging', 'BOGO')),
    discount_value VARCHAR(50) NOT NULL,
    min_purchase_inr NUMERIC(10, 2) DEFAULT 0 CHECK (min_purchase_inr >= 0),
    max_usage INT DEFAULT 100 CHECK (max_usage >= 0),
    used_count INT DEFAULT 0 CHECK (used_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    categories TEXT DEFAULT 'All',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AUDIT LOGGING TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);

-- AUTO-UPDATE updated_at TRIGGER
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
-- ROW LEVEL SECURITY (RLS) POLICIES — Hardened
-- ====================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
        AND r.name IN ('Super Admin', 'Admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PRODUCTS: Public read, admin-only write
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin Insert Products" ON public.products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin Update Products" ON public.products FOR UPDATE USING (is_admin());
CREATE POLICY "Admin Delete Products" ON public.products FOR DELETE USING (is_admin());

-- ORDERS: Users read own, admins read all
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users Insert Orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin Update Orders" ON public.orders FOR UPDATE USING (is_admin());

-- BANNERS: Public read active, admin CRUD
CREATE POLICY "Public Read Active Banners" ON public.banners FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin Manage Banners" ON public.banners FOR ALL USING (is_admin());

-- COUPONS: Public read active for validation, admin CRUD
CREATE POLICY "Public Read Active Coupons" ON public.coupons FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admin Manage Coupons" ON public.coupons FOR ALL USING (is_admin());

-- AUDIT LOGS: Admin-only read, system write
CREATE POLICY "Admin Read Audit Logs" ON public.audit_logs FOR SELECT USING (is_admin());
CREATE POLICY "System Insert Audit Logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- USER ROLES: Super Admin only
CREATE POLICY "Super Admin Manage Roles" ON public.user_roles FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'Super Admin'
    )
);
CREATE POLICY "Users Read Own Role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
