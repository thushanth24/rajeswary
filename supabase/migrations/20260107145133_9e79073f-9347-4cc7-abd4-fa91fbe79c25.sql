-- Allow a manager (user_id) to be actively assigned to multiple halls
DROP INDEX IF EXISTS public.hall_managers_active_user_unique;

-- Prevent duplicate active assignments for the same (user_id, hall_id)
CREATE UNIQUE INDEX IF NOT EXISTS hall_managers_active_user_hall_unique
  ON public.hall_managers (user_id, hall_id)
  WHERE (is_active = true);