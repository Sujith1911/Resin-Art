-- ====================================================================
-- SEED TEST DATA — Real products, banners, coupons, orders
-- Run this in Supabase SQL Editor AFTER running 01_initial_schema.sql
-- and seed_admin_users.sql
-- ====================================================================

-- ★ FIX: Add missing columns if they don't exist (safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='status') THEN
    ALTER TABLE public.products ADD COLUMN status VARCHAR(20) DEFAULT 'Published';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='flower_details') THEN
    ALTER TABLE public.products ADD COLUMN flower_details TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='resin_type') THEN
    ALTER TABLE public.products ADD COLUMN resin_type VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='materials') THEN
    ALTER TABLE public.products ADD COLUMN materials TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='products' AND column_name='care_guide') THEN
    ALTER TABLE public.products ADD COLUMN care_guide TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='banners' AND column_name='status') THEN
    ALTER TABLE public.banners ADD COLUMN status VARCHAR(20) DEFAULT 'Active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='banners' AND column_name='click_count') THEN
    ALTER TABLE public.banners ADD COLUMN click_count INT DEFAULT 0;
  END IF;
END $$;

-- ★ CATEGORIES
INSERT INTO public.categories (name, slug) VALUES
  ('Pendants', 'pendants'),
  ('Earrings', 'earrings'),
  ('Bookmarks', 'bookmarks'),
  ('Coasters', 'coasters'),
  ('Bracelets', 'bracelets'),
  ('Wedding Keepsakes', 'wedding-keepsakes'),
  ('Rings', 'rings'),
  ('Hair Accessories', 'hair-accessories')
ON CONFLICT (name) DO NOTHING;

-- ★ PRODUCTS (8 items with real descriptions)
-- Using only columns guaranteed to exist in the base schema + the ones we just added
INSERT INTO public.products (slug, name, tagline, description, category_id, base_price_inr, compare_at_price_inr, rating, review_count, is_customizable, is_featured, is_bestseller, status, images)
VALUES
(
  'royal-emerald-fern-pendant',
  'Royal Emerald Fern Pendant',
  'Real Forest Fern encased in UV-Resistant Crystal Resin with 24K Gold Flakes',
  'Handcrafted luxury pendant carrying a real, hand-harvested forest fern leaf captured in high-transparency crystal resin, accented with genuine 24K gold foil flakes and suspended on an 18K gold-plated snake chain. Each piece is unique — no two fern patterns are identical.',
  (SELECT id FROM public.categories WHERE slug = 'pendants'),
  2999, 3999, 4.90, 48, TRUE, TRUE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85']
),
(
  'blushing-rose-drop-earrings',
  'Blushing Rose Drop Earrings',
  'Preserved miniature rose buds in teardrop crystal resin with rose gold hooks',
  'Delicate teardrop-shaped earrings with hand-preserved miniature pink rose buds suspended in optically clear resin. Finished with hypoallergenic rose gold-plated hooks. Lightweight and comfortable for all-day wear.',
  (SELECT id FROM public.categories WHERE slug = 'earrings'),
  1899, 2499, 4.80, 32, TRUE, TRUE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85']
),
(
  'oceanic-botanical-coasters-set',
  'Oceanic Botanical Coasters (Set of 4)',
  'Hand-poured ocean-themed resin coasters with real pressed wildflowers and gold leaf',
  'Set of 4 handcrafted resin coasters featuring real pressed wildflowers arranged in an ocean-inspired gradient of teal and deep blue. Each coaster is accented with genuine gold leaf and has cork backing to protect furniture.',
  (SELECT id FROM public.categories WHERE slug = 'coasters'),
  2499, 3499, 4.95, 22, FALSE, TRUE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=85']
),
(
  'lavender-dreams-bookmark',
  'Lavender Dreams Bookmark',
  'Pressed lavender sprigs in slim crystal resin with silver foil accents',
  'An elegant bookmark featuring real pressed lavender sprigs encased in crystal-clear resin, finished with delicate silver foil accents and a silk tassel. Perfect for book lovers who appreciate botanical art.',
  (SELECT id FROM public.categories WHERE slug = 'bookmarks'),
  799, 999, 4.70, 65, FALSE, FALSE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85']
),
(
  'bridal-bouquet-preservation-block',
  'Bridal Bouquet Preservation Block',
  'Your actual wedding bouquet preserved forever in crystal-clear optical resin with 24K gold',
  'The ultimate bridal keepsake — we take your actual wedding bouquet flowers, professionally dry and preserve them, then hand-cast them in a large crystal-clear resin block with optional 24K gold flakes. Includes a personalized engraved brass plate.',
  (SELECT id FROM public.categories WHERE slug = 'wedding-keepsakes'),
  14999, 19999, 5.00, 18, TRUE, TRUE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85']
),
(
  'wildflower-meadow-bracelet',
  'Wildflower Meadow Bracelet',
  'Adjustable gold-plated bracelet with real wildflower resin charm',
  'A dainty adjustable bracelet featuring a small circular resin charm filled with real pressed wildflowers. The bracelet is 18K gold-plated with a lobster clasp and adjustable chain.',
  (SELECT id FROM public.categories WHERE slug = 'bracelets'),
  1599, 2199, 4.85, 29, TRUE, FALSE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=85']
),
(
  'cherry-blossom-ring',
  'Cherry Blossom Resin Ring',
  'Real preserved cherry blossom petal in adjustable resin ring with gold flakes',
  'A stunning adjustable ring featuring a real preserved cherry blossom petal floating in crystal-clear resin, dusted with 24K gold flakes. The band is adjustable to fit most sizes.',
  (SELECT id FROM public.categories WHERE slug = 'rings'),
  1299, 1799, 4.75, 41, TRUE, FALSE, TRUE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85']
),
(
  'daisy-sunflower-hair-clip',
  'Daisy & Sunflower Hair Clip',
  'Real pressed daisy and sunflower petals in a resin hair barrette',
  'A beautiful hair clip featuring real pressed daisy and sunflower petals arranged in crystal resin, mounted on a sturdy gold-toned metal barrette. Adds a touch of botanical elegance to any hairstyle.',
  (SELECT id FROM public.categories WHERE slug = 'hair-accessories'),
  999, 1499, 4.60, 17, FALSE, FALSE, FALSE, 'Published',
  ARRAY['https://images.unsplash.com/photo-1490750967868-88aa4f44baee?auto=format&fit=crop&w=800&q=85']
)
ON CONFLICT (slug) DO NOTHING;

