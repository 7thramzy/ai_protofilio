export type Lang = "en" | "ar" | "zh";

type Dict = {
  nav: { about: string; skills: string; projects: string; experience: string; contact: string };
  hero: { greeting: string; name: string; title: string; tagline: string; ctaPrimary: string; ctaSecondary: string; stats: { projects: string; years: string; satisfaction: string } };
  about: { eyebrow: string; title: string; body: string; languages: string };
  skills: { eyebrow: string; title: string; technical: string; soft: string };
  projects: { eyebrow: string; title: string; view: string; featured: string };
  experience: { eyebrow: string; title: string; work: string; education: string };
  contact: { eyebrow: string; title: string; subtitle: string; name: string; email: string; subject: string; message: string; send: string; sending: string; success: string; error: string; orChat: string };
  chat: { title: string; placeholder: string; welcome: string; send: string };
  footer: { rights: string; built: string };
};

export const translations: Record<Lang, Dict> = {
  en: {
    nav: { about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact" },
    hero: {
      greeting: "Hi, I'm",
      name: "Ramzy Albazel",
      title: "AI Engineer & Full Stack Developer",
      tagline: "I build intelligent systems and beautiful products — from blood-bank AI to mobile apps and educational platforms.",
      ctaPrimary: "View My Work",
      ctaSecondary: "Get In Touch",
      stats: { projects: "Projects", years: "Years Experience", satisfaction: "Satisfaction" },
    },
    about: {
      eyebrow: "About Me",
      title: "Building the future, one line at a time",
      body: "I'm a Yemeni AI engineer and full-stack developer who recently graduated with excellent honors in Information Technology from the University of Science and Technology in Ibb. I specialize in machine learning, full-stack web & mobile, and AI-powered cybersecurity. Beyond shipping code, I teach Flutter, UI/UX, networking and AI at universities — because helping the next generation of engineers is just as important as the systems we build today.",
      languages: "Languages: Arabic (native), English (fluent), Chinese (learning)",
    },
    skills: {
      eyebrow: "Skills",
      title: "Tools I work with daily",
      technical: "Technical",
      soft: "Soft Skills",
    },
    projects: {
      eyebrow: "Projects",
      title: "Selected work",
      view: "View Project",
      featured: "Featured",
    },
    experience: {
      eyebrow: "Experience & Education",
      title: "My journey so far",
      work: "Work",
      education: "Education",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's build something great",
      subtitle: "Have a project, a job, or just want to chat? Drop a message — I respond within 24h.",
      name: "Your name",
      email: "Email address",
      subject: "Subject",
      message: "Tell me about your project…",
      send: "Send Message",
      sending: "Sending…",
      success: "Message sent! I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
      orChat: "Prefer to chat? Click the AI assistant in the bottom corner — it knows everything about me.",
    },
    chat: {
      title: "Ask anything about Ramzy",
      placeholder: "Type a message…",
      welcome: "Hi! I'm RamzyBot 👋 — ask me about Ramzy's experience, skills, or hire him. I speak English, العربية, and 中文.",
      send: "Send",
    },
    footer: {
      rights: "All rights reserved.",
      built: "Built with passion in Yemen 🇾🇪",
    },
  },
  ar: {
    nav: { about: "نبذة", skills: "المهارات", projects: "المشاريع", experience: "الخبرة", contact: "تواصل" },
    hero: {
      greeting: "مرحباً، أنا",
      name: "رمزي البازل",
      title: "مهندس ذكاء اصطناعي ومطور Full Stack",
      tagline: "أبني أنظمة ذكية ومنتجات جميلة — من ذكاء بنوك الدم إلى تطبيقات الجوال والمنصات التعليمية.",
      ctaPrimary: "أعمالي",
      ctaSecondary: "تواصل معي",
      stats: { projects: "مشروع", years: "سنوات خبرة", satisfaction: "رضا العملاء" },
    },
    about: {
      eyebrow: "نبذة عني",
      title: "أبني المستقبل، سطر برمجي في كل مرة",
      body: "أنا مهندس ذكاء اصطناعي ومطور Full Stack يمني، تخرجت مؤخراً بامتياز في تقنية المعلومات من جامعة العلوم والتكنولوجيا في إب. متخصص في تعلم الآلة، تطوير الويب والجوال، والأمن السيبراني المعزز بالذكاء الاصطناعي. إلى جانب البرمجة، أُدرّس Flutter وتصميم UI/UX والشبكات والذكاء الاصطناعي في الجامعات.",
      languages: "اللغات: العربية (الأم)، الإنجليزية (بطلاقة)، الصينية (قيد التعلم)",
    },
    skills: { eyebrow: "المهارات", title: "أدواتي اليومية", technical: "المهارات التقنية", soft: "المهارات الشخصية" },
    projects: { eyebrow: "المشاريع", title: "أعمال مختارة", view: "عرض المشروع", featured: "مميز" },
    experience: { eyebrow: "الخبرة والتعليم", title: "رحلتي حتى الآن", work: "عمل", education: "تعليم" },
    contact: {
      eyebrow: "تواصل",
      title: "لنبني شيئاً عظيماً",
      subtitle: "عندك مشروع أو فرصة عمل أو حتى دردشة؟ اكتب لي وسأرد خلال ٢٤ ساعة.",
      name: "اسمك",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "أخبرني عن مشروعك…",
      send: "إرسال",
      sending: "جارٍ الإرسال…",
      success: "تم الإرسال! سأعود إليك قريباً.",
      error: "حدث خطأ. حاول مرة أخرى.",
      orChat: "تفضّل الدردشة؟ اضغط على المساعد الذكي في الزاوية — يعرف كل شيء عني.",
    },
    chat: {
      title: "اسألني أي شيء عن رمزي",
      placeholder: "اكتب رسالة…",
      welcome: "مرحباً! أنا RamzyBot 👋 — اسألني عن خبرات رمزي ومهاراته أو وظّفه. أتحدث العربية والإنجليزية والصينية.",
      send: "إرسال",
    },
    footer: { rights: "جميع الحقوق محفوظة.", built: "صُنع بشغف في اليمن 🇾🇪" },
  },
  zh: {
    nav: { about: "关于", skills: "技能", projects: "项目", experience: "经验", contact: "联系" },
    hero: {
      greeting: "你好，我是",
      name: "Ramzy Albazel",
      title: "AI 工程师 & 全栈开发者",
      tagline: "我构建智能系统和精美产品——从血库 AI 到移动应用和教育平台。",
      ctaPrimary: "查看作品",
      ctaSecondary: "联系我",
      stats: { projects: "项目", years: "年经验", satisfaction: "满意度" },
    },
    about: {
      eyebrow: "关于我",
      title: "用代码构建未来",
      body: "我是一名也门 AI 工程师和全栈开发者，最近以优异成绩毕业于伊卜科技大学信息技术专业。我专注于机器学习、全栈 Web 与移动开发以及 AI 网络安全。除了编程，我还在大学教授 Flutter、UI/UX、网络和人工智能。",
      languages: "语言：阿拉伯语（母语）、英语（流利）、中文（学习中）",
    },
    skills: { eyebrow: "技能", title: "我每天使用的工具", technical: "技术技能", soft: "软技能" },
    projects: { eyebrow: "项目", title: "精选作品", view: "查看项目", featured: "推荐" },
    experience: { eyebrow: "经验与教育", title: "我的旅程", work: "工作", education: "教育" },
    contact: {
      eyebrow: "联系",
      title: "让我们一起创造伟大",
      subtitle: "有项目、工作机会，或只想聊聊？发消息给我，我会在 24 小时内回复。",
      name: "您的姓名",
      email: "电子邮箱",
      subject: "主题",
      message: "告诉我您的项目…",
      send: "发送消息",
      sending: "发送中…",
      success: "已发送！我会尽快回复您。",
      error: "出错了，请重试。",
      orChat: "想聊天？点击右下角的 AI 助手——它了解我的一切。",
    },
    chat: {
      title: "随便问关于 Ramzy 的事",
      placeholder: "输入消息…",
      welcome: "你好！我是 RamzyBot 👋 — 询问 Ramzy 的经验、技能或聘用他。我会说中文、英语和阿拉伯语。",
      send: "发送",
    },
    footer: { rights: "版权所有。", built: "在也门用心打造 🇾🇪" },
  },
};

export type TranslationKey = Dict;
