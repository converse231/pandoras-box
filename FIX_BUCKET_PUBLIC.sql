-- ============================================
-- FIX: Make jewelry-images bucket PUBLIC
-- ============================================

-- This will allow the public URLs to work!

-- 1. Update the bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'jewelry-images';

-- 2. Create policy to allow public reads
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'jewelry-images' );

-- That's it! Your images will now be accessible via public URLs









