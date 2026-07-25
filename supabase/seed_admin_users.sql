-- ====================================================================
-- SEED ADMIN & TEST ACCOUNTS FOR SUPABASE AUTH
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- This creates 3 test users and assigns roles to them.
-- ====================================================================

-- ★ STEP 1: Clean up any previous test users (safe reset)
DELETE FROM public.user_roles WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN (
        'admin@aureliabotanical.in',
        'ananya.roy@example.com',
        'priya.sharma@example.com'
    )
);

DELETE FROM auth.users WHERE email IN (
    'admin@aureliabotanical.in',
    'ananya.roy@example.com',
    'priya.sharma@example.com'
);

-- ★ STEP 2: Create Super Admin User
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, recovery_sent_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'authenticated',
    'authenticated',
    'admin@aureliabotanical.in',
    crypt('Admin@2026#Aurelia', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Super Admin"}',
    FALSE, NOW(), NOW(), '', '', '', ''
);

-- ★ STEP 3: Create VIP Bridal Client
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, recovery_sent_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'authenticated',
    'authenticated',
    'ananya.roy@example.com',
    crypt('BridalUser@2026', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Ananya Roy"}',
    FALSE, NOW(), NOW(), '', '', '', ''
);

-- ★ STEP 4: Create Retail Customer
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, recovery_sent_at, last_sign_in_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'authenticated',
    'authenticated',
    'priya.sharma@example.com',
    crypt('Customer@2026', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Priya Sharma"}',
    FALSE, NOW(), NOW(), '', '', '', ''
);

-- ★ STEP 5: Create identities for each user (REQUIRED for Supabase auth to work)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'admin@aureliabotanical.in',
    jsonb_build_object('sub', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'email', 'admin@aureliabotanical.in'),
    'email',
    NOW(), NOW(), NOW()
);

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'ananya.roy@example.com',
    jsonb_build_object('sub', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'email', 'ananya.roy@example.com'),
    'email',
    NOW(), NOW(), NOW()
);

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'priya.sharma@example.com',
    jsonb_build_object('sub', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'email', 'priya.sharma@example.com'),
    'email',
    NOW(), NOW(), NOW()
);

-- ★ STEP 6: Assign roles to users in user_roles table
-- Super Admin role
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', id
FROM public.roles WHERE name = 'Super Admin'
ON CONFLICT DO NOTHING;

-- Customer role for VIP bridal user (Ananya)
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', id
FROM public.roles WHERE name = 'Customer'
ON CONFLICT DO NOTHING;

-- Customer role for retail customer (Priya)
INSERT INTO public.user_roles (user_id, role_id)
SELECT 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', id
FROM public.roles WHERE name = 'Customer'
ON CONFLICT DO NOTHING;

-- ====================================================================
-- VERIFICATION: Run this to confirm users and roles were created
-- ====================================================================
-- SELECT u.email, r.name as role
-- FROM auth.users u
-- LEFT JOIN public.user_roles ur ON u.id = ur.user_id
-- LEFT JOIN public.roles r ON ur.role_id = r.id
-- WHERE u.email IN ('admin@aureliabotanical.in', 'ananya.roy@example.com', 'priya.sharma@example.com');
