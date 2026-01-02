-- Create table to track inventory allocations per booking
CREATE TABLE public.booking_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  quantity_allocated INTEGER NOT NULL DEFAULT 1,
  quantity_returned INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'allocated' CHECK (status IN ('allocated', 'checked_out', 'returned', 'damaged')),
  notes TEXT,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  checked_out_by UUID,
  returned_at TIMESTAMP WITH TIME ZONE,
  returned_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id, inventory_id)
);

-- Enable RLS
ALTER TABLE public.booking_inventory ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all booking inventory"
ON public.booking_inventory
FOR ALL
USING (is_admin_or_above(auth.uid()));

-- Hall managers can manage their hall's booking inventory
CREATE POLICY "Managers can view their hall booking inventory"
ON public.booking_inventory
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_inventory.booking_id
    AND b.hall_id = get_manager_hall_id(auth.uid())
  )
);

CREATE POLICY "Managers can insert their hall booking inventory"
ON public.booking_inventory
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_inventory.booking_id
    AND b.hall_id = get_manager_hall_id(auth.uid())
  )
);

CREATE POLICY "Managers can update their hall booking inventory"
ON public.booking_inventory
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_inventory.booking_id
    AND b.hall_id = get_manager_hall_id(auth.uid())
  )
);

CREATE POLICY "Managers can delete their hall booking inventory"
ON public.booking_inventory
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = booking_inventory.booking_id
    AND b.hall_id = get_manager_hall_id(auth.uid())
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_booking_inventory_updated_at
BEFORE UPDATE ON public.booking_inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_booking_inventory_booking_id ON public.booking_inventory(booking_id);
CREATE INDEX idx_booking_inventory_inventory_id ON public.booking_inventory(inventory_id);