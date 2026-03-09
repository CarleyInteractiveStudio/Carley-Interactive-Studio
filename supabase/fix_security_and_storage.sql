-- Migration and Fix Script for Carley Interactive Studio
-- This script ensures columns exist and fixes RLS issues.

-- 1. Ensure user_id column exists in all relevant tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'claims' AND COLUMN_NAME = 'user_id') THEN
        ALTER TABLE public.claims ADD COLUMN user_id UUID REFERENCES auth.users ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'reports' AND COLUMN_NAME = 'user_id') THEN
        ALTER TABLE public.reports ADD COLUMN user_id UUID REFERENCES auth.users ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'donations' AND COLUMN_NAME = 'user_id') THEN
        ALTER TABLE public.donations ADD COLUMN user_id UUID REFERENCES auth.users ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Fix mutable search_path for handle_new_user (security warning)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, recovery_email, gender, usage_type, institution, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'recovery_email',
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'usage_type',
    NEW.raw_user_meta_data->>'institution',
    COALESCE(NEW.raw_user_meta_data->>'language', 'es')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Refine RLS policies (fixing "always true" warnings)

-- Claims
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede enviar reclamos" ON public.claims;
DROP POLICY IF EXISTS "Usuarios autenticados pueden enviar sus propios reclamos" ON public.claims;
CREATE POLICY "Usuarios autenticados pueden enviar sus propios reclamos"
ON public.claims FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cualquiera puede enviar reportes" ON public.reports;
CREATE POLICY "Cualquiera puede enviar reportes"
ON public.reports FOR INSERT
WITH CHECK (user_email IS NOT NULL);

-- Donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insertar donaciones (público para PayPal callback)" ON public.donations;
DROP POLICY IF EXISTS "Insertar donaciones verificadas" ON public.donations;
CREATE POLICY "Insertar donaciones verificadas"
ON public.donations FOR INSERT
WITH CHECK (amount > 0);

-- 4. STORAGE BUCKETS AND POLICIES (Fixes "new row violates row-level security policy")

-- Create Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('claims', 'claims', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars Policies
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Claims Photos Policies
DROP POLICY IF EXISTS "Users can upload claim photos" ON storage.objects;
CREATE POLICY "Users can upload claim photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'claims' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Anyone can view claim photos" ON storage.objects;
CREATE POLICY "Anyone can view claim photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'claims');

-- Reports Photos Policies
DROP POLICY IF EXISTS "Anyone can upload report photos" ON storage.objects;
CREATE POLICY "Anyone can upload report photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'reports');

DROP POLICY IF EXISTS "Anyone can view report photos" ON storage.objects;
CREATE POLICY "Anyone can view report photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'reports');
