-- Fix Permissions for Public Schema
-- Run this in the Supabase SQL Editor to resolve "permission denied for schema public"

-- 1. Grant usage on schema public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA public TO postgres;

-- 2. Grant permissions on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO postgres;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;

-- 3. Grant permissions on all existing sequences (important for ID generation)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Ensure future tables also get these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon;

-- 5. Extra check for specific tables we use
GRANT ALL PRIVILEGES ON TABLE public.profiles TO postgres, authenticated, service_role;
GRANT SELECT ON TABLE public.profiles TO anon;

GRANT ALL PRIVILEGES ON TABLE public.opinions TO postgres, authenticated, service_role;
GRANT SELECT ON TABLE public.opinions TO anon;

GRANT ALL PRIVILEGES ON TABLE public.reports TO postgres, authenticated, service_role, anon;
GRANT ALL PRIVILEGES ON TABLE public.claims TO postgres, authenticated, service_role, anon;
GRANT ALL PRIVILEGES ON TABLE public.donations TO postgres, authenticated, service_role, anon;
GRANT ALL PRIVILEGES ON TABLE public.deletion_requests TO postgres, authenticated, service_role;
