import { useLang } from "@/contexts/LangContext";
import { useSkills } from "@/hooks/useSiteData";

export function Skills() {
  const { t } = useLang();
  const all = useSkills();
  const technical = all.filter(s => s.category === "technical");
  const stack = all.filter(s => s.category === "stack");
  const soft = all.filter(s => s.category === "soft");

  return (
    <section id="skills" className="section-pad">
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t.skills.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">{t.skills.title}</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <h3 className="font-display font-semibold text-lg mb-6">{t.skills.technical}</h3>
            <div className="space-y-4">
              {technical.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground tabular-nums">{s.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-primary transition-all duration-1000" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <h3 className="font-display font-semibold text-lg mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {stack.map((s) => (
                  <span key={s.id} className="rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-primary/10 hover:text-primary">{s.name}</span>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8">
              <h3 className="font-display font-semibold text-lg mb-4">{t.skills.soft}</h3>
              <div className="flex flex-wrap gap-2">
                {soft.map((s) => (
                  <span key={s.id} className="rounded-full bg-gradient-primary/20 border border-primary/30 px-3 py-1.5 text-xs font-medium text-foreground">{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
