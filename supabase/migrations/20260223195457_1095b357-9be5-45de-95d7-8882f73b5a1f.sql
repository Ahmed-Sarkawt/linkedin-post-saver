
-- Create a public storage bucket for the extension download
INSERT INTO storage.buckets (id, name, public) VALUES ('extension', 'extension', true);

-- Allow anyone to read/download files from the extension bucket
CREATE POLICY "Public read access for extension files"
ON storage.objects FOR SELECT
USING (bucket_id = 'extension');
