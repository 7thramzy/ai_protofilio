
-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  interest TEXT,
  source TEXT NOT NULL DEFAULT 'chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact messages from contact form
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_session ON public.conversations(session_id);
CREATE INDEX idx_leads_created ON public.leads(created_at DESC);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous portfolio visitors), but cannot read
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can store conversation"
  ON public.conversations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can submit contact message"
  ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
