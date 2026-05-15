import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/lib/translations";

export type ML = { en?: string; ar?: string; zh?: string } | string | null | undefined;

export function ml(v: ML, lang: Lang): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v[lang] || v.en || v.ar || v.zh || "";
}

export function useSiteSetting<T = any>(key: string, fallback?: T) {
  const [value, setValue] = useState<T | undefined>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.from("site_settings").select("value").eq("key", key).maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data?.value) setValue(data.value as T);
        setLoaded(true);
      });
    return () => { active = false; };
  }, [key]);

  return { value, loaded };
}

export interface SkillRow {
  id: string; name: string; category: string; level: number; sort_order: number;
}
export function useSkills() {
  const [rows, setRows] = useState<SkillRow[]>([]);
  useEffect(() => {
    supabase.from("skills").select("*").order("sort_order").then(({ data }) => setRows(data ?? []));
  }, []);
  return rows;
}

export interface ExperienceRow {
  id: string; kind: string;
  title_en: string; title_ar: string | null; title_zh: string | null;
  org: string; period: string; sort_order: number;
}
export function useExperiences() {
  const [rows, setRows] = useState<ExperienceRow[]>([]);
  useEffect(() => {
    supabase.from("experiences").select("*").order("sort_order").then(({ data }) => setRows(data ?? []));
  }, []);
  return rows;
}

export interface SectionRow {
  id: string; slug: string; template: string;
  title_en: string; title_ar: string | null; title_zh: string | null;
  eyebrow_en: string | null; eyebrow_ar: string | null; eyebrow_zh: string | null;
  visible: boolean; sort_order: number;
}
export interface SectionItemRow {
  id: string; section_id: string;
  title_en: string; title_ar: string | null; title_zh: string | null;
  description_en: string | null; description_ar: string | null; description_zh: string | null;
  link_url: string | null; link_label: string | null; image_url: string | null;
  date_label: string | null; tags: string[]; meta: Record<string, any>; sort_order: number;
}

export function useCustomSections() {
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [items, setItems] = useState<SectionItemRow[]>([]);
  useEffect(() => {
    (async () => {
      const [s, i] = await Promise.all([
        supabase.from("custom_sections").select("*").eq("visible", true).order("sort_order"),
        supabase.from("section_items").select("*").order("sort_order"),
      ]);
      setSections(s.data ?? []);
      setItems((i.data ?? []) as SectionItemRow[]);
    })();
  }, []);
  return { sections, items };
}
