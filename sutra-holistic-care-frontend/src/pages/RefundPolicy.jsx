import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  CheckCircle,
  XCircle,
  Scissors,
  Clock,
  CreditCard,
  AlertTriangle,
  Undo2,
} from "lucide-react";

const sections = [
  { id: "eligibility", label: "Refund Eligibility", icon: CheckCircle },
  { id: "non-refundable", label: "Non-Refundable", icon: XCircle },
  { id: "cancellation", label: "Cancellation Before Shipping", icon: Scissors },
  { id: "process", label: "Refund Process", icon: RotateCcw },
  { id: "timeline", label: "Refund Timeline", icon: Clock },
  { id: "method", label: "Refund Method", icon: CreditCard },
  { id: "failed-deliveries", label: "Failed Deliveries", icon: AlertTriangle },
  { id: "contact", label: "Contact Us", icon: Phone },
];

const SectionTitle = ({ id, number, title }) => (
  <h2
    id={id}
    className="font-serif text-xl sm:text-2xl font-bold text-text-dark mt-10 mb-4 flex items-center gap-3 scroll-mt-28"
  >
    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold font-sans shrink-0">
      {number}
    </span>
    {title}
  </h2>
);

const BulletList = ({ items }) => (
  <ul className="space-y-2 mt-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
        {item}
      </li>
    ))}
  </ul>
);

