import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UtensilsCrossed } from "lucide-react";
import { useLanguage, IMAGES } from "../i18n";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
};

const Gallery = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const dishes = t.gallery.dishes.filter((d) => filter === "all" || d.category === filter);

  return (
    <section
      id="gallery"
      data-testid="gallery-section"
      className="relative bg-espresso py-28 lg:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp} className="max-w-2xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cognac">
            {t.gallery.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-2xl sm:text-3xl lg:text-[2.8rem] font-light tracking-tight text-headline leading-[1.15]">
            {t.gallery.title}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-light text-mutedtext leading-relaxed">
            {t.gallery.intro}
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-12 flex flex-wrap gap-3" data-testid="gallery-filters">
          {t.gallery.filters.map((f) => (
            <button
              key={f.id}
              data-testid={`filter-button-${f.id}`}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] border transition-colors duration-300 ${
                filter === f.id
                  ? "bg-caramel text-espresso border-caramel"
                  : "border-caramel/25 text-bodytext hover:border-caramel/60 hover:text-goldlight"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {dishes.map((dish, i) => (
              <motion.button
                layout
                key={dish.id}
                data-testid={`dish-card-${dish.id}`}
                onClick={() => setSelected(dish)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative text-left overflow-hidden border border-caramel/15 bg-surface/40 ${
                  i % 3 === 1 ? "lg:translate-y-10" : ""
                }`}
              >
                <div className="overflow-hidden">
                  <img
                    src={IMAGES[dish.image]}
                    alt={dish.title}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-espresso/0 transition-colors duration-500 group-hover:bg-espresso/25" />
                <div className="p-6">
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-cognac">
                    {String(i + 1).padStart(2, "0")} — {t.gallery.filters.find((f) => f.id === dish.category)?.label}
                  </span>
                  <h3 className="mt-2 font-serif text-xl text-headline transition-colors duration-300 group-hover:text-goldlight">
                    {dish.title}
                  </h3>
                  <p className="mt-2 text-xs font-light text-mutedtext leading-relaxed line-clamp-2">
                    {dish.desc}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            data-testid="dish-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 bg-espresso/90 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto grid md:grid-cols-2 bg-surface border border-caramel/25"
            >
              <button
                data-testid="dish-modal-close"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 bg-espresso/80 border border-caramel/30 p-2.5 text-cream transition-colors duration-300 hover:bg-caramel hover:text-espresso"
                aria-label={t.gallery.close}
              >
                <X size={18} />
              </button>
              <div className="relative min-h-[280px]">
                <img
                  src={IMAGES[selected.image]}
                  alt={selected.title}
                  className="photo-warm absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="p-8 lg:p-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cognac">
                  {t.gallery.filters.find((f) => f.id === selected.category)?.label}
                </span>
                <h3 className="mt-3 font-serif text-2xl lg:text-3xl text-headline leading-tight">
                  {selected.title}
                </h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-bodytext">
                  {selected.desc}
                </p>
                <div className="mt-7 border-t border-caramel/15 pt-6">
                  <div className="flex items-start gap-4">
                    <UtensilsCrossed size={16} className="mt-1 shrink-0 text-caramel" />
                    <p className="text-xs font-light tracking-wide text-sand leading-relaxed">
                      {selected.ingredients}
                    </p>
                  </div>
                </div>
                <blockquote className="mt-7 border-l-2 border-caramel/50 pl-5">
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-mutedtext block mb-2">
                    {t.gallery.noteLabel}
                  </span>
                  <p className="font-serif italic text-base text-goldlight/90 leading-relaxed">
                    {selected.note}
                  </p>
                </blockquote>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
