import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { loginAdmin } from '../services/authService.js';

const AdminLogin = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-bg-cream rounded-3xl overflow-hidden shadow-2xl border border-primary/20 animate-fade-in">
        
        {/* Header decoration bar */}
        <div className="h-2 w-full bg-linear-to-r from-primary via-primary-dark to-primary" />

        <div className="px-6 py-8 relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-text-light hover:text-text-dark hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary-dark mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-text-dark">
              Admin Portal Login
            </h3>
            <p className="text-xs text-text-light mt-1">
              Enter your credentials to access the doctor's console.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md flex items-center gap-2 text-xs text-red-700 font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-light/50">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="admin-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sutraholistic.com"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 pl-10 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-[10px] font-bold text-text-dark uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-light/50">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full rounded-xl border border-primary/20 bg-bg-cream/45 px-3 py-3 pl-10 text-xs text-text-dark focus:border-primary-dark focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-primary text-text-dark font-bold hover:bg-primary-dark hover:text-white py-4 text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Secure notice */}
          <div className="mt-6 pt-6 border-t border-primary/10 text-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-light bg-primary/10 px-2.5 py-1 rounded-md">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-dark" />
              Secured by JWT authentication
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
