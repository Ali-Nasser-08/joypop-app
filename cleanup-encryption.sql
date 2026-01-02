-- ============================================
-- CLEANUP: Remove encryption functions
-- Run this in your Supabase SQL Editor
-- ============================================

-- Drop the GET functions
DROP FUNCTION IF EXISTS public.get_stars_decrypted();
DROP FUNCTION IF EXISTS public.get_jars_decrypted();

-- Drop the INSERT functions
DROP FUNCTION IF EXISTS public.insert_star_encrypted(UUID, TEXT, TEXT, UUID);
DROP FUNCTION IF EXISTS public.insert_jar_encrypted(UUID, TEXT);

-- Verify functions are removed
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%encrypted%';

-- Should return 0 rows (no functions)
