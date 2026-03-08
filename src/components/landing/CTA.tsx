// src/components/landing/CTA.tsx
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative bg-[#0A0A0A] py-20 sm:py-24 overflow-hidden">
      {/* Red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(220,38,38,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Red Team Your AI — <span className="text-red-500">And Export Proof</span>
        </h2>
        <p className="text-lg text-[#A0A0A0] mb-10">
          Run 295 AI red team attack scenarios and generate audit-grade evidence in 24 hours. $2,500 Pilot. No hidden costs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/asl3-testing"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded-lg transition-colors shadow-xl shadow-red-900/40"
          >
            Attack Your AI Now
          </Link>
          <a
            href="mailto:dsovan2004@gmail.com"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white font-semibold text-base px-8 py-4 rounded-lg transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}
