import React from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Activity,
  Truck,
  FileText,
  Scale,
  RotateCcw,
  Package,
  Shield,
} from "lucide-react";
import { Facebook, Instagram, Youtube } from "./SocialIcons";

const Footer = ({ onAdminToggle }) => {
  const policyLinks = [
    { label: "Privacy Policy", to: "/privacy-policy", icon: Shield },
    { label: "Terms & Conditions", to: "/terms-and-conditions", icon: Scale },
    { label: "Refund Policy", to: "/refund-policy", icon: RotateCcw },
    { label: "Return Policy", to: "/return-policy", icon: Package },
    { label: "Shipping Policy", to: "/shipping-policy", icon: Truck },
  ];

  const siteLinks = [
    { label: "About Us", to: "/about-us" },
    { label: "Contact Us", to: "/contact-us" },
  ];

  return (
    <footer className="bg-[#1E1B1A] text-slate-300 py-16 text-left">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
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
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Holistic natural solution, wild-crafted herbal formulations, and
              personalized lifestyle counseling by Dr. Keval Dankhara. Treating
              the root cause, not just symptoms.
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

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Therapies &amp; Clinic
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="/#doctor"
                  className="hover:text-primary transition-colors"
                >
                  About Dr. Keval
                </a>
              </li>
              <li>
                <a
                  href="/#products"
                  className="hover:text-primary transition-colors"
                >
                  Sutra Remedies
                </a>
              </li>
              <li>
                <a
                  href="/#seminars"
                  className="hover:text-primary transition-colors"
                >
                  Live Health Seminars
                </a>
              </li>
              <li>
                <a
                  href="/#consultation"
                  className="hover:text-primary transition-colors"
                >
                  Telehealth Consultations
                </a>
              </li>
            </ul>

            {/* About & Contact */}
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 mt-6 font-sans">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Policies */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {policyLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                      <Icon className="h-3 w-3 text-slate-600 group-hover:text-primary transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-sans">
              Radhe Clinic
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  C 401 Opera Palm, Kholvad Gam, Kamrej
                  <br />
                  Surat, Gujarat, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="tel:+919537051626"
                  className="hover:text-primary transition-colors"
                >
                  +91 95370 51626
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:drkevaldakhara@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  drkevaldakhara@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
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
              {onAdminToggle && (
                <button
                  onClick={onAdminToggle}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 hover:border-primary hover:text-primary text-slate-300 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all w-full justify-center"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Doctor Panel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} Sutra Holistic Care / Radhe Clinic.
              All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
              <Link
                to="/privacy-policy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                to="/terms-and-conditions"
                className="hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                to="/refund-policy"
                className="hover:text-primary transition-colors"
              >
                Refunds
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                to="/shipping-policy"
                className="hover:text-primary transition-colors"
              >
                Shipping
              </Link>
              <span className="text-slate-700">•</span>
              <Link
                to="/return-policy"
                className="hover:text-primary transition-colors"
              >
                Returns
              </Link>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] text-slate-600 max-w-2xl mx-auto">
            Disclaimer: The formulas and lifestyle guidelines shared on this
            platform are formulated based on classical botanical blend and herbal
            formula principles. Individual results may vary.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
