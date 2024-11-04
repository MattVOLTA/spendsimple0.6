-- Create a storage bucket for receipts if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('expense-receipts', 'expense-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'expense-receipts' );

-- Allow uploads without authentication for this demo
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'expense-receipts' );

-- Update expenses table to ensure receipt_url is properly typed
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS receipt_url text;