import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import { useAuth } from "@/hooks/useAuth";
import { LangSwitcher } from "./LangSwitcher";
import { Menu, X, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { t } = useLang();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "about", label: t.nav.about },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "experience", label: t.nav.experience },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all md:px-6 ${
            scrolled ? "glass-strong shadow-elegant" : "glass"
          }`}
        >
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary font-display font-bold text-white shadow-glow transition group-hover:scale-110">
              R
            </span>
            <span className="font-display text-base font-semibold tracking-tight hidden sm:block">
              Ramzy<span className="text-primary">.</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-white shadow-glow hover:opacity-90"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
            <LangSwitcher />
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden glass rounded-full p-2"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden glass-strong mt-2 rounded-2xl p-3 animate-fade-up">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/15"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
