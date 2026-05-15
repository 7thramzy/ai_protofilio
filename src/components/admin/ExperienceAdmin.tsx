import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Row {
  id: string; kind: string;
  title_en: string; title_ar: string | null; title_zh: string | null;
  org: string; period: string; sort_order: number;
}

const empty = { kind: "work", title_en: "", title_ar: "", title_zh: "", org: "", period: "", sort_order: 0 };

export function ExperienceAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [tab, setTab] = useState<"work" | "education">("work");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experiences").select("*").order("sort_order");
    if (error) toast.error(error.message); else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm({ ...empty, kind: tab }); setOpen(true); };
  const openEdit = (r: Row) => {
    setEditId(r.id);
    setForm({ kind: r.kind, title_en: r.title_en, title_ar: r.title_ar ?? "", title_zh: r.title_zh ?? "", org: r.org, period: r.period, sort_order: r.sort_order });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, title_ar: form.title_ar || null, title_zh: form.title_zh || null };
    const res = editId
      ? await supabase.from("experiences").update(payload).eq("id", editId)
      : await supabase.from("experiences").insert(payload);
    if (res.error) toast.error(res.error.message);
    else { toast.success("Saved"); setOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  const filtered = rows.filter(r => r.kind === tab);

  return (
    <div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <div className="flex items-center justify-between mb-3">
          <TabsList className="glass">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="bg-gradient-primary"><Plus className="h-4 w-4" /> New Entry</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl glass-strong max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editId ? "Edit" : "New"} Entry</DialogTitle></DialogHeader>
              <form onSubmit={save} className="space-y-3">
                <div>
                  <Label>Type</Label>
                  <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="w-full rounded-md border border-border bg-input/60 p-2 text-sm">
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div className="grid md:grid-cols-3 gap-2">
                  <div><Label>Title (EN)*</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
                  <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} /></div>
                  <div><Label>Title (ZH)</Label><Input value={form.title_zh} onChange={(e) => setForm({ ...form, title_zh: e.target.value })} /></div>
                </div>
                <div><Label>Organization</Label><Input value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>Period</Label><Input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="2023 – Present" /></div>
                  <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {(["work", "education"] as const).map((k) => (
          <TabsContent key={k} value={k}>
            <div className="grid gap-2">
              {filtered.map((r) => (
                <div key={r.id} className="glass rounded-xl p-3 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{r.title_en}</h4>
                    <p className="text-xs text-muted-foreground">{r.org}</p>
                    <p className="text-[11px] text-primary font-semibold uppercase tracking-wider mt-1">{r.period}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No entries yet.</p>}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
