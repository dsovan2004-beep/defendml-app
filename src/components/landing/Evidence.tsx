// src/components/landing/Evidence.tsx

const cards = [
  {
    icon: '📈',
    title: 'Live Dashboard',
    body: 'Real-time attack monitoring across all targets. View all scans, filter by severity, track block rates over time — every result time-stamped.',
  },
  {
    icon: '📄',
    title: 'Multi-Format Export',
    body: 'Export evidence in PDF (auditors), CSV (data teams), or JSON (automation). Built for security reviews and audit workflows.',
  },
  {
    icon: '🎯',
    title: '6-Framework Coverage',
    body: 'Our 295-scenario library maps to OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, ASL-3, SOC 2/ISO 27001, and EU AI Act simultaneously.',
  },
];

export default function Evidence() {
  return (
    <section id="evidence" className="bg-[#0A0A0A] py-20 sm:py-24 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Evidence, <span className="text-red-500">Not Claims</span>
          </h2>
          <p className="text-[#A0A0A0] max-w-2xl mx-auto text-lg">
            DefendML generates measurable security outcomes you can attach to risk reviews, security questionnaires, and audit packages.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
              <p className="text-[#A0A0A0] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Frameworks strip */}
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-6">
          <p className="text-center text-xs text-[#555555] uppercase tracking-widest mb-4 font-semibold">
            All 6 Frameworks Covered in Every Scan
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['OWASP LLM Top 10', 'NIST AI RMF', 'MITRE ATLAS', 'ASL-3', 'SOC 2 / ISO 27001', 'EU AI Act'].map((f) => (
              <span
                key={f}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
