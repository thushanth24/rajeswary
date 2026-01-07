-- Create hall_sections table
CREATE TABLE public.hall_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id UUID NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint for hall + section name
ALTER TABLE public.hall_sections 
ADD CONSTRAINT unique_hall_section_name UNIQUE (hall_id, name);

-- Add section_id to bookings table (nullable for backward compatibility)
ALTER TABLE public.bookings 
ADD COLUMN section_id UUID REFERENCES public.hall_sections(id);

-- Enable RLS on hall_sections
ALTER TABLE public.hall_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hall_sections
CREATE POLICY "Anyone can view active sections"
ON public.hall_sections
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all sections"
ON public.hall_sections
FOR ALL
USING (is_admin_or_above(auth.uid()));

-- Seed sections for Chelva Palace (3 sections)
INSERT INTO public.hall_sections (hall_id, name, display_order)
SELECT id, 'Section A', 1 FROM public.halls WHERE slug = 'chelva-palace'
UNION ALL
SELECT id, 'Section B', 2 FROM public.halls WHERE slug = 'chelva-palace'
UNION ALL
SELECT id, 'Section C', 3 FROM public.halls WHERE slug = 'chelva-palace';

-- Seed sections for Raajeshwariy Wedding Hall Kondavil (2 sections)
INSERT INTO public.hall_sections (hall_id, name, display_order)
SELECT id, 'Section A', 1 FROM public.halls WHERE slug = 'raajeshwariy-weeding-hall-kondavil'
UNION ALL
SELECT id, 'Section B', 2 FROM public.halls WHERE slug = 'raajeshwariy-weeding-hall-kondavil';

-- Create index for better query performance
CREATE INDEX idx_hall_sections_hall_id ON public.hall_sections(hall_id);
CREATE INDEX idx_bookings_section_id ON public.bookings(section_id);