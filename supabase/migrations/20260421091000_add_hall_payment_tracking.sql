ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS advance_paid_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_paid_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS payment_provider text,
ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

ALTER TABLE public.bookings
ADD CONSTRAINT bookings_payment_status_check
CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed'));
