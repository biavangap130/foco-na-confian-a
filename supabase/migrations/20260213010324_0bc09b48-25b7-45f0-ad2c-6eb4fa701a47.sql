
-- Table for tracking page visits
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Table for tracking button clicks
CREATE TABLE public.button_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  button_name TEXT NOT NULL,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.button_clicks ENABLE ROW LEVEL SECURITY;

-- Table for comments submitted for review
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Table for contact requests
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Table for purchases (from Lemon Squeezy webhooks)
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  product_name TEXT,
  amount_cents INTEGER,
  currency TEXT DEFAULT 'EUR',
  lemon_squeezy_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Admin profiles table
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Allow anonymous inserts for tracking (visitors don't need auth)
CREATE POLICY "Anyone can insert page visits" ON public.page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert button clicks" ON public.button_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests FOR INSERT WITH CHECK (true);

-- RLS: Only admins can read data
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles WHERE user_id = _user_id
  )
$$;

CREATE POLICY "Admins can read page visits" ON public.page_visits FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read button clicks" ON public.button_clicks FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read comments" ON public.comments FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update comments" ON public.comments FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read contact requests" ON public.contact_requests FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update contact requests" ON public.contact_requests FOR UPDATE USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read purchases" ON public.purchases FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can read admin profiles" ON public.admin_profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- Allow webhook to insert purchases (no auth)
CREATE POLICY "Anyone can insert purchases" ON public.purchases FOR INSERT WITH CHECK (true);