-- ★ PRODUCT VARIANTS (one default variant per product)
INSERT INTO public.product_variants (product_id, sku, title, price_inr, inventory_quantity, metal_color)
SELECT p.id, 
  'AUR-' || UPPER(LEFT(REPLACE(p.slug, '-', ''), 6)) || '-STD',
  'Standard',
  p.base_price_inr,
  CASE WHEN p.is_bestseller THEN 15 ELSE 25 END,
  'Gold'
FROM public.products p
WHERE NOT EXISTS (SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id);

-- ★ BANNERS (3 homepage banners)
INSERT INTO public.banners (type, title, subtitle, cta_text, cta_link, desktop_image_url, is_active, priority) VALUES
(
  'Homepage Banner',
  'Handcrafted Eternal Botanicals',
  'Preserving Nature''s Timeless Grace in Premium Optical Resin & 24K Gold',
  'Explore Luxury Collection',
  '/#shop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=85',
  TRUE, 1
),
(
  'Festival Banner',
  'Bespoke Bridal Bouquet Keepsakes',
  'Turn Your Wedding Flowers into Heirlooms That Last Forever',
  'Book Preservation',
  '/#custom-studio',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=85',
  TRUE, 2
),
(
  'Offer Banner',
  'Summer Botanical Collection — 20% OFF',
  'Use code SUMMER20 at checkout. Valid until August 31st.',
  'Shop Now',
  '/#shop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=85',
  TRUE, 3
);

-- ★ COUPONS (4 active coupons)
INSERT INTO public.coupons (code, type, discount_value, min_purchase_inr, max_usage, is_active, categories) VALUES
  ('LUXURY10', 'Percentage', '10', 999, 500, TRUE, 'All'),
  ('FREESHIP', 'Free Shipping', '0', 1499, 1000, TRUE, 'All'),
  ('BRIDAL20', 'Percentage', '20', 5000, 100, TRUE, 'Wedding Keepsakes'),
  ('WELCOME15', 'Percentage', '15', 499, 200, TRUE, 'All')
ON CONFLICT (code) DO NOTHING;

-- ★ TEST ORDERS (3 orders — using placeholder user_id since actual IDs depend on your auth setup)
-- NOTE: If these fail due to user_id FK constraint, comment out the user_id field
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
)
ON CONFLICT (order_number) DO NOTHING;
