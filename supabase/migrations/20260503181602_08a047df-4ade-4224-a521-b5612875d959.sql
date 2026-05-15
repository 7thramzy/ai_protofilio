-- Site settings: flexible key/value JSON for hero, about, contact, etc.
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site settings" ON public.site_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skills
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'technical', -- 'technical' | 'stack' | 'soft'
  level INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage skills" ON public.skills FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_skills_updated BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Experience & Education
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'work', -- 'work' | 'education'
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_zh TEXT,
  org TEXT NOT NULL,
  period TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view experiences" ON public.experiences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage experiences" ON public.experiences FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_experiences_updated BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Dynamic sections (Research, Publications, Awards, etc.)
CREATE TABLE public.custom_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL DEFAULT 'generic', -- 'generic' | 'research' | 'publications' | 'certificates'
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_zh TEXT,
  eyebrow_en TEXT,
  eyebrow_ar TEXT,
  eyebrow_zh TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view sections" ON public.custom_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage sections" ON public.custom_sections FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_custom_sections_updated BEFORE UPDATE ON public.custom_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Items inside dynamic sections
CREATE TABLE public.section_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.custom_sections(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_zh TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_zh TEXT,
  link_url TEXT,
  link_label TEXT,
  image_url TEXT,
  date_label TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  meta JSONB NOT NULL DEFAULT '{}'::jsonb, -- template-specific fields (authors, venue, issuer, etc.)
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.section_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view section items" ON public.section_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage section items" ON public.section_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_section_items_updated BEFORE UPDATE ON public.section_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_section_items_section ON public.section_items(section_id, sort_order);

-- Seed initial site settings (hero, about, contact)
INSERT INTO public.site_settings (key, value) VALUES
('hero', jsonb_build_object(
  'name', jsonb_build_object('en','Ramzy Albazel','ar','رمزي البزل','zh','拉姆齐·阿尔巴泽尔'),
  'greeting', jsonb_build_object('en','Hello, I''m','ar','مرحباً، أنا','zh','你好,我是'),
  'title', jsonb_build_object('en','Full Stack Developer & AI Engineer','ar','مطوّر Full Stack ومهندس ذكاء اصطناعي','zh','全栈开发者与AI工程师'),
  'tagline', jsonb_build_object('en','Building intelligent web & mobile experiences with modern stacks.','ar','أبني تجارب ويب وموبايل ذكية بأحدث التقنيات.','zh','使用现代技术栈构建智能Web和移动体验。'),
  'badge', 'Open for freelance & full-time roles',
  'available_label', 'Available now',
  'photo_url', '',
  'social', jsonb_build_object('github','https://github.com/r7-yn','linkedin','https://linkedin.com/in/ramzy-albazel-47795b289','email','ramzyalbazel700@gmail.com'),
  'stats', jsonb_build_array(
    jsonb_build_object('value','20+','label_en','Projects','label_ar','مشاريع','label_zh','项目'),
    jsonb_build_object('value','5+','label_en','Years','label_ar','سنوات','label_zh','年'),
    jsonb_build_object('value','100%','label_en','Satisfaction','label_ar','رضا','label_zh','满意度')
  )
)),
('about', jsonb_build_object(
  'eyebrow', jsonb_build_object('en','About','ar','عني','zh','关于'),
  'title', jsonb_build_object('en','Who I am','ar','من أنا','zh','我是谁'),
  'body', jsonb_build_object('en','I''m a full stack developer and AI engineer passionate about building modern, intelligent products.','ar','أنا مطوّر full stack ومهندس ذكاء اصطناعي شغوف ببناء منتجات حديثة وذكية.','zh','我是一名全栈开发者和AI工程师,热衷于构建现代化的智能产品。'),
  'highlights', jsonb_build_array(
    jsonb_build_object('icon','GraduationCap','value_en','Excellent','value_ar','ممتاز','value_zh','优秀','label_en','BSc IT — University of Science & Tech, Ibb','label_ar','بكالوريوس تقنية المعلومات — جامعة العلوم والتكنولوجيا، إب','label_zh','信息技术学士 — 伊卜科技大学'),
    jsonb_build_object('icon','Sparkles','value_en','Specialized','value_ar','متخصص','value_zh','专业','label_en','AI / ML, Full Stack & Cybersecurity','label_ar','ذكاء اصطناعي وتعلم آلي، Full Stack وأمن سيبراني','label_zh','AI/ML、全栈与网络安全'),
    jsonb_build_object('icon','Globe2','value_en','Trilingual','value_ar','ثلاثي اللغة','value_zh','三语','label_en','Arabic · English · Chinese (learning)','label_ar','العربية · الإنجليزية · الصينية (تعلم)','label_zh','阿拉伯语·英语·中文(学习中)')
  )
)),
('contact', jsonb_build_object(
  'email','ramzyalbazel700@gmail.com',
  'phone','',
  'location_en','Ibb, Yemen','location_ar','إب، اليمن','location_zh','也门伊卜',
  'github','https://github.com/r7-yn',
  'linkedin','https://linkedin.com/in/ramzy-albazel-47795b289',
  'whatsapp',''
));

-- Seed skills
INSERT INTO public.skills (name, category, level, sort_order) VALUES
('Python','technical',95,1),('JavaScript / TypeScript','technical',92,2),
('React / Next.js','technical',90,3),('Flutter / Dart','technical',85,4),
('Machine Learning','technical',88,5),('Node.js / Laravel / PHP','technical',82,6),
('Firebase / Supabase / SQL','technical',87,7),('AI in Cybersecurity','technical',80,8),
('Mikrotik & Networking','technical',85,9),('Figma / UI · UX','technical',78,10);

INSERT INTO public.skills (name, category, sort_order) 
SELECT name, 'stack', row_number() OVER () FROM unnest(ARRAY[
'Python','JavaScript','TypeScript','Dart','PHP','C#','React','Next.js','Node.js','Flutter','Laravel','Tailwind','Bootstrap','Firebase','Supabase','SQL','Oracle Apex','Random Forest','K-Means','ANN','MLP','NLP','Speech Recognition','Mikrotik','Windows Server','Figma','Git'
]) AS name;

INSERT INTO public.skills (name, category, sort_order)
SELECT name, 'soft', row_number() OVER () FROM unnest(ARRAY[
'Leadership','Teaching','Critical Thinking','Creativity','Teamwork','Problem-Solving','Adaptability','Article Writing','Ethical Reasoning','Punctuality'
]) AS name;

-- Seed experiences
INSERT INTO public.experiences (kind, title_en, title_ar, title_zh, org, period, sort_order) VALUES
('work','System Developer (AI)','مطوّر أنظمة (ذكاء اصطناعي)','系统开发者 (AI)','National Blood Research Center, Ibb','Nov 2024 – Jan 2025',1),
('work','Full Stack Developer','مطوّر Full Stack','全栈开发者','24 Academy, Ibb','2023 – Present',2),
('work','College Instructor','محاضر جامعي','大学讲师','Universities in Ibb','2025 – Present',3),
('work','Mobile App Developer (Freelance)','مطوّر تطبيقات جوال (Freelance)','移动应用开发者 (自由职业)','Ongoing client project','2025 – Present',4),
('education','BSc Information Technology','بكالوريوس تقنية المعلومات','信息技术学士','University of Science & Technology, Ibb','2022 – 2025',1),
('education','Mikrotik Network Management','إدارة الشبكات بـ Mikrotik','Mikrotik 网络管理','Modern College, Ibb','2024',2),
('education','Python for Networks & Cybersecurity','بايثون للشبكات والأمن السيبراني','Python 网络与网络安全','Modern College, Ibb','2022',3),
('education','TOEFL Preparation + High Diploma in English','تحضير TOEFL + دبلوم عالي إنجليزي','TOEFL 备考 + 英语高级文凭','Speak Now Institute, Ibb','2018 – 2019',4);
