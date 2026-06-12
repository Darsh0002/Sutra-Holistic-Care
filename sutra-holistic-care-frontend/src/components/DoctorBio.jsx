import React from 'react';
import { MessageSquare, Calendar, Award, Star, Activity } from 'lucide-react';
import doctorImage from '../assets/dr-keval-dankhara.png';

const DoctorBio = ({ onBookClick }) => {
  const whatsappNumber = '919537051626';
  const whatsappMessage = encodeURIComponent("Hello Dr. Keval, I visited your website and would like to chat about scheduling a holistic health consultation.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section id="doctor" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative vectors */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-radial from-primary/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Left Column: Image with Green Foliage background (from screenshot) */}
          <div className="lg:col-span-5 flex justify-center mb-12 lg:mb-0">
            <div className="relative group">
              {/* Doctor Image */}
              <div className="relative h-[400px] w-[320px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.01] bg-white">
                <img 
                  src={doctorImage} 
                  alt="Dr. Keval Dankhara" 
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* 3+ Years Experience Badge (from screenshot) */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-bg-card border border-primary/20 shadow-xl px-6 py-2.5 rounded-2xl whitespace-nowrap flex items-center gap-2">
                <Award className="h-5 w-5 text-primary-dark" />
                <span className="font-sans font-bold text-sm text-text-dark">3+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio Details (from screenshot) */}
          <div className="lg:col-span-7 lg:pl-6 text-left">
            <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
              YOUR HOLISTIC EXPERT
            </span>
            
            {/* Title with styling matching image */}
            <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
              Dr. Keval <span className="text-primary">Dankhara</span>
            </h2>

            {/* Credentials pills */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-text-dark">
                🩺 BHMS
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-text-dark">
                📜 Homeopathic Doctor
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-text-dark">
                ❤️ Root-cause Healing
              </span>
            </div>

            {/* Bio body */}
            <div className="mt-8 space-y-6 text-base text-text-light leading-relaxed font-sans">
              <p>
                Dr. Keval Dankhara believes in treating the root cause, not just the physical symptoms. 
                With a deep blend of ancient Ayurveda, clinical Homeopathy, psychological lifestyle counseling, 
                and modern medical science, he helps patients identify deep-seated lifestyle patterns that 
                trigger chronic ailments — starting with correcting sleep hygiene.
              </p>
              <p>
                Having consulted hundreds of patients struggling with chronic stress, gut complications, 
                insomnia, and hormonal imbalances, Dr. Keval curates customized herbal remedies and 
                daily routines to trigger natural self-healing.
              </p>
            </div>

            {/* Quote block (from screenshot) */}
            <div className="mt-8 border-l-4 border-primary pl-4 py-1 italic text-text-dark font-serif text-lg">
              "Not just treatment — I help you fix your lifestyle."
            </div>

            {/* Action buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5 fill-current" />
                WhatsApp Message
              </a>
              <button
                onClick={onBookClick}
                className="flex items-center justify-center gap-2 rounded-xl bg-text-dark hover:bg-black text-white font-bold px-6 py-3.5 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Calendar className="h-5 w-5" />
                Book Appointment
              </button>
            </div>

            {/* Achievements row */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-primary/15 pt-8">
              <div>
                <span className="block font-serif text-3xl font-extrabold text-text-dark">500+</span>
                <span className="text-xs text-text-light font-medium mt-1 block">Happy Patients</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-extrabold text-text-dark">6+</span>
                <span className="text-xs text-text-light font-medium mt-1 block">Proprietary Formulas</span>
              </div>
              <div>
                <span className="block font-serif text-3xl font-extrabold text-text-dark">98%</span>
                <span className="text-xs text-text-light font-medium mt-1 block">Satisfaction Rate</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorBio;
