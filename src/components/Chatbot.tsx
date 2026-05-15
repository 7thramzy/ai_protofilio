import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLang } from "@/contexts/LangContext";

interface Msg { role: "user" | "assistant"; content: string }

function getSessionId(): string {
  let id = localStorage.getItem("ramzy-chat-session");
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("ramzy-chat-session", id);
  }
  return id;
}

export function Chatbot() {
  const { t, lang, dir } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset welcome on language change
  useEffect(() => {
    setMessages([{ role: "assistant", content: t.chat.welcome }]);
  }, [lang, t.chat.welcome]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          sessionId: getSessionId(),
          language: lang,
        }),
      });

      if (r.status === 429) {
        setMessages((m) => [...m, { role: "assistant", content: lang === "ar" ? "عدد الطلبات كثير، حاول بعد قليل." : lang === "zh" ? "请求过多，请稍后再试。" : "Too many requests, please try again shortly." }]);
        return;
      }
      if (r.status === 402) {
        setMessages((m) => [...m, { role: "assistant", content: lang === "ar" ? "الرصيد مستنفد." : lang === "zh" ? "AI 额度已用完。" : "AI credits exhausted." }]);
        return;
      }

      const data = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…" }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I had trouble responding." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="fixed bottom-5 end-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-glow transition hover:scale-110 animate-glow"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Window */}
      {open && (
        <div
          dir={dir}
          className="fixed bottom-24 end-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm h-[min(560px,calc(100vh-8rem))] glass-strong rounded-3xl shadow-elegant flex flex-col overflow-hidden animate-fade-up"
        >
          {/* Header */}
          <div className="bg-gradient-primary p-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">RamzyBot</p>
              <p className="text-[11px] text-white/80">{t.chat.title}</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-primary text-white rounded-br-md"
                      : "bg-muted/70 text-foreground rounded-bl-md"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-strong:text-primary prose-a:text-primary">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted/70 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-border p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chat.placeholder}
              className="flex-1 bg-input/60 rounded-full px-4 py-2.5 text-sm border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-glow transition hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t.chat.send}
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
