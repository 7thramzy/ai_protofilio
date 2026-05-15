import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Loader2, Star } from "lucide-react";

interface ProjectRow {
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
  sort_order: number;
}

const empty = {
  title_en: "", title_ar: "", title_zh: "",
  description_en: "", description_ar: "", description_zh: "",
  category: "web", tags: "",
  image_url: "", demo_url: "", github_url: "",
  featured: false, sort_order: 0,
};

export function ProjectsAdmin() {
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditingId(null); setForm(empty); setOpen(true); };
  const openEdit = (p: ProjectRow) => {
    setEditingId(p.id);
    setForm({
      title_en: p.title_en, title_ar: p.title_ar ?? "", title_zh: p.title_zh ?? "",
      description_en: p.description_en, description_ar: p.description_ar ?? "", description_zh: p.description_zh ?? "",
      category: p.category, tags: p.tags.join(", "),
      image_url: p.image_url ?? "", demo_url: p.demo_url ?? "", github_url: p.github_url ?? "",
      featured: p.featured, sort_order: p.sort_order,
    });
    setOpen(true);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title_en: form.title_en,
      title_ar: form.title_ar || null,
      title_zh: form.title_zh || null,
      description_en: form.description_en,
      description_ar: form.description_ar || null,
      description_zh: form.description_zh || null,
      category: form.category,
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      image_url: form.image_url || null,
      demo_url: form.demo_url || null,
      github_url: form.github_url || null,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
    };
    const res = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editingId ? "Project updated" : "Project added");
    setOpen(false);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} project{rows.length !== 1 && "s"}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="bg-gradient-primary"><Plus className="h-4 w-4" /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-strong">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Title (EN)*</Label>
                  <Input required value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Title (AR)</Label>
                  <Input value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Title (ZH)</Label>
                  <Input value={form.title_zh} onChange={e => setForm({ ...form, title_zh: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description (EN)*</Label>
                <Textarea required rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Description (AR)</Label>
                <Textarea rows={2} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Description (ZH)</Label>
                <Textarea rows={2} value={form.description_zh} onChange={e => setForm({ ...form, description_zh: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="web, ai, mobile…" />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort order</Label>
                  <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, Supabase" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Demo URL</Label>
                  <Input value={form.demo_url} onChange={e => setForm({ ...form, demo_url: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>GitHub URL</Label>
                  <Input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <Label>Featured project</Label>
              </div>

              <Button type="submit" disabled={saving} className="w-full bg-gradient-primary">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {rows.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold truncate">{p.title_en}</h3>
                {p.featured && <Star className="h-4 w-4 fill-primary text-primary" />}
                <Badge variant="secondary">{p.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{p.description_en}</p>
              <div className="flex flex-wrap gap-1">
                {p.tags.slice(0, 5).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted">{t}</span>)}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-muted-foreground py-12">No projects yet. Click "New Project" to add one.</p>}
      </div>
    </div>
  );
}
