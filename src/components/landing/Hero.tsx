// src/components/landing/Hero.tsx
import Link from 'next/link';
import { PRODUCT } from '../../lib/productConstants';

const pills = [
  `${PRODUCT.attackLibrarySize} Attack Scenarios`,
  `${PRODUCT.aslCoverageLabel}`,
  `${PRODUCT.scanPromptCount} Prompts / Scan`,
  `${PRODUCT.deliveryLabel} Delivery`,
];

export default function Hero() {
  return (
    <section className="relative bg-[#0A0A0A] overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Red glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(220,38,38,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {pills.map((pill) => (
            <span
              key={pill}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-300"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Attack Before They Do.
          <br />
          <span className="text-red-500">Offensive AI Red Team Testing</span>
        </h1>

        {/* Sub-headline — credible, no absolute claims */}
        <p className="text-lg sm:text-xl text-[#A0A0A0] max-w-3xl mx-auto mb-10 leading-relaxed">
          DefendML attacks your AI with{' '}
          <strong className="text-[#F5F5F5]">{PRODUCT.attackLibrarySize} real attack scenarios</strong> aligned with{' '}
          <strong className="text-[#F5F5F5]">ASL-3 security requirements</strong> and{' '}
          <strong className="text-[#F5F5F5]">{PRODUCT.frameworkCount} industry frameworks</strong>. Get
          audit-ready evidence in {PRODUCT.deliveryHours} hours — starting at{' '}
          <strong className="text-[#F5F5F5]">{PRODUCT.pricing.pilot}</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            href="/scan"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded-lg transition-colors shadow-xl shadow-red-900/40"
          >
            Run a Live Red Team Test
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white font-semibold text-base px-8 py-4 rounded-lg transition-colors"
          >
            See How It Works
          </a>
        </div>

        {/* Trust line */}
        <p className="text-sm text-[#555555]">
          No credit card required&nbsp;·&nbsp;Multi-tenant isolated&nbsp;·&nbsp;Evidence exports: PDF / CSV / JSON
        </p>
      </div>
    </section>
  );
}
