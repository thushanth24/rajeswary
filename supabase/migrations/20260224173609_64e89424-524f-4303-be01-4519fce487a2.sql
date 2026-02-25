-- Create storage bucket for ID proof documents
INSERT INTO storage.buckets (id, name, public) VALUES ('id-proofs', 'id-proofs', false);

-- Only admins/bungalow managers can view uploaded ID proofs
CREATE POLICY "Managers can view id proofs" ON storage.objects FOR SELECT
USING (bucket_id = 'id-proofs' AND (
  has_role(auth.uid(), 'bungalow_manager') OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'super_admin')
));

-- Anyone can upload id proofs (public booking form)
CREATE POLICY "Anyone can upload id proofs" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'id-proofs');

-- Managers can delete id proofs
CREATE POLICY "Managers can delete id proofs" ON storage.objects FOR DELETE
USING (bucket_id = 'id-proofs' AND (
  has_role(auth.uid(), 'bungalow_manager') OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'super_admin')
));

-- Add id_proof_url column to bungalow_bookings
ALTER TABLE public.bungalow_bookings ADD COLUMN IF NOT EXISTS id_proof_url text;