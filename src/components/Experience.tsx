import { useLang } from "@/contexts/LangContext";
import { Briefcase, GraduationCap } from "lucide-react";
import { useExperiences, ml } from "@/hooks/useSiteData";

export function Experience() {
  const { t, lang } = useLang();
  const all = useExperiences();
  const work = all.filter(e => e.kind === "work");
  const education = all.filter(e => e.kind === "education");

  return (
    <section id="experience" className="section-pad">
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t.experience.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">{t.experience.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Timeline icon={Briefcase} title={t.experience.work} items={work.map(w => ({ title: ml({ en: w.title_en, ar: w.title_ar, zh: w.title_zh } as any, lang), org: w.org, period: w.period }))} />
          <Timeline icon={GraduationCap} title={t.experience.education} items={education.map(e => ({ title: ml({ en: e.title_en, ar: e.title_ar, zh: e.title_zh } as any, lang), org: e.org, period: e.period }))} />
        </div>
      </div>
    </section>
  );
}

function Timeline({ icon: Icon, title, items }: { icon: typeof Briefcase; title: string; items: { title: string; org: string; period: string }[] }) {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-display font-semibold text-lg">{title}</h3>
      </div>
      <div className="relative ps-6 space-y-6">
        <span className="absolute start-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />
        {items.map((it, i) => (
          <div key={i} className="relative">
            <span className="absolute -start-[22px] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-primary ring-4 ring-background" />
            <h4 className="font-semibold text-sm md:text-base">{it.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{it.org}</p>
            <p className="text-[11px] uppercase tracking-wider text-primary mt-1 font-semibold">{it.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
