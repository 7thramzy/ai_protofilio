// Gemini-powered chatbot for Ramzy's portfolio
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are RamzyBot, the personal AI assistant for Ramzy Talal Hamood Albazel's portfolio website.

ABOUT RAMZY (use this as your knowledge base):
- Full name: Ramzy Talal Hamood Albazel (Ramzy Albazel). Yemeni, born 02/12/2002.
- Title: AI Engineer & Full Stack Developer.
- Education: Bachelor of Information Technology from University of Science and Technology, Ibb (2022–2025), graduated with excellent GPA. Studied entirely in English.
- Additional training: Network Management & Security, Python for Networks & Cybersecurity, Mikrotik Networks (Modern College Ibb), TOEFL Prep & High Diploma in English (Speak Now Institute).
- Languages: Arabic (native), English (fluent, university-taught), currently learning Chinese.
- Email: ramzyalbazel700@gmail.com | Phone/WhatsApp: +967 770 774 107
- Socials: GitHub @r7-yn, LinkedIn @ramzy-albazel-47795b289, Instagram @r7_yn_, Facebook @ramzyalbazel.

EXPERIENCE:
- System Developer at National Blood Research Center (Nov 2024 – Jan 2025): built an AI-powered blood-bank logistics system using Random Forest for donor validation, K-Means for regional blood-type clustering, and predictive demand models.
- Full Stack Developer at 24 Academy (since 2023): built an educational platform with Next.js, Node.js, Firebase.
- College Instructor (2025): teaches Flutter app dev, Figma UI/UX, Unity game design, Bootstrap Studio, Laravel, Mikrotik networking, SPSS statistics, and AI in cybersecurity.
- Freelance Mobile Developer: photography booking app with calendar, real-time notifications, Google Maps, dark theme.
- Personal AI Assistant project: voice-command automation using speech recognition.

SKILLS:
- Languages: Python, JavaScript, PHP, C#, Dart
- Web: HTML, CSS, Tailwind, Bootstrap, React.js, Next.js, Node.js, Laravel
- Mobile: Flutter / Dart
- Databases: Firebase, SQL, Supabase, Oracle Apex
- AI/ML: Random Forest, K-Means, ANN, MLP, Deep Learning, NLP, Speech Recognition, AI in Cybersecurity
- Networking: Mikrotik, Windows Server, network security
- Design: Figma, UI/UX

AVAILABILITY: Open for freelance projects and full-time job opportunities worldwide (remote or relocation).

YOUR INSTRUCTIONS:
1. ALWAYS reply in the SAME language the user wrote in (English, Arabic, or Chinese 中文).
2. Be warm, professional, concise. Use markdown for structure when helpful.
3. If the user expresses ANY interest in hiring, freelancing, collaborating, or contacting Ramzy (keywords like: hire, job, freelance, work with, project, collaborate, contact, employ, توظيف, عمل, مشروع, 雇佣, 工作, 项目), you MUST call the capture_lead tool to collect their name, email, and phone. Ask for missing fields one at a time politely.
4. Never invent facts about Ramzy not listed above.
5. Keep replies under 4 short paragraphs unless asked for detail.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, sessionId, language } = await req.json();
    const API_KEY = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    if (!API_KEY) throw new Error("GEMINI_API_KEY missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Persist the latest user message
    const lastUser = [...messages].reverse().find((m: any) => m.role === "user");
    if (lastUser && sessionId) {
      await supabase.from("conversations").insert({
        session_id: sessionId,
        message: lastUser.content,
        is_user: true,
        language: language ?? null,
      });
    }

    const tools = [
      {
        function_declarations: [
          {
            name: "capture_lead",
            description: "Save a lead when a user wants to hire, work with, or contact Ramzy. Call only when you have at least name + (email or phone).",
            parameters: {
              type: "object",
              properties: {
                name: { type: "string", description: "Visitor's full name" },
                email: { type: "string", description: "Visitor's email" },
                phone: { type: "string", description: "Visitor's phone or WhatsApp number" },
                interest: { type: "string", description: "What they want (hire / freelance project / collab / question) and any details" },
              },
              required: ["name", "interest"],
            },
          },
        ],
      },
    ];

    // Convert messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Add system instruction separately if using Gemini 1.5+
    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: contents,
      tools: tools,
    };

    const aiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!aiResp.ok) {
      const errorText = await aiResp.text();
      console.error("Gemini API error:", aiResp.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await aiResp.json();
    const candidate = data.candidates?.[0];
    let reply: string = candidate?.content?.parts?.find((p: any) => p.text)?.text ?? "";
    let leadCaptured = false;

    const toolCalls = candidate?.content?.parts?.filter((p: any) => p.functionCall) ?? [];
    for (const tc of toolCalls) {
      if (tc.functionCall?.name === "capture_lead") {
        try {
          const args = tc.functionCall.args || {};
          await supabase.from("leads").insert({
            name: args.name ?? null,
            email: args.email ?? null,
            phone: args.phone ?? null,
            interest: args.interest ?? null,
            source: "chatbot",
          });
          leadCaptured = true;
          
          // Fire notification (don't block)
          fetch(`${SUPABASE_URL}/functions/v1/notify-lead`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
            body: JSON.stringify({ ...args, source: "chatbot" }),
          }).catch((e) => console.error("notify-lead failed", e));

          if (!reply) {
            reply = language === "ar"
              ? "تم! حفظت معلوماتك وسأبلغ رمزي فوراً. سيتواصل معك قريباً."
              : language === "zh"
              ? "已收到！我已将您的信息发送给Ramzy，他会尽快与您联系。"
              : "Got it! I've saved your details and notified Ramzy — he'll reach out soon.";
          }
        } catch (e) {
          console.error("lead parse error", e);
        }
      }
    }

    // Persist assistant reply
    if (reply && sessionId) {
      await supabase.from("conversations").insert({
        session_id: sessionId,
        message: reply,
        is_user: false,
        language: language ?? null,
      });
    }

    return new Response(JSON.stringify({ reply, leadCaptured }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
