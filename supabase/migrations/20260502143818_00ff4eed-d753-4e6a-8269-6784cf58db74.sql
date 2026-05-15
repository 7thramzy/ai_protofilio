
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- ============ AUTO-GRANT ADMIN TO OWNER EMAIL ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'ramzyalbazel700@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ PROJECTS TABLE ============
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_zh TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT,
  description_zh TEXT,
  category TEXT NOT NULL DEFAULT 'web',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ ADMIN READ ACCESS for leads / contact / conversations ============
CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads"
ON public.leads FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view conversations"
ON public.conversations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============ SEED PROJECTS ============
INSERT INTO public.projects (title_en, description_en, category, tags, github_url, featured, sort_order) VALUES
('Blood Bank AI System', 'AI-powered blood bank management with donor matching, inventory prediction, and smart routing.', 'ai', ARRAY['Python','TensorFlow','Flask','PostgreSQL'], NULL, true, 1),
('24 Academy Platform', 'Educational platform for 24 Academy with course management and student tracking.', 'web', ARRAY['React','Node.js','MongoDB','TailwindCSS'], NULL, true, 2),
('ML Image Classifier', 'Deep learning image classifier using CNNs, deployed via REST API.', 'ml', ARRAY['Python','PyTorch','FastAPI','Docker'], NULL, false, 3),
('Smart IoT Dashboard', 'Real-time IoT sensor monitoring dashboard with analytics and alerts.', 'iot', ARRAY['React','MQTT','InfluxDB','Grafana'], NULL, false, 4),
('NLP Chatbot', 'Multilingual chatbot powered by transformer models for customer support.', 'ai', ARRAY['Python','Transformers','Hugging Face','Flask'], NULL, false, 5),
('Portfolio Website', 'This trilingual portfolio with AI assistant and real-time lead notifications.', 'web', ARRAY['React','TypeScript','Supabase','Gemini AI'], NULL, true, 6),
('Data Analytics Toolkit', 'Python toolkit for automated data cleaning, EDA, and report generation.', 'data', ARRAY['Python','Pandas','Plotly','Jupyter'], NULL, false, 7);
