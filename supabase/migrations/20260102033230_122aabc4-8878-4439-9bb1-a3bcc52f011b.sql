-- Create table for hall closed dates (manager can block dates)
CREATE TABLE public.hall_closed_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hall_id UUID NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  closed_date DATE NOT NULL,
  reason TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (hall_id, closed_date)
);

-- Enable Row Level Security
ALTER TABLE public.hall_closed_dates ENABLE ROW LEVEL SECURITY;

-- Policies for hall_closed_dates
-- Anyone can view closed dates (needed for public booking form)
CREATE POLICY "Anyone can view closed dates"
ON public.hall_closed_dates
FOR SELECT
USING (true);

-- Admins can manage all closed dates
CREATE POLICY "Admins can insert closed dates"
ON public.hall_closed_dates
FOR INSERT
WITH CHECK (is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can delete closed dates"
ON public.hall_closed_dates
FOR DELETE
USING (is_admin_or_above(auth.uid()));

-- Managers can manage their hall's closed dates
CREATE POLICY "Managers can insert their hall closed dates"
ON public.hall_closed_dates
FOR INSERT
WITH CHECK (hall_id = get_manager_hall_id(auth.uid()));

CREATE POLICY "Managers can delete their hall closed dates"
ON public.hall_closed_dates
FOR DELETE
USING (hall_id = get_manager_hall_id(auth.uid()));

-- Add index for faster date lookups
CREATE INDEX idx_hall_closed_dates_lookup ON public.hall_closed_dates(hall_id, closed_date);