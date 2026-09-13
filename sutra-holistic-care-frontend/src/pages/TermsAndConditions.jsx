import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  ShoppingCart,
  DollarSign,
  Truck,
  BookOpen,
  UserCheck,
  AlertOctagon,
  ExternalLink,
  Lock,
  Gavel,
  RefreshCw,
} from "lucide-react";

const sections = [
  { id: "about-us", label: "About Us", icon: BookOpen },
  { id: "use-of-website", label: "Use of Website", icon: Globe },
  { id: "product-info", label: "Product Information", icon: ShoppingCart },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "pricing", label: "Pricing & Payments", icon: DollarSign },
  { id: "shipping", label: "Shipping, Returns & Refunds", icon: Truck },
  { id: "ip", label: "Intellectual Property", icon: ShieldCheck },
  { id: "user-responsibilities", label: "User Responsibilities", icon: UserCheck },
  { id: "liability", label: "Limitation of Liability", icon: AlertOctagon },
  { id: "third-party-links", label: "Third-Party Links", icon: ExternalLink },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "governing-law", label: "Governing Law", icon: Gavel },
  { id: "changes", label: "Changes to Terms", icon: RefreshCw },
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

const TermsAndConditions = ({ onAdminToggle }) => {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="These Terms & Conditions govern your access to and use of our website, including the purchase of products and use of services offered by Madhav Clinic."
      effectiveDate="July 8, 2026"
      onAdminToggle={onAdminToggle}
    >
      {/* Table of Contents */}
      <nav className="mb-10 p-5 rounded-xl bg-bg-cream border border-primary/10">
        <h3 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
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
        Welcome to <strong className="text-text-dark">Madhav Clinic</strong>. These Terms &amp; Conditions ("Terms")
        govern your access to and use of{" "}
        <a
          href="https://drkevaldankhara.com"
          className="text-primary hover:text-primary-dark underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://drkevaldankhara.com
        </a>
        , including the purchase of products and use of services offered by
        Madhav Clinic.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        By accessing or using this website, you agree to be bound by these Terms
        &amp; Conditions. If you do not agree with any part of these Terms,
        please do not use our website.
      </p>

      {/* Section 1 */}
      <SectionTitle id="about-us" number={1} title="About Us" />
      <p className="text-sm leading-relaxed mb-4">
        This website is owned and operated by Madhav Clinic, founded by
        Dr. Keval Dankhara (BHMS).
      </p>
      <div className="rounded-xl bg-bg-cream border border-primary/10 p-5">
        <h4 className="font-sans text-sm font-bold text-text-dark mb-3">
          Business Details
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-xs text-text-light">Business Name</span>
            <p className="font-medium text-text-dark">Madhav Clinic</p>
          </div>
          <div>
            <span className="text-xs text-text-light">Founder</span>
            <p className="font-medium text-text-dark">
              Dr. Keval Dankhara (BHMS)
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light">Clinic</span>
            <p className="font-medium text-text-dark">Madhav Clinic</p>
          </div>
          <div>
            <span className="text-xs text-text-light">Website</span>
            <p className="font-medium text-primary">
              <a href="https://drkevaldankhara.com" target="_blank" rel="noopener noreferrer">
                drkevaldankhara.com
              </a>
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light">Email</span>
            <p className="font-medium text-text-dark">
              drkevaldakhara@gmail.com
            </p>
          </div>
          <div>
            <span className="text-xs text-text-light">Customer Care</span>
            <p className="font-medium text-text-dark">+91 9537051626</p>
          </div>
          <div>
            <span className="text-xs text-text-light">Location</span>
            <p className="font-medium text-text-dark">Gujarat, India</p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <SectionTitle id="use-of-website" number={2} title="Use of Website" />
      <p className="text-sm leading-relaxed">
        By using this website, you agree that you will:
      </p>
      <BulletList
        items={[
          "Use the website only for lawful purposes.",
          "Provide accurate and complete information while placing orders.",
          "Not misuse, hack, disrupt, or interfere with the website or its services.",
          "Not upload viruses, malware, or harmful software.",
          "Not attempt unauthorized access to our systems or customer data.",
          "Not copy or reproduce website content without prior written permission.",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        We reserve the right to suspend or terminate access to users who violate
        these Terms.
      </p>

      {/* Section 3 */}
      <SectionTitle id="product-info" number={3} title="Product Information" />
      <p className="text-sm leading-relaxed">
        We strive to ensure that all product descriptions, images, pricing, and
        other information displayed on our website are accurate and up to date.
        However:
      </p>
      <BulletList
        items={[
          "Product images are for illustrative purposes and may vary slightly from the actual product.",
          "Packaging design, labels, or product appearance may change without prior notice while maintaining product quality.",
          "Product information provided on this website is intended for general wellness and educational purposes only.",
          "Our products are not intended to diagnose, treat, cure, or prevent any disease.",
          "Customers should consult a qualified healthcare professional before using any wellness product, especially if pregnant, nursing, taking medication, or managing an existing medical condition.",
        ]}
      />

      {/* Section 4 */}
      <SectionTitle id="orders" number={4} title="Orders" />
      <p className="text-sm leading-relaxed">When you place an order:</p>
      <BulletList
        items={[
          "All orders are subject to acceptance and availability.",
          "We reserve the right to accept, decline, or cancel any order at our discretion.",
          "You will receive an order confirmation after successful placement.",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        Orders may be cancelled in cases including, but not limited to:
      </p>
      <BulletList
        items={[
          "Pricing or technical errors",
          "Product unavailability",
          "Suspected fraudulent activity",
          "Payment verification failure",
          "Regulatory or legal requirements",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        If payment has already been received for a cancelled order, an eligible
        refund will be processed in accordance with our Refund Policy.
      </p>

      {/* Section 5 */}
      <SectionTitle id="pricing" number={5} title="Pricing and Payments" />
      <BulletList
        items={[
          "All prices displayed on the website are in Indian Rupees (INR) unless otherwise stated.",
          "Prices may be updated at any time without prior notice.",
          "Applicable taxes and shipping charges, if any, will be shown during checkout.",
          "Payments are processed through secure third-party payment gateway providers.",
          "Madhav Clinic does not store sensitive payment information such as debit/credit card numbers, CVV, UPI PINs, or banking passwords.",
        ]}
      />

      {/* Section 6 */}
      <SectionTitle id="shipping" number={6} title="Shipping, Returns & Refunds" />
      <p className="text-sm leading-relaxed">
        Orders are processed and shipped in accordance with our{" "}
        <a href="/shipping-policy" className="text-primary hover:text-primary-dark underline underline-offset-2">
          Shipping Policy
        </a>
        .
      </p>
      <p className="text-sm leading-relaxed mt-2">
        Returns and refunds are handled in accordance with our{" "}
        <a href="/return-policy" className="text-primary hover:text-primary-dark underline underline-offset-2">
          Return Policy
        </a>{" "}
        and{" "}
        <a href="/refund-policy" className="text-primary hover:text-primary-dark underline underline-offset-2">
          Refund Policy
        </a>
        .
      </p>
      <p className="text-sm leading-relaxed mt-2">
        Customers are encouraged to review these policies before placing an
        order.
      </p>

      {/* Section 7 */}
      <SectionTitle id="ip" number={7} title="Intellectual Property" />
      <p className="text-sm leading-relaxed">
        Unless otherwise stated, all content available on this website is the
        exclusive property of Madhav Clinic, including but not limited to:
      </p>
      <BulletList
        items={[
          "Brand name",
          "Logo",
          "Product names",
          "Website design",
          "Images",
          "Videos",
          "Graphics",
          "Icons",
          "Text",
          "Articles",
          "Blog content",
          "Product descriptions",
          "Educational materials",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        No content may be copied, reproduced, modified, distributed, published,
        or used for commercial purposes without prior written permission from
        Madhav Clinic.
      </p>

      {/* Section 8 */}
      <SectionTitle id="user-responsibilities" number={8} title="User Responsibilities" />
      <p className="text-sm leading-relaxed">You agree that you will:</p>
      <BulletList
        items={[
          "Provide accurate personal and shipping information.",
          "Keep your account credentials confidential, if applicable.",
          "Use the website responsibly and ethically.",
          "Not engage in fraudulent transactions or unlawful activities.",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        You are responsible for maintaining the confidentiality of any login
        credentials associated with your account.
      </p>

      {/* Section 9 */}
      <SectionTitle id="liability" number={9} title="Limitation of Liability" />
      <p className="text-sm leading-relaxed">
        To the maximum extent permitted by applicable law:
      </p>
      <BulletList
        items={[
          "Madhav Clinic shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of this website or its products.",
          "We are not responsible for delays caused by courier services, natural disasters, government actions, internet failures, or other events beyond our reasonable control.",
          "Individual experiences with wellness products may vary. We do not guarantee specific health outcomes or results.",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        Nothing in these Terms limits any rights available to consumers under
        applicable law.
      </p>

      {/* Section 10 */}
      <SectionTitle id="third-party-links" number={10} title="Third-Party Links" />
      <p className="text-sm leading-relaxed">
        Our website may contain links to third-party websites for your
        convenience. We do not control or endorse the content, privacy
        practices, or policies of external websites and are not responsible for
        their availability or content. Users access third-party websites at
        their own discretion.
      </p>

      {/* Section 11 */}
      <SectionTitle id="privacy" number={11} title="Privacy" />
      <p className="text-sm leading-relaxed">
        Your use of this website is also governed by our{" "}
        <a href="/privacy-policy" className="text-primary hover:text-primary-dark underline underline-offset-2">
          Privacy Policy
        </a>
        , which explains how we collect, use, and protect your personal
        information.
      </p>

      {/* Section 12 */}
      <SectionTitle id="governing-law" number={12} title="Governing Law" />
      <p className="text-sm leading-relaxed">
        These Terms &amp; Conditions shall be governed by and interpreted in
        accordance with the laws of India.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        Any disputes arising from the use of this website or purchase of our
        products shall be subject to the competent courts having jurisdiction in
        Surat, Gujarat, unless otherwise required by applicable law.
      </p>

      {/* Section 13 */}
      <SectionTitle id="changes" number={13} title="Changes to These Terms" />
      <p className="text-sm leading-relaxed">
        Madhav Clinic reserves the right to modify or update these Terms
        &amp; Conditions at any time without prior notice. Any changes will
        become effective immediately upon publication on this website. Continued
        use of the website after such changes constitutes acceptance of the
        revised Terms.
      </p>

      {/* Section 14 - Contact */}
      <SectionTitle id="contact" number={14} title="Contact Us" />
      <p className="text-sm leading-relaxed mb-4">
        If you have any questions regarding these Terms &amp; Conditions, please
        contact us:
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
          We appreciate your trust in Madhav Clinic and thank you for
          choosing us as your wellness partner.
        </p>
      </div>
    </PolicyLayout>
  );
};

export default TermsAndConditions;
