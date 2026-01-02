-- ============================================
-- STEP 1: Enable Encryption Extension
-- ============================================
-- Enable the pgcrypto extension for encryption functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- STEP 2: Create Encryption/Decryption Functions
-- ============================================

-- Function to encrypt content
-- Uses AES-256 encryption with a secret key from Supabase vault
CREATE OR REPLACE FUNCTION public.encrypt_content(content_text TEXT)
RETURNS BYTEA
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Get the encryption key from Supabase secrets
  -- You'll set this up in Supabase dashboard: Settings > Vault
  encryption_key := current_setting('app.settings.encryption_key', true);
  
  -- If no key is set, use a default (you should change this!)
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'CHANGE_THIS_TO_YOUR_SECRET_KEY_32CHARS';
  END IF;
  
  -- Encrypt using AES-256
  RETURN encrypt(
    content_text::bytea,
    encryption_key::bytea,
    'aes'
  );
END;
$$;

-- Function to decrypt content
CREATE OR REPLACE FUNCTION public.decrypt_content(encrypted_content BYTEA)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  -- Handle NULL values
  IF encrypted_content IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get the encryption key from Supabase secrets
  encryption_key := current_setting('app.settings.encryption_key', true);
  
  -- If no key is set, use the default
  IF encryption_key IS NULL OR encryption_key = '' THEN
    encryption_key := 'CHANGE_THIS_TO_YOUR_SECRET_KEY_32CHARS';
  END IF;
  
  -- Decrypt using AES-256
  RETURN convert_from(
    decrypt(
      encrypted_content,
      encryption_key::bytea,
      'aes'
    ),
    'UTF8'
  );
END;
$$;

-- ============================================
-- STEP 3: Migrate Existing Data
-- ============================================

-- Add a temporary column for encrypted content
ALTER TABLE public.stars ADD COLUMN IF NOT EXISTS content_encrypted BYTEA;

-- Encrypt all existing content
-- This will take a moment if you have many stars
UPDATE public.stars 
SET content_encrypted = encrypt_content(content)
WHERE content_encrypted IS NULL;

-- Drop the old plaintext column
ALTER TABLE public.stars DROP COLUMN content;

-- Rename encrypted column to content
ALTER TABLE public.stars RENAME COLUMN content_encrypted TO content;

-- ============================================
-- STEP 4: Create Decrypted View
-- ============================================

-- Create a view that automatically decrypts content for queries
CREATE OR REPLACE VIEW public.stars_decrypted AS
SELECT 
  id,
  user_id,
  type,
  decrypt_content(content) AS content,
  created_at
FROM public.stars;

-- Grant access to authenticated users
GRANT SELECT ON public.stars_decrypted TO authenticated;

-- ============================================
-- STEP 5: Create Insert Function for Encrypted Stars
-- ============================================

CREATE OR REPLACE FUNCTION public.insert_star_encrypted(
  p_user_id UUID,
  p_type TEXT,
  p_content TEXT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type TEXT,
  content TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_star_id UUID;
  new_created_at TIMESTAMPTZ;
BEGIN
  -- Insert with encrypted content
  INSERT INTO public.stars (user_id, type, content)
  VALUES (p_user_id, p_type, encrypt_content(p_content))
  RETURNING stars.id, stars.created_at INTO new_star_id, new_created_at;
  
  -- Return the decrypted version
  RETURN QUERY
  SELECT 
    new_star_id,
    p_user_id,
    p_type,
    p_content,
    new_created_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.insert_star_encrypted TO authenticated;

-- ============================================
-- STEP 6: Verification Queries
-- ============================================

-- Check that encryption is working
-- This should show binary data (encrypted)
-- SELECT content FROM public.stars LIMIT 3;

-- This should show readable text (decrypted)
-- SELECT content FROM public.stars_decrypted LIMIT 3;

-- ============================================
-- Done! Your star content is now encrypted.
-- ============================================

-- IMPORTANT NOTES:
-- 1. The encryption key is currently set to a default value
-- 2. You MUST change this in Supabase Vault (see setup instructions)
-- 3. Back up your encryption key - if lost, data is unrecoverable
-- 4. After running this, update your API code to use the new functions
