-- Add floor_plan_url to halls table
ALTER TABLE public.halls 
ADD COLUMN floor_plan_url text;

-- Create hall_images table for gallery
CREATE TABLE public.hall_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_id uuid NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create hall_reviews table for testimonials
CREATE TABLE public.hall_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_id uuid NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  event_type text,
  event_date date,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create hall_event_photos table for previous events gallery
CREATE TABLE public.hall_event_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_id uuid NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  event_type text,
  event_date date,
  caption text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hall_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_event_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hall_images (public read, admin write)
CREATE POLICY "Anyone can view active hall images" 
ON public.hall_images FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage hall images" 
ON public.hall_images FOR ALL 
USING (is_admin_or_above(auth.uid()));

-- RLS Policies for hall_reviews (public read approved, admin write)
CREATE POLICY "Anyone can view approved reviews" 
ON public.hall_reviews FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews" 
ON public.hall_reviews FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage reviews" 
ON public.hall_reviews FOR ALL 
USING (is_admin_or_above(auth.uid()));

-- RLS Policies for hall_event_photos (public read, admin write)
CREATE POLICY "Anyone can view active event photos" 
ON public.hall_event_photos FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage event photos" 
ON public.hall_event_photos FOR ALL 
USING (is_admin_or_above(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_hall_images_hall_id ON public.hall_images(hall_id);
CREATE INDEX idx_hall_reviews_hall_id ON public.hall_reviews(hall_id);
CREATE INDEX idx_hall_event_photos_hall_id ON public.hall_event_photos(hall_id);