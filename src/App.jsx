import { useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { LanguageProvider } from "./i18n";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="App grain bg-canvas text-bodytext font-sans">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Manifesto />
          <Services />
          <Gallery />
          <BookingForm />
        </main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1E1715",
              border: "1px solid rgba(212, 163, 115, 0.3)",
              color: "#F8F1EB",
              borderRadius: 0,
            },
          }}
        />
      </div>
    </LanguageProvider>
  );
}

export default App;
