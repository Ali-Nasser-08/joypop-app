-- Rate Limiting Schema for JoyPop
-- This tracks star creation timestamps to enforce daily limits
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Create star_rate_limits table
-- ============================================
CREATE TABLE IF NOT EXISTS public.star_rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ============================================
-- 2. Create index for efficient queries
-- ============================================
CREATE INDEX IF NOT EXISTS idx_star_rate_limits_user_created 
  ON public.star_rate_limits(user_id, created_at DESC);

-- ============================================
-- 3. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.star_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Create RLS Policies
-- ============================================

-- Users can view their own rate limit records
CREATE POLICY "Users can view own rate limits"
  ON public.star_rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rate limit records
CREATE POLICY "Users can insert own rate limits"
  ON public.star_rate_limits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. Create cleanup function (optional)
-- ============================================
-- This function can be called periodically to clean up old rate limit records
-- You can set up a cron job in Supabase to run this daily

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  -- Delete records older than 7 days (we only need last 24 hours, but keep extra for safety)
  DELETE FROM public.star_rate_limits
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Done! Rate limiting table is ready.
-- ============================================
