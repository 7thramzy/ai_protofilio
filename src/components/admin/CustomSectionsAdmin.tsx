import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Section { id: string; slug: string; template: string; title_en: string; title_ar: string | null; title_zh: string | null; eyebrow_en: string | null; eyebrow_ar: string | null; eyebrow_zh: string | null; visible: boolean; sort_order: number; }
interface Item { id: string; section_id: string; title_en: string; title_ar: string | null; title_zh: string | null; description_en: string | null; description_ar: string | null; description_zh: string | null; link_url: string | null; link_label: string | null; image_url: string | null; date_label: string | null; tags: string[]; meta: any; sort_order: number; }

const TEMPLATES = ["generic", "research", "publications", "certificates"];

export function CustomSectionsAdmin() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<Section | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: "", template: "generic", title_en: "", title_ar: "", title_zh: "", eyebrow_en: "", eyebrow_ar: "", eyebrow_zh: "", visible: true, sort_order: 0 });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("custom_sections").select("*").order("sort_order");
    if (error) toast.error(error.message); else setSections(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm({ slug: "", template: "generic", title_en: "", title_ar: "", title_zh: "", eyebrow_en: "", eyebrow_ar: "", eyebrow_zh: "", visible: true, sort_order: sections.length }); setDialogOpen(true); };
  const openEdit = (s: Section) => {
    setEditId(s.id);
    setForm({ slug: s.slug, template: s.template, title_en: s.title_en, title_ar: s.title_ar ?? "", title_zh: s.title_zh ?? "", eyebrow_en: s.eyebrow_en ?? "", eyebrow_ar: s.eyebrow_ar ?? "", eyebrow_zh: s.eyebrow_zh ?? "", visible: s.visible, sort_order: s.sort_order });
    setDialogOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, title_ar: form.title_ar || null, title_zh: form.title_zh || null, eyebrow_en: form.eyebrow_en || null, eyebrow_ar: form.eyebrow_ar || null, eyebrow_zh: form.eyebrow_zh || null };
    const res = editId
      ? await supabase.from("custom_sections").update(payload).eq("id", editId)
      : await supabase.from("custom_sections").insert(payload);
    if (res.error) toast.error(res.error.message);
    else { toast.success("Saved"); setDialogOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete section and all its items?")) return;
    const { error } = await supabase.from("custom_sections").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  if (openSection) return <SectionItemsEditor section={openSection} onBack={() => setOpenSection(null)} />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{sections.length} section{sections.length !== 1 && "s"}</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-primary"><Plus className="h-4 w-4" /> New Section</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glass-strong max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit" : "New"} Section</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div className="grid md:grid-cols-2 gap-2">
                <div><Label>Slug (URL)*</Label><Input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="research" /></div>
                <div>
                  <Label>Template</Label>
                  <select value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} className="w-full rounded-md border border-border bg-input/60 p-2 text-sm">
                    {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <div><Label>Eyebrow EN</Label><Input value={form.eyebrow_en} onChange={(e) => setForm({ ...form, eyebrow_en: e.target.value })} /></div>
                <div><Label>Eyebrow AR</Label><Input value={form.eyebrow_ar} onChange={(e) => setForm({ ...form, eyebrow_ar: e.target.value })} /></div>
                <div><Label>Eyebrow ZH</Label><Input value={form.eyebrow_zh} onChange={(e) => setForm({ ...form, eyebrow_zh: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <div><Label>Title EN*</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
                <div><Label>Title AR</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></div>
                <div><Label>Title ZH</Label><Input value={form.title_zh} onChange={(e) => setForm({ ...form, title_zh: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                <div className="flex items-end gap-2"><Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} /><Label>Visible on site</Label></div>
              </div>
              <Button type="submit" className="w-full bg-gradient-primary">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-2">
        {sections.map((s) => (
          <div key={s.id} className="glass rounded-xl p-3 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold">{s.title_en}</h4>
                <Badge variant="secondary">{s.template}</Badge>
                <Badge variant="outline">#{s.slug}</Badge>
                {!s.visible && <Badge variant="destructive">hidden</Badge>}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setOpenSection(s)}>Manage items</Button>
            <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" onClick={() => del(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
        {sections.length === 0 && <p className="text-center text-muted-foreground py-8">No custom sections yet. Click "New Section" to create one (e.g. Research, Publications).</p>}
      </div>
    </div>
  );
}

const emptyItem = { title_en: "", title_ar: "", title_zh: "", description_en: "", description_ar: "", description_zh: "", link_url: "", link_label: "", image_url: "", date_label: "", tags: "", meta_authors: "", meta_venue: "", meta_issuer: "", sort_order: 0 };

function SectionItemsEditor({ section, onBack }: { section: Section; onBack: () => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyItem>(emptyItem);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("section_items").select("*").eq("section_id", section.id).order("sort_order");
    if (error) toast.error(error.message); else setItems((data ?? []) as Item[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [section.id]);

  const openNew = () => { setEditId(null); setForm({ ...emptyItem, sort_order: items.length }); setOpen(true); };
  const openEdit = (it: Item) => {
    setEditId(it.id);
    setForm({
      title_en: it.title_en, title_ar: it.title_ar ?? "", title_zh: it.title_zh ?? "",
      description_en: it.description_en ?? "", description_ar: it.description_ar ?? "", description_zh: it.description_zh ?? "",
      link_url: it.link_url ?? "", link_label: it.link_label ?? "",
      image_url: it.image_url ?? "", date_label: it.date_label ?? "",
      tags: (it.tags ?? []).join(", "),
      meta_authors: it.meta?.authors ?? "", meta_venue: it.meta?.venue ?? "", meta_issuer: it.meta?.issuer ?? "",
      sort_order: it.sort_order,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const meta: any = {};
    if (form.meta_authors) meta.authors = form.meta_authors;
    if (form.meta_venue) meta.venue = form.meta_venue;
    if (form.meta_issuer) meta.issuer = form.meta_issuer;
    const payload = {
      section_id: section.id,
      title_en: form.title_en, title_ar: form.title_ar || null, title_zh: form.title_zh || null,
      description_en: form.description_en || null, description_ar: form.description_ar || null, description_zh: form.description_zh || null,
      link_url: form.link_url || null, link_label: form.link_label || null,
      image_url: form.image_url || null, date_label: form.date_label || null,
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      meta, sort_order: form.sort_order,
    };
    const res = editId
      ? await supabase.from("section_items").update(payload).eq("id", editId)
      : await supabase.from("section_items").insert(payload);
    if (res.error) toast.error(res.error.message);
    else { toast.success("Saved"); setOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("section_items").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  const isPub = section.template === "publications";
  const isCert = section.template === "certificates";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back to sections</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-primary"><Plus className="h-4 w-4" /> New Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl glass-strong max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? "Edit" : "New"} item — {section.title_en}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-3">
              <div className="grid md:grid-cols-3 gap-2">
                <div><Label>Title EN*</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
                <div><Label>Title AR</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></div>
                <div><Label>Title ZH</Label><Input value={form.title_zh} onChange={(e) => setForm({ ...form, title_zh: e.target.value })} /></div>
              </div>
              <div><Label>Description EN</Label><Textarea rows={2} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} /></div>
              <div className="grid md:grid-cols-2 gap-2">
                <div><Label>Description AR</Label><Textarea rows={2} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} /></div>
                <div><Label>Description ZH</Label><Textarea rows={2} value={form.description_zh} onChange={(e) => setForm({ ...form, description_zh: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div><Label>Date label</Label><Input value={form.date_label} onChange={(e) => setForm({ ...form, date_label: e.target.value })} placeholder="2024" /></div>
                <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div><Label>Link URL</Label><Input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} /></div>
                <div><Label>Link label</Label><Input value={form.link_label} onChange={(e) => setForm({ ...form, link_label: e.target.value })} placeholder="Read paper" /></div>
              </div>
              <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>

              {(isPub || section.template === "research") && (
                <div className="grid md:grid-cols-2 gap-2">
                  <div><Label>Authors</Label><Input value={form.meta_authors} onChange={(e) => setForm({ ...form, meta_authors: e.target.value })} /></div>
                  <div><Label>Venue / Journal</Label><Input value={form.meta_venue} onChange={(e) => setForm({ ...form, meta_venue: e.target.value })} /></div>
                </div>
              )}
              {isCert && (
                <div><Label>Issuer</Label><Input value={form.meta_issuer} onChange={(e) => setForm({ ...form, meta_issuer: e.target.value })} /></div>
              )}

              <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
              <Button type="submit" className="w-full bg-gradient-primary">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-strong rounded-2xl p-3">
        <h3 className="font-display font-semibold mb-1">{section.title_en}</h3>
        <p className="text-xs text-muted-foreground mb-3">Template: {section.template} · {items.length} item(s)</p>
        <div className="grid gap-2">
          {items.map((it) => (
            <div key={it.id} className="glass rounded-xl p-3 flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{it.title_en}</h4>
                {it.description_en && <p className="text-xs text-muted-foreground line-clamp-2">{it.description_en}</p>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground py-6 text-sm">No items yet.</p>}
        </div>
      </div>
    </div>
  );
}
