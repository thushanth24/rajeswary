CREATE POLICY "Anyone can check bungalow booking availability"
ON public.bungalow_bookings
FOR SELECT
USING (true);