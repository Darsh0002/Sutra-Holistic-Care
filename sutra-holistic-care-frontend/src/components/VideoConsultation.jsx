import React, { useState } from 'react';
import { Video, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { bookConsultation, parseTimeSlot } from '../services/consultationService.js';

const VideoConsultation = ({ onBook }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    age: '',
    sex: 'Male',
    description: ''
  });
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [bookingId, setBookingId]   = useState(null);

  // 6 upcoming days as date options (skip Sundays)
  const getDateOptions = () => {
    const dates = [];
    const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      if (d.getDay() === 0) continue; // Skip Sundays
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

  const timeSlots = [
    '10:00 AM - 10:45 AM',
    '11:30 AM - 12:15 PM',
    '03:00 PM - 03:45 PM',
    '04:30 PM - 05:15 PM',
    '06:00 PM - 06:45 PM'
  ];

  const handleDateSelect   = (val) => { setFormData({ ...formData, date: val }); setError(''); };
  const handleTimeSelect   = (val) => { setFormData({ ...formData, timeSlot: val }); setError(''); };
  const handleInputChange  = (e)   => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleNextStep = () => {
    if (!formData.date || !formData.timeSlot) {
      setError('Please select both a date and a preferred time slot.');
      return;
    }
    setError('');
    setStep(2);
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
        patientName:       formData.name,
        email:             formData.email,
        mobile:            formData.phone,
        age:               parseInt(formData.age, 10),
        sex:               formData.sex,
        chiefComplaint:    formData.description || 'Not specified',
        consultationDate:  formData.date,
        timeSlot:          parseTimeSlot(formData.timeSlot),
      };
      const result = await bookConsultation(consultationRequest);
      setBookingId(result?.id || null);
      // Notify parent (App.jsx) — pass a UI-friendly object
      if (onBook) {
        onBook({
          id:          result?.id,
          name:        formData.name,
          email:       formData.email,
          phone:       formData.phone,
          date:        formData.date,
          timeSlot:    formData.timeSlot,
          description: formData.description,
          status:      'Pending',
          meetLink:    '',
        });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to book consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setFormData({ date: '', timeSlot: '', name: '', email: '', phone: '', age: '', sex: 'Male', description: '' });
    setStep(1);
    setSubmitted(false);
    setBookingId(null);
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
              <h3 className="font-serif text-2xl font-bold leading-tight">
                How It Works
              </h3>
              
              <ul className="mt-8 space-y-5 text-xs text-slate-300">
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">1</span>
                  <span>Select an available day and time slot.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">2</span>
                  <span>Complete the short health intake form.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold shrink-0">3</span>
                  <span>Get confirmation via WhatsApp with your video room link.</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-700/60 pt-6 space-y-4">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                <ShieldCheck className="h-4 w-4 text-primary" />
                100% HIPAA Private &amp; Secure
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Consultation fee: ₹500. Payment link will be sent with your confirmation.
              </p>
            </div>
          </div>

          {/* Right Panel: Scheduler Form */}
          <div className="md:col-span-8 p-8 lg:p-10 flex flex-col justify-center min-h-[460px]">
            {submitted ? (
              <div className="text-center py-6 animate-fade-in text-left">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-dark text-center">
                  Consultation Request Submitted!
                </h3>
                {bookingId && (
                  <p className="mt-2 text-[10px] font-mono text-slate-400 text-center">
                    Booking ID: {bookingId}
                  </p>
                )}
                <p className="mt-3 text-sm text-text-light leading-relaxed max-w-md mx-auto text-center">
                  Thank you, <strong>{formData.name}</strong>. Your slot request for{' '}
                  <strong>{dateOptions.find(d => d.value === formData.date)?.fullString}</strong> at{' '}
                  <strong>{formData.timeSlot}</strong> has been received.
                  <br /><br />
                  Dr. Keval's clinic assistant will reach out to you on <strong>{formData.phone}</strong> via WhatsApp to confirm and share the payment link.
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
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
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

                    {/* Time Slots */}
                    <div>
                      <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-3 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary-dark" />
                        2. Select Time Slot
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleTimeSelect(slot)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all duration-200 ${
                              formData.timeSlot === slot
                                ? 'bg-primary border-primary text-text-dark font-bold shadow-md'
                                : 'bg-bg-cream/40 border-primary/10 text-text-light hover:border-primary/45 hover:bg-white'
                            }`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${formData.timeSlot === slot ? 'bg-text-dark' : 'bg-slate-300'}`} />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-dark hover:text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-dark shadow-md"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                    <h4 className="text-xs font-bold tracking-wider text-text-dark uppercase font-sans mb-4 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary-dark" />
                      3. Patient Intake Details
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
                        <textarea id="patient-desc" name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="e.g. Chronic bloating for 3 months, waking up tired..." className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-2.5 pl-9 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden resize-none" />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 flex justify-between gap-4">
                      <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-primary/40 text-text-dark hover:bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-wider">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white px-6 py-3 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Booking…</>) : 'Request Appointment'}
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
