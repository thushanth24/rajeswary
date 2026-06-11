CREATE TABLE IF NOT EXISTS public.hall_gallery_albums (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_id uuid NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date date,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hall_gallery_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id uuid NOT NULL REFERENCES public.hall_gallery_albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hall_gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_gallery_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active gallery albums" ON public.hall_gallery_albums;
CREATE POLICY "Anyone can view active gallery albums"
ON public.hall_gallery_albums
FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage gallery albums" ON public.hall_gallery_albums;
CREATE POLICY "Admins can manage gallery albums"
ON public.hall_gallery_albums
FOR ALL
USING (public.is_admin_or_above(auth.uid()))
WITH CHECK (public.is_admin_or_above(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage their hall gallery albums" ON public.hall_gallery_albums;
CREATE POLICY "Managers can manage their hall gallery albums"
ON public.hall_gallery_albums
FOR ALL
USING (hall_id = ANY(public.get_manager_hall_ids(auth.uid())))
WITH CHECK (hall_id = ANY(public.get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Anyone can view active gallery photos" ON public.hall_gallery_photos;
CREATE POLICY "Anyone can view active gallery photos"
ON public.hall_gallery_photos
FOR SELECT
USING (
  is_active = true
  AND EXISTS (
    SELECT 1
    FROM public.hall_gallery_albums a
    WHERE a.id = hall_gallery_photos.album_id
      AND a.is_active = true
  )
);

DROP POLICY IF EXISTS "Admins can manage gallery photos" ON public.hall_gallery_photos;
CREATE POLICY "Admins can manage gallery photos"
ON public.hall_gallery_photos
FOR ALL
USING (public.is_admin_or_above(auth.uid()))
WITH CHECK (public.is_admin_or_above(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage their hall gallery photos" ON public.hall_gallery_photos;
CREATE POLICY "Managers can manage their hall gallery photos"
ON public.hall_gallery_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.hall_gallery_albums a
    WHERE a.id = hall_gallery_photos.album_id
      AND a.hall_id = ANY(public.get_manager_hall_ids(auth.uid()))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.hall_gallery_albums a
    WHERE a.id = hall_gallery_photos.album_id
      AND a.hall_id = ANY(public.get_manager_hall_ids(auth.uid()))
  )
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('hall-gallery-images', 'hall-gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Anyone can view hall gallery images" ON storage.objects;
CREATE POLICY "Anyone can view hall gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hall-gallery-images');

DROP POLICY IF EXISTS "Admins can upload hall gallery images" ON storage.objects;
CREATE POLICY "Admins can upload hall gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'hall-gallery-images'
  AND public.is_admin_or_above(auth.uid())
);

DROP POLICY IF EXISTS "Managers can upload their hall gallery images" ON storage.objects;
CREATE POLICY "Managers can upload their hall gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'hall-gallery-images'
  AND EXISTS (
    SELECT 1
    FROM public.hall_managers hm
    WHERE hm.user_id = auth.uid()
      AND hm.is_active = true
      AND hm.hall_id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Admins can update hall gallery images" ON storage.objects;
CREATE POLICY "Admins can update hall gallery images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'hall-gallery-images'
  AND public.is_admin_or_above(auth.uid())
)
WITH CHECK (
  bucket_id = 'hall-gallery-images'
  AND public.is_admin_or_above(auth.uid())
);

DROP POLICY IF EXISTS "Managers can update their hall gallery images" ON storage.objects;
CREATE POLICY "Managers can update their hall gallery images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'hall-gallery-images'
  AND EXISTS (
    SELECT 1
    FROM public.hall_managers hm
    WHERE hm.user_id = auth.uid()
      AND hm.is_active = true
      AND hm.hall_id::text = (storage.foldername(name))[1]
  )
)
WITH CHECK (
  bucket_id = 'hall-gallery-images'
  AND EXISTS (
    SELECT 1
    FROM public.hall_managers hm
    WHERE hm.user_id = auth.uid()
      AND hm.is_active = true
      AND hm.hall_id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Admins can delete hall gallery images" ON storage.objects;
CREATE POLICY "Admins can delete hall gallery images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'hall-gallery-images'
  AND public.is_admin_or_above(auth.uid())
);

DROP POLICY IF EXISTS "Managers can delete their hall gallery images" ON storage.objects;
CREATE POLICY "Managers can delete their hall gallery images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'hall-gallery-images'
  AND EXISTS (
    SELECT 1
    FROM public.hall_managers hm
    WHERE hm.user_id = auth.uid()
      AND hm.is_active = true
      AND hm.hall_id::text = (storage.foldername(name))[1]
  )
);

CREATE INDEX IF NOT EXISTS idx_hall_gallery_albums_hall_id ON public.hall_gallery_albums(hall_id);
CREATE INDEX IF NOT EXISTS idx_hall_gallery_photos_album_id ON public.hall_gallery_photos(album_id);
