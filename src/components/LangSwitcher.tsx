import { useLang } from "@/contexts/LangContext";
import { type Lang } from "@/lib/translations";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const langs: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ar", label: "العربية", native: "AR" },
  { code: "zh", label: "中文", native: "中" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = langs.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-foreground transition hover:bg-primary/15 hover:border-primary/40"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="font-display">{current.native}</span>
      </button>
      {open && (
        <div className="glass-strong absolute end-0 mt-2 w-40 overflow-hidden rounded-xl shadow-elegant z-50 animate-fade-up">
          {langs.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-primary/15 ${
                lang === l.code ? "text-primary font-semibold" : "text-foreground"
              }`}
            >
              <span>{l.label}</span>
              <span className="text-xs text-muted-foreground">{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
