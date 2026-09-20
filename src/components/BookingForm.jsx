import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../i18n";

const BOOKING_EMAIL = "scott.anila.chef@gmail.com";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  service_type: "long-terme",
  location: "",
  dates: "",
  guests: 2,
  preferences: "",
};

const BookingForm = () => {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: null });
  };

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = true;
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = true;
    if (form.location.trim().length < 2) errs.location = true;
    if (form.dates.trim().length < 2) errs.dates = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const ref = `SA${Date.now().toString().slice(-8)}`;
    const subject =
      lang === "en"
        ? `Private chef enquiry — ${form.service_type} — ${form.name}`
        : `Demande chef privé — ${form.service_type} — ${form.name}`;
    const body = [
      `Ref: ${ref}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "—"}`,
      `Service: ${form.service_type}`,
      `Location: ${form.location}`,
      `Dates: ${form.dates}`,
      `Guests: ${form.guests}`,
      `Notes: ${form.preferences || "—"}`,
    ].join("\n");
    window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setConfirmation({ id: ref });
    toast.success(t.booking.successTitle, { description: t.booking.successBody });
    setSubmitting(false);
  };

  const reset = () => {
    setForm(initialForm);
    setConfirmation(null);
  };

  const f = t.booking.fields;

  return (
    <section
      id="reservation"
      data-testid="booking-section"
      className="relative bg-espresso py-28 lg:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-40 right-0 w-[600px] h-[600px] rounded-full bg-cognac/8 blur-[150px]" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cognac">
            {t.booking.eyebrow}
          </span>
          <h2 className="mt-5 font-serif text-2xl sm:text-3xl lg:text-[2.8rem] font-light tracking-tight text-headline leading-[1.15]">
            {t.booking.title}
          </h2>
          <p className="mt-5 text-sm sm:text-base font-light text-mutedtext leading-relaxed">
            {t.booking.intro}
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-14 border border-caramel/20 bg-surface/50 p-6 sm:p-10 lg:p-14"
        >
          <AnimatePresence mode="wait">
            {confirmation ? (
              <motion.div
                key="confirmation"
                data-testid="booking-confirmation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-10"
              >
                <CheckCircle2 size={44} className="mx-auto text-caramel" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-3xl text-headline">{t.booking.successTitle}</h3>
                <p className="mt-4 max-w-md mx-auto text-sm font-light text-bodytext leading-relaxed">
                  {t.booking.successBody}
                </p>
                <div className="mt-8 inline-block border border-caramel/25 bg-espresso/60 px-6 py-4">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.28em] text-mutedtext">
                    {t.booking.successRef}
                  </span>
                  <span
                    data-testid="booking-reference"
                    className="block mt-1 font-mono text-sm tracking-widest text-goldlight"
                  >
                    {String(confirmation.id).slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="mt-8">
                  <button
                    data-testid="booking-new-request-button"
                    onClick={reset}
                    className="font-mono text-[11px] uppercase tracking-[0.25em] text-goldlight border-b border-caramel/40 pb-1 transition-colors duration-300 hover:text-cream"
                  >
                    {t.booking.successAgain}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-testid="booking-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                onSubmit={submit}
                noValidate
                className="grid sm:grid-cols-2 gap-6"
              >
                <div>
                  <label htmlFor="booking-name" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.name} *
                  </label>
                  <input
                    id="booking-name"
                    data-testid="booking-name-input"
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder={f.namePlaceholder}
                    className={`lux-field ${errors.name ? "border-red-400/60" : ""}`}
                  />
                  {errors.name && (
                    <span data-testid="booking-name-error" className="mt-1.5 block text-[11px] text-red-300/90">
                      {t.booking.required}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-email" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.email} *
                  </label>
                  <input
                    id="booking-email"
                    data-testid="booking-email-input"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder={f.emailPlaceholder}
                    className={`lux-field ${errors.email ? "border-red-400/60" : ""}`}
                  />
                  {errors.email && (
                    <span data-testid="booking-email-error" className="mt-1.5 block text-[11px] text-red-300/90">
                      {t.booking.required}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-phone" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.phone}
                  </label>
                  <input
                    id="booking-phone"
                    data-testid="booking-phone-input"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder={f.phonePlaceholder}
                    className="lux-field"
                  />
                </div>

                <div>
                  <label htmlFor="booking-service" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.serviceType}
                  </label>
                  <select
                    id="booking-service"
                    data-testid="booking-service-select"
                    value={form.service_type}
                    onChange={set("service_type")}
                    className="lux-field"
                  >
                    {t.booking.serviceOptions.map((o) => (
                      <option key={o.id} value={o.id} className="bg-surface text-cream">
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="booking-location" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.location} *
                  </label>
                  <input
                    id="booking-location"
                    data-testid="booking-location-input"
                    type="text"
                    value={form.location}
                    onChange={set("location")}
                    placeholder={f.locationPlaceholder}
                    className={`lux-field ${errors.location ? "border-red-400/60" : ""}`}
                  />
                  {errors.location && (
                    <span data-testid="booking-location-error" className="mt-1.5 block text-[11px] text-red-300/90">
                      {t.booking.required}
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-dates" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.dates} *
                  </label>
                  <input
                    id="booking-dates"
                    data-testid="booking-dates-input"
                    type="text"
                    value={form.dates}
                    onChange={set("dates")}
                    placeholder={f.datesPlaceholder}
                    className={`lux-field ${errors.dates ? "border-red-400/60" : ""}`}
                  />
                  {errors.dates && (
                    <span data-testid="booking-dates-error" className="mt-1.5 block text-[11px] text-red-300/90">
                      {t.booking.required}
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="booking-guests" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.guests}
                  </label>
                  <input
                    id="booking-guests"
                    data-testid="booking-guests-input"
                    type="number"
                    min="1"
                    max="200"
                    value={form.guests}
                    onChange={set("guests")}
                    className="lux-field sm:max-w-[200px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="booking-preferences" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-sand mb-2.5">
                    {f.preferences}
                  </label>
                  <textarea
                    id="booking-preferences"
                    data-testid="booking-preferences-input"
                    rows={4}
                    value={form.preferences}
                    onChange={set("preferences")}
                    placeholder={f.preferencesPlaceholder}
                    className="lux-field resize-none"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-6 pt-2">
                  <button
                    data-testid="reservation-submit-button"
                    type="submit"
                    disabled={submitting}
                    className="group relative w-full sm:w-auto bg-caramel text-espresso px-10 py-4 font-mono text-[11px] uppercase tracking-[0.25em] overflow-hidden transition-colors duration-300 disabled:opacity-60"
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-cream">
                      {submitting ? t.booking.submitting : t.booking.submit}
                    </span>
                    <span className="absolute inset-0 bg-cognac translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  </button>
                  <a
                    data-testid="booking-whatsapp-button"
                    href="https://wa.me/33616612948"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bodytext transition-colors duration-300 hover:text-goldlight"
                  >
                    <MessageCircle size={16} className="text-caramel" />
                    {t.booking.whatsapp}
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
