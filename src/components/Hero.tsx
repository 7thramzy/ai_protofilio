import { useLang } from "@/contexts/LangContext";
import { ArrowRight, Sparkles, Github, Linkedin, Mail, Download } from "lucide-react";
import ramzyPhoto from "@/assets/ramzy.png";
import { useSiteSetting, ml } from "@/hooks/useSiteData";

interface HeroData {
  name?: any; greeting?: any; title?: any; tagline?: any;
  badge?: string; available_label?: string; photo_url?: string; cv_url?: string;
  social?: { github?: string; linkedin?: string; email?: string };
  stats?: Array<{ value: string; label_en?: string; label_ar?: string; label_zh?: string }>;
}

export function Hero() {
  const { t, lang } = useLang();
  const { value: data } = useSiteSetting<HeroData>("hero");

  const name = ml(data?.name, lang) || t.hero.name;
  const greeting = ml(data?.greeting, lang) || t.hero.greeting;
  const title = ml(data?.title, lang) || t.hero.title;
  const tagline = ml(data?.tagline, lang) || t.hero.tagline;
  const badge = data?.badge || "Open for freelance & full-time roles";
  const available = data?.available_label || "Available now";
  const photo = data?.photo_url || ramzyPhoto;
  const cvUrl = data?.cv_url || "/CV_Ramzy_Albazel.pdf";
  const social = data?.social || {};

  const stats = (data?.stats?.length ? data.stats : [
    { value: "20+", label_en: t.hero.stats.projects },
    { value: "5+", label_en: t.hero.stats.years },
    { value: "100%", label_en: t.hero.stats.satisfaction },
  ]).map(s => ({ value: s.value, label: ml({ en: s.label_en, ar: s.label_ar, zh: s.label_zh } as any, lang) }));

  return (
    <section id="hero" className="relative overflow-hidden pt-32 md:pt-40 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-accent-cyan/20 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-14 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{badge}</span>
            </div>

            <p className="text-muted-foreground text-lg mb-3 font-medium">{greeting}</p>
            <h1 className="font-display font-bold leading-[1.05] tracking-tight mb-5 text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient">{name}</span>
            </h1>
            <p className="text-xl md:text-2xl font-display text-primary mb-5">{title}</p>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">{tagline}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href="#projects" className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-elegant hover:scale-[1.03]">
                {t.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
              </a>
              <a href="#contact" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/10">
                {t.hero.ctaSecondary}
              </a>
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/10">
                <Download className="h-4 w-4" /> Download CV
              </a>
            </div>

            <div className="flex items-center gap-3 mb-10">
              {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="glass grid h-10 w-10 place-items-center rounded-full transition hover:border-primary/50 hover:text-primary"><Github className="h-4 w-4" /></a>}
              {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="glass grid h-10 w-10 place-items-center rounded-full transition hover:border-primary/50 hover:text-primary"><Linkedin className="h-4 w-4" /></a>}
              {social.email && <a href={`mailto:${social.email}`} aria-label="Email" className="glass grid h-10 w-10 place-items-center rounded-full transition hover:border-primary/50 hover:text-primary"><Mail className="h-4 w-4" /></a>}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-md">
              {stats.map((s, i) => (
                <div key={i} className="glass rounded-2xl p-4 text-center">
                  <div className="font-display text-2xl md:text-3xl font-bold text-gradient-primary">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up delay-200">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-primary opacity-30 blur-2xl animate-glow" />
              <div className="relative glass-strong rounded-[2rem] p-3 shadow-elegant animate-float">
                <img src={photo} alt={name} className="w-full rounded-[1.5rem] object-cover aspect-[3/4]" loading="eager" />
                <div className="absolute -bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 glass-strong rounded-2xl px-4 py-2 shadow-glow flex items-center gap-2 whitespace-nowrap">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-xs font-semibold">{available}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
