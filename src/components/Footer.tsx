import { useLang } from "@/contexts/LangContext";
import { Github, Linkedin, Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 mt-12">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary font-display font-bold text-white shadow-glow">R</span>
            <div>
              <p className="font-display font-semibold text-sm">Ramzy Albazel</p>
              <p className="text-xs text-muted-foreground">{t.footer.built}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Social href="https://github.com/r7-yn" Icon={Github} />
            <Social href="https://linkedin.com/in/ramzy-albazel-47795b289" Icon={Linkedin} />
            <Social href="https://instagram.com/r7_yn_" Icon={Instagram} />
            <Social href="https://facebook.com/ramzyalbazel" Icon={Facebook} />
            <Social href="mailto:ramzyalbazel700@gmail.com" Icon={Mail} />
          </div>

          <p className="text-xs text-muted-foreground">© {year} Ramzy Albazel. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}

function Social({ href, Icon }: { href: string; Icon: typeof Github }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass grid h-9 w-9 place-items-center rounded-full transition hover:border-primary/50 hover:text-primary"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
