-- Create bungalow_rooms table
CREATE TABLE public.bungalow_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text DEFAULT '',
  room_type text NOT NULL DEFAULT 'Double Room',
  ac_type text NOT NULL DEFAULT 'AC',
  max_adults integer NOT NULL DEFAULT 2,
  max_children integer NOT NULL DEFAULT 1,
  tariff_room_only numeric NOT NULL DEFAULT 0,
  tariff_bb numeric NOT NULL DEFAULT 0,
  tariff_full_board numeric NOT NULL DEFAULT 0,
  amenities text[] DEFAULT '{}',
  description text DEFAULT '',
  rules text[] DEFAULT ARRAY['Valid ID proof mandatory', 'No smoking inside premises', 'No pets allowed', 'Quiet hours: 10 PM - 6 AM'],
  check_in_time text DEFAULT '12:00 PM',
  check_out_time text DEFAULT '11:00 AM',
  images text[] DEFAULT '{}',
  available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.bungalow_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bungalow rooms" ON public.bungalow_rooms
  FOR SELECT USING (true);

CREATE POLICY "Managers can manage bungalow rooms" ON public.bungalow_rooms
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'bungalow_manager') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'bungalow_manager') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- Create storage bucket for bungalow room images
INSERT INTO storage.buckets (id, name, public) VALUES ('bungalow-images', 'bungalow-images', true);

CREATE POLICY "Anyone can view bungalow images" ON storage.objects
  FOR SELECT USING (bucket_id = 'bungalow-images');

CREATE POLICY "Authenticated users can upload bungalow images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'bungalow-images');

CREATE POLICY "Authenticated users can update bungalow images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'bungalow-images');

CREATE POLICY "Authenticated users can delete bungalow images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'bungalow-images');