-- Drop the unique constraint that prevents a manager from being assigned to multiple halls
ALTER TABLE public.hall_managers DROP CONSTRAINT IF EXISTS hall_managers_active_user_unique;

-- Also drop the unique constraint on hall_id if it exists (one hall = one manager)
ALTER TABLE public.hall_managers DROP CONSTRAINT IF EXISTS hall_managers_hall_id_key;