const RefundPolicy = ({ onAdminToggle }) => {
  return (
    <PolicyLayout
      title="Refund Policy"
      subtitle="Customer satisfaction is important to us. This Refund Policy explains when refunds may be provided and how they are processed."
      effectiveDate="July 8, 2026"
      onAdminToggle={onAdminToggle}
    >
      {/* Table of Contents */}
      <nav className="mb-10 p-5 rounded-xl bg-bg-cream border border-primary/10">
        <h3 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary" />
          Table of Contents
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-xs text-text-light hover:text-primary transition-colors py-1 px-2 rounded hover:bg-primary/5"
              >
                <Icon className="h-3 w-3 text-primary/60" />
                <span className="text-primary/60 font-semibold w-4">
                  {i + 1}.
                </span>
                {s.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Intro */}
      <p className="text-sm leading-relaxed">
        At <strong className="text-text-dark">Sutra Holistic Care</strong>, customer satisfaction is important to us.
        We strive to ensure that every order reaches you in excellent condition.
        If an issue occurs, this Refund Policy explains when refunds may be
        provided and how they are processed.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        By placing an order through{" "}
        <a
          href="https://drkevaldankhara.com"
          className="text-primary hover:text-primary-dark underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://drkevaldankhara.com
        </a>
        , you agree to the terms of this Refund Policy.
      </p>

      {/* Section 1 */}
      <SectionTitle id="eligibility" number={1} title="Refund Eligibility" />
      <p className="text-sm leading-relaxed">
        You may be eligible for a refund under the following circumstances:
      </p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "You received the wrong product",
          "The product was damaged during transit",
          "The product has a verified manufacturing defect",
          "Your order was cancelled before it was shipped",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800"
          >
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>
      <p className="text-xs text-text-light mt-3">
        Refund requests are subject to verification by our customer support
        team.
      </p>

      {/* Section 2 */}
      <SectionTitle id="non-refundable" number={2} title="Non-Refundable Situations" />
      <p className="text-sm leading-relaxed">
        Refunds will not be provided in the following cases:
      </p>
      <div className="mt-3 space-y-2">
        {[
          "The product has been opened, used, or consumed.",
          "The product seal has been broken or tampered with after delivery.",
          "The refund request is made due to a change of mind.",
          "The order was placed incorrectly by the customer.",
          "The customer dislikes the taste, aroma, texture, or personal experience of the product.",
          "Delivery could not be completed because of an incorrect or incomplete shipping address provided by the customer.",
          "Delivery failed due to repeated unavailability of the customer at the delivery location.",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-800"
          >
            <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>

      {/* Section 3 */}
      <SectionTitle id="cancellation" number={3} title="Cancellation Before Shipping" />
      <p className="text-sm leading-relaxed">
        You may request to cancel your order before it has been shipped.
      </p>
      <BulletList
        items={[
          "If the cancellation request is approved before dispatch, a full refund will be initiated.",
          "Once an order has been shipped, it cannot be cancelled and will be governed by our Return Policy.",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        To request a cancellation, please contact our customer support team as
        soon as possible after placing your order.
      </p>

      {/* Section 4 */}
      <SectionTitle id="process" number={4} title="Refund Process" />
      <p className="text-sm leading-relaxed mb-4">
        If your refund request is approved:
      </p>
      <div className="space-y-3">
        {[
          { step: 1, text: "Our team will verify your request and supporting information." },
          { step: 2, text: "You may be asked to provide Order ID, photographs or videos (if applicable), and a brief description of the issue." },
          { step: 3, text: "Once approved, the refund process will be initiated." },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-start gap-3 p-4 rounded-lg bg-bg-cream border border-primary/10"
          >
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white text-xs font-bold shrink-0">
              {item.step}
            </span>
            <p className="text-sm text-text-light leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Section 5 */}
      <SectionTitle id="timeline" number={5} title="Refund Timeline" />
      <div className="rounded-xl bg-blue-50 border border-blue-200 p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-sans text-sm font-bold text-blue-800">
            5–7 Business Days
          </span>
        </div>
        <p className="text-sm text-blue-700">
          Approved refunds are generally processed within 5–7 business days. The
          refunded amount will be credited to the original payment method used
          at the time of purchase.
        </p>
        <p className="text-xs text-blue-600">
          Depending on your bank, card issuer, UPI provider, or payment gateway,
          it may take additional time for the amount to appear in your account.
        </p>
      </div>

      {/* Section 6 */}
      <SectionTitle id="method" number={6} title="Refund Method" />
      <p className="text-sm leading-relaxed">
        Refunds will be issued through the original payment method whenever
        possible, including:
      </p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallets", "Other Online Methods"].map(
          (method) => (
            <div
              key={method}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-cream border border-primary/10 text-xs font-medium text-text-dark"
            >
              <CreditCard className="h-3.5 w-3.5 text-primary" />
              {method}
            </div>
          ),
        )}
      </div>
      <p className="text-sm leading-relaxed mt-3 text-text-light">
        Cash refunds are not provided for online orders.
      </p>

      {/* Section 7 */}
      <SectionTitle id="failed-deliveries" number={7} title="Failed or Returned Deliveries" />
      <p className="text-sm leading-relaxed">
        If an order is returned to us because:
      </p>
      <BulletList
        items={[
          "An incorrect or incomplete address was provided,",
          "The customer was unavailable after multiple delivery attempts,",
          "The shipment was refused without a valid reason,",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        the refund, if approved, may be processed after deducting applicable
        shipping and handling charges, where permitted.
      </p>

      {/* Section 8 - Contact */}
      <SectionTitle id="contact" number={8} title="Contact Us" />
      <p className="text-sm leading-relaxed mb-4">
        If you have any questions regarding refunds or wish to submit a refund
        request, please contact us:
      </p>
      <div className="rounded-xl bg-bg-cream border border-primary/10 p-5 space-y-3">
        <h4 className="font-serif text-lg font-bold text-text-dark">
          Sutra Holistic Care
        </h4>
        <p className="text-xs text-text-light">
          Founder: Dr. Keval Dankhara (BHMS) &bull; Clinic: Radhe Clinic
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-primary shrink-0" />
            <a href="https://drkevaldankhara.com" className="text-primary hover:text-primary-dark transition-colors" target="_blank" rel="noopener noreferrer">
              https://drkevaldankhara.com
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <a href="mailto:drkevaldakhara@gmail.com" className="hover:text-primary transition-colors">
              drkevaldakhara@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <a href="tel:+919537051626" className="hover:text-primary transition-colors">
              +91 9537051626
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>Gujarat, India</span>
          </div>
        </div>
        <p className="text-xs text-text-light pt-2">
          Our customer support team will review your request and assist you as
          quickly as possible.
        </p>
      </div>

      {/* Policy Updates */}
      <div className="mt-10 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Policy Updates:</strong> Sutra Holistic Care reserves
        the right to amend or update this Refund Policy at any time without
        prior notice. Any changes will be published on this page with the
        updated effective date.
      </div>
    </PolicyLayout>
  );
};

export default RefundPolicy;
