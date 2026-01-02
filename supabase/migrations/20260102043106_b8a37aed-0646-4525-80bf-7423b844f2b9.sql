-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (public form)
CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (is_admin_or_above(auth.uid()));

-- Only admins can update contact messages (mark as read)
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (is_admin_or_above(auth.uid()));

-- Only super admins can delete contact messages
CREATE POLICY "Super admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (is_super_admin(auth.uid()));