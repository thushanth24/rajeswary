-- =============================================
-- ADMIN MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =============================================

-- 1. Create Role Enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'hall_manager');

-- 2. Create Booking Status Enum
CREATE TYPE public.booking_status AS ENUM ('new', 'acknowledged', 'confirmed', 'cancelled', 'completed');

-- 3. Create Inventory Status Enum
CREATE TYPE public.inventory_status AS ENUM ('available', 'in_use', 'under_repair', 'disposed');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER ROLES TABLE (Separate from profiles for security)
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HALLS TABLE (Wedding Halls)
-- =============================================
CREATE TABLE public.halls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  capacity_min INTEGER NOT NULL DEFAULT 0,
  capacity_max INTEGER NOT NULL DEFAULT 0,
  price_range TEXT,
  features TEXT[] DEFAULT '{}',
  event_types TEXT[] DEFAULT '{}',
  has_ac BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  has_dining BOOLEAN DEFAULT false,
  has_stage BOOLEAN DEFAULT false,
  has_power_backup BOOLEAN DEFAULT false,
  has_bride_room BOOLEAN DEFAULT false,
  has_groom_room BOOLEAN DEFAULT false,
  washrooms_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.halls ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HALL MANAGERS TABLE (Links managers to halls)
-- =============================================
CREATE TABLE public.hall_managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id UUID NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (hall_id) -- One manager per hall
);

ALTER TABLE public.hall_managers ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id UUID NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  
  -- Event details
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_start_time TIME,
  event_end_time TIME,
  expected_guests INTEGER,
  special_requests TEXT,
  
  -- Booking status
  status booking_status NOT NULL DEFAULT 'new',
  is_manual_booking BOOLEAN NOT NULL DEFAULT false,
  
  -- Acknowledgement tracking
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  
  -- Confirmation tracking
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID REFERENCES auth.users(id),
  
  -- Cancellation tracking
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES auth.users(id),
  cancellation_reason TEXT,
  
  -- Internal notes
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- INVENTORY TABLE
-- =============================================
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_id UUID NOT NULL REFERENCES public.halls(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  status inventory_status NOT NULL DEFAULT 'available',
  description TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  last_checked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- SECURITY DEFINER FUNCTIONS
-- =============================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'super_admin')
$$;

-- Function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin')
  )
$$;

-- Function to get hall_id for a hall manager
CREATE OR REPLACE FUNCTION public.get_manager_hall_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hall_id
  FROM public.hall_managers
  WHERE user_id = _user_id
    AND is_active = true
  LIMIT 1
$$;

-- =============================================
-- RLS POLICIES - PROFILES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Super Admin and Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin_or_above(auth.uid()));

-- Super Admin can insert profiles
CREATE POLICY "Super Admin can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Super Admin can update any profile
CREATE POLICY "Super Admin can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - USER ROLES
-- =============================================

