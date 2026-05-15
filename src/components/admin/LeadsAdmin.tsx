import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Trash2, Mail, Phone, MessageSquare } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  interest: string | null;
  source: string;
  created_at: string;
}

export function LeadsAdmin() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{rows.length} lead{rows.length !== 1 && "s"} captured</p>
      {rows.map((l) => (
        <div key={l.id} className="glass rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{l.name || "Anonymous"}</h3>
                <Badge variant="secondary">{l.source}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onDelete(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-2 text-primary hover:underline"><Mail className="h-3.5 w-3.5" />{l.email}</a>}
            {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-2 text-primary hover:underline"><Phone className="h-3.5 w-3.5" />{l.phone}</a>}
          </div>
          {l.interest && <div className="mt-2 flex gap-2 text-sm text-muted-foreground"><MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" /><span>{l.interest}</span></div>}
        </div>
      ))}
      {rows.length === 0 && <p className="text-center text-muted-foreground py-12">No leads yet.</p>}
    </div>
  );
}
