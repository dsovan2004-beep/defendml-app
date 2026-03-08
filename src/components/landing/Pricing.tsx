// src/components/landing/Pricing.tsx
import Link from 'next/link';
import { PRODUCT } from '../../lib/productConstants';

const tiers = [
  {
    name: 'Free',
    price: PRODUCT.pricing.free,
    sub: 'Limited access',
    highlight: false,
    features: [
      'Demo scan interface',
      'Sample report preview',
      'Framework overview',
    ],
    cta: 'Get Started Free',
    href: '/login',
    ctaStyle: 'border border-[#2A2A2A] text-white hover:bg-[#1A1A1A]',
  },
  {
    name: 'Pilot',
    price: PRODUCT.pricing.pilot,
    sub: 'One-time engagement',
    highlight: true,
    features: [
      `${PRODUCT.scanPromptCount} prompts · 1 target`,
      `${PRODUCT.deliveryHours}-hour PDF delivery`,
      `${PRODUCT.frameworkCount}-framework evidence report`,
      'AI-powered remediation playbook',
      'PASS / FAIL verdict with timestamps',
    ],
    cta: 'Start Pilot →',
    href: 'mailto:dsovan2004@gmail.com',
    ctaStyle: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40',
    badge: 'Most Popular',
  },
  {
    name: 'Standard',
    price: PRODUCT.pricing.standard,
    sub: 'One-time engagement',
    highlight: false,
    features: [
      `${PRODUCT.attackLibrarySize} prompts · 1 target`,
      `${PRODUCT.deliveryHours}-hour full delivery`,
      'Complete evidence package',
      'Priority AI remediation',
    ],
    cta: 'Contact Us',
    href: 'mailto:dsovan2004@gmail.com',
    ctaStyle: 'border border-[#2A2A2A] text-white hover:bg-[#1A1A1A]',
  },
  {
    name: 'Growth',
    price: PRODUCT.pricing.growth,
    sub: '/month',
    highlight: false,
    features: [
      `${PRODUCT.attackLibrarySize} × 3 targets`,
      'Monthly scans',
      'AI Risk Score tracking',
      'CI/CD integration support',
    ],
    cta: 'Contact Us',
    href: 'mailto:dsovan2004@gmail.com',
    ctaStyle: 'border border-[#2A2A2A] text-white hover:bg-[#1A1A1A]',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#111111] py-20 sm:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            <span className="text-red-500">{PRODUCT.affordabilityLabel} More Affordable</span> Than Platforms
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-lg">
            {PRODUCT.pricing.pilot} pilot vs $10K–$200K+ platform contracts. Pay for offensive testing, not defensive features you don't need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-xl p-7 flex flex-col ${
                t.highlight
                  ? 'bg-[#1A1A1A] border-2 border-red-500/60 shadow-xl shadow-red-900/20'
                  : 'bg-[#0D0D0D] border border-[#1A1A1A]'
              }`}
            >
              {t.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t.badge}
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{t.price}</span>
                  {t.sub && (
                    <span className="text-sm text-[#555555]">{t.sub}</span>
                  )}
                </div>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                    <span className="text-red-500 font-bold mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={t.href}
                className={`block text-center font-semibold py-2.5 rounded-lg text-sm transition-colors ${t.ctaStyle}`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise callout */}
        <div className="mt-8 bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-white font-bold mb-1">Enterprise — Custom</h4>
            <p className="text-[#A0A0A0] text-sm">Unlimited targets · CI/CD ready · Custom attack scenarios · Priority SLA</p>
          </div>
          <a
            href="mailto:dsovan2004@gmail.com"
            className="flex-shrink-0 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Contact Sales
          </a>
        </div>

        <p className="text-center text-sm text-[#555555] mt-6">
          Compare: Defensive platforms charge $10K–$200K+ annually. DefendML starts at {PRODUCT.pricing.pilot} for offensive red team testing with audit-grade evidence.
        </p>
      </div>
    </section>
  );
}
