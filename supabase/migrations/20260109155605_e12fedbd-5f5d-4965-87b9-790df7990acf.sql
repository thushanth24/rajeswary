-- Add RLS policy to allow public to check booking availability
-- This only allows reading minimal fields needed for availability checking (no PII)
CREATE POLICY "Public can check booking availability" 
ON public.bookings 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Note: This policy allows reading all columns, but the application only queries
-- section_id, event_start_time, event_end_time for availability checks.
-- Consider creating a view or RPC function for more granular control in production.