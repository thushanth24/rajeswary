-- Ensure one manager per hall (only one active manager per hall)
CREATE UNIQUE INDEX IF NOT EXISTS hall_managers_active_hall_unique 
ON public.hall_managers (hall_id) 
WHERE is_active = true;

-- Ensure one hall per manager (a manager can only manage one hall)
CREATE UNIQUE INDEX IF NOT EXISTS hall_managers_active_user_unique 
ON public.hall_managers (user_id) 
WHERE is_active = true;