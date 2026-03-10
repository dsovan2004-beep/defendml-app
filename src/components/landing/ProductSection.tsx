// src/components/landing/ProductSection.tsx
import Link from 'next/link';
import { PRODUCT } from '../../lib/productConstants';

const cards = [
  {
    icon: '⚔️',
    title: `${PRODUCT.attackLibrarySize} Attack Scenarios`,
    body: `Execute varied red team attacks against YOUR AI implementation. ${PRODUCT.scanPromptCount} prompts per scan randomly selected — no two scans are identical.`,
    bullets: [
      'CBRN synthesis & dual-use enablement',
      'Jailbreak + prompt injection resistance',
      'PII leakage + data exfiltration',
      'Cybersecurity attack enablement',
    ],
  },
  {
    icon: '🤖',
    title: 'AI-Powered Remediation',
    body: 'Every vulnerability comes with context-aware security playbooks. Actionable fixes specific to your implementation — not generic advice.',
    bullets: [
      'Custom remediation for each finding',
      'Defense layer attribution (L1–L4)',
      'Priority-ranked security improvements',
    ],
  },
  {
    icon: '📊',
    title: 'Audit-Grade Evidence',
    body: `Generate evidence-ready reports mapped to OWASP, NIST, MITRE, ASL-3, SOC 2/ISO, and EU AI Act. Export PDF/CSV/JSON for auditors. ${PRODUCT.frameworkCount} frameworks covered in every scan.`,
    bullets: [
      'Multi-format export (PDF / CSV / JSON)',
      'Decision rationale + timestamps',
      `${PRODUCT.frameworkCount}-framework coverage mapping`,
    ],
  },
];

export default function ProductSection() {
  return (
    <section id="red-team" className="bg-[#0A0A0A] py-20 sm:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Offensive Red Team Testing as a{' '}
            <span className="text-red-500">Service</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-lg">
            DefendML ATTACKS AI systems to find vulnerabilities. Not defensive guardrails. Not monitoring. Pure offensive testing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors flex flex-col"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
              <p className="text-[#A0A0A0] mb-5 leading-relaxed">{c.body}</p>
              <ul className="mt-auto space-y-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                    <span className="text-red-500 font-bold mt-0.5">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Callout banner */}
        <div className="bg-[#111111] border border-red-500/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">No Two Scans Are Identical</h3>
          <p className="text-[#A0A0A0] mb-6">
            {PRODUCT.scanPromptCount} prompts randomly selected from the {PRODUCT.attackLibrarySize}-scenario library — ensuring varied, comprehensive coverage every time.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Try Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
