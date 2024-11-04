-- Enable public access for the storage bucket
UPDATE storage.buckets
SET public = true
WHERE id = 'expense-receipts';

-- Ensure proper CORS settings
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[],
    file_size_limit = 5242880
WHERE id = 'expense-receipts';

-- Update storage policies to ensure proper access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'expense-receipts'
  AND auth.role() = 'anon'
);

CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'expense-receipts'
  AND auth.role() = 'anon'
);