import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoctorBio from "./components/DoctorBio";
import ProductList from "./components/ProductList";
import SeminarRegister from "./components/SeminarRegister";
import VideoConsultation from "./components/VideoConsultation";
import FAQ from "./components/FAQ";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import { MessageCircle } from "lucide-react";
import {
  getActiveProducts,
  getDisplayPrice,
} from "./services/productService.js";
import { isAdminLoggedIn, logoutAdmin } from "./services/authService.js";


// Lazy-load policy/legal pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";

// ── Home Page Component ──────────────────────────────────────────────────────
const HomePage = ({
  products,
  loadingProducts,
  handleProductInquiry,
  onAdminToggle,
}) => {
  return (
    <>
      <main className="animate-fade-in">
        <Navbar onAdminLoginClick={onAdminToggle} currentView="patient" />
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
            products={products}
            onProductInquiry={handleProductInquiry}
          />
        )}

        <SeminarRegister onRegister={() => {}} />

        <VideoConsultation onBook={() => {}} />

        <FAQ />

        <Footer onAdminToggle={onAdminToggle} />
      </main>
    </>
  );
};

// ── Main App Component ───────────────────────────────────────────────────────
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // ── Load products from API on mount ─────────────────────────────────────────
  useEffect(() => {
    setAdminLoggedIn(isAdminLoggedIn());

    // If the page was opened at /admin but the user isn't logged in, show login modal
    if (location.pathname === "/admin" && !isAdminLoggedIn()) {
      navigate("/", { replace: true });
      setShowAdminLogin(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    navigate("/admin");
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminLoggedIn(false);
    navigate("/");
  };

  const handleAdminToggle = () => {
    if (isAdminLoggedIn()) {
      navigate("/admin");
    } else {
      setShowAdminLogin(true);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const isAdminRoute = location.pathname === "/admin";

  return (
    <>
      <div className="relative min-h-screen bg-bg-cream selection:bg-primary/30 text-text-light font-sans scroll-smooth">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={
              <HomePage
                products={normalizedProducts}
                loadingProducts={loadingProducts}
                handleProductInquiry={handleProductInquiry}
                onAdminToggle={handleAdminToggle}
              />
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              adminLoggedIn ? (
                <AdminDashboard
                  onLogout={handleLogout}
                  onBackToSite={() => navigate("/")}
                />
              ) : (
                <HomePage
                  products={normalizedProducts}
                  loadingProducts={loadingProducts}
                  handleProductInquiry={handleProductInquiry}
                  onAdminToggle={handleAdminToggle}
                />
              )
            }
          />

          {/* Policy & Legal Pages */}
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/refund-policy"
            element={<RefundPolicy onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/return-policy"
            element={<ReturnPolicy onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/shipping-policy"
            element={<ShippingPolicy onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/contact-us"
            element={<ContactUs onAdminToggle={handleAdminToggle} />}
          />
          <Route
            path="/about-us"
            element={<AboutUs onAdminToggle={handleAdminToggle} />}
          />

          {/* Catch-all → redirect to home */}
          <Route
            path="*"
            element={
              <HomePage
                products={normalizedProducts}
                loadingProducts={loadingProducts}
                handleProductInquiry={handleProductInquiry}
                onAdminToggle={handleAdminToggle}
              />
            }
          />
        </Routes>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* WhatsApp floating button */}
      {!isAdminRoute && (
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
    </>
  );
};

export default App;
