import React from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  MessageCircle,
  ShoppingCart,
  Truck,
  RotateCcw,
  CreditCard,
  HelpCircle,
  Handshake,
  ExternalLink,
} from "lucide-react";

const ContactUs = ({ onAdminToggle }) => {
  const supportTopics = [
    { icon: ShoppingCart, label: "Product Information" },
    { icon: Truck, label: "Order Status" },
    { icon: Truck, label: "Shipping & Delivery" },
    { icon: RotateCcw, label: "Returns & Refunds" },
    { icon: CreditCard, label: "Payment Issues" },
    { icon: HelpCircle, label: "General Inquiries" },
    { icon: Handshake, label: "Partnership & Business" },
  ];

  return (
    <PolicyLayout
      title="Contact Us"
      subtitle="We are here to assist you with product inquiries, order support, and general questions. Feel free to reach out through any of the channels below."
      onAdminToggle={onAdminToggle}
    >
      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {/* Phone Card */}
        <a
          href="tel:+919537051626"
          className="group p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white group-hover:scale-110 transition-transform">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                Customer Care
              </p>
              <p className="text-lg font-bold text-text-dark mt-0.5">
                +91 9537051626
              </p>
            </div>
          </div>
        </a>

        {/* Email Card */}
        <a
          href="mailto:drkevaldakhara@gmail.com"
          className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                Email Address
              </p>
              <p className="text-lg font-bold text-text-dark mt-0.5">
                drkevaldakhara@gmail.com
              </p>
            </div>
          </div>
        </a>

        {/* WhatsApp Card */}
        <a
          href="https://wa.me/919537051626?text=Hi%20Dr.%20Keval,%20I%20have%20a%20query%20regarding%20Sutra%20Holistic%20Care."
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white group-hover:scale-110 transition-transform">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                WhatsApp
              </p>
              <p className="text-lg font-bold text-text-dark mt-0.5">
                Chat with us
              </p>
            </div>
          </div>
        </a>

        {/* Website Card */}
        <a
          href="https://drkevaldankhara.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-6 rounded-xl bg-gradient-to-br from-primary-light to-orange-50 border border-primary/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white group-hover:scale-110 transition-transform">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-primary-dark font-semibold uppercase tracking-wider">
                Official Website
              </p>
              <p className="text-lg font-bold text-text-dark mt-0.5">
                drkevaldankhara.com
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Business Details */}
      <div className="rounded-xl bg-bg-cream border border-primary/10 p-6 sm:p-8 mb-10">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-dark mb-6">
          Business Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
              Legal Business Name
            </span>
            <p className="font-medium text-text-dark mt-1 text-sm">
              Madhav Clinic
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
              Founder
            </span>
            <p className="font-medium text-text-dark mt-1 text-sm">
              Dr. Keval Dankhara (BHMS)
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
              Clinic
            </span>
            <p className="font-medium text-text-dark mt-1 text-sm">
              Madhav Clinic
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
              Location
            </span>
            <p className="font-medium text-text-dark mt-1 text-sm">
              Gujarat, India
            </p>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="rounded-xl border border-primary/10 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-[#2A2725] to-[#3a3330] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Business Address
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Madhav Clinic / Madhav Clinic
                <br />
                C 401 Opera Palm, Kholvad Gam, Kamrej
                <br />
                Surat, Gujarat, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-xl border border-primary/10 overflow-hidden mb-10">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-dark">
              Business Hours
            </h2>
          </div>

          <div className="space-y-3">
            {/* Monday - Saturday */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <div>
                <p className="font-sans text-sm font-bold text-text-dark">
                  Monday – Saturday
                </p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <span>🕙</span>
                  <span>10:00 AM – 1:00 PM (IST)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-700">
                  <span>🕔</span>
                  <span>5:00 PM – 9:00 PM (IST)</span>
                </div>
              </div>
            </div>

            {/* Sunday */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
              <div>
                <p className="font-sans text-sm font-bold text-text-dark">
                  Sunday
                </p>
              </div>
              <div>
                <span className="text-sm text-red-600 font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Support Topics */}
      <div className="mb-10">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-text-dark mb-2">
          Customer Support
        </h2>
        <p className="text-sm text-text-light mb-5">
          For assistance related to any of the following, please contact us via
          phone or email during business hours:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {supportTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-bg-cream border border-primary/5 text-sm text-text-dark"
              >
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {topic.label}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-text-light mt-4">
          We aim to respond to all inquiries as quickly as possible.
        </p>
      </div>

      {/* Quick Links to Policies */}
      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/15 p-6">
        <h3 className="font-sans text-sm font-bold text-text-dark uppercase tracking-wider mb-4">
          Helpful Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: "Privacy Policy", to: "/privacy-policy" },
            { label: "Terms & Conditions", to: "/terms-and-conditions" },
            { label: "Refund Policy", to: "/refund-policy" },
            { label: "Return Policy", to: "/return-policy" },
            { label: "Shipping Policy", to: "/shipping-policy" },
            { label: "About Us", to: "/about-us" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors py-1.5 group"
            >
              <ExternalLink className="h-3.5 w-3.5 text-primary/50 group-hover:text-primary transition-colors" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Closing */}
      <p className="mt-8 text-sm text-text-light text-center leading-relaxed">
        We appreciate your trust in{" "}
        <strong className="text-text-dark">Madhav Clinic</strong> and look
        forward to supporting you on your wellness journey.
      </p>
    </PolicyLayout>
  );
};

export default ContactUs;
