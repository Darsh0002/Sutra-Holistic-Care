import React, { useState } from 'react';
import { Video, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sun, Sunset } from 'lucide-react';
import { bookConsultation } from '../services/consultationService.js';
import { loadRazorpayScript, openRazorpayCheckout, verifyPayment } from '../services/orderService.js';
import { api } from '../services/api.js';

const SESSIONS = [
  {
    id: 'morning',
    label: 'Morning Session',
    time: '9:00 AM – 1:00 PM',
    icon: Sun,
    gradient: 'from-amber-50 to-yellow-50',
    borderActive: 'border-amber-400',
    dot: 'bg-amber-400',
    startTime: '09:00',   // sent to backend as the representative slot
  },
  {
    id: 'evening',
    label: 'Evening Session',
    time: '4:00 PM – 8:00 PM',
    icon: Sunset,
    gradient: 'from-indigo-50 to-purple-50',
    borderActive: 'border-indigo-400',
    dot: 'bg-indigo-400',
    startTime: '16:00',
  }
];

const VideoConsultation = ({ onBook }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    session: null,    // one of the SESSIONS objects
    name: '',
    email: '',
    phone: '',
    age: '',
    sex: 'Male',
    description: ''
  });
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [bookingId, setBookingId]     = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // 6 upcoming days (skip Sundays)
  const getDateOptions = () => {
    const dates = [];
    const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 1; i <= 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() === 0) continue;
      if (dates.length >= 6) break;
      dates.push({
        value: d.toISOString().split('T')[0],
        dayName: days[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()],
        fullString: `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
      });
    }
    return dates;
  };

  const handleDateSelect    = (val) => { setFormData({ ...formData, date: val }); setError(''); };
  const handleSessionSelect = (s)   => { setFormData({ ...formData, session: s }); setError(''); };
  const handleInputChange   = (e)   => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleNextStep = () => {
    if (!formData.date || !formData.session) {
      setError('Please select both a date and a session time.');
      return;
    }
    setError('');
    setStep(2);
  };

  // ── Razorpay payment flow ──────────────────────────────────────────────────
  const handleRazorpayPayment = async (consultationId) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Could not load payment gateway. Please try again.');

    // Create payment order on backend
    const paymentOrder = await api.post(`/user/payments/consultation/${consultationId}`);

    // Open Razorpay checkout
    const paymentResult = await openRazorpayCheckout(paymentOrder, {
      name:   formData.name,
      email:  formData.email,
      mobile: formData.phone,
    });

    // Verify signature
    await verifyPayment(paymentResult);
    setPaymentDone(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.phone || !formData.age) {
      setError('Please fill in all required contact details.');
      return;
    }
    setLoading(true);
    try {
      const consultationRequest = {
        patientName:      formData.name,
        email:            formData.email,
        mobile:           formData.phone,
        age:              parseInt(formData.age, 10),
        sex:              formData.sex,
        chiefComplaint:   formData.description || 'Not specified',
        consultationDate: formData.date,
        timeSlot:         formData.session.startTime,
      };

      const result = await bookConsultation(consultationRequest);
      const cId = result?.id;
      setBookingId(cId);

      // Trigger Razorpay payment
      if (cId) {
        await handleRazorpayPayment(cId);
      }

      if (onBook) {
        onBook({
          id:        cId,
          name:      formData.name,
          email:     formData.email,
          phone:     formData.phone,
          date:      formData.date,
          timeSlot:  formData.session.time,
          description: formData.description,
          status:    'Pending',
          meetLink:  '',
        });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setFormData({ date: '', session: null, name: '', email: '', phone: '', age: '', sex: 'Male', description: '' });
    setStep(1);
    setSubmitted(false);
    setBookingId(null);
    setPaymentDone(false);
  };

  const dateOptions = getDateOptions();

  return (
    <section id="consultation" className="py-20 bg-bg-cream relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
            VIRTUAL CLINIC
          </span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            Online Video Consultation
          </h2>
          <p className="mt-4 text-base text-text-light max-w-xl mx-auto">
            Book a private video consultation session with Dr. Keval Dankhara. Get a comprehensive
            root-cause assessment and a custom digital prescription from your home.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-primary/10 shadow-xl overflow-hidden md:grid md:grid-cols-12">

          {/* Left Panel: Info Banner */}
          <div className="md:col-span-4 bg-linear-to-b from-[#2A2725] to-[#1A1817] p-8 text-white flex flex-col justify-between text-left">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/25 text-primary mb-6">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-white text-2xl font-bold leading-tight">
                How It Works
              </h3>

              <ul className="mt-8 space-y-5 text-xs text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">1</span>
                  <span>Select a date and preferred session — Morning or Evening.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">2</span>
                  <span>Fill in your health intake form with a brief chief complaint.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">3</span>
                  <span>Receive your video room link via WhatsApp or call before your session time.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-700/60 pt-6 space-y-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                <ShieldCheck className="h-4 w-4 text-primary" />
                100% Private &amp; Secure
              </div>
            </div>
          </div>

          {/* Right Panel: Scheduler Form */}
          <div className="md:col-span-8 p-8 lg:p-10 flex flex-col justify-center min-h-[500px]">
            {submitted ? (
              <div className="text-center py-6 animate-fade-in text-left">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-dark text-center">
                  {paymentDone ? 'Booking Confirmed & Paid!' : 'Consultation Request Submitted!'}
                </h3>
                {bookingId && (
                  <p className="mt-2 text-[10px] font-mono text-slate-400 text-center">
                    Booking ID: {bookingId}
                  </p>
                )}
                {paymentDone && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-emerald-200 mx-auto">
                    <CheckCircle className="h-3.5 w-3.5" /> Payment of ₹ 100 received
                  </div>
                )}
                <p className="mt-4 text-sm text-text-light leading-relaxed max-w-md mx-auto text-center">
                  Thank you, <strong>{formData.name}</strong>. Your{' '}
                  <strong>{formData.session?.label}</strong> slot on{' '}
                  <strong>{dateOptions.find(d => d.value === formData.date)?.fullString}</strong> has been booked.
                  <br /><br />
                  Dr. Keval's assistant will reach out to <strong>{formData.phone}</strong> via WhatsApp with your video room link before your session.
                </p>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={resetBooking}
                    className="rounded-lg bg-text-dark hover:bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Book Another Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-left">
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-6">
                  <span className={`h-2.5 w-8 rounded-full transition-colors duration-300 ${step === 1 ? 'bg-primary' : 'bg-slate-200'}`} />
                  <span className={`h-2.5 w-8 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-primary' : 'bg-slate-200'}`} />
                  <span className="text-xs text-text-light font-bold ml-2">Step {step} of 2</span>
                </div>

                {step === 1 ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Date Picker */}
                    <div>
                      <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-3 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary-dark" />
                        1. Select Preferred Date
                      </h4>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {dateOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleDateSelect(opt.value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              formData.date === opt.value
                                ? 'bg-primary border-primary text-text-dark font-bold shadow-md'
                                : 'bg-bg-cream/40 border-primary/10 text-text-light hover:border-primary/45 hover:bg-white'
                            }`}
                          >
                            <span className="text-[10px] tracking-wider uppercase font-semibold block leading-none mb-1 opacity-70">{opt.dayName}</span>
                            <span className="text-lg font-serif font-extrabold leading-none block">{opt.dayNum}</span>
                            <span className="text-[9px] font-sans tracking-wide block mt-1 opacity-70">{opt.month}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Session Selector */}
                    <div>
                      <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-3 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary-dark" />
                        2. Choose Your Session
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SESSIONS.map((s) => {
                          const Icon = s.icon;
                          const isSelected = formData.session?.id === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleSessionSelect(s)}
                              className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                                isSelected
                                  ? `${s.borderActive} bg-white shadow-lg scale-[1.02]`
                                  : 'border-primary/10 bg-bg-cream/40 hover:border-primary/30 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                </span>
                              )}
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${isSelected ? 'bg-primary/20' : 'bg-slate-100'}`}>
                                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary-dark' : 'text-slate-400'}`} />
                              </div>
                              <span className={`text-sm font-bold block ${isSelected ? 'text-text-dark' : 'text-text-light'}`}>
                                {s.label}
                              </span>
                              <span className={`text-xs font-semibold mt-0.5 ${isSelected ? 'text-primary-dark' : 'text-slate-400'}`}>
                                {s.time}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fee notice */}
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
                      <span className="text-amber-500 text-lg font-bold">₹</span>
                      <div>
                        <p className="text-xs font-bold text-amber-800">Booking Fee: ₹ 100</p>
                        <p className="text-[10px] text-amber-600">Pay in the next step. Secure & Instant.</p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark hover:text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-dark shadow-md transition-all duration-200"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                    {/* Selected slot summary */}
                    <div className="flex items-center gap-3 bg-primary/10 rounded-xl px-4 py-2.5 mb-2">
                      <Calendar className="h-4 w-4 text-primary-dark shrink-0" />
                      <span className="text-xs font-semibold text-text-dark">
                        {dateOptions.find(d => d.value === formData.date)?.fullString}
                        {formData.session && (
                          <span className="ml-2 text-primary-dark">• {formData.session.label} ({formData.session.time})</span>
                        )}
                      </span>
                      <button type="button" onClick={() => setStep(1)} className="ml-auto text-[10px] text-primary-dark underline font-bold">Change</button>
                    </div>

                    <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-4 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary-dark" />
                      Patient Intake Details
                    </h4>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="patient-name" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">Full Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><User className="h-3.5 w-3.5" /></div>
                        <input type="text" id="patient-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Priyasheel Patel" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-9 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label htmlFor="patient-email" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">Email Address *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><Mail className="h-3.5 w-3.5" /></div>
                          <input type="email" id="patient-email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. priya@example.com" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-9 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                        </div>
                      </div>
                      {/* Phone */}
                      <div>
                        <label htmlFor="patient-phone" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">WhatsApp Phone *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light/50"><Phone className="h-3.5 w-3.5" /></div>
                          <input type="tel" id="patient-phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +91 95370 51626" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-9 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Age */}
                      <div>
                        <label htmlFor="patient-age" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">Age *</label>
                        <input type="number" id="patient-age" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g. 35" min="1" max="120" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                      </div>
                      {/* Sex */}
                      <div>
                        <label htmlFor="patient-sex" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">Sex *</label>
                        <select id="patient-sex" name="sex" value={formData.sex} onChange={handleInputChange} className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                      <label htmlFor="patient-desc" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1">Describe Your Health Symptoms / Main Issue</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none text-text-light/50"><FileText className="h-3.5 w-3.5" /></div>
                        <textarea id="patient-desc" name="description" rows="2" value={formData.description} onChange={handleInputChange} placeholder="e.g. Chronic bloating for 3 months, waking up tired..." className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-9 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden resize-none" />
                      </div>
                    </div>

                    {/* Pay & Confirm notice */}
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Secure payment of ₹ 100</p>
                        <p className="text-[10px] text-emerald-600">Clicking below will book your slot and open the payment window.</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex justify-between gap-4">
                      <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-primary/40 text-text-dark hover:bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-wider">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white px-6 py-3 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Processing…</>) : 'Book & Pay ₹ 100'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoConsultation;
