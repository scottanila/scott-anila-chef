import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useLanguage } from "../i18n";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      data-testid="main-footer"
      className="relative bg-[#0E0A09] border-t border-caramel/15 overflow-hidden"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 font-serif text-[22rem] leading-none monogram-outline select-none opacity-70"
      >
        {t.footer.monogram}
      </span>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <span className="block leading-none">
              <span className="block font-display font-semibold text-[10px] tracking-[0.4em] uppercase text-caramel">
                Maison
              </span>
              <span className="block mt-0.5 font-display font-bold text-3xl tracking-[0.06em] uppercase text-headline">
                Anila
              </span>
            </span>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-mutedtext">
              {t.footer.line}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              data-testid="footer-email-link"
              href={`mailto:${t.footer.email}`}
              className="flex items-center gap-3 text-sm font-light text-bodytext transition-colors duration-300 hover:text-goldlight"
            >
              <Mail size={15} className="text-caramel" />
              {t.footer.email}
            </a>
            <a
              data-testid="footer-phone-link"
              href={`tel:${t.footer.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-sm font-light text-bodytext transition-colors duration-300 hover:text-goldlight"
            >
              <Phone size={15} className="text-caramel" />
              {t.footer.phone}
            </a>
            <span className="flex items-center gap-3 text-sm font-light text-mutedtext">
              <ShieldCheck size={15} className="text-caramel" />
              {t.footer.protocols}
            </span>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-caramel/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mutedtext">
            {t.footer.rights}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mutedtext/60">
            France — Europe — International
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
