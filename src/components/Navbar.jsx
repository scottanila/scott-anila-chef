import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../i18n";

export const scrollToSection = (href) => {
  if (window.__lenis) {
    window.__lenis.scrollTo(href, { offset: -70, duration: 1.6 });
  } else {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
};

const LangToggle = () => {
  const { lang, setLang } = useLanguage();
  return (
    <div
      data-testid="lang-toggle"
      className="relative flex items-center border border-caramel/25 rounded-full p-0.5"
    >
      {["fr", "en"].map((l) => (
        <button
          key={l}
          data-testid={`lang-toggle-${l}`}
          onClick={() => setLang(l)}
          className="relative z-10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300"
          style={{ color: lang === l ? "#120E0D" : "#D4A373" }}
        >
          {l}
          {lang === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-full bg-caramel"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#experience", label: t.nav.experience },
    { href: "#manifesto", label: t.nav.manifesto },
    { href: "#services", label: t.nav.services },
    { href: "#gallery", label: t.nav.gallery },
  ];

  const go = (href) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      data-testid="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-espresso/85 backdrop-blur-xl border-b border-caramel/15"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[70px] flex items-center justify-between">
        <button
          data-testid="nav-brand"
          onClick={() => go("#experience")}
          className="text-left leading-none"
        >
          <span className="block font-serif text-lg tracking-[0.12em] uppercase text-headline">
            {t.nav.brand}
          </span>
          <span className="block mt-1 font-mono text-[9px] tracking-[0.3em] uppercase text-mutedtext">
            {t.nav.subline}
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              onClick={() => go(l.href)}
              className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-bodytext transition-colors duration-300 hover:text-goldlight"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-caramel transition-[width] duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <LangToggle />
          <button
            data-testid="nav-cta-button"
            onClick={() => go("#reservation")}
            className="relative overflow-hidden border border-caramel/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-goldlight transition-colors duration-300 hover:bg-caramel hover:text-espresso"
          >
            {t.nav.cta}
          </button>
        </div>

        <button
          data-testid="mobile-menu-button"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-cream p-2"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            data-testid="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden bg-espresso/95 backdrop-blur-xl border-b border-caramel/15"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {links.map((l) => (
                <button
                  key={l.href}
                  data-testid={`mobile-nav-link-${l.href.slice(1)}`}
                  onClick={() => go(l.href)}
                  className="text-left font-serif text-2xl text-headline"
                >
                  {l.label}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-caramel/15">
                <LangToggle />
                <button
                  data-testid="mobile-nav-cta-button"
                  onClick={() => go("#reservation")}
                  className="border border-caramel/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-goldlight"
                >
                  {t.nav.cta}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
