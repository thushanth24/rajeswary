-- Allow admins to view user_roles for manager assignment purposes
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (is_admin_or_above(auth.uid()));