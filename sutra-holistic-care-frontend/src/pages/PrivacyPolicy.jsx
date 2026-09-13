import React from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout";
import {
  Shield,
  Eye,
  Cookie,
  Lock,
  CreditCard,
  Users,
  Globe,
  UserCheck,
  Baby,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
} from "lucide-react";

const sections = [
  { id: "info-we-collect", label: "Information We Collect", icon: Eye },
  { id: "how-we-use", label: "How We Use Info", icon: Users },
  { id: "cookies", label: "Cookies", icon: Cookie },
  { id: "data-security", label: "Data Security", icon: Lock },
  { id: "payment-security", label: "Payment Security", icon: CreditCard },
  { id: "sharing", label: "Sharing Information", icon: Users },
  { id: "third-party", label: "Third-Party Services", icon: Globe },
  { id: "user-rights", label: "User Rights", icon: UserCheck },
  { id: "children", label: "Children's Privacy", icon: Baby },
  { id: "changes", label: "Changes", icon: RefreshCw },
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

const PrivacyPolicy = ({ onAdminToggle }) => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Your privacy is important to us. This Privacy Policy explains how we collect, use, protect, and disclose your personal information."
      effectiveDate="July 8, 2026"
      onAdminToggle={onAdminToggle}
    >
      {/* Table of Contents */}
      <nav className="mb-10 p-5 rounded-xl bg-bg-cream border border-primary/10">
        <h3 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
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
        Welcome to <strong className="text-text-dark">Madhav Clinic</strong> ("we," "our," or "us"). Your privacy is
        important to us. This Privacy Policy explains how we collect, use,
        protect, and disclose your personal information when you visit{" "}
        <a
          href="https://drkevaldankhara.com"
          className="text-primary hover:text-primary-dark underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://drkevaldankhara.com
        </a>
        , purchase our products, or interact with our services.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        By using our website, you agree to the practices described in this
        Privacy Policy.
      </p>

      {/* Section 1 */}
      <SectionTitle id="info-we-collect" number={1} title="Information We Collect" />
      <p className="text-sm leading-relaxed">
        To provide you with a seamless shopping and customer support experience,
        we may collect the following information:
      </p>

      <h3 className="font-sans text-sm font-bold text-text-dark mt-5 mb-2">
        Personal Information
      </h3>
      <p className="text-sm leading-relaxed">
        When you place an order, register an account, subscribe to our
        newsletter, or contact us, we may collect:
      </p>
      <BulletList
        items={[
          "Full Name",
          "Email Address",
          "Mobile Number",
          "Shipping Address",
          "Billing Address",
          "City, State, and PIN Code",
          "Order Details",
          "Communication Preferences",
        ]}
      />

      <h3 className="font-sans text-sm font-bold text-text-dark mt-5 mb-2">
        Payment Information
      </h3>
      <p className="text-sm leading-relaxed">
        Payments are securely processed through trusted third-party payment
        gateway providers.
      </p>
      <div className="mt-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
        <strong>Important:</strong> We do not collect, store, or have access to
        your debit card, credit card, UPI PIN, net banking password, CVV, or
        other sensitive financial information.
      </div>

      <h3 className="font-sans text-sm font-bold text-text-dark mt-5 mb-2">
        Automatically Collected Information
      </h3>
      <p className="text-sm leading-relaxed">
        When you browse our website, we may automatically collect:
      </p>
      <BulletList
        items={[
          "IP Address",
          "Browser Type",
          "Device Information",
          "Operating System",
          "Pages Visited",
          "Time Spent on Website",
          "Referral Source",
          "Cookies and Analytics Data",
        ]}
      />

      {/* Section 2 */}
      <SectionTitle id="how-we-use" number={2} title="How We Use Your Information" />
      <p className="text-sm leading-relaxed">We use your information to:</p>
      <BulletList
        items={[
          "Process and fulfill your orders",
          "Deliver products to your shipping address",
          "Provide customer support",
          "Respond to your inquiries",
          "Send order confirmations and shipping updates",
          "Improve our website, products, and services",
          "Enhance user experience",
          "Prevent fraudulent transactions",
          "Comply with legal and regulatory obligations",
          "Send promotional emails, wellness tips, or special offers (only where permitted or with your consent)",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        We use your information responsibly and only for legitimate business
        purposes.
      </p>

      {/* Section 3 */}
      <SectionTitle id="cookies" number={3} title="Cookies" />
      <p className="text-sm leading-relaxed">
        Our website uses cookies and similar technologies to improve your
        browsing experience. Cookies help us:
      </p>
      <BulletList
        items={[
          "Remember your preferences",
          "Maintain website functionality",
          "Analyze website traffic",
          "Improve website performance",
          "Measure marketing effectiveness",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        You may disable cookies through your browser settings. However, certain
        features of the website may not function properly if cookies are
        disabled.
      </p>

      {/* Section 4 */}
      <SectionTitle id="data-security" number={4} title="Data Security" />
      <p className="text-sm leading-relaxed">
        Protecting your personal information is one of our priorities. We
        implement reasonable administrative, technical, and organizational
        safeguards to protect your data against:
      </p>
      <BulletList
        items={[
          "Unauthorized access",
          "Loss",
          "Misuse",
          "Alteration",
          "Disclosure",
          "Destruction",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        Although we strive to use commercially acceptable methods to protect
        your information, no method of transmission over the internet or
        electronic storage is completely secure. Therefore, we cannot guarantee
        absolute security.
      </p>

      {/* Section 5 */}
      <SectionTitle id="payment-security" number={5} title="Payment Security" />
      <p className="text-sm leading-relaxed">
        All online payments are processed through secure and trusted payment
        gateway providers that use industry-standard encryption technologies.
      </p>
      <div className="mt-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
        <strong>Madhav Clinic</strong> never stores your complete card
        details, banking credentials, UPI PIN, CVV, or internet banking
        passwords. Your payment information is handled directly by our payment
        partners in accordance with applicable security standards.
      </div>

      {/* Section 6 */}
      <SectionTitle id="sharing" number={6} title="Sharing Information" />
      <p className="text-sm leading-relaxed">
        We respect your privacy and <strong className="text-text-dark">do not sell, rent, or trade</strong> your
        personal information.
      </p>
      <p className="text-sm leading-relaxed mt-3">
        Your information may be shared only with trusted third parties when
        necessary to provide our services, including:
      </p>
      <BulletList
        items={[
          "Payment Gateway Providers",
          "Courier and Logistics Partners",
          "Website Hosting Providers",
          "IT and Technical Service Providers",
          "Marketing Service Providers (where applicable)",
          "Government Authorities or Regulatory Bodies, if required by law",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        These service providers are expected to protect your information and use
        it only for the services they perform on our behalf.
      </p>

      {/* Section 7 */}
      <SectionTitle id="third-party" number={7} title="Third-Party Services" />
      <p className="text-sm leading-relaxed">
        Our website may integrate with trusted third-party platforms for
        services such as:
      </p>
      <BulletList
        items={[
          "Payment Processing",
          "Shipping and Order Fulfillment",
          "Website Analytics",
          "Customer Communication",
          "Email Marketing",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        These third-party services operate under their own privacy policies. We
        encourage you to review their privacy practices before using their
        services.
      </p>

      {/* Section 8 */}
      <SectionTitle id="user-rights" number={8} title="User Rights" />
      <p className="text-sm leading-relaxed">You have the right to:</p>
      <BulletList
        items={[
          "Access the personal information we hold about you",
          "Request correction of inaccurate or incomplete information",
          "Request deletion of your personal information, subject to applicable legal requirements",
          "Opt out of receiving promotional communications",
          "Request information about how your data is processed",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        To exercise these rights, please contact us using the details below.
      </p>

      {/* Section 9 */}
      <SectionTitle id="children" number={9} title="Children's Privacy" />
      <p className="text-sm leading-relaxed">
        Our website is intended for individuals who are legally capable of
        entering into contracts under applicable laws. We do not knowingly
        collect personal information from children without appropriate parental
        or guardian consent.
      </p>

      {/* Section 10 */}
      <SectionTitle id="changes" number={10} title="Changes to This Privacy Policy" />
      <p className="text-sm leading-relaxed">
        We may update this Privacy Policy periodically to reflect changes in our
        business practices, legal requirements, or website functionality. The
        revised version will be posted on this page with an updated Effective
        Date. We encourage you to review this policy regularly.
      </p>

      {/* Section 11 - Contact */}
      <SectionTitle id="contact" number={11} title="Contact Us" />
      <p className="text-sm leading-relaxed mb-4">
        If you have any questions, concerns, or requests regarding this Privacy
        Policy or the way we handle your personal information, please contact
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
            <a
              href="https://drkevaldankhara.com"
              className="text-primary hover:text-primary-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://drkevaldankhara.com
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <a
              href="mailto:drkevaldakhara@gmail.com"
              className="hover:text-primary transition-colors"
            >
              drkevaldakhara@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <a
              href="tel:+919537051626"
              className="hover:text-primary transition-colors"
            >
              +91 9537051626
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>Gujarat, India</span>
          </div>
        </div>
        <p className="text-xs text-text-light pt-2">
          We will make reasonable efforts to respond to your queries as quickly
          as possible.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 p-5 rounded-xl bg-amber-50 border border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-sans text-sm font-bold text-amber-800 mb-1">
              Disclaimer
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              The information collected through this website is used solely for
              providing our services, processing orders, improving customer
              experience, and complying with applicable legal requirements. The
              content on this website is intended for general wellness and
              educational purposes only and should not be considered a substitute
              for professional medical advice, diagnosis, or treatment. Always
              consult a qualified healthcare professional for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
