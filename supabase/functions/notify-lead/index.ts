// Sends new-lead notifications via Telegram + Resend email
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const lead = await req.json();
    const { name, email, phone, interest, source } = lead ?? {};

    const text = `🚀 New lead on your portfolio!\n\n👤 Name: ${name ?? "—"}\n📧 Email: ${email ?? "—"}\n📱 Phone: ${phone ?? "—"}\n💼 Interest: ${interest ?? "—"}\n🔗 Source: ${source ?? "chat"}`;

    const TG_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TG_CHAT = Deno.env.get("TELEGRAM_CHAT_ID");
    const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
    const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL");

    const results: Record<string, unknown> = {};

    // Telegram
    if (TG_TOKEN && TG_CHAT) {
      try {
        const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TG_CHAT, text }),
        });
        results.telegram = r.ok ? "sent" : `error ${r.status}`;
      } catch (e) {
        results.telegram = String(e);
      }
    } else {
      results.telegram = "skipped (missing secrets)";
    }

    // Resend email
    if (RESEND_KEY && OWNER_EMAIL) {
      try {
        const html = `<h2>New portfolio lead 🎉</h2>
          <p><b>Name:</b> ${name ?? "—"}</p>
          <p><b>Email:</b> ${email ?? "—"}</p>
          <p><b>Phone:</b> ${phone ?? "—"}</p>
          <p><b>Interest:</b> ${interest ?? "—"}</p>
          <p><b>Source:</b> ${source ?? "chat"}</p>`;
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Portfolio <onboarding@resend.dev>",
            to: [OWNER_EMAIL],
            subject: `New lead: ${name ?? "Anonymous"}`,
            html,
          }),
        });
        results.email = r.ok ? "sent" : `error ${r.status}: ${await r.text()}`;
      } catch (e) {
        results.email = String(e);
      }
    } else {
      results.email = "skipped (missing secrets)";
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
