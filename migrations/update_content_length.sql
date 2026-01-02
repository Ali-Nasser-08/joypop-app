-- Update the content column constraint to allow 200 characters instead of 80
ALTER TABLE stars 
DROP CONSTRAINT IF EXISTS stars_content_check;

ALTER TABLE stars 
ADD CONSTRAINT stars_content_check 
CHECK (char_length(content) <= 200);
