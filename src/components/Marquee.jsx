import { useLanguage } from "../i18n";

const Marquee = () => {
  const { t } = useLanguage();
  const items = [...t.marquee, ...t.marquee];

  return (
    <div
      data-testid="editorial-marquee"
      className="relative overflow-hidden bg-surface border-y border-caramel/15 py-5"
    >
      <div className="marquee-track flex w-max items-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-display italic text-lg sm:text-xl text-sand/80 px-8">
              {item}
            </span>
            <span className="text-cognac text-xs">★</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
