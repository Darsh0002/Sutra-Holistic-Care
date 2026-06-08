import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, Phone, Mail, Award, CheckCircle, HelpCircle, Loader2, AlertCircle, Users } from 'lucide-react';
import { getUpcomingSeminars, registerForSeminar } from '../services/seminarService.js';

const SeminarRegister = ({ onRegister }) => {
  const [seminars, setSeminars]     = useState([]);
  const [activeSeminar, setActiveSeminar] = useState(null);
  const [loadingSeminars, setLoadingSeminars] = useState(true);
  const [seminarError, setSeminarError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    sex: 'Male',
    concern: 'Sleep Problems'
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Fetch upcoming seminars on mount
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const data = await getUpcomingSeminars();
        if (data && data.length > 0) {
          setSeminars(data);
          setActiveSeminar(data[0]); // default to first seminar
        }
      } catch (err) {
        setSeminarError(err.message || 'Could not load seminar data.');
      } finally {
        setLoadingSeminars(false);
      }
    };
    fetchSeminars();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Coming Soon';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'TBA';
    const [h, m] = timeStr.split(':');
    const hours = parseInt(h, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${display}:${m} ${suffix} (IST)`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.phone || !formData.age) {
      setError('Please fill out all required fields.');
      return;
    }
    if (!activeSeminar) {
      setError('No seminar available to register for.');
      return;
    }
    setLoading(true);
    try {
      const registrationRequest = {
        name:      formData.name,
        age:       parseInt(formData.age, 10),
        sex:       formData.sex,
        mobile:    formData.phone,
        email:     formData.email,
        seminarId: activeSeminar.id,
      };
      await registerForSeminar(registrationRequest);

      // Notify parent for UI update
      if (onRegister) {
        onRegister({
          name:      formData.name,
          email:     formData.email,
          phone:     formData.phone,
          concern:   formData.concern,
          timestamp: Date.now(),
        });
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', age: '', sex: 'Male', concern: 'Sleep Problems' });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="seminars" className="py-20 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-primary-dark font-sans uppercase">
            LEARN FROM THE EXPERT
          </span>
          <h2 className="mt-3 font-serif text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl">
            Live Health Seminars
          </h2>
          <p className="mt-4 text-base text-text-light max-w-xl mx-auto">
            Join Dr. Keval Dankhara's upcoming online webinars. Discover root-cause healing, ask questions live, 
            and start your journey to a balanced lifestyle.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-stretch">
          
          {/* Left Column: Seminar Details Card */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl bg-bg-cream border border-primary/15 p-8 lg:p-10 shadow-xs hover:shadow-lg transition-shadow">
            {loadingSeminars ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary-dark" />
                <p className="text-sm text-text-light">Loading seminar details…</p>
              </div>
            ) : seminarError ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <AlertCircle className="h-8 w-8 text-amber-500" />
                <p className="text-sm text-text-light">{seminarError}</p>
                <p className="text-xs text-text-light/70">Showing static seminar info.</p>
                {/* Fallback static display */}
                <FallbackSeminarCard />
              </div>
            ) : activeSeminar ? (
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  ● Live Webinar
                </div>

                {/* Seminar selector if multiple */}
                {seminars.length > 1 && (
                  <div className="mt-4">
                    <select
                      value={activeSeminar.id}
                      onChange={(e) => setActiveSeminar(seminars.find(s => s.id === e.target.value))}
                      className="block w-full rounded-xl border border-primary/20 bg-white px-3 py-2 text-xs text-text-dark focus:border-primary-dark focus:outline-hidden"
                    >
                      {seminars.map(s => (
                        <option key={s.id} value={s.id}>{s.topic}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <h3 className="mt-4 font-serif text-3xl font-extrabold text-text-dark leading-tight">
                  {activeSeminar.topic}
                </h3>
                
                <p className="mt-4 text-sm text-text-light leading-relaxed">
                  Join Dr. Keval Dankhara for an in-depth live session. Ask questions, get personalized insights, 
                  and discover holistic solutions to your health concerns.
                </p>

                {/* Seminar Details grid */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-text-light leading-none">Date</span>
                      <span className="font-sans font-bold text-sm text-text-dark">{formatDate(activeSeminar.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-text-light leading-none">Time</span>
                      <span className="font-sans font-bold text-sm text-text-dark">{formatTime(activeSeminar.time)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-text-light leading-none">Location</span>
                      <span className="font-sans font-bold text-sm text-text-dark">
                        Virtual — {activeSeminar.language || 'Hindi / Gujarati'} (Link sent on registration)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs text-text-light leading-none">Admission Fee</span>
                      <span className="font-sans font-extrabold text-sm text-emerald-700 uppercase tracking-wide">
                        {activeSeminar.fee === 0 ? 'Free (Limited Slots)' : `₹${activeSeminar.fee}`}
                      </span>
                    </div>
                  </div>

                  {activeSeminar.totalSeats && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-dark">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs text-text-light leading-none">Seats Available</span>
                        <span className="font-sans font-bold text-sm text-text-dark">
                          {Math.max(0, activeSeminar.totalSeats - (activeSeminar.bookedSeats || 0))} / {activeSeminar.totalSeats} remaining
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <FallbackSeminarCard />
            )}

            <div className="mt-8 border-t border-primary/15 pt-6 flex items-center gap-3">
              <span className="text-xl">🎓</span>
              <p className="text-xs text-text-light font-medium italic">
                Attendees will receive a free "Healthy Sleep Checklist" PDF compiled by Dr. Keval.
              </p>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="mt-8 lg:mt-0 lg:col-span-6 bg-white border border-primary/10 rounded-3xl p-8 lg:p-10 shadow-lg flex flex-col justify-center">
            {submitted ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-text-dark">Registration Successful!</h3>
                <p className="mt-3 text-sm text-text-light leading-relaxed max-w-sm mx-auto">
                  Thank you for registering. We have reserved your seat. The access link will be sent to your email before the event.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-lg border border-primary/40 text-text-dark hover:bg-primary/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Register Someone Else
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                <h3 className="font-serif text-2xl font-bold text-text-dark mb-2">Reserve Your Spot</h3>
                <p className="text-xs text-text-light mb-6">
                  Fill in your details below to secure your seat. Access link will be dispatched via email.
                </p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label htmlFor="sem-name" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Your Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-light/50"><User className="h-4 w-4" /></div>
                    <input type="text" id="sem-name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 pl-10 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-hidden transition-all duration-200" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="sem-email" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-light/50"><Mail className="h-4 w-4" /></div>
                    <input type="email" id="sem-email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. rahul@example.com" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 pl-10 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-hidden transition-all duration-200" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="sem-phone" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-light/50"><Phone className="h-4 w-4" /></div>
                    <input type="tel" id="sem-phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 95370 51626" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 pl-10 text-sm text-text-dark placeholder-slate-400 focus:border-primary-dark focus:bg-white focus:outline-hidden transition-all duration-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div>
                    <label htmlFor="sem-age" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Age *</label>
                    <input type="number" id="sem-age" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 32" min="1" max="120" required className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden" />
                  </div>
                  {/* Sex */}
                  <div>
                    <label htmlFor="sem-sex" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5">Sex *</label>
                    <select id="sem-sex" name="sex" value={formData.sex} onChange={handleChange} className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Health Concern Dropdown */}
                <div>
                  <label htmlFor="sem-concern" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    Primary Health Concern
                    <HelpCircle className="h-3.5 w-3.5 text-text-light" title="Helps Dr. Keval tailor the Q&A segment" />
                  </label>
                  <select id="sem-concern" name="concern" value={formData.concern} onChange={handleChange} className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3.5 py-3 text-sm text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden">
                    <option value="Sleep Problems">Insomnia / Sleep Complications</option>
                    <option value="Bloating and Gas">Chronic Bloating &amp; Digestive Issues</option>
                    <option value="Stress and Anxiety">Anxiety, Fatigue &amp; Stress</option>
                    <option value="Acidity / Reflux">Heartburn &amp; Acidity Issues</option>
                    <option value="Joint Pain">Joint Stiffness &amp; Chronic Pain</option>
                    <option value="Hormonal Imbalances">Thyroid / Hormonal Imbalance</option>
                    <option value="General Wellness">General Healthy Lifestyle Guidance</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !activeSeminar}
                  className="mt-3 w-full rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-4 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (<><Loader2 className="h-4 w-4 animate-spin" />Registering…</>) : 'Register Now'}
                </button>
              </form>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

// Fallback static card shown when API is unavailable
const FallbackSeminarCard = () => (
  <div className="mt-4">
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">● Live Webinar</div>
    <h3 className="mt-4 font-serif text-3xl font-extrabold text-text-dark leading-tight">Lifestyle &amp; Sleep Mastery: Ayurvedic Solutions</h3>
    <p className="mt-4 text-sm text-text-light leading-relaxed">Discover root-cause healing for insomnia, fatigue, and lifestyle disorders with Dr. Keval Dankhara.</p>
    <div className="mt-6 space-y-3">
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">Live seminar dates are loading from the server. Please check back or contact us directly.</p>
    </div>
  </div>
);

export default SeminarRegister;