-- Super Admin can view all roles
CREATE POLICY "Super Admin can view all roles"
ON public.user_roles FOR SELECT
USING (public.is_super_admin(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Super Admin can insert roles
CREATE POLICY "Super Admin can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));

-- Super Admin can delete roles
CREATE POLICY "Super Admin can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - HALLS
-- =============================================

-- Everyone can view active halls
CREATE POLICY "Anyone can view active halls"
ON public.halls FOR SELECT
USING (is_active = true);

-- Admins can view all halls
CREATE POLICY "Admins can view all halls"
ON public.halls FOR SELECT
USING (public.is_admin_or_above(auth.uid()));

-- Super Admin can manage halls
CREATE POLICY "Super Admin can insert halls"
ON public.halls FOR INSERT
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admin can update halls"
ON public.halls FOR UPDATE
USING (public.is_super_admin(auth.uid()));

-- =============================================
-- RLS POLICIES - HALL MANAGERS
-- =============================================

-- Admins can view all hall managers
CREATE POLICY "Admins can view hall managers"
ON public.hall_managers FOR SELECT
USING (public.is_admin_or_above(auth.uid()));

-- Hall managers can view their own assignment
CREATE POLICY "Managers can view own assignment"
ON public.hall_managers FOR SELECT
USING (auth.uid() = user_id);

-- Admin can manage hall managers
CREATE POLICY "Admin can insert hall managers"
ON public.hall_managers FOR INSERT
WITH CHECK (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admin can update hall managers"
ON public.hall_managers FOR UPDATE
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admin can delete hall managers"
ON public.hall_managers FOR DELETE
USING (public.is_admin_or_above(auth.uid()));

-- =============================================
-- RLS POLICIES - BOOKINGS
-- =============================================

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (public.is_admin_or_above(auth.uid()));

-- Hall managers can view bookings for their hall
CREATE POLICY "Managers can view their hall bookings"
ON public.bookings FOR SELECT
USING (hall_id = public.get_manager_hall_id(auth.uid()));

-- Anyone can create a booking (public form)
CREATE POLICY "Anyone can create booking"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Hall managers can update bookings for their hall
CREATE POLICY "Managers can update their hall bookings"
ON public.bookings FOR UPDATE
USING (hall_id = public.get_manager_hall_id(auth.uid()));

-- Admins can update any booking
CREATE POLICY "Admins can update any booking"
ON public.bookings FOR UPDATE
USING (public.is_admin_or_above(auth.uid()));

-- =============================================
-- RLS POLICIES - INVENTORY
-- =============================================

-- Admins can view all inventory
CREATE POLICY "Admins can view all inventory"
ON public.inventory FOR SELECT
USING (public.is_admin_or_above(auth.uid()));

-- Hall managers can view inventory for their hall
CREATE POLICY "Managers can view their hall inventory"
ON public.inventory FOR SELECT
USING (hall_id = public.get_manager_hall_id(auth.uid()));

-- Hall managers can manage inventory for their hall
CREATE POLICY "Managers can insert their hall inventory"
ON public.inventory FOR INSERT
WITH CHECK (hall_id = public.get_manager_hall_id(auth.uid()));

CREATE POLICY "Managers can update their hall inventory"
ON public.inventory FOR UPDATE
USING (hall_id = public.get_manager_hall_id(auth.uid()));

CREATE POLICY "Managers can delete their hall inventory"
ON public.inventory FOR DELETE
USING (hall_id = public.get_manager_hall_id(auth.uid()));

-- =============================================
-- RLS POLICIES - AUDIT LOGS
-- =============================================

-- Super Admin can view all audit logs
CREATE POLICY "Super Admin can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_super_admin(auth.uid()));

-- All authenticated users can insert audit logs
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_halls_updated_at
BEFORE UPDATE ON public.halls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER FOR AUTO-CREATING PROFILE
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SEED HALLS DATA FROM EXISTING STATIC DATA
-- =============================================

INSERT INTO public.halls (name, slug, description, short_description, capacity_min, capacity_max, price_range, features, event_types, has_ac, has_parking, has_dining, has_stage, has_power_backup, has_bride_room, has_groom_room, washrooms_count)
VALUES
  ('Grand Ballroom', 'grand-ballroom', 'Our flagship venue, the Grand Ballroom offers unparalleled elegance with soaring ceilings, crystal chandeliers, and a spacious dance floor. Perfect for grand weddings and large receptions that demand sophistication and style.', 'Elegant venue for grand celebrations with crystal chandeliers and spacious layout.', 300, 800, '₹2,50,000 - ₹5,00,000', ARRAY['Crystal Chandeliers', 'Grand Entrance', 'Private Lawn', 'VIP Lounge'], ARRAY['Wedding', 'Reception', 'Corporate Event', 'Gala Dinner'], true, true, true, true, true, true, true, 8),
  ('Royal Banquet Hall', 'royal-banquet', 'Experience royalty at the Royal Banquet Hall. Featuring ornate gold accents, plush seating, and exceptional lighting, this venue creates an atmosphere of timeless luxury for your special day.', 'Luxurious setting with royal ambiance and gold accents.', 200, 500, '₹1,75,000 - ₹3,50,000', ARRAY['Gold Accents', 'Royal Decor', 'Premium Sound System', 'LED Stage'], ARRAY['Wedding', 'Reception', 'Engagement', 'Birthday Party'], true, true, true, true, true, true, true, 6),
  ('Crystal Palace', 'crystal-palace', 'The Crystal Palace combines intimate elegance with modern amenities. Its warm wooden accents and crystal decorations create a cozy yet sophisticated atmosphere ideal for medium-sized celebrations.', 'Intimate elegance with warm ambiance and crystal decorations.', 100, 300, '₹1,00,000 - ₹2,00,000', ARRAY['Wooden Ceiling', 'Intimate Setting', 'Garden View', 'Customizable Lighting'], ARRAY['Wedding', 'Engagement', 'Anniversary', 'Cocktail Party'], true, true, true, true, true, true, false, 4),
  ('Emerald Garden Hall', 'emerald-garden', 'A modern masterpiece featuring contemporary design elements, floor-to-ceiling windows, and state-of-the-art amenities. The Emerald Garden Hall brings natural light and elegance together beautifully.', 'Modern venue with natural lighting and contemporary design.', 250, 600, '₹2,00,000 - ₹4,00,000', ARRAY['Floor-to-Ceiling Windows', 'Modern Design', 'Premium AV System', 'Rooftop Access'], ARRAY['Wedding', 'Reception', 'Conference', 'Exhibition'], true, true, true, true, true, true, true, 6),
  ('Sunset Terrace', 'sunset-terrace', 'An enchanting outdoor venue surrounded by lush greenery and twinkling lights. The Sunset Terrace offers a magical garden wedding experience under the stars with a beautiful pavilion.', 'Magical outdoor venue with garden setting and string lights.', 150, 400, '₹1,50,000 - ₹3,00,000', ARRAY['Outdoor Setting', 'Garden Pavilion', 'String Lights', 'Natural Backdrop'], ARRAY['Garden Wedding', 'Reception', 'Cocktail Party', 'Pre-Wedding'], false, true, true, true, true, true, true, 4);

-- =============================================
-- SEED DEFAULT INVENTORY ITEMS FOR EACH HALL
-- =============================================

-- Get hall IDs and insert inventory for each
INSERT INTO public.inventory (hall_id, item_name, category, quantity, status)
SELECT h.id, item.item_name, item.category, item.quantity, 'available'::inventory_status
FROM public.halls h
CROSS JOIN (
  VALUES
    ('Chairs', 'Seating', 500),
    ('Tables (Round)', 'Furniture', 50),
    ('Tables (Rectangular)', 'Furniture', 30),
    ('Stage Backdrop', 'Stage', 2),
    ('Sound System', 'Audio', 1),
    ('LED Lights', 'Lighting', 20),
    ('Flower Vases', 'Decoration', 50),
    ('Table Cloths', 'Linen', 100)
) AS item(item_name, category, quantity);