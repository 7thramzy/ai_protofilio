import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Trash2, Mail } from "lucide-react";

interface Msg {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export function MessagesAdmin() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); load(); }
  };

  if (loading) return <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{rows.length} message{rows.length !== 1 && "s"}</p>
      {rows.map((m) => (
        <div key={m.id} className="glass rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{m.subject || "(no subject)"}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span>{m.name}</span>
                <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-primary hover:underline"><Mail className="h-3 w-3" />{m.email}</a>
                <span>·</span>
                <span>{new Date(m.created_at).toLocaleString()}</span>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => onDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
          <p className="text-sm whitespace-pre-wrap">{m.message}</p>
        </div>
      ))}
      {rows.length === 0 && <p className="text-center text-muted-foreground py-12">No messages yet.</p>}
    </div>
  );
}
