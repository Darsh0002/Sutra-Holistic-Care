import React from 'react';
import { MessageCircle, Info, Sparkles, Shield, Heart } from 'lucide-react';

const Hero = ({ onOpenIngredients }) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-bg-cream pt-10 pb-16 sm:pb-24 lg:pt-16 lg:pb-32">
      {/* Background graphic elements */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-radial from-primary/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-radial from-primary/5 to-transparent blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-dark">
              <Sparkles className="h-3 w-3" />
              Trusted by 1000+ people
            </div>
            
            <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl block leading-tight">
              Sleep is not a luxury.
              <span className="block text-primary mt-2">It's your foundation.</span>
            </h1>
            
            <p className="mt-6 text-base text-text-light sm:text-lg md:text-xl leading-relaxed max-w-xl">
              A natural Ayurvedic sleep solution — no dependency, no side effects.
              Just deep, restful sleep every night, formulated using time-tested herbs for holistic wellness.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
              <a
                href="https://wa.me/919537051626?text=Hi%20Dr.%20Keval,%20I'm%20interested%20in%20getting%20a%20Trial%20Pack%20of%20Sleep%20Sutra."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark hover:text-white px-6 py-4 text-sm font-bold tracking-wide uppercase text-text-dark shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                Get Trial Pack @ 50% OFF
              </a>
              <button
                onClick={onOpenIngredients}
                className="mt-3 sm:mt-0 flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-white/40 hover:bg-white px-6 py-4 text-sm font-semibold text-text-dark shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1"
              >
                <Info className="h-5 w-5" />
                See Ingredients
              </button>
            </div>

            {/* Badges footer */}
            <div className="mt-12 grid grid-cols-3 gap-3 border-t border-primary/20 pt-8 max-w-lg sm:mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-text-dark text-left">100% Ayurvedic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-text-dark text-left">No Chemicals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-text-dark text-left">Doctor Formulated</span>
              </div>
            </div>
          </div>

          {/* Right Product Image Mockup Column */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl bg-radial from-primary/10 to-transparent p-6 transition-all duration-500 hover:scale-[1.02]">
              {/* Card Container mimicking second image style */}
              <div className="h-full w-full rounded-2xl bg-amber-50/70 border border-primary/10 shadow-2xl p-8 flex flex-col justify-between items-center relative overflow-hidden">
                {/* Decorative foliage SVGs */}
                <div className="absolute top-2 left-2 opacity-20 pointer-events-none">
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 90C40 70 50 40 80 10C70 40 50 70 10 90Z" fill="#CCA47C" />
                    <path d="M30 80C50 65 60 45 80 25C65 45 50 65 30 80Z" fill="#A47F5C" />
                  </svg>
                </div>
                
                {/* Background lighting */}
                <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-xl pointer-events-none" />

                {/* Rating badge */}
                <div className="self-end bg-white/80 border border-primary/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider text-primary-dark uppercase flex items-center gap-1">
                  <span>★</span> Best Seller
                </div>

                {/* Simulated Glass/Aesthetic Jar mockup */}
                <div className="relative my-6 group">
                  {/* Jar body */}
                  <div className="h-56 w-36 rounded-2xl bg-linear-to-b from-amber-950 via-amber-900 to-amber-950 shadow-2xl border-x border-amber-800 flex flex-col items-center justify-between py-6 px-3 relative overflow-hidden">
                    {/* Gloss shine */}
                    <div className="absolute inset-y-0 left-3 w-4 bg-linear-to-r from-white/10 to-transparent blur-[1px]" />
                    
                    {/* Metal Cap */}
                    <div className="absolute -top-1 h-4 w-[110%] bg-linear-to-r from-amber-600 via-amber-400 to-amber-600 rounded-md shadow-md border-b border-amber-700" />
                    
                    {/* Jar Label */}
                    <div className="w-full bg-[#1A1513] border-y border-amber-600/30 p-2.5 rounded-sm flex flex-col items-center text-center z-10">
                      <div className="h-4 w-4 rounded-full border border-amber-500/50 flex items-center justify-center text-[7px] text-amber-500 font-serif">
                        S
                      </div>
                      <span className="text-[6px] tracking-widest text-amber-500/80 font-sans uppercase font-bold mt-1">
                        PREMIUM
                      </span>
                      <h4 className="font-serif text-amber-100 font-bold text-xs tracking-wider uppercase mt-0.5 leading-none">
                        SLEEP SUTRA
                      </h4>
                      <p className="text-[5px] text-amber-400/70 font-serif tracking-widest mt-1 italic">
                        Premium Ayurvedic Sleep Powder
                      </p>
                    </div>

                    <div className="w-full flex justify-between px-2 text-[5px] text-amber-200/50 tracking-wider">
                      <span>100% ORGANIC</span>
                      <span>150G</span>
                    </div>
                  </div>
                  
                  {/* Floating ingredients decor items surrounding jar */}
                  <div className="absolute -bottom-4 -left-6 bg-white/95 rounded-xl border border-primary/10 p-2 shadow-lg flex items-center gap-1.5 text-left transform -rotate-6 animate-pulse">
                    <span className="text-base">🌾</span>
                    <div>
                      <h5 className="text-[8px] font-bold text-text-dark leading-none">Cardamom</h5>
                      <span className="text-[6px] text-text-light">Deep Sleep</span>
                    </div>
                  </div>
                  <div className="absolute -right-4 top-8 bg-white/95 rounded-xl border border-primary/10 p-2 shadow-lg flex items-center gap-1.5 text-left transform rotate-12">
                    <span className="text-base">🌿</span>
                    <div>
                      <h5 className="text-[8px] font-bold text-text-dark leading-none">Ashwagandha</h5>
                      <span className="text-[6px] text-text-light">Stress Relief</span>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Doctor branding */}
                <div className="text-center z-10 mt-2">
                  <p className="text-[9px] tracking-widest text-primary-dark font-bold uppercase leading-none">
                    SUTRA HOLISTIC FORMULAS
                  </p>
                  <p className="text-[8px] text-text-light font-sans mt-1">
                    Carefully blended by Dr. Keval Dankhara
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
