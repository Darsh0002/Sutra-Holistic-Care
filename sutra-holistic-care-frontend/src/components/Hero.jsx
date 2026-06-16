import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, BookOpen, Sparkles, Shield, Heart, ChevronRight, Star, Truck } from 'lucide-react';

// Rotating conditions the brand addresses
const HEADLINES = [
  { problem: "Can't sleep?",         solution: "We heal your root cause.",  emoji: "🌙" },
  { problem: "Chronic acidity?",     solution: "Natural solution has the answer.",  emoji: "🔥" },
  { problem: "Joint pain daily?",    solution: "Nature relieves it gently.", emoji: "🦴" },
  { problem: "Hormonal imbalance?",  solution: "Balance from within.",       emoji: "⚖️" },
  { problem: "Bloating & gas?",      solution: "Your gut can heal.",         emoji: "💚" },
  { problem: "Low energy & stress?", solution: "Reclaim your vitality.",     emoji: "⚡" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  // Rotate headline every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(i => (i + 1) % HEADLINES.length);
        setFading(false);
      }, 350);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const { problem, solution, emoji } = HEADLINES[current];

  return (
    <section id="hero" className="relative overflow-hidden bg-bg-cream pt-10 pb-16 sm:pb-24 lg:pt-16 lg:pb-32">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -z-10 h-[700px] w-[700px] rounded-full bg-radial from-primary/12 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-radial from-primary/6 to-transparent blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">

          {/* ── LEFT TEXT COLUMN ── */}
          <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-7 lg:text-left">

            {/* Trust badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-dark">
              <Sparkles className="h-3 w-3" />
              Trusted by 1000+ patients across India
            </div>

            {/* Rotating problem / solution headline */}
            <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-tight">
              <span
                className="block transition-all duration-350"
                style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)' }}
              >
                <span className="mr-2">{emoji}</span>{problem}
              </span>
              <span className="block text-primary mt-2 transition-all duration-350"
                style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)', transitionDelay: '50ms' }}
              >
                {solution}
              </span>
            </h1>

            {/* Brand promise */}
            <p className="mt-6 text-base text-text-light sm:text-lg leading-relaxed max-w-xl">
              <strong className="text-text-dark">Sutra Holistic Care</strong> — founded by Dr. Keval Dankhara — blends
              classical herbal medicines, botanical blend &amp; lifestyle medicine to treat the <em>root cause</em>, not just symptoms.
            </p>

            {/* Dot indicators for headline */}
            <div className="mt-5 flex gap-1.5 sm:justify-center lg:justify-start">
              {HEADLINES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 300); }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary-dark' : 'w-1.5 bg-primary/30'}`}
                  aria-label={`Condition ${i + 1}`}
                />
              ))}
            </div>

            {/* ── CTA BUTTONS ── */}
            <div className="mt-10 flex flex-wrap sm:justify-center lg:justify-start gap-3">
              {/* Primary: WhatsApp */}
              <a
                href="https://wa.me/919537051626?text=Hi%20Dr.%20Keval%2C%20I%20visited%20Sutra%20Holistic%20Care%20and%20would%20like%20to%20know%20more%20about%20your%20remedies."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-dark hover:text-white px-6 py-3.5 text-sm font-bold tracking-wide uppercase text-text-dark shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircle className="h-4 w-4 fill-current" />
                Talk to Doctor — Free
              </a>

              {/* Secondary: Book Consultation */}
              <a
                href="#consultation"
                onClick={e => { e.preventDefault(); document.querySelector('#consultation')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-white/60 hover:bg-white px-6 py-3.5 text-sm font-semibold text-text-dark shadow-sm transition-all duration-300 hover:-translate-y-1"
              >
                <Calendar className="h-4 w-4" />
                Book Consultation
              </a>

              {/* Tertiary: Seminars */}
              <a
                href="#seminars"
                onClick={e => { e.preventDefault(); document.querySelector('#seminars')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="flex items-center justify-center gap-2 rounded-lg border border-indigo-300/60 bg-indigo-50/60 hover:bg-indigo-50 px-6 py-3.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-300 hover:-translate-y-1"
              >
                <BookOpen className="h-4 w-4" />
                Free Health Seminar
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-primary/20 pt-8 max-w-lg sm:mx-auto lg:mx-0">
              {[
                { icon: Shield,   text: '100% Plant-based solution' },
                { icon: Sparkles, text: 'No Chemicals'    },
                { icon: Heart,    text: 'Doctor Crafted'  },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary-dark shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold text-text-dark text-left">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT VISUAL COLUMN ── */}
          <div className="mt-14 sm:mt-16 lg:mt-0 lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">

              {/* Main card */}
              <div className="relative rounded-3xl bg-linear-to-br from-amber-50 to-white border border-primary/15 shadow-2xl p-8 overflow-hidden">

                {/* Decorative leaf */}
                <div className="absolute top-3 right-3 opacity-10 pointer-events-none select-none text-[80px]">🌿</div>

                {/* Header */}
                <div className="relative z-10">
                  <span className="inline-block text-[10px] font-bold tracking-widest text-primary-dark uppercase bg-primary/10 px-3 py-1 rounded-full">
                    Sutra Holistic Care
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-extrabold text-text-dark leading-snug">
                    One clinic.<br />All-natural<br />Herbal support.
                  </h3>
                  <p className="mt-2 text-xs text-text-light leading-relaxed">
                    Dr. Keval Dankhara, BHMS — since 2024.
                  </p>
                </div>

                {/* Condition pills — the 6 Sutra products */}
                <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                  {[
                    { label: 'Sleep',     emoji: '🌙', color: 'bg-indigo-50 border-indigo-200 text-indigo-700'   },
                    { label: 'Gut',       emoji: '🌿', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                    { label: 'Gas',       emoji: '💨', color: 'bg-sky-50 border-sky-200 text-sky-700'             },
                    { label: 'Acidity',   emoji: '❄️', color: 'bg-cyan-50 border-cyan-200 text-cyan-700'          },
                    { label: 'Pain',      emoji: '🦴', color: 'bg-orange-50 border-orange-200 text-orange-700'    },
                    { label: 'Hormones',  emoji: '⚖️', color: 'bg-purple-50 border-purple-200 text-purple-700'   },
                  ].map(({ label, emoji, color }) => (
                    <span key={label} className={`inline-flex items-center gap-1 text-[11px] font-bold border rounded-full px-3 py-1 ${color}`}>
                      {emoji} {label}
                    </span>
                  ))}
                </div>

                {/* Offerings row */}
                <div className="mt-6 space-y-2.5 relative z-10">
                  {[
                    { icon: '📦', label: 'Herbal Sutra Remedies',    sub: 'Pan-India delivery' },
                    { icon: '🎥', label: 'Online Video Consultation', sub: 'Get Curated Treatment Plans Remotely' },
                    { icon: '🎓', label: 'Free Health Seminars',      sub: 'Hindi & Gujarati'   },
                  ].map(({ icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-3 bg-white/70 border border-slate-100 rounded-xl px-3.5 py-2.5">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-text-dark leading-none">{label}</p>
                        <p className="text-[10px] text-text-light mt-0.5">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Star rating */}
                <div className="mt-5 flex items-center gap-2 relative z-10">
                  <div className="flex text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <span className="text-[11px] font-semibold text-text-dark">4.9 · 500+ reviews</span>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-3 -right-3 bg-primary text-text-dark text-[10px] font-extrabold uppercase tracking-wider rounded-full px-3 py-1.5 shadow-lg border border-white">
                ✦ All Natural
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
