import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowDown } from "lucide-react";
import { useLanguage, IMAGES } from "../i18n";
import { scrollToSection } from "./Navbar";

const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "115%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

const Hero = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      id="experience"
      data-testid="hero-section"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-canvas pt-[70px]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-cognac/10 blur-[140px]" />
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-umber/60 blur-[120px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center py-20">
        <motion.div style={{ y: textY }} className="lg:col-span-7 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-testid="hero-badge"
            className="inline-flex items-center gap-3 border border-caramel/25 px-4 py-2 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cognac opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-caramel" />
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-goldlight">
              {t.hero.badge}
            </span>
          </motion.div>

          <h1 className="font-serif text-headline font-normal tracking-tight leading-[1.02] text-4xl sm:text-5xl lg:text-[4.6rem]">
            <MaskedLine delay={0.35}>{t.hero.line1}</MaskedLine>
            <MaskedLine delay={0.5} className="italic text-goldlight">
              {t.hero.line2}
            </MaskedLine>
            <MaskedLine delay={0.65}>{t.hero.line3}</MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="mt-8 max-w-xl text-base sm:text-lg font-light leading-relaxed text-bodytext"
          >
            {t.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.15 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <button
              data-testid="hero-cta-primary"
              onClick={() => scrollToSection("#reservation")}
              className="group relative bg-caramel text-espresso px-8 py-4 font-mono text-[11px] uppercase tracking-[0.25em] overflow-hidden transition-colors duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-cream">
                {t.hero.ctaPrimary}
              </span>
              <span className="absolute inset-0 bg-cognac translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </button>
            <button
              data-testid="hero-cta-secondary"
              onClick={() => scrollToSection("#gallery")}
              className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-bodytext transition-colors duration-300 hover:text-goldlight"
            >
              {t.hero.ctaSecondary}
              <span className="block w-10 h-px bg-caramel transition-[width] duration-300 group-hover:w-16" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2"
            data-testid="hero-locations"
          >
            <MapPin size={13} className="text-cognac" />
            {t.hero.locations.map((loc, i) => (
              <span key={loc} className="flex items-center gap-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mutedtext">
                  {loc}
                </span>
                {i < t.hero.locations.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-caramel/40" />
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: imgY }} className="lg:col-span-5 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto max-w-[380px] lg:max-w-none"
          >
            <div className="arch-frame overflow-hidden border border-caramel/25 p-2 bg-surface/40">
              <div className="arch-frame overflow-hidden">
                <img
                  data-testid="hero-image"
                  src={IMAGES.hero}
                  alt="Chef privé dressant une assiette gastronomique"
                  className="w-full h-[420px] sm:h-[500px] lg:h-[560px] object-cover"
                />
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-espresso border border-caramel/30 px-5 py-4"
            >
              <span className="block font-serif text-2xl text-goldlight">{t.hero.chipValue}</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-mutedtext mt-1">
                {t.hero.chipLabel}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => scrollToSection("#manifesto")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-mutedtext transition-colors duration-300 hover:text-goldlight"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em]">{t.hero.scroll}</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown size={14} />
        </motion.span>
      </motion.button>
    </section>
  );
};

export default Hero;
