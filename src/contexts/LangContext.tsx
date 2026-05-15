import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "@/lib/translations";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKey;
  dir: "ltr" | "rtl";
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("ramzy-lang") as Lang | null;
    if (stored && ["en", "ar", "zh"].includes(stored)) return stored;
    const browser = navigator.language.toLowerCase();
    if (browser.startsWith("ar")) return "ar";
    if (browser.startsWith("zh")) return "zh";
    return "en";
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("ramzy-lang", lang);
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang], dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
