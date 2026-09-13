import React from "react";
import { Link } from "react-router-dom";
import PolicyLayout from "../components/PolicyLayout";
import {
  Heart,
  Leaf,
  Shield,
  Users,
  Award,
  Target,
  Eye,
  Star,
  Globe,
  Phone,
  Mail,
  MapPin,
  Activity,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const AboutUs = ({ onAdminToggle }) => {
  const values = [
    {
      icon: Leaf,
      title: "Natural Healing",
      description:
        "We believe in the power of nature. Our formulations use carefully selected herbal ingredients rooted in classical principles.",
      color: "emerald",
    },
    {
      icon: Heart,
      title: "Holistic Approach",
      description:
        "We treat the root cause, not just symptoms. Our approach considers your complete physical, mental, and emotional wellbeing.",
      color: "rose",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Every product undergoes rigorous quality inspection before dispatch. We maintain the highest standards of hygiene and safety.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Patient-Centered Care",
      description:
        "Your wellness journey is personal. We provide personalized lifestyle counseling and ongoing support for every customer.",
      color: "purple",
    },
  ];

  const colorMap = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "bg-emerald-100 text-emerald-600",
      title: "text-emerald-800",
    },
    rose: {
      bg: "bg-rose-50",
      border: "border-rose-200",
      icon: "bg-rose-100 text-rose-600",
      title: "text-rose-800",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      title: "text-blue-800",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      title: "text-purple-800",
    },
  };

  return (
    <PolicyLayout
      title="About Us"
      subtitle="Discover the story behind Madhav Clinic — where ancient wisdom meets modern wellness, guided by a passion for natural healing."
      onAdminToggle={onAdminToggle}
    >
      {/* Mission Statement */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#2A2725] to-[#3a3330] p-8 sm:p-10 mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(204,164,124,0.4) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xs text-primary uppercase tracking-widest font-semibold font-sans">
              Our Mission
            </span>
          </div>
          <p className="font-serif text-xl sm:text-2xl text-white leading-relaxed">
            To make holistic, natural healthcare accessible to everyone by
            providing wild-crafted herbal formulations, personalized wellness
            guidance, and compassionate care — treating the root cause of
            health concerns, not just the symptoms.
          </p>
        </div>
      </div>

      {/* Who We Are */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-dark">
            Who We Are
          </h2>
        </div>
        <div className="space-y-4 text-sm text-text-light leading-relaxed">
          <p>
            <strong className="text-text-dark">Madhav Clinic</strong> is a
            wellness brand founded by{" "}
            <strong className="text-text-dark">Dr. Keval Dankhara (BHMS)</strong>
            , a dedicated practitioner committed to the philosophy of holistic
            healing. Operating from{" "}
            <strong className="text-text-dark">Madhav Clinic</strong> in Surat,
            Gujarat, Dr. Keval brings together classical homeopathic knowledge
            with carefully formulated botanical blends.
          </p>
          <p>
            Our journey began with a simple belief: that nature holds the key to
            sustainable wellness. Instead of masking symptoms, we focus on
            understanding the root causes of health concerns and providing
            natural, effective solutions through herbal formulations and
            personalized lifestyle counseling.
          </p>
          <p>
            Today, Madhav Clinic offers a curated range of herbal wellness
            products through our online store, along with video consultations
            and health seminars, making quality holistic healthcare accessible
            to people across India.
          </p>
        </div>
      </div>

      {/* Meet the Founder */}
      <div className="rounded-xl border border-primary/10 overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
              <span className="font-serif text-2xl font-bold">KD</span>
            </div>
            <div>
              <span className="text-xs text-primary uppercase tracking-widest font-semibold font-sans">
                Founder & Practitioner
              </span>
              <h3 className="font-serif text-2xl font-bold text-text-dark mt-1 mb-3">
                Dr. Keval Dankhara
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                A qualified BHMS practitioner with a deep passion for holistic
                healing, Dr. Keval Dankhara founded Madhav Clinic to bridge
                the gap between traditional wisdom and modern wellness needs. His
                approach combines homeopathic principles with herbal expertise to
                develop natural formulations that support overall wellbeing.
              </p>
              <p className="text-sm text-text-light leading-relaxed mt-3">
                Through Madhav Clinic, Dr. Keval provides personalized
                consultations, both in-person and via video, helping patients
                across India achieve better health through natural, sustainable
                approaches.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["BHMS", "Holistic Healthcare", "Herbal Formulations", "Lifestyle Counseling"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary-dark font-medium"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Star className="h-4 w-4" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-dark">
            Our Values
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value, i) => {
            const Icon = value.icon;
            const colors = colorMap[value.color];
            return (
              <div
                key={i}
                className={`p-5 rounded-xl ${colors.bg} border ${colors.border} hover:shadow-md transition-shadow`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.icon} mb-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className={`font-sans text-sm font-bold ${colors.title} mb-1.5`}
                >
                  {value.title}
                </h3>
                <p className="text-xs text-text-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-text-dark">
            What We Offer
          </h2>
        </div>
        <div className="space-y-3">
          {[
            {
              icon: Leaf,
              title: "Herbal Wellness Products",
              desc: "Carefully formulated botanical blends and herbal remedies for various wellness needs, delivered across India.",
            },
            {
              icon: Eye,
              title: "Video Consultations",
              desc: "One-on-one virtual consultations with Dr. Keval for personalized health guidance from the comfort of your home.",
            },
            {
              icon: Users,
              title: "Health Seminars",
              desc: "Educational seminars on holistic health, sleep wellness, and natural remedies to empower informed health decisions.",
            },
            {
              icon: Target,
              title: "Personalized Counseling",
              desc: "Customized lifestyle and dietary guidance based on individual health assessment and holistic principles.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-bg-cream border border-primary/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans text-sm font-bold text-text-dark mb-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-text-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Info */}
      <div className="rounded-xl bg-bg-cream border border-primary/10 p-6 sm:p-8 mb-10">
        <h2 className="font-serif text-xl font-bold text-text-dark mb-6">
          Business Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Business Name
              </span>
            </div>
            <p className="font-medium text-text-dark text-sm pl-6">
              Madhav Clinic
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Founder
              </span>
            </div>
            <p className="font-medium text-text-dark text-sm pl-6">
              Dr. Keval Dankhara (BHMS)
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Address
              </span>
            </div>
            <p className="font-medium text-text-dark text-sm pl-6">
              Shop No. 10, Opera Royal,
              <br />
              Kholvad Road, Pasodara Patiya,
              <br />
              Surat, Gujarat, India
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Website
              </span>
            </div>
            <p className="font-medium text-primary text-sm pl-6">
              <a
                href="https://drkevaldankhara.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-dark transition-colors"
              >
                https://drkevaldankhara.com
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Email
              </span>
            </div>
            <p className="font-medium text-text-dark text-sm pl-6">
              <a
                href="mailto:drkevaldakhara@gmail.com"
                className="hover:text-primary transition-colors"
              >
                drkevaldakhara@gmail.com
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-xs text-text-light uppercase tracking-wider font-semibold">
                Customer Care
              </span>
            </div>
            <p className="font-medium text-text-dark text-sm pl-6">
              <a
                href="tel:+919537051626"
                className="hover:text-primary transition-colors"
              >
                +91 9537051626
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <p className="text-sm text-text-light">
          Have questions? We'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-dark text-white px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-md"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="/#products"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 hover:border-primary text-text-dark px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
          >
            Explore Products
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default AboutUs;
