import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoctorBio from "./components/DoctorBio";
import ProductList from "./components/ProductList";
import SeminarRegister from "./components/SeminarRegister";
import VideoConsultation from "./components/VideoConsultation";
import FAQ from "./components/FAQ";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import {
  MessageCircle,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Activity,
  Truck,
} from "lucide-react";
import { Facebook, Instagram, Youtube } from "./components/SocialIcons";
import {
  getActiveProducts,
  getDisplayPrice,
} from "./services/productService.js";
import { isAdminLoggedIn, logoutAdmin } from "./services/authService.js";

const App = () => {
  // ── Derive initial view from URL (/admin → admin, anything else → patient)
  const getViewFromPath = () =>
    window.location.pathname === "/admin" ? "admin" : "patient";

  const [view, setView] = useState(getViewFromPath);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // ── Navigate helper – updates state AND browser URL ─────────────────────────
  const navigateTo = (newView) => {
    setView(newView);
    const path = newView === "admin" ? "/admin" : "/";
    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, "", path);
    }
  };

  // ── Load products from API on mount ─────────────────────────────────────────
  useEffect(() => {
    setAdminLoggedIn(isAdminLoggedIn());

    const currentPath = window.location.pathname;

    // If the page was opened at /admin but the user isn't logged in, show login modal
    if (currentPath === "/admin" && !isAdminLoggedIn()) {
      setView("patient");
      window.history.replaceState({ view: "patient" }, "", "/");
      setShowAdminLogin(true);
    } else if (currentPath !== "/admin" && currentPath !== "/") {
      // Redirect any invalid path to home
      setView("patient");
      window.history.replaceState({ view: "patient" }, "", "/");
    }

    // Handle browser back / forward
    const onPopState = (e) => {
      const v = e.state?.view ?? getViewFromPath();
      setView(v);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getActiveProducts();
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // ── Normalize product shape for ProductList ────────────────────────────────
  const normalizeProduct = (p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    image: p.image || "",
    price: getDisplayPrice(p),
    inStock: p.active !== false,
    packs: p.packs || [],
    ingredients: p.ingredients || [],
    benefits: p.benefits || [],
    active: p.active !== false,
  });
  const normalizedProducts = products.map(normalizeProduct);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleProductInquiry = (product) => {
    const price = product.price || getDisplayPrice(product);
    const msg = encodeURIComponent(
      `Hi Dr. Keval, I visited your SUTRA Holistic Care portal and would like to order ${product.name} (₹${price}). Please guide me on payment and shipping options.`,
    );
    window.open(`https://wa.me/919537051626?text=${msg}`, "_blank");
  };

  const handleLoginSuccess = () => {
    setAdminLoggedIn(true);
    navigateTo("admin");
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminLoggedIn(false);
    navigateTo("patient");
  };

  const handleAdminToggle = () => {
    if (isAdminLoggedIn()) {
      navigateTo("admin");
    } else {
      setShowAdminLogin(true);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-bg-cream selection:bg-primary/30 text-text-light font-sans scroll-smooth">
      {view === "admin" ? (
        <AdminDashboard
          onLogout={handleLogout}
          onBackToSite={() => navigateTo("patient")}
        />
      ) : (
        <main className="animate-fade-in">
          <Navbar
            onAdminLoginClick={handleAdminToggle}
            currentView={view}
            onViewToggle={setView}
          />
          <Hero />

          <DoctorBio
            onBookClick={() => {
              const el = document.querySelector("#consultation");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          />

          {loadingProducts ? (
            <section className="py-20 bg-bg-cream">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <div className="inline-flex items-center gap-2 text-text-light text-sm">
                  <svg
                    className="animate-spin h-5 w-5 text-primary-dark"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading Sutra Products…
                </div>
              </div>
            </section>
          ) : (
            <ProductList
              products={normalizedProducts}
              onProductInquiry={handleProductInquiry}
            />
          )}

          <SeminarRegister onRegister={() => {}} />

          <VideoConsultation onBook={() => {}} />

          <FAQ />

          {/* Footer */}
          <footer className="bg-[#1E1B1A] text-slate-300 py-16 text-left">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-serif text-base font-bold text-white tracking-wide block leading-none">
                        SUTRA
                      </span>
                      <span className="text-[10px] tracking-widest text-primary font-sans uppercase">
                        Holistic Care
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                    Holistic natural solution, wild-crafted herbal formulations,
                    and personalized lifestyle counseling by Dr. Keval Dankhara.
                    Treating the root cause, not just symptoms.
                  </p>

                  {/* Social Media Links */}
                  <div className="pt-4 flex items-center gap-3">
                    <a
                      href="https://youtube.com/@drkevaldakhara?si=YOZmJhqA3AesaRWf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-md"
                    >
                      <Youtube className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.instagram.com/dr_keval_dankhara?igsh=b202a3FtZjJoZGt3&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-pink-600 hover:text-white transition-all shadow-md"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.facebook.com/dankhrakeval?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-md"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href="https://whatsapp.com/channel/0029VbBqXTdJpe8hgxrZCb2t"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-md"
                      title="WhatsApp Channel"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
                    Therapies &amp; Clinic
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li>
                      <a
                        href="#doctor"
                        className="hover:text-primary transition-colors"
                      >
                        About Dr. Keval
                      </a>
                    </li>
                    <li>
                      <a
                        href="#products"
                        className="hover:text-primary transition-colors"
                      >
                        Sutra Remedies
                      </a>
                    </li>
                    <li>
                      <a
                        href="#seminars"
                        className="hover:text-primary transition-colors"
                      >
                        Live Health Seminars
                      </a>
                    </li>
                    <li>
                      <a
                        href="#consultation"
                        className="hover:text-primary transition-colors"
                      >
                        Telehealth Consultations
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
                    Radhe Clinic
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2.5">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Surat, Gujarat, India</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>+91 95370 51626</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span>drkevaldankhara@gmail.com</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
                    Customer Support
                  </h4>
                  <div className="space-y-3">
                    <a
                      href="https://trackcourier.io/anjani-courier-tracking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400 text-indigo-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all w-full justify-center"
                    >
                      <Truck className="h-4 w-4" />
                      Track Your Order
                    </a>
                    <button
                      onClick={handleAdminToggle}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 hover:border-primary hover:text-primary text-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all w-full justify-center"
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Doctor Panel
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-500 space-y-2">
                <p>
                  © 2026 Sutra Holistic Care / Radhe Clinic. All Rights
                  Reserved.
                </p>
                <p className="max-w-2xl mx-auto">
                  Disclaimer: The formulas and lifestyle guidelines shared on
                  this platform are formulated based on classical botanical
                  blend and herbal formula principles. Individual results may
                  vary.
                </p>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* WhatsApp floating button */}
      {view !== "admin" && (
        <a
          href="https://wa.me/919537051626?text=Hi%20Dr.%20Keval,%20I%27m%20visiting%20your%20website%20and%20have%20some%20queries."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Chat with Doctor"
        >
          <MessageCircle className="h-6 w-6 fill-current" />
        </a>
      )}
    </div>
  );
};

export default App;
