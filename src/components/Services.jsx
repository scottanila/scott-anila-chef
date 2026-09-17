import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLanguage, IMAGES } from "../i18n";
import { scrollToSection } from "./Navbar";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const Services = () => {
  const { t } = useLanguage();

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative bg-canvas py-28 lg:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cognac">
              {t.services.eyebrow}
            </span>
            <h2 className="mt-5 font-serif text-2xl sm:text-3xl lg:text-[2.8rem] font-light tracking-tight text-headline leading-[1.15]">
              {t.services.title}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-light text-mutedtext leading-relaxed">
            {t.services.intro}
          </p>
        </motion.div>

        <div className="mt-16 flex flex-col gap-10">
          {t.services.formats.map((f, i) => (
            <motion.article
              key={f.num}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              data-testid={`service-card-${i + 1}`}
              className={`group grid lg:grid-cols-2 gap-0 border border-caramel/15 bg-surface/40 overflow-hidden ${
                i % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className="relative overflow-hidden [direction:ltr]">
                <img
                  src={IMAGES[f.image]}
                  alt={f.title}
                  className="w-full h-72 lg:h-full min-h-[320px] object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-espresso/25" />
                <span className="absolute top-6 left-6 font-serif text-6xl text-cream/90 drop-shadow-lg">
                  {f.num}
                </span>
              </div>
              <div className="[direction:ltr] p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.7rem] text-headline leading-snug">
                  {f.title}
                </h3>
                <p className="mt-5 text-sm sm:text-base font-light leading-relaxed text-bodytext/90">
                  {f.desc}
                </p>
                <ul className="mt-7 flex flex-col gap-3">
                  {f.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm text-sand/90">
                      <Check size={15} className="mt-0.5 shrink-0 text-cognac" />
                      <span className="font-light">{d}</span>
                    </li>
                  ))}
                </ul>
                <button
                  data-testid={`service-cta-${i + 1}`}
                  onClick={() => scrollToSection("#reservation")}
                  className="group/btn mt-8 self-start flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-goldlight"
                >
                  {t.nav.cta}
                  <span className="block w-8 h-px bg-caramel transition-[width] duration-300 group-hover/btn:w-14" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
