import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Pencil, Save } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Skill { id: string; name: string; category: string; level: number; sort_order: number; }
const CATS = ["technical", "stack", "soft"] as const;

export function SkillsAdmin() {
  const [rows, setRows] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<typeof CATS[number]>("technical");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("skills").select("*").order("sort_order");
    if (error) toast.error(error.message); else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => r.category === tab);

  const updateRow = async (id: string, patch: Partial<Skill>) => {
    const { error } = await supabase.from("skills").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); load(); }
  };
  const addRow = async (name: string, level: number) => {
    if (!name.trim()) return;
    const sort_order = (filtered[filtered.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("skills").insert({ name, category: tab, level, sort_order });
    if (error) toast.error(error.message); else { toast.success("Added"); load(); }
  };
  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
      <TabsList className="glass mb-4">
        <TabsTrigger value="technical">Technical (with bars)</TabsTrigger>
        <TabsTrigger value="stack">Tech Stack</TabsTrigger>
        <TabsTrigger value="soft">Soft Skills</TabsTrigger>
      </TabsList>
      {CATS.map((c) => (
        <TabsContent key={c} value={c}>
          <SkillCategoryEditor showLevel={c === "technical"} rows={filtered} onUpdate={updateRow} onAdd={addRow} onDelete={del} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function SkillCategoryEditor({ rows, showLevel, onUpdate, onAdd, onDelete }: { rows: Skill[]; showLevel: boolean; onUpdate: (id: string, p: Partial<Skill>) => void; onAdd: (n: string, l: number) => void; onDelete: (id: string) => void; }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(80);
  return (
    <div className="space-y-3">
      <div className="glass rounded-2xl p-3 flex gap-2 items-end">
        <div className="flex-1"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        {showLevel && <div className="w-24"><Label>Level</Label><Input type="number" min={0} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} /></div>}
        <Button onClick={() => { onAdd(name, level); setName(""); }} className="bg-gradient-primary"><Plus className="h-4 w-4" /> Add</Button>
      </div>
      <div className="grid gap-2">
        {rows.map((r) => <SkillRow key={r.id} row={r} showLevel={showLevel} onUpdate={onUpdate} onDelete={onDelete} />)}
      </div>
    </div>
  );
}

function SkillRow({ row, showLevel, onUpdate, onDelete }: any) {
  const [name, setName] = useState(row.name);
  const [level, setLevel] = useState(row.level);
  const [order, setOrder] = useState(row.sort_order);
  return (
    <div className="glass rounded-xl p-2 flex gap-2 items-center">
      <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
      {showLevel && <Input type="number" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-20" />}
      <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-20" placeholder="Order" />
      <Button size="icon" variant="ghost" onClick={() => onUpdate(row.id, { name, level, sort_order: order })}><Save className="h-4 w-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => onDelete(row.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </div>
  );
}
