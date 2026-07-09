import React from "react";
import PolicyLayout from "../components/PolicyLayout";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  Truck,
  Clock,
  Package,
  CreditCard,
  MapPinned,
  Search,
  CloudRain,
  AlertTriangle,
  UserX,
  Camera,
  CheckCircle,
} from "lucide-react";

const sections = [
  { id: "processing", label: "Order Processing Time", icon: Clock },
  { id: "shipping-time", label: "Shipping Time", icon: Truck },
  { id: "delivery-partners", label: "Delivery Partners", icon: Package },
  { id: "charges", label: "Shipping Charges", icon: CreditCard },
  { id: "tracking", label: "Order Tracking", icon: Search },
  { id: "delays", label: "Delivery Delays", icon: CloudRain },
  { id: "incorrect-address", label: "Incorrect Address", icon: MapPinned },
  { id: "failed-delivery", label: "Failed Delivery", icon: UserX },
  { id: "damaged-packages", label: "Damaged Packages", icon: Camera },
  { id: "availability", label: "Delivery Availability", icon: MapPin },
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

const ShippingPolicy = ({ onAdminToggle }) => {
  return (
    <PolicyLayout
      title="Shipping Policy"
      subtitle="We are committed to delivering your order safely, efficiently, and on time. This policy outlines our order processing, shipping timelines, and delivery procedures."
      effectiveDate="July 8, 2026"
      onAdminToggle={onAdminToggle}
    >
      {/* Table of Contents */}
      <nav className="mb-10 p-5 rounded-xl bg-bg-cream border border-primary/10">
        <h3 className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 font-sans flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
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
        Thank you for shopping with{" "}
        <strong className="text-text-dark">Sutra Holistic Care</strong>. We are
        committed to delivering your order safely, efficiently, and on time.
        This Shipping Policy outlines our order processing, shipping timelines,
        and delivery procedures.
      </p>

      {/* Section 1 */}
      <SectionTitle id="processing" number={1} title="Order Processing Time" />
      <BulletList
        items={[
          <>Orders are processed within <strong className="text-text-dark">24–48 business hours</strong> after successful payment confirmation.</>,
          "Orders placed on Sundays, public holidays, or outside business hours will be processed on the next working business day.",
          "During high-demand periods, promotional campaigns, or festive seasons, order processing may require additional time.",
        ]}
      />

      {/* Section 2 */}
      <SectionTitle id="shipping-time" number={2} title="Shipping Time" />
      <p className="text-sm leading-relaxed">
        We currently ship across India. Estimated delivery timelines are:
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-primary/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary/5">
              <th className="text-left px-5 py-3 font-sans text-xs font-bold text-text-dark uppercase tracking-wider">
                Destination
              </th>
              <th className="text-left px-5 py-3 font-sans text-xs font-bold text-text-dark uppercase tracking-wider">
                Estimated Delivery
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            <tr className="hover:bg-primary/[0.02] transition-colors">
              <td className="px-5 py-3 font-medium text-text-dark">
                🏙️ Metro Cities
              </td>
              <td className="px-5 py-3 text-text-light">
                3–5 Business Days
              </td>
            </tr>
            <tr className="hover:bg-primary/[0.02] transition-colors">
              <td className="px-5 py-3 font-medium text-text-dark">
                🏘️ Other Cities &amp; Towns
              </td>
              <td className="px-5 py-3 text-text-light">
                4–7 Business Days
              </td>
            </tr>
            <tr className="hover:bg-primary/[0.02] transition-colors">
              <td className="px-5 py-3 font-medium text-text-dark">
                🌾 Remote &amp; Rural Areas
              </td>
              <td className="px-5 py-3 text-text-light">
                5–10 Business Days
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-light mt-3">
        Please note that these are estimated delivery times and may vary
        depending on your location and courier availability.
      </p>

      {/* Section 3 */}
      <SectionTitle id="delivery-partners" number={3} title="Delivery Partners" />
      <p className="text-sm leading-relaxed">
        To ensure reliable and timely delivery, we work with trusted logistics
        and courier partners:
      </p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          "Delhivery",
          "DTDC",
          "Blue Dart",
          "Xpressbees",
          "Ecom Express",
          "India Post",
        ].map((partner) => (
          <div
            key={partner}
            className="flex items-center gap-2 p-3 rounded-lg bg-bg-cream border border-primary/10 text-xs font-medium text-text-dark"
          >
            <Truck className="h-3.5 w-3.5 text-primary" />
            {partner}
          </div>
        ))}
      </div>
      <p className="text-xs text-text-light mt-3">
        The courier partner is selected based on service availability and
        delivery efficiency for your location. Other reputed courier partners
        may also be used.
      </p>

      {/* Section 4 */}
      <SectionTitle id="charges" number={4} title="Shipping Charges" />
      <BulletList
        items={[
          "Shipping charges, if applicable, will be displayed during checkout before you complete your purchase.",
          "We may offer Free Shipping on selected products, promotional offers, or orders above a specified purchase value.",
        ]}
      />

      {/* Section 5 */}
      <SectionTitle id="tracking" number={5} title="Order Tracking" />
      <p className="text-sm leading-relaxed">
        Once your order has been shipped, you will receive:
      </p>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          { icon: Mail, text: "Shipping Confirmation Email" },
          { icon: Phone, text: "SMS and/or WhatsApp notification" },
          { icon: Search, text: "Tracking ID / AWB Number" },
          { icon: Globe, text: "Tracking link for real-time monitoring" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800"
            >
              <Icon className="h-4 w-4 text-blue-600 shrink-0" />
              {item.text}
            </div>
          );
        })}
      </div>
      <p className="text-sm leading-relaxed mt-3">
        If you do not receive tracking details within 72 hours of placing your
        order, please contact our customer support team.
      </p>

      {/* Section 6 */}
      <SectionTitle id="delays" number={6} title="Delivery Delays" />
      <p className="text-sm leading-relaxed">
        While we strive to deliver every order within the estimated timeline,
        delays may occasionally occur due to circumstances beyond our control,
        including:
      </p>
      <BulletList
        items={[
          "Severe weather conditions",
          "Natural disasters",
          "Public holidays",
          "Festivals",
          "Government restrictions",
          "Transportation disruptions",
          "Courier operational delays",
          "Incorrect or incomplete shipping information",
        ]}
      />
      <p className="text-sm leading-relaxed mt-3">
        We appreciate your patience and understanding in such situations.
      </p>

      {/* Section 7 */}
      <SectionTitle id="incorrect-address" number={7} title="Incorrect or Incomplete Address Policy" />
      <p className="text-sm leading-relaxed">
        Customers are responsible for providing accurate shipping information at
        the time of placing an order.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        If an incorrect, incomplete, or invalid address is provided:
      </p>
      <BulletList
        items={[
          "Delivery may be delayed.",
          "Additional shipping charges may apply for re-dispatch.",
          "If the shipment is returned to us by the courier, we will contact you to arrange re-shipment after confirmation of the correct address.",
          "Re-shipping charges, if applicable, must be borne by the customer.",
        ]}
      />
      <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <strong>Important:</strong> Please review your shipping details
        carefully before confirming your order.
      </div>

      {/* Section 8 */}
      <SectionTitle id="failed-delivery" number={8} title="Failed Delivery Attempts" />
      <p className="text-sm leading-relaxed">
        Our courier partners generally make <strong className="text-text-dark">2–3 delivery attempts</strong>.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        If delivery cannot be completed due to customer unavailability, refusal
        to accept the parcel, or an incorrect address, the shipment may be
        returned to us.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        Any re-shipping costs arising from such situations may be charged to
        the customer.
      </p>

      {/* Section 9 */}
      <SectionTitle id="damaged-packages" number={9} title="Damaged or Tampered Packages" />
      <p className="text-sm leading-relaxed">
        If your package appears damaged, opened, or tampered with at the time of
        delivery:
      </p>
      <div className="mt-3 space-y-2">
        {[
          "Do not accept the package if possible.",
          "Take clear photographs of the package.",
          "Contact our customer support team within 24 hours of the delivery attempt.",
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-800"
          >
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            {item}
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed mt-3">
        We will review the issue and assist you in accordance with our{" "}
        <a href="/return-policy" className="text-primary hover:text-primary-dark underline underline-offset-2">
          Return Policy
        </a>
        .
      </p>

      {/* Section 10 */}
      <SectionTitle id="availability" number={10} title="Delivery Availability" />
      <p className="text-sm leading-relaxed">
        We currently deliver to most serviceable PIN codes across India.
      </p>
      <p className="text-sm leading-relaxed mt-2">
        If your location is not serviceable by our courier partners, we will
        notify you promptly and initiate a refund if your order cannot be
        fulfilled.
      </p>

      {/* Section 11 - Contact */}
      <SectionTitle id="contact" number={11} title="Contact Us" />
      <p className="text-sm leading-relaxed mb-4">
        For any shipping-related questions or assistance, please contact us:
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
          Our customer support team will be happy to assist you during our
          business hours.
        </p>
      </div>

      {/* Policy Updates */}
      <div className="mt-10 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Policy Updates:</strong> Sutra
        Holistic Care reserves the right to modify this Shipping Policy at any
        time without prior notice. Any changes will be posted on this page with
        the updated effective date.
      </div>
    </PolicyLayout>
  );
};

export default ShippingPolicy;
