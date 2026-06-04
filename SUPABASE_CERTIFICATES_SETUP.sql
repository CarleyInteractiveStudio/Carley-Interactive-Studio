-- SQL to setup the certificates and progress system
-- Run this in the Supabase SQL Editor

-- 1. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY, -- Professional serial code like CE-2026-ABCDE
    user_id UUID NOT NULL REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    rank TEXT NOT NULL,
    achievements JSONB DEFAULT '[]'::jsonb,
    privacy_settings JSONB DEFAULT '{"show_score": true, "show_rank": true, "show_achievements": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Course Progress Table
CREATE TABLE IF NOT EXISTS public.course_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    stage INTEGER DEFAULT 1,
    completed_courses JSONB DEFAULT '[]'::jsonb,
    credits INTEGER DEFAULT 0,
    owned_skins JSONB DEFAULT '["default"]'::jsonb,
    active_skin TEXT DEFAULT 'default',
    achievements JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for Certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anyone can read a certificate if they have the ID (to support the verification page)
DROP POLICY IF EXISTS "Public read for verification" ON public.certificates;
CREATE POLICY "Public read for verification" ON public.certificates
    FOR SELECT USING (true);

-- Users can only insert/update their own certificates
DROP POLICY IF EXISTS "Users can manage own certificates" ON public.certificates;
CREATE POLICY "Users can manage own certificates" ON public.certificates
    FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Course Progress
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own progress" ON public.course_progress;
CREATE POLICY "Users can manage own progress" ON public.course_progress
    FOR ALL USING (auth.uid() = user_id);
