// src/components/landing/HowItWorks.tsx
import Link from 'next/link';
import { PRODUCT } from '../../lib/productConstants';

const steps = [
  {
    num: '1',
    title: 'Connect Your AI Target',
    body: 'Point DefendML at your AI endpoint, agent, or application. Multi-tenant isolated by design — your data stays yours.',
  },
  {
    num: '2',
    title: 'Run Offensive Red Team Scans',
    body: `Execute ${PRODUCT.scanPromptCount} prompts randomly selected from our ${PRODUCT.attackLibrarySize}-scenario library. CBRN, jailbreaks, PII leakage, cyber enablement — real offensive testing.`,
  },
  {
    num: '3',
    title: 'Export Evidence + Remediation',
    body: `Get audit-grade reports with AI-powered remediation playbooks in ${PRODUCT.deliveryHours} hours. Export PDF/CSV/JSON for security reviews and auditors.`,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#111111] py-20 sm:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How <span className="text-red-500">It Works</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-lg">
            Three steps to offensive AI security testing and audit-ready evidence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 text-2xl font-extrabold mx-auto mb-5">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-[#A0A0A0] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors shadow-xl shadow-red-900/30"
          >
            Try Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
