import React, { useState } from 'react';
import { Menu, X, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

const Navbar = ({ onAdminLoginClick, currentView, onViewToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'The Doctor', href: '#doctor' },
    { label: 'Sutra Formulas', href: '#products' },
    { label: 'Seminars', href: '#seminars' },
    { label: 'Video Consultation', href: '#consultation' },
    { label: 'FAQs', href: '#faq' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (currentView === 'admin') {
      onViewToggle('patient');
      // Wait for view toggle to render, then scroll
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleLinkClick(e, '#hero')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-dark">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wide text-text-dark block leading-none">
                SUTRA
              </span>
              <span className="text-xs tracking-widest text-primary-dark font-sans uppercase">
                Holistic Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm font-medium text-text-light hover:text-primary-dark transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Button (Admin Login or View Toggle) */}
          <div className="hidden md:flex items-center gap-4">
            {currentView === 'admin' ? (
              <button
                onClick={() => onViewToggle('patient')}
                className="flex items-center gap-2 rounded-full border border-primary text-primary-dark hover:bg-primary/10 px-5 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300"
              >
                Patient View
              </button>
            ) : (
              <button
                onClick={onAdminLoginClick}
                className="flex items-center gap-1.5 rounded-full border border-primary/30 text-text-dark hover:border-primary-dark hover:text-primary-dark px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-300"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Admin Portal
              </button>
            )}

            <a
              href="#consultation"
              onClick={(e) => handleLinkClick(e, '#consultation')}
              className="flex items-center gap-2 rounded-full bg-primary text-text-dark font-medium hover:bg-primary-dark hover:text-white px-5 py-2.5 text-xs font-semibold tracking-wider uppercase shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Book Consultation
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {currentView === 'admin' && (
              <button
                onClick={() => onViewToggle('patient')}
                className="rounded-full border border-primary text-primary-dark px-3 py-1 text-xs font-semibold transition-all"
              >
                Patient View
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-text-light hover:bg-primary-light hover:text-primary-dark transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-primary/10">
          <div className="space-y-1 px-4 py-4 pb-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block rounded-md px-3 py-2 text-base font-medium text-text-light hover:bg-primary-light hover:text-primary-dark transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3 border-t border-primary/10 mt-4">
              {currentView !== 'admin' && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAdminLoginClick();
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-md border border-primary/30 py-2.5 text-sm font-medium text-text-dark"
                >
                  <ShieldAlert className="h-4 w-4" />
                  Admin Portal
                </button>
              )}
              <a
                href="#consultation"
                onClick={(e) => handleLinkClick(e, '#consultation')}
                className="flex items-center justify-center gap-2 w-full rounded-md bg-primary text-text-dark py-3 text-sm font-semibold uppercase tracking-wider text-center"
              >
                Book Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
