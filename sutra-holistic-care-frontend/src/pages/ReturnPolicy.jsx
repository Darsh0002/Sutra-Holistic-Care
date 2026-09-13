import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  Camera,
  ClipboardCheck,
  Truck,
  Award,
} from "lucide-react";

const sections = [
  { id: "eligibility", label: "Return Eligibility", icon: CheckCircle },
  { id: "non-returnable", label: "Non-Returnable Products", icon: XCircle },
  { id: "damaged", label: "Damaged or Incorrect Products", icon: Camera },
  { id: "approval", label: "Return Approval Process", icon: ClipboardCheck },
  { id: "shipping", label: "Return Shipping", icon: Truck },
  { id: "quality", label: "Quality Assurance", icon: Award },
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

const ReturnPolicy = ({ onAdminToggle }) => {
  return (
    <PolicyLayout
      title="Return Policy"
      subtitle="We are committed to delivering high-quality wellness products. Please read our Return Policy carefully before placing your order."
      effectiveDate="July 8, 2026"
      onAdminToggle={onAdminToggle}
    >
      {/* Table of Contents */}
      <nav className="mb-10 p-5 rounded-xl bg-bg-cream border border-primary/10">
        <h3 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
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
        At <strong className="text-text-dark">Madhav Clinic</strong>, we are committed to delivering
        high-quality wellness products. Due to the nature of herbal and wellness
        products, we maintain strict quality and hygiene standards. Please read
        our Return Policy carefully before placing your order.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        By purchasing from{" "}
        <a
          href="https://drkevaldankhara.com"
          className="text-primary hover:text-primary-dark underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://drkevaldankhara.com
        </a>
        , you agree to the terms outlined below.
      </p>

      {/* Section 1 */}
      <SectionTitle id="eligibility" number={1} title="Return Eligibility" />
      <p className="text-sm leading-relaxed">
        We accept returns only under the following circumstances:
      </p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "You received the wrong product.",
          "The product was damaged during transit.",
          "The product has a manufacturing defect.",
          "The package was tampered with before delivery.",
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

      <h3 className="font-sans text-sm font-bold text-text-dark mt-6 mb-2">
        To be eligible for a return:
      </h3>
      <BulletList
        items={[
          <>The request must be made within <strong className="text-text-dark">48 hours</strong> of delivery.</>,
          "The product must remain unused and unopened.",
          "The product should be returned in its original packaging with all labels intact.",
          "You must provide your Order ID along with clear photos or videos showing the issue.",
        ]}
      />

      {/* Section 2 */}
      <SectionTitle id="non-returnable" number={2} title="Non-Returnable Products" />
      <p className="text-sm leading-relaxed">
        For safety, hygiene, and quality reasons, we do not accept returns in
        the following cases:
      </p>
      <div className="mt-3 space-y-2">
        {[
          "Opened products",
          "Used or partially used products",
          "Products with broken or removed seals",
          "Change of mind after purchase",
          "Personal taste, smell, or texture preferences",
          "Orders placed by mistake",
          "Products damaged due to improper storage or misuse after delivery",
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
      <p className="text-xs text-text-light mt-3">
        As our products are intended for personal wellness, returned opened
        items cannot be resold or reused.
      </p>

      {/* Section 3 */}
      <SectionTitle id="damaged" number={3} title="Damaged or Incorrect Products" />
      <p className="text-sm leading-relaxed">If you receive:</p>
      <BulletList
        items={[
          "A damaged package",
          "A wrong product",
          "A manufacturing defect",
          "A tampered parcel",
        ]}
      />
      <p className="text-sm leading-relaxed mt-4">
        Please contact us within <strong className="text-text-dark">48 hours</strong> of delivery by sharing:
      </p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          "Order Number",
          "Customer Name",
          "Clear photographs of the outer package",
          "Photographs of the product",
          "A brief description of the issue",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-cream border border-primary/10 text-xs font-medium text-text-dark"
          >
            <Camera className="h-3.5 w-3.5 text-primary" />
            {item}
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed mt-3">
        After verification, we will provide an appropriate resolution in
        accordance with this policy.
      </p>

      {/* Section 4 */}
      <SectionTitle id="approval" number={4} title="Return Approval Process" />
      <p className="text-sm leading-relaxed mb-4">
        Once your return request is received:
      </p>
      <div className="space-y-3">
        {[
          { step: 1, text: "Our customer support team will review your request." },
          { step: 2, text: "Additional photographs or information may be requested if required." },
          { step: 3, text: "If the return is approved, we will provide instructions for the return process." },
          { step: 4, text: "Products must be packed securely before shipment." },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-start gap-3 p-4 rounded-lg bg-bg-cream border border-primary/10"
          >
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white text-xs font-bold shrink-0">
              {item.step}
            </span>
            <p className="text-sm text-text-light leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <strong>Note:</strong> Returns sent without prior approval may not be
        accepted.
      </div>

      {/* Section 5 */}
      <SectionTitle id="shipping" number={5} title="Return Shipping" />
      <p className="text-sm leading-relaxed">
        If the return is approved because of:
      </p>
      <BulletList
        items={[
          "Wrong product delivered",
          "Manufacturing defect",
          "Transit damage",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        Madhav Clinic will guide you through the return process.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        If the return is requested for reasons not covered under this policy,
        the return request may be declined.
      </p>

      {/* Section 6 */}
      <SectionTitle id="quality" number={6} title="Quality Assurance" />
      <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="flex items-start gap-3">
          <Award className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Every order is carefully inspected before dispatch. We strive to
              ensure that each customer receives products that meet our quality
              standards. However, if an issue occurs despite these precautions,
              we will work with you to resolve it fairly and promptly.
            </p>
          </div>
        </div>
      </div>

      {/* Section 7 - Contact */}
      <SectionTitle id="contact" number={7} title="Contact Us" />
      <p className="text-sm leading-relaxed mb-4">
        For any return-related questions or to request a return, please contact
        us:
      </p>
      <div className="rounded-xl bg-bg-cream border border-primary/10 p-5 space-y-3">
        <h4 className="font-serif text-lg font-bold text-text-dark">
          Madhav Clinic
        </h4>
        <p className="text-xs text-text-light">
          Founder: Dr. Keval Dankhara (BHMS) &bull; Clinic: Madhav Clinic
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
          Please include your Order ID and relevant photographs when contacting
          us to help us process your request more efficiently.
        </p>
      </div>

      {/* Policy Updates */}
      <div className="mt-10 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Policy Updates:</strong> Madhav Clinic reserves
        the right to modify or update this Return Policy at any time without
        prior notice. Any changes will be published on this page with the
        updated effective date.
      </div>
    </PolicyLayout>
  );
};

export default ReturnPolicy;
