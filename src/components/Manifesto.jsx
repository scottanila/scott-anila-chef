import { motion } from "framer-motion";
import { useLanguage, IMAGES } from "../i18n";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const Manifesto = () => {
  const { t } = useLanguage();

  return (
    <section
      id="manifesto"
      data-testid="manifesto-section"
      className="relative bg-espresso py-28 lg:py-36 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp} className="max-w-3xl">
          <span
            data-testid="manifesto-eyebrow"
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-cognac"
          >
            {t.manifesto.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-2xl sm:text-3xl lg:text-[2.8rem] font-light tracking-tight text-headline leading-[1.15]">
            {t.manifesto.title}
          </h2>
        </motion.div>

        <div className="mt-20 grid lg:grid-cols-12 gap-14 lg:gap-10">
          <div className="lg:col-span-8 flex flex-col gap-16">
            {t.manifesto.chapters.map((ch, i) => (
              <motion.article
                key={ch.num}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.12 }}
                data-testid={`manifesto-chapter-${ch.num}`}
                className="group grid sm:grid-cols-[110px_1fr] gap-6 border-b border-caramel/12 pb-14"
              >
                <span className="font-serif text-6xl sm:text-7xl leading-none monogram-outline select-none transition-colors duration-500">
                  {ch.num}
                </span>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-headline transition-colors duration-300 group-hover:text-goldlight">
                    {ch.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm sm:text-base font-light leading-relaxed text-bodytext/90">
                    {ch.text}
                  </p>
                </div>
              </motion.article>
            ))}

            <motion.div {...fadeUp} className="grid grid-cols-3 gap-6">
              {t.manifesto.credentials.map((c) => (
                <div
                  key={c.value}
                  data-testid={`credential-${c.value.replace(/\s/g, "-")}`}
                  className="border border-caramel/15 bg-surface/50 px-4 py-6 text-center"
                >
                  <span className="block font-serif text-2xl sm:text-3xl text-goldlight">{c.value}</span>
                  <span className="mt-2 block font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-mutedtext leading-relaxed">
                    {c.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.aside {...fadeUp} className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden border border-caramel/20">
                <img
                  data-testid="manifesto-chef-image"
                  src={IMAGES.plating}
                  alt="Le chef en cuisine, geste précis"
                  className="w-full h-[460px] object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>
              <blockquote
                data-testid="manifesto-quote"
                className="mt-8 border-l-2 border-caramel/50 pl-6"
              >
                <p className="font-serif italic text-lg text-sand leading-relaxed">
                  {t.manifesto.quote}
                </p>
                <footer className="mt-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-caramel" />
                  <span className="font-display italic text-goldlight text-lg">
                    {t.manifesto.signature}
                  </span>
                </footer>
              </blockquote>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
