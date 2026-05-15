import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const KEYS = ["hero", "about", "contact"] as const;
type Key = typeof KEYS[number];

export function SiteSettingsAdmin() {
  const [tab, setTab] = useState<Key>("hero");
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as Key)}>
      <TabsList className="glass mb-4">
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="hero"><HeroEditor /></TabsContent>
      <TabsContent value="about"><AboutEditor /></TabsContent>
      <TabsContent value="contact"><ContactEditor /></TabsContent>
    </Tabs>
  );
}

function useSetting(key: Key) {
  const [value, setValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const reload = async () => {
    setLoading(true);
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
    setValue(data?.value ?? {});
    setLoading(false);
  };
  useEffect(() => { reload(); }, [key]);

  const save = async (next: any) => {
    const { error } = await supabase.from("site_settings").upsert({ key, value: next }, { onConflict: "key" });
    if (error) { toast.error(error.message); return false; }
    toast.success("Saved");
    setValue(next);
    return true;
  };
  return { value, setValue, loading, save };
}

function MLFields({ obj, onChange, label, textarea }: { obj: any; onChange: (v: any) => void; label: string; textarea?: boolean }) {
  const Comp: any = textarea ? Textarea : Input;
  const v = obj || {};
  return (
    <div className="grid md:grid-cols-3 gap-3">
      <div><Label>{label} (EN)</Label><Comp value={v.en ?? ""} onChange={(e: any) => onChange({ ...v, en: e.target.value })} /></div>
      <div><Label>{label} (AR)</Label><Comp value={v.ar ?? ""} onChange={(e: any) => onChange({ ...v, ar: e.target.value })} /></div>
      <div><Label>{label} (ZH)</Label><Comp value={v.zh ?? ""} onChange={(e: any) => onChange({ ...v, zh: e.target.value })} /></div>
    </div>
  );
}

function HeroEditor() {
  const { value, loading, save } = useSetting("hero");
  const [v, setV] = useState<any>({});
  useEffect(() => { if (value) setV(value); }, [value]);
  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  const stats = v.stats ?? [];
  const social = v.social ?? {};

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <MLFields label="Greeting" obj={v.greeting} onChange={(x) => setV({ ...v, greeting: x })} />
      <MLFields label="Name" obj={v.name} onChange={(x) => setV({ ...v, name: x })} />
      <MLFields label="Title" obj={v.title} onChange={(x) => setV({ ...v, title: x })} />
      <MLFields label="Tagline" obj={v.tagline} onChange={(x) => setV({ ...v, tagline: x })} textarea />
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Top badge</Label><Input value={v.badge ?? ""} onChange={(e) => setV({ ...v, badge: e.target.value })} /></div>
        <div><Label>"Available" label</Label><Input value={v.available_label ?? ""} onChange={(e) => setV({ ...v, available_label: e.target.value })} /></div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Photo URL (leave blank for default)</Label><Input value={v.photo_url ?? ""} onChange={(e) => setV({ ...v, photo_url: e.target.value })} /></div>
        <div><Label>CV / Resume URL (PDF)</Label><Input placeholder="/CV_Ramzy_Albazel.pdf" value={v.cv_url ?? ""} onChange={(e) => setV({ ...v, cv_url: e.target.value })} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>GitHub URL</Label><Input value={social.github ?? ""} onChange={(e) => setV({ ...v, social: { ...social, github: e.target.value } })} /></div>
        <div><Label>LinkedIn URL</Label><Input value={social.linkedin ?? ""} onChange={(e) => setV({ ...v, social: { ...social, linkedin: e.target.value } })} /></div>
        <div><Label>Email</Label><Input value={social.email ?? ""} onChange={(e) => setV({ ...v, social: { ...social, email: e.target.value } })} /></div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2"><Label>Stats</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => setV({ ...v, stats: [...stats, { value: "", label_en: "", label_ar: "", label_zh: "" }] })}><Plus className="h-3 w-3" /> Add</Button>
        </div>
        <div className="space-y-2">
          {stats.map((s: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_2fr_auto] gap-2 items-end">
              <Input placeholder="Value" value={s.value ?? ""} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; setV({ ...v, stats: n }); }} />
              <Input placeholder="Label EN" value={s.label_en ?? ""} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label_en: e.target.value }; setV({ ...v, stats: n }); }} />
              <Input placeholder="Label AR" value={s.label_ar ?? ""} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label_ar: e.target.value }; setV({ ...v, stats: n }); }} />
              <Input placeholder="Label ZH" value={s.label_zh ?? ""} onChange={(e) => { const n = [...stats]; n[i] = { ...n[i], label_zh: e.target.value }; setV({ ...v, stats: n }); }} />
              <Button type="button" size="icon" variant="ghost" onClick={() => setV({ ...v, stats: stats.filter((_: any, j: number) => j !== i) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => save(v)} className="bg-gradient-primary"><Save className="h-4 w-4" /> Save Hero</Button>
    </div>
  );
}

