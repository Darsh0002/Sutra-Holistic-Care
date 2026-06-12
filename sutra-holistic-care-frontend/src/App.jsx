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
import {
  getActiveProducts,
  getDisplayPrice,
} from "./services/productService.js";
import { isAdminLoggedIn, logoutAdmin } from "./services/authService.js";

const App = () => {
  // ── Derive initial view from URL (/admin → admin, anything else → patient)
  const getViewFromPath = () =>
    window.location.pathname === '/admin' ? 'admin' : 'patient';

  const [view, setView] = useState(getViewFromPath);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);

  // ── Navigate helper – updates state AND browser URL ─────────────────────────
  const navigateTo = (newView) => {
    setView(newView);
    const path = newView === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, '', path);
    }
  };

  // ── Load products from API on mount ─────────────────────────────────────────
  useEffect(() => {
    setAdminLoggedIn(isAdminLoggedIn());

    const currentPath = window.location.pathname;

    // If the page was opened at /admin but the user isn't logged in, show login modal
    if (currentPath === '/admin' && !isAdminLoggedIn()) {
      setView('patient');
      window.history.replaceState({ view: 'patient' }, '', '/');
      setShowAdminLogin(true);
    } else if (currentPath !== '/admin' && currentPath !== '/') {
      // Redirect any invalid path to home
      setView('patient');
      window.history.replaceState({ view: 'patient' }, '', '/');
    }

    // Handle browser back / forward
    const onPopState = (e) => {
      const v = e.state?.view ?? getViewFromPath();
      setView(v);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getActiveProducts();
        setProducts(data || []);
      } catch {
        setProducts([
          {
            id: "local-1",
            name: "Sleep Sutra Powder",
            description: "Premium Ayurvedic sleep powder with zero dependency.",
            packs: [{ price: 499, weight: 100 }],
            ingredients: [
              "Tagara Root",
              "Ashwagandha",
              "Jatamansi",
              "Elaichi",
              "Organic Oats",
            ],
            benefits: [
              "Promotes deep sleep",
              "Non-habit forming",
              "Reduces anxiety",
            ],
            active: true,
            image: "",
          },
          {
            id: "local-2",
            name: "Vayu Sutra",
            description:
              "Instant relief from bloating, flatulence, and abdominal gas.",
            packs: [{ price: 399, weight: 100 }],
            ingredients: [
              "Ajwain",
              "Jeera",
              "Hing",
              "Dry Ginger",
              "Black Salt",
            ],
            benefits: [
              "Relieves bloating",
              "Aids digestion",
              "Combats acid reflux",
            ],
            active: true,
            image: "",
          },
          {
            id: "local-3",
            name: "Gut Sutra",
            description:
              "Daily colon cleanse, detox, and digestive rejuvenator.",
            packs: [{ price: 449, weight: 100 }],
            ingredients: [
              "Haritaki",
              "Bibhitaki",
              "Amalaki",
              "Senna leaves",
              "Fennel seeds",
            ],
            benefits: [
              "Supports bowel health",
              "Cleanses toxins",
              "Improves absorption",
            ],
            active: true,
            image: "",
          },
          {
            id: "local-4",
            name: "Cool Sutra",
            description:
              "Herbal cooling remedy for acidity, body heat, and ulcers.",
            packs: [{ price: 429, weight: 100 }],
            ingredients: [
              "Shatavari",
              "Mulethi",
              "Fennel seeds",
              "Coriander seeds",
              "Praval Pishti",
            ],
            benefits: [
              "Neutralizes acidity",
              "Soothes ulcers",
              "Balances body heat",
            ],
            active: true,
            image: "",
          },
          {
            id: "local-5",
            name: "Pain Sutra",
            description:
              "Natural anti-inflammatory relief for joints and muscles.",
            packs: [{ price: 479, weight: 100 }],
            ingredients: [
              "Shallaki",
              "Guggulu",
              "Nirgundi",
              "Methi",
              "Dry Ginger",
            ],
            benefits: [
              "Reduces joint stiffness",
              "Anti-inflammatory",
              "Safe long-term",
            ],
            active: true,
            image: "",
          },
          {
            id: "local-6",
            name: "Homoco Sutra",
            description:
              "Endocrine regulator for hormonal balance, thyroid, and stress.",
            packs: [{ price: 499, weight: 100 }],
            ingredients: [
              "Kanchanar",
              "Ashwagandha",
              "Gokshura",
              "Shatavari",
              "Lodhra",
            ],
            benefits: [
              "Balances hormones",
              "Supports thyroid",
              "Reduces fatigue",
            ],
            active: true,
            image: "",
          },
        ]);
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
    navigateTo('admin');
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminLoggedIn(false);
    navigateTo('patient');
  };

  const handleAdminToggle = () => {
    if (isAdminLoggedIn()) {
      navigateTo('admin');
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
          <Hero onOpenIngredients={() => setShowIngredientsModal(true)} />

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
                    Holistic Homeopathy, wild-crafted herbal formulations, and
                    personalized lifestyle counseling by Dr. Keval Dankhara.
                    Treating the root cause, not just symptoms.
                  </p>
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
                      <span>
                        204 Royal Plaza, Yogi Chowk, Surat, Gujarat, India -
                        395010
                      </span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span>+91 95370 51626</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-primary shrink-0" />
                      <span>contact@sutraholistic.com</span>
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
                  this platform are formulated based on classical Ayurvedic and
                  Homeopathic principles. Individual results may vary.
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

      {/* Ingredients Modal */}
      {showIngredientsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 animate-fade-in text-left">
            <div className="px-6 py-5 border-b border-primary/15 bg-white flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-text-dark">
                Sleep Sutra Ingredients
              </h3>
              <button
                onClick={() => setShowIngredientsModal(false)}
                className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm text-text-light">
              <ul className="space-y-2 text-xs">
                {[
                  [
                    "Tagara Root Extract",
                    "Clinically researched to decrease sleep latency and calm brain activity.",
                  ],
                  [
                    "Ashwagandha",
                    "Decreases cortisol stress hormones to quieten the nervous system.",
                  ],
                  [
                    "Jatamansi (Spikenard)",
                    "Promotes cooling relaxation and relaxes hyper-active thinking loops.",
                  ],
                  [
                    "Elaichi (Green Cardamom)",
                    "Balances digestive Pitta to avoid middle-of-night waking.",
                  ],
                  [
                    "Spelt & Organic Oats",
                    "High in magnesium — triggers natural melatonin production.",
                  ],
                ].map(([name, desc]) => (
                  <li key={name} className="flex gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>
                      <strong>{name}</strong> — {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-primary/10 flex justify-end">
                <button
                  onClick={() => setShowIngredientsModal(false)}
                  className="rounded-lg bg-text-dark text-white px-5 py-2.5 text-xs font-bold uppercase"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
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
