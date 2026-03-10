// src/components/landing/Navbar.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Red Team', href: '#red-team' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Evidence', href: '#evidence' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              className="w-7 h-7 text-red-500 group-hover:text-red-400 transition-colors"
              style={{ filter: 'drop-shadow(0 0 3px rgba(220,38,38,0.85)) drop-shadow(0 0 7px rgba(220,38,38,0.4))' }}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2.5L28.5 7.5V18.5C28.5 25 22.8 29.5 16 31.5C9.2 29.5 3.5 25 3.5 18.5V7.5L16 2.5Z"
                fill="rgba(220,38,38,0.10)"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.1" />
              <line x1="16" y1="7.5" x2="16" y2="24.5" stroke="currentColor" strokeWidth="1.1" />
              <circle cx="16" cy="16" r="5.5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2.5" />
              <circle cx="16" cy="16" r="2.2" fill="currentColor" opacity="0.35">
                <animate attributeName="r" values="2.2;5.5;2.2" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="16" cy="16" r="2.2" fill="currentColor" />
            </svg>
            <span className="text-lg font-bold text-white">DefendML</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[#A0A0A0] hover:text-white text-sm font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#A0A0A0] hover:text-white text-sm font-medium transition-colors"
                >
                  {l.label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#A0A0A0] hover:text-white font-medium transition-colors px-3 py-2"
            >
              Login
            </Link>
            <Link
              href="/scan"
              className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors shadow-lg shadow-red-900/30"
            >
              Attack Your AI →
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1A1A1A] bg-[#0D0D0D]">
          <div className="px-4 py-4 space-y-3">
            {links.map((l) =>
              l.href.startsWith('/') ? (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-[#A0A0A0] hover:text-white text-base font-medium py-2 transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-[#A0A0A0] hover:text-white text-base font-medium py-2 transition-colors"
                >
                  {l.label}
                </a>
              )
            )}
            <div className="pt-2 border-t border-[#1A1A1A] flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block text-center py-2 text-[#A0A0A0] hover:text-white font-medium border border-[#2A2A2A] rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                href="/scan"
                onClick={() => setOpen(false)}
                className="block text-center py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Attack Your AI →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
