import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { useSiteSetting, ml } from "@/hooks/useSiteData";

interface ContactInfo {
  email?: string; phone?: string;
  location_en?: string; location_ar?: string; location_zh?: string;
  github?: string; linkedin?: string; whatsapp?: string;
}

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

export function Contact() {
  const { t, lang } = useLang();
  const { value: info } = useSiteSetting<ContactInfo>("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
      });
      if (error) throw error;

      // Fire notification
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          interest: parsed.data.subject || parsed.data.message.slice(0, 120),
          source: "contact_form",
        }),
      }).catch(() => {});

      toast.success(t.contact.success);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error(t.contact.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-pad">
      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-3">{t.contact.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient mb-4">{t.contact.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
          {/* Contact info */}
          <div className="space-y-3">
            {info?.email && (
              <a href={`mailto:${info.email}`} className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-primary/50">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow"><Mail className="h-5 w-5 text-white" /></div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate">{info.email}</p>
                </div>
              </a>
            )}
            {info?.phone && (
              <a href={`tel:${info.phone}`} className="glass flex items-center gap-4 rounded-2xl p-5 transition hover:border-primary/50">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow"><Phone className="h-5 w-5 text-white" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone / WhatsApp</p>
                  <p className="font-medium text-sm">{info.phone}</p>
                </div>
              </a>
            )}
            {(info?.location_en || info?.location_ar || info?.location_zh) && (
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow"><MapPin className="h-5 w-5 text-white" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-sm">{ml({ en: info.location_en, ar: info.location_ar, zh: info.location_zh } as any, lang)}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground px-2 leading-relaxed">{t.contact.orChat}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-6 md:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t.contact.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label={t.contact.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            </div>
            <Field label={t.contact.subject} value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{t.contact.message}</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl bg-input/60 border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:shadow-elegant hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t.contact.sending : t.contact.send}
              <Send className="h-4 w-4 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-input/60 border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
    </div>
  );
}
