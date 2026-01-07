-- Create a new function that returns all hall IDs managed by a user
CREATE OR REPLACE FUNCTION public.get_manager_hall_ids(_user_id uuid)
RETURNS uuid[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(array_agg(hall_id), ARRAY[]::uuid[])
  FROM public.hall_managers
  WHERE user_id = _user_id
    AND is_active = true
$$;

-- Update RLS policies for bookings to use the new function
DROP POLICY IF EXISTS "Managers can view their hall bookings" ON public.bookings;
CREATE POLICY "Managers can view their hall bookings" 
ON public.bookings 
FOR SELECT 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Managers can update their hall bookings" ON public.bookings;
CREATE POLICY "Managers can update their hall bookings" 
ON public.bookings 
FOR UPDATE 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));

-- Update RLS policies for booking_inventory
DROP POLICY IF EXISTS "Managers can view their hall booking inventory" ON public.booking_inventory;
CREATE POLICY "Managers can view their hall booking inventory" 
ON public.booking_inventory 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM bookings b 
  WHERE b.id = booking_inventory.booking_id 
  AND b.hall_id = ANY(get_manager_hall_ids(auth.uid()))
));

DROP POLICY IF EXISTS "Managers can insert their hall booking inventory" ON public.booking_inventory;
CREATE POLICY "Managers can insert their hall booking inventory" 
ON public.booking_inventory 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM bookings b 
  WHERE b.id = booking_inventory.booking_id 
  AND b.hall_id = ANY(get_manager_hall_ids(auth.uid()))
));

DROP POLICY IF EXISTS "Managers can update their hall booking inventory" ON public.booking_inventory;
CREATE POLICY "Managers can update their hall booking inventory" 
ON public.booking_inventory 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM bookings b 
  WHERE b.id = booking_inventory.booking_id 
  AND b.hall_id = ANY(get_manager_hall_ids(auth.uid()))
));

DROP POLICY IF EXISTS "Managers can delete their hall booking inventory" ON public.booking_inventory;
CREATE POLICY "Managers can delete their hall booking inventory" 
ON public.booking_inventory 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM bookings b 
  WHERE b.id = booking_inventory.booking_id 
  AND b.hall_id = ANY(get_manager_hall_ids(auth.uid()))
));

-- Update RLS policies for inventory
DROP POLICY IF EXISTS "Managers can view their hall inventory" ON public.inventory;
CREATE POLICY "Managers can view their hall inventory" 
ON public.inventory 
FOR SELECT 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Managers can insert their hall inventory" ON public.inventory;
CREATE POLICY "Managers can insert their hall inventory" 
ON public.inventory 
FOR INSERT 
WITH CHECK (hall_id = ANY(get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Managers can update their hall inventory" ON public.inventory;
CREATE POLICY "Managers can update their hall inventory" 
ON public.inventory 
FOR UPDATE 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Managers can delete their hall inventory" ON public.inventory;
CREATE POLICY "Managers can delete their hall inventory" 
ON public.inventory 
FOR DELETE 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));

-- Update RLS policies for hall_closed_dates
DROP POLICY IF EXISTS "Managers can insert their hall closed dates" ON public.hall_closed_dates;
CREATE POLICY "Managers can insert their hall closed dates" 
ON public.hall_closed_dates 
FOR INSERT 
WITH CHECK (hall_id = ANY(get_manager_hall_ids(auth.uid())));

DROP POLICY IF EXISTS "Managers can delete their hall closed dates" ON public.hall_closed_dates;
CREATE POLICY "Managers can delete their hall closed dates" 
ON public.hall_closed_dates 
FOR DELETE 
USING (hall_id = ANY(get_manager_hall_ids(auth.uid())));