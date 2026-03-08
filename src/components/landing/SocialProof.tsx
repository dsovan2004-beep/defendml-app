// src/components/landing/SocialProof.tsx

const cards = [
  {
    icon: '🎯',
    title: 'Zero Direct Competitors',
    body: 'While $500M+ went to defensive AI security platforms, DefendML is the only offensive red team testing service in the $2,500 pilot market.',
  },
  {
    icon: '⚔️',
    title: 'Built by Practitioners',
    body: 'Founded by a Senior IT Infrastructure & Security Manager with 20+ years experience and 4 successful SOC 2 Type II audits.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Remediation',
    body: 'Generates context-aware security playbooks for every vulnerability found — actionable fixes for your implementation, not generic advice.',
  },
];

export default function SocialProof() {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Why DefendML is <span className="text-red-500">Different</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto">
            We find vulnerabilities. We don't prevent them. That's the job of your guardrails.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
              <p className="text-[#A0A0A0] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
