import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, ChevronUp, Calendar } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PolicyLayout = ({ children, title, subtitle, effectiveDate, onAdminToggle }) => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-cream text-text-light font-sans">
      <Navbar onAdminLoginClick={onAdminToggle} currentView="patient" />

      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2725] via-[#3a3330] to-[#2A2725]" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(204,164,124,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(204,164,124,0.2) 0%, transparent 50%)",
            }}
          />
        </div>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CCA47C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-primary font-medium">{title}</span>
          </nav>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Effective Date Badge */}
          {effectiveDate && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-xs text-slate-300 backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Effective Date: {effectiveDate}
            </div>
          )}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="#FAF6F0"
            />
          </svg>
        </div>
      </section>

      {/* Page Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-40 bg-primary hover:bg-primary-dark text-white rounded-full p-3 shadow-xl hover:scale-110 transition-all duration-300"
          title="Back to Top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      <Footer onAdminToggle={onAdminToggle} />
    </div>
  );
};

export default PolicyLayout;
