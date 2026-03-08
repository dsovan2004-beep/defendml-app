// src/components/landing/Footer.tsx
import Link from 'next/link';

const productLinks = [
  { label: 'Red Team', href: '#red-team' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Evidence', href: '#evidence' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Live Demo', href: '/asl3-testing' },
];

const companyLinks = [
  { label: 'Login', href: '/login' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-7 h-7 text-red-500"
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
                <circle cx="16" cy="16" r="2.2" fill="currentColor" />
              </svg>
              <span className="text-lg font-bold text-white">DefendML</span>
            </div>
            <p className="text-[#555555] text-sm leading-relaxed">
              The only offensive AI red team testing service. Generate audit-grade evidence in 24 hours.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#555555] hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#555555] hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tagline */}
          <div>
            <h4 className="text-[#A0A0A0] text-xs font-semibold uppercase tracking-widest mb-4">Approach</h4>
            <p className="text-sm text-[#555555] leading-relaxed">
              "We find vulnerabilities. We don't prevent them."
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['OWASP', 'NIST', 'MITRE', 'ASL-3'].map((f) => (
                <span key={f} className="text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1A1A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#555555]">
          <p>© 2026 DefendML. All rights reserved.</p>
          <p>The Only Offensive AI Red Team Testing Service — Attack Before They Do.</p>
        </div>
      </div>
    </footer>
  );
}
