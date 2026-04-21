ALTER TABLE public.bungalow_bookings
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS paid_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_paid_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS payment_provider text,
ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE public.bungalow_bookings
DROP CONSTRAINT IF EXISTS bungalow_bookings_payment_status_check;

ALTER TABLE public.bungalow_bookings
ADD CONSTRAINT bungalow_bookings_payment_status_check
CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed'));
