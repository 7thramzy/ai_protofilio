import { useLang } from "@/contexts/LangContext";
import { useCustomSections, ml, type SectionItemRow, type SectionRow } from "@/hooks/useSiteData";
import { ExternalLink, FileText, Award, Microscope, Sparkles } from "lucide-react";

const TEMPLATE_ICON: Record<string, typeof Sparkles> = {
  research: Microscope,
  publications: FileText,
  certificates: Award,
  generic: Sparkles,
};

export function CustomSections() {
  const { lang } = useLang();
  const { sections, items } = useCustomSections();

  if (!sections.length) return null;

  return (
    <>
      {sections.map((s) => {
        const sItems = items.filter((it) => it.section_id === s.id);
        return <CustomSection key={s.id} section={s} items={sItems} lang={lang} />;
      })}
    </>
  );
}

function CustomSection({ section, items, lang }: { section: SectionRow; items: SectionItemRow[]; lang: any }) {
  const Icon = TEMPLATE_ICON[section.template] ?? Sparkles;
  const eyebrow = ml({ en: section.eyebrow_en, ar: section.eyebrow_ar, zh: section.eyebrow_zh } as any, lang);
  const title = ml({ en: section.title_en, ar: section.title_ar, zh: section.title_zh } as any, lang);

  return (
    <section id={section.slug} className="section-pad">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{eyebrow}</p>}
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">{title}</h2>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">No items yet.</p>
        ) : section.template === "publications" ? (
          <div className="space-y-3 max-w-4xl mx-auto">
            {items.map((it) => {
              const t = ml({ en: it.title_en, ar: it.title_ar, zh: it.title_zh } as any, lang);
              const d = ml({ en: it.description_en, ar: it.description_ar, zh: it.description_zh } as any, lang);
              return (
                <article key={it.id} className="glass rounded-2xl p-5 transition hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shrink-0"><Icon className="h-4 w-4 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold leading-tight">{t}</h3>
                      {it.meta?.venue && <p className="text-xs text-primary mt-1 font-semibold">{it.meta.venue}</p>}
                      {d && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d}</p>}
                      {it.date_label && <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-2">{it.date_label}</p>}
                      {it.link_url && (
                        <a href={it.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-3 hover:gap-2 transition">
                          <ExternalLink className="h-3.5 w-3.5" /> {it.link_label || "View"}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it) => {
              const t = ml({ en: it.title_en, ar: it.title_ar, zh: it.title_zh } as any, lang);
              const d = ml({ en: it.description_en, ar: it.description_ar, zh: it.description_zh } as any, lang);
              return (
                <article key={it.id} className="group glass rounded-3xl p-6 transition hover:border-primary/50 hover:-translate-y-1">
                  {it.image_url ? (
                    <img src={it.image_url} alt={t} loading="lazy" className="w-full h-32 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow mb-4"><Icon className="h-5 w-5 text-white" /></div>
                  )}
                  {it.date_label && <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{it.date_label}</p>}
                  <h3 className="font-display text-lg font-semibold mb-2 leading-tight">{t}</h3>
                  {it.meta?.issuer && <p className="text-xs text-muted-foreground mb-2">{it.meta.issuer}</p>}
                  {d && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 mb-4">{d}</p>}
                  {it.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {it.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-md bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground">{tag}</span>)}
                    </div>
                  )}
                  {it.link_url && (
                    <a href={it.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition">
                      <ExternalLink className="h-3.5 w-3.5" /> {it.link_label || "View"}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