function AboutEditor() {
  const { value, loading, save } = useSetting("about");
  const [v, setV] = useState<any>({});
  useEffect(() => { if (value) setV(value); }, [value]);
  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;
  const highlights = v.highlights ?? [];

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-4">
      <MLFields label="Eyebrow" obj={v.eyebrow} onChange={(x) => setV({ ...v, eyebrow: x })} />
      <MLFields label="Title" obj={v.title} onChange={(x) => setV({ ...v, title: x })} />
      <MLFields label="Body" obj={v.body} onChange={(x) => setV({ ...v, body: x })} textarea />

      <div>
        <div className="flex items-center justify-between mb-2"><Label>Highlights</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => setV({ ...v, highlights: [...highlights, { icon: "Sparkles" }] })}><Plus className="h-3 w-3" /> Add</Button>
        </div>
        <div className="space-y-3">
          {highlights.map((h: any, i: number) => (
            <div key={i} className="glass rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <Input className="max-w-[220px]" placeholder="Icon: GraduationCap, Globe2, Sparkles" value={h.icon ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], icon: e.target.value }; setV({ ...v, highlights: n }); }} />
                <Button type="button" size="icon" variant="ghost" onClick={() => setV({ ...v, highlights: highlights.filter((_: any, j: number) => j !== i) })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <Input placeholder="Value EN" value={h.value_en ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], value_en: e.target.value }; setV({ ...v, highlights: n }); }} />
                <Input placeholder="Value AR" value={h.value_ar ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], value_ar: e.target.value }; setV({ ...v, highlights: n }); }} />
                <Input placeholder="Value ZH" value={h.value_zh ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], value_zh: e.target.value }; setV({ ...v, highlights: n }); }} />
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <Input placeholder="Label EN" value={h.label_en ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], label_en: e.target.value }; setV({ ...v, highlights: n }); }} />
                <Input placeholder="Label AR" value={h.label_ar ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], label_ar: e.target.value }; setV({ ...v, highlights: n }); }} />
                <Input placeholder="Label ZH" value={h.label_zh ?? ""} onChange={(e) => { const n = [...highlights]; n[i] = { ...n[i], label_zh: e.target.value }; setV({ ...v, highlights: n }); }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => save(v)} className="bg-gradient-primary"><Save className="h-4 w-4" /> Save About</Button>
    </div>
  );
}

function ContactEditor() {
  const { value, loading, save } = useSetting("contact");
  const [v, setV] = useState<any>({});
  useEffect(() => { if (value) setV(value); }, [value]);
  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  const set = (k: string, val: string) => setV({ ...v, [k]: val });

  return (
    <div className="glass-strong rounded-2xl p-5 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Email</Label><Input value={v.email ?? ""} onChange={(e) => set("email", e.target.value)} /></div>
        <div><Label>Phone / WhatsApp</Label><Input value={v.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>Location (EN)</Label><Input value={v.location_en ?? ""} onChange={(e) => set("location_en", e.target.value)} /></div>
        <div><Label>Location (AR)</Label><Input value={v.location_ar ?? ""} onChange={(e) => set("location_ar", e.target.value)} /></div>
        <div><Label>Location (ZH)</Label><Input value={v.location_zh ?? ""} onChange={(e) => set("location_zh", e.target.value)} /></div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>GitHub</Label><Input value={v.github ?? ""} onChange={(e) => set("github", e.target.value)} /></div>
        <div><Label>LinkedIn</Label><Input value={v.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} /></div>
        <div><Label>WhatsApp URL</Label><Input value={v.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} /></div>
      </div>
      <Button onClick={() => save(v)} className="bg-gradient-primary"><Save className="h-4 w-4" /> Save Contact</Button>
    </div>
  );
}
