import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { projects as fallbackProjects } from "@/data/projects";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { ProjectsSkeleton } from "@/components/ProjectsSkeleton";

interface DBProject {
  id: string;
  title_en: string;
  title_ar: string | null;
  title_zh: string | null;
  description_en: string;
  description_ar: string | null;
  description_zh: string | null;
  category: string;
  tags: string[];
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
}

const gradients = [
  "from-rose-500/40 to-indigo-600/40",
  "from-indigo-500/40 to-cyan-500/40",
  "from-cyan-500/40 to-emerald-500/40",
  "from-orange-500/40 to-pink-500/40",
  "from-violet-500/40 to-indigo-500/40",
  "from-amber-500/40 to-rose-500/40",
  "from-emerald-500/40 to-cyan-500/40",
];

export function Projects() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<DBProject[] | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  // Fallback to static data if DB empty/loading
  const display = items && items.length > 0 ? items : null;

  return (
    <section id="projects" className="section-pad">
      <div className="container max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t.projects.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">{t.projects.title}</h2>
        </div>

        {items === null ? <ProjectsSkeleton /> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {display
            ? display.map((p, i) => {
                const title = (lang === "ar" && p.title_ar) || (lang === "zh" && p.title_zh) || p.title_en;
                const desc = (lang === "ar" && p.description_ar) || (lang === "zh" && p.description_zh) || p.description_en;
                const gradient = gradients[i % gradients.length];
                return (
                  <article
                    key={p.id}
                    className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:border-primary/50 hover:-translate-y-1 hover:shadow-elegant"
                  >
                    <div className={`absolute -top-20 -end-20 h-48 w-48 rounded-full bg-gradient-to-br ${gradient} blur-3xl opacity-60 transition group-hover:opacity-90`} />
                    {p.featured && (
                      <span className="absolute top-4 end-4 z-10 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
                        {t.projects.featured}
                      </span>
                    )}
                    <div className="relative">
                      {p.image_url ? (
                        <img src={p.image_url} alt={title} className="w-full h-32 object-cover rounded-xl mb-4" loading="lazy" />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-2xl glass-strong text-3xl mb-4 shadow-card">✨</div>
                      )}
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{p.category}</p>
                      <h3 className="font-display text-xl font-semibold mb-3 leading-tight">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">{desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {p.tags.slice(0, 4).map((tech) => (
                          <span key={tech} className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground">{tech}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        {p.demo_url && (
                          <a href={p.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition">
                            <ExternalLink className="h-3.5 w-3.5" /> {t.projects.view}
                          </a>
                        )}
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition">
                            <Github className="h-3.5 w-3.5" /> Code
                          </a>
                        )}
                        {!p.demo_url && !p.github_url && (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            {t.projects.view} <ArrowUpRight className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            : fallbackProjects.map((p, i) => (
                <article key={p.id} className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:border-primary/50 hover:-translate-y-1 hover:shadow-elegant">
                  <div className={`absolute -top-20 -end-20 h-48 w-48 rounded-full bg-gradient-to-br ${p.gradient} blur-3xl opacity-60`} />
                  {p.featured && (
                    <span className="absolute top-4 end-4 z-10 rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
                      {t.projects.featured}
                    </span>
                  )}
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl glass-strong text-3xl mb-4 shadow-card">{p.icon}</div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{p.category}</p>
                    <h3 className="font-display text-xl font-semibold mb-3 leading-tight">{p.title[lang]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">{p.description[lang]}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {p.tech.slice(0, 4).map((tech) => (
                        <span key={tech} className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground">{tech}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
        </div>
        )}
      </div>
    </section>
  );
}
