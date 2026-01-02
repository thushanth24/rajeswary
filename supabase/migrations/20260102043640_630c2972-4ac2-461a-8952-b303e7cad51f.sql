-- Add reference_number column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN reference_number TEXT UNIQUE;

-- Create a function to generate unique reference numbers
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_ref TEXT;
  ref_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate reference: CH-YEAR-5CHARS (e.g., CH-2026-A3B7X)
    new_ref := 'CH-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || 
               UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
    
    -- Check if it already exists
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE reference_number = new_ref) INTO ref_exists;
    
    -- Exit loop if unique
    EXIT WHEN NOT ref_exists;
  END LOOP;
  
  RETURN new_ref;
END;
$$;

-- Create trigger to auto-generate reference number on insert
CREATE OR REPLACE FUNCTION public.set_booking_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_booking_reference
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_booking_reference();