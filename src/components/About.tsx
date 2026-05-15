import { useLang } from "@/contexts/LangContext";
import { GraduationCap, Globe2, Sparkles, type LucideIcon } from "lucide-react";
import { useSiteSetting, ml } from "@/hooks/useSiteData";

const ICONS: Record<string, LucideIcon> = { GraduationCap, Globe2, Sparkles };

interface AboutData {
  eyebrow?: any; title?: any; body?: any;
  highlights?: Array<{ icon?: string; value_en?: string; value_ar?: string; value_zh?: string; label_en?: string; label_ar?: string; label_zh?: string }>;
}

export function About() {
  const { t, lang } = useLang();
  const { value: data } = useSiteSetting<AboutData>("about");

  const eyebrow = ml(data?.eyebrow, lang) || t.about.eyebrow;
  const title = ml(data?.title, lang) || t.about.title;
  const body = ml(data?.body, lang) || t.about.body;
  const highlights = data?.highlights ?? [];

  return (
    <section id="about" className="section-pad">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient mb-6">{title}</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">{body}</p>
        </div>

        {highlights.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-4">
            {highlights.map((h, i) => {
              const Icon = ICONS[h.icon ?? "Sparkles"] ?? Sparkles;
              const value = ml({ en: h.value_en, ar: h.value_ar, zh: h.value_zh } as any, lang);
              const label = ml({ en: h.label_en, ar: h.label_ar, zh: h.label_zh } as any, lang);
              return (
                <div key={i} className="glass rounded-2xl p-6 transition hover:border-primary/40 hover:-translate-y-1">
                  <Icon className="h-7 w-7 text-primary mb-3" />
                  <div className="font-display font-semibold text-sm mb-1">{value}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
