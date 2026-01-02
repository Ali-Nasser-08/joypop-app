-- JoyPop Database Schema Setup
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- 2. Create stars table
-- ============================================
CREATE TABLE IF NOT EXISTS public.stars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('savouring', 'kindness', 'gratitude')),
  content TEXT NOT NULL CHECK (char_length(content) <= 80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ============================================
-- 3. Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_stars_user_id ON public.stars(user_id);
CREATE INDEX IF NOT EXISTS idx_stars_type ON public.stars(type);
CREATE INDEX IF NOT EXISTS idx_stars_created_at ON public.stars(created_at DESC);

-- ============================================
-- 4. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stars ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Create RLS Policies for profiles table
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 6. Create RLS Policies for stars table
-- ============================================

-- Users can view their own stars
CREATE POLICY "Users can view own stars"
  ON public.stars
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own stars
CREATE POLICY "Users can insert own stars"
  ON public.stars
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own stars
CREATE POLICY "Users can delete own stars"
  ON public.stars
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. Create function to auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Create trigger to call the function
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Done! Your database is ready.
-- ============================================
