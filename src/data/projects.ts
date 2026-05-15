export interface Project {
  id: string;
  title: { en: string; ar: string; zh: string };
  description: { en: string; ar: string; zh: string };
  tech: string[];
  category: string;
  featured?: boolean;
  gradient: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: "blood-bank",
    title: {
      en: "Blood Bank AI System",
      ar: "نظام بنك الدم بالذكاء الاصطناعي",
      zh: "血库 AI 系统",
    },
    description: {
      en: "AI-powered logistics platform for the National Blood Research Center. Uses Random Forest for donor validation and K-Means clustering to predict regional blood demand.",
      ar: "منصة لوجستية مدعومة بالذكاء الاصطناعي للمركز الوطني لأبحاث الدم. تستخدم Random Forest للتحقق من المتبرعين وK-Means لتوقع الطلب الإقليمي.",
      zh: "为国家血液研究中心打造的 AI 物流平台。使用 Random Forest 验证捐献者，K-Means 预测区域需求。",
    },
    tech: ["Python", "Random Forest", "K-Means", "Flask", "PostgreSQL"],
    category: "AI / Healthcare",
    featured: true,
    gradient: "from-rose-500/40 to-indigo-600/40",
    icon: "🩸",
  },
  {
    id: "24-academy",
    title: { en: "24 Academy Platform", ar: "منصة أكاديمية 24", zh: "24 学院平台" },
    description: {
      en: "Full-stack educational platform with course management, student dashboards, and live classes. Powered by Next.js and Firebase.",
      ar: "منصة تعليمية متكاملة لإدارة الدورات ولوحات تحكم الطلاب والفصول المباشرة، مبنية بـ Next.js وFirebase.",
      zh: "全栈教育平台，包含课程管理、学生仪表板和直播课。基于 Next.js 和 Firebase。",
    },
    tech: ["Next.js", "Node.js", "Firebase", "Tailwind"],
    category: "EdTech",
    featured: true,
    gradient: "from-indigo-500/40 to-cyan-500/40",
    icon: "🎓",
  },
  {
    id: "power-station",
    title: { en: "Power Station PWA", ar: "تطبيق محطة الطاقة", zh: "电站 PWA" },
    description: {
      en: "Progressive Web App for monitoring power station performance with real-time metrics, offline support and push alerts.",
      ar: "تطبيق ويب تقدمي لمراقبة أداء محطات الطاقة مع مقاييس فورية ودعم بدون إنترنت وتنبيهات.",
      zh: "用于监控电站性能的渐进式 Web 应用，支持实时指标、离线运行和推送警报。",
    },
    tech: ["React", "PWA", "Service Workers", "Chart.js"],
    category: "PWA / IoT",
    gradient: "from-cyan-500/40 to-emerald-500/40",
    icon: "⚡",
  },
  {
    id: "ad-agency",
    title: { en: "Advertising Agency Site", ar: "موقع وكالة إعلانات", zh: "广告公司网站" },
    description: {
      en: "Modern marketing website with CMS-driven case studies, smooth scroll animations and a multilingual blog.",
      ar: "موقع تسويقي حديث بدراسات حالة مدارة عبر CMS، حركات سلسة، ومدونة متعددة اللغات.",
      zh: "现代营销网站，CMS 驱动的案例研究、流畅滚动动画和多语言博客。",
    },
    tech: ["Next.js", "Sanity CMS", "Framer Motion"],
    category: "Marketing",
    gradient: "from-orange-500/40 to-pink-500/40",
    icon: "🎯",
  },
  {
    id: "web-design-course",
    title: { en: "Web Design Course Platform", ar: "منصة دورة تصميم الويب", zh: "Web 设计课程平台" },
    description: {
      en: "Interactive learning platform for web design students with code playgrounds, video lessons and progress tracking.",
      ar: "منصة تعلم تفاعلية لطلاب تصميم الويب مع بيئات تجربة الكود ودروس فيديو وتتبع التقدم.",
      zh: "面向 Web 设计学生的互动学习平台，包含代码沙箱、视频课程和进度跟踪。",
    },
    tech: ["React", "Supabase", "Monaco Editor"],
    category: "EdTech",
    gradient: "from-violet-500/40 to-indigo-500/40",
    icon: "💻",
  },
  {
    id: "photo-booking",
    title: { en: "Photography Booking App", ar: "تطبيق حجز التصوير", zh: "摄影预订应用" },
    description: {
      en: "Flutter mobile app with calendar booking, real-time notifications, Google Maps location picker and dark theme UI.",
      ar: "تطبيق Flutter للجوال يحوي حجزاً عبر التقويم، إشعارات فورية، خرائط Google لاختيار الموقع، وواجهة داكنة.",
      zh: "Flutter 移动应用，支持日历预订、实时通知、Google 地图选址和深色主题。",
    },
    tech: ["Flutter", "Dart", "Firebase", "Google Maps"],
    category: "Mobile",
    featured: true,
    gradient: "from-amber-500/40 to-rose-500/40",
    icon: "📸",
  },
  {
    id: "voice-ai",
    title: { en: "Voice Command AI Assistant", ar: "مساعد ذكي بالأوامر الصوتية", zh: "语音命令 AI 助手" },
    description: {
      en: "Personal AI assistant that recognizes voice commands to open apps, browse websites and run shortcuts using speech recognition.",
      ar: "مساعد ذكي شخصي يتعرف على الأوامر الصوتية لفتح التطبيقات وتصفح المواقع وتنفيذ الاختصارات.",
      zh: "个人 AI 助手，通过语音识别打开应用、浏览网站并执行快捷指令。",
    },
    tech: ["Python", "Speech Recognition", "NLP"],
    category: "AI",
    gradient: "from-emerald-500/40 to-cyan-500/40",
    icon: "🎙️",
  },
];
