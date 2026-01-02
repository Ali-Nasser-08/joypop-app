-- ============================================
-- Account Deletion Function
-- ============================================
-- This function allows users to delete their account and all associated data
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user's ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user's jars (if table exists)
  DELETE FROM public.jars WHERE user_id = current_user_id;
  
  -- Delete user's stars
  DELETE FROM public.stars WHERE user_id = current_user_id;
  
  -- Delete user's profile
  DELETE FROM public.profiles WHERE id = current_user_id;
  
  -- Delete the auth user (this is why we need SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = current_user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;

-- ============================================
-- Done! Users can now delete their accounts.
-- ============================================
