import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Video, User, Phone, Mail, Award,
  CheckCircle, Loader2, AlertCircle, Users,
  ChevronRight, X, Shield, Sparkles
} from 'lucide-react';
import { getUpcomingSeminars, registerForSeminar } from '../services/seminarService.js';

// ── helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return 'Coming Soon';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};
const formatDateShort = (dateStr) => {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (timeStr) => {
  if (!timeStr) return 'TBA';
  const [h, m] = (timeStr || '').split(':');
  const hours = parseInt(h, 10);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${display}:${m || '00'} ${suffix} IST`;
};

const emptyForm = () => ({ name: '', age: '', sex: 'Male', mobile: '', email: '' });

// ─────────────────────────────────────────────────────────────────────────────
//  Main Component
// ─────────────────────────────────────────────────────────────────────────────

const SeminarRegister = ({ onRegister }) => {
  const [seminars, setSeminars]               = useState([]);
  const [loadingSeminars, setLoadingSeminars] = useState(true);

  // Modal state
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [formData, setFormData]               = useState(emptyForm());
  const [step, setStep]                       = useState('form'); // 'form' | 'processing' | 'success'
  const [formError, setFormError]             = useState('');

  useEffect(() => {
    getUpcomingSeminars()
      .then(data => { if (data?.length) setSeminars(data); })
      .catch(() => {})
      .finally(() => setLoadingSeminars(false));
  }, []);

  const openModal = (seminar) => {
    setSelectedSeminar(seminar);
    setFormData(emptyForm());
    setFormError('');
    setStep('form');
  };
  const closeModal = () => {
    if (step === 'processing') return;
    setSelectedSeminar(null);
    setStep('form');
    setFormError('');
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.age) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStep('processing');

    try {
      await registerForSeminar({
        name:      formData.name.trim(),
        age:       parseInt(formData.age, 10),
        sex:       formData.sex,
        mobile:    formData.mobile.trim(),
        email:     formData.email.trim(),
        seminarId: selectedSeminar.id,
      });

      if (onRegister) onRegister({ name: formData.name, email: formData.email });
      setStep('success');
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
      setStep('form');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section id="seminars" className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
            LEARN FROM THE EXPERT
          </span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            Live Health Seminars
          </h2>
          <p className="mt-4 text-base text-text-light max-w-xl mx-auto">
            Join Dr. Keval Dankhara's upcoming online webinars. Discover root-cause healing,
            ask questions live, and start your holistic health journey.
          </p>
          {/* Free badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-5 py-2 text-sm font-bold text-emerald-700">
            <CheckCircle className="h-4 w-4" /> All seminars are 100% Free to attend
          </div>
        </div>

        {/* ── Seminar Cards ──────────────────────────────────────────────────── */}
        {loadingSeminars ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-9 w-9 animate-spin text-primary-dark" />
            <p className="text-sm text-text-light">Loading upcoming seminars…</p>
          </div>
        ) : seminars.length === 0 ? (
          <NoSeminarsState />
        ) : (
          <div className={`grid gap-6 ${
            seminars.length === 1
              ? 'max-w-md mx-auto'
              : seminars.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {seminars.map(seminar => (
              <SeminarCard
                key={seminar.id}
                seminar={seminar}
                onRegister={() => openModal(seminar)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Registration Modal ──────────────────────────────────────────────────── */}
      {selectedSeminar && (
        <RegistrationModal
          seminar={selectedSeminar}
          formData={formData}
          step={step}
          formError={formError}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
          onRegisterAnother={() => {
            setStep('form');
            setFormData(emptyForm());
            setFormError('');
          }}
        />
      )}
    </section>
  );
};

// ── Seminar Card ──────────────────────────────────────────────────────────────

const SeminarCard = ({ seminar, onRegister }) => {
  const seatsLeft = seminar.totalSeats
    ? Math.max(0, seminar.totalSeats - (seminar.bookedSeats || 0))
    : null;
  const isFull = seatsLeft !== null && seatsLeft === 0;

  return (
    <div className="flex flex-col rounded-3xl border border-primary/15 bg-bg-cream p-7 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 group">
      {/* Badge row */}
      <div className="flex items-center justify-between mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
          ● Live Webinar
        </span>
        {seatsLeft !== null && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            isFull
              ? 'bg-red-50 text-red-700 border-red-200'
              : seatsLeft <= 10
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-slate-50 text-slate-500 border-slate-200'
          }`}>
            {isFull ? 'Full' : `${seatsLeft} seats left`}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-extrabold text-text-dark leading-snug mb-5 flex-1">
        {seminar.topic}
      </h3>

      {/* Details */}
      <div className="space-y-2.5 mb-6">
        <DetailRow icon={Calendar} label={formatDateShort(seminar.date)} />
        <DetailRow icon={Clock}    label={formatTime(seminar.time)} />
        <DetailRow icon={Video}    label={`${seminar.language || 'Hindi / Gujarati'} · Online`} />
        {seminar.totalSeats && (
          <DetailRow icon={Users}  label={`${seminar.totalSeats} total seats`} />
        )}
      </div>

      {/* Free badge + CTA */}
      <div className="flex items-center justify-between pt-5 border-t border-primary/15">
        <div>
          <p className="text-[10px] text-text-light uppercase tracking-wider font-semibold">Admission</p>
          <p className="text-lg font-extrabold font-serif text-emerald-700">Free</p>
        </div>
        <button
          onClick={onRegister}
          disabled={isFull}
          className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-text-dark hover:text-white font-bold px-5 py-2.5 text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
        >
          {isFull ? 'Sold Out' : 'Register Now'}
          {!isFull && <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 text-xs text-text-light">
    <Icon className="h-4 w-4 text-primary-dark shrink-0" />
    <span className="font-medium">{label}</span>
  </div>
);

// ── Registration Modal ────────────────────────────────────────────────────────

const RegistrationModal = ({ seminar, formData, step, formError, onChange, onSubmit, onClose, onRegisterAnother }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-primary/15 max-h-[95vh] flex flex-col">

      {/* Gradient top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-dark to-primary shrink-0" />

      {/* Header */}
      <div className="px-7 pt-6 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold tracking-widest text-primary-dark uppercase">
              {step === 'success' ? 'Booking Confirmed' : 'Reserve Your Spot — Free'}
            </span>
            <h3 className="font-serif text-lg font-bold text-text-dark mt-0.5 leading-snug line-clamp-2">
              {seminar.topic}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              <span className="text-[11px] text-text-light flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary-dark" /> {formatDate(seminar.date)}
              </span>
              <span className="text-[11px] text-text-light flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary-dark" /> {formatTime(seminar.time)}
              </span>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:bg-slate-100 shrink-0 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-7 py-6">

        {/* ── SUCCESS STATE ── */}
        {step === 'success' && (
          <div className="text-center py-4 animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-text-dark mb-2">You're Registered!</h4>
            <p className="text-sm text-text-light leading-relaxed max-w-xs mx-auto mb-6">
              Your seat has been reserved. The webinar link will be sent to <strong>{formData.email}</strong> before the event.
            </p>
            <div className="bg-bg-cream rounded-2xl p-4 text-xs text-text-light space-y-1.5 mb-4 text-left">
              <p className="font-bold text-text-dark uppercase tracking-wider text-[10px] mb-2">Session Details</p>
              <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary-dark" />{formatDate(seminar.date)}</p>
              <p className="flex items-center gap-2"><Clock    className="h-3.5 w-3.5 text-primary-dark" />{formatTime(seminar.time)}</p>
              <p className="flex items-center gap-2"><Video    className="h-3.5 w-3.5 text-primary-dark" />{seminar.language || 'Hindi / Gujarati'} &middot; Online</p>
            </div>

            {/* Join Link block */}
            {seminar.seminarLink ? (
              <div className="mb-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-left space-y-3">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Your Join Link</p>
                <a
                  href={seminar.seminarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Video className="h-4 w-4" /> Join Seminar
                </a>
                {/* WhatsApp share with link */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`I just registered for the seminar *"${seminar.topic}"* by Dr. Keval Dankhara (Sutra Holistic Care)!\n\n\uD83D\uDCC5 ${formatDate(seminar.date)} at ${formatTime(seminar.time)}\n\uD83C\uDFA5 Join here: ${seminar.seminarLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 text-sm uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Share on WhatsApp
                </a>
              </div>
            ) : (
              <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 font-semibold text-center">
                The join link will be shared with you before the event.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onRegisterAnother}
                className="flex-1 rounded-xl border border-slate-200 hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider text-text-light transition-colors"
              >
                Register Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-primary hover:bg-primary-dark text-text-dark hover:text-white py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING STATE ── */}
        {step === 'processing' && (
          <div className="text-center py-10 animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 mb-5">
              <Loader2 className="h-10 w-10 animate-spin text-primary-dark" />
            </div>
            <h4 className="font-serif text-lg font-bold text-text-dark mb-2">Processing…</h4>
            <p className="text-sm text-text-light">Confirming your registration…</p>
          </div>
        )}

        {/* ── FORM STATE ── */}
        {step === 'form' && (
          <form id="seminar-reg-form" onSubmit={onSubmit} className="space-y-4">

            {/* Free notice */}
            <div className="rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle className="h-4 w-4 shrink-0" />
              This seminar is <strong>completely free</strong>. Fill your details to confirm your seat.
            </div>

            {/* Error */}
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl px-4 py-3 text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-name" name="name" type="text"
                  value={formData.name} onChange={onChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/50 pl-10 pr-4 py-3 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-email" name="email" type="email"
                  value={formData.email} onChange={onChange}
                  placeholder="e.g. rahul@example.com"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/50 pl-10 pr-4 py-3 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="reg-mobile" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                WhatsApp / Mobile *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="reg-mobile" name="mobile" type="tel"
                  value={formData.mobile} onChange={onChange}
                  placeholder="10-digit mobile number"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/50 pl-10 pr-4 py-3 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Age + Sex */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-age" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Age *
                </label>
                <input
                  id="reg-age" name="age" type="number"
                  value={formData.age} onChange={onChange}
                  placeholder="e.g. 34" min="1" max="120"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/50 px-4 py-3 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="reg-sex" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                  Sex *
                </label>
                <select
                  id="reg-sex" name="sex"
                  value={formData.sex} onChange={onChange}
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/50 px-4 py-3 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-none transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex items-center justify-center gap-4 pt-1 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Secure &amp; Private</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Instant Confirmation</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> 100% Free</span>
            </div>
          </form>
        )}
      </div>

      {/* Footer CTA — only shown in form state */}
      {step === 'form' && (
        <div className="px-7 pb-6 pt-4 border-t border-slate-100 shrink-0">
          <button
            type="submit"
            form="seminar-reg-form"
            className="w-full rounded-xl bg-primary hover:bg-primary-dark text-text-dark hover:text-white font-bold py-4 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" /> Confirm Free Registration
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3">
            By registering you agree to our terms. The webinar link will be sent to your email.
          </p>
        </div>
      )}
    </div>
  </div>
);

// ── No seminars empty state ───────────────────────────────────────────────────

const NoSeminarsState = () => (
  <div className="text-center py-20">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-5">
      <Calendar className="h-8 w-8 text-primary-dark" />
    </div>
    <h3 className="font-serif text-xl font-bold text-text-dark mb-2">No Upcoming Seminars</h3>
    <p className="text-sm text-text-light max-w-sm mx-auto mb-7">
      Dr. Keval hasn't scheduled any sessions yet. Check out Later.
    </p>
  </div>
);

export default SeminarRegister;
