// src/pages/team.tsx
import Head from 'next/head';
import Link from 'next/link';
import LandingNavbar from '../components/landing/Navbar';
import LandingFooter from '../components/landing/Footer';
import { PRODUCT } from '../lib/productConstants';

const teamGroups = [
  {
    group: 'Founding Team',
    description:
      'Security and infrastructure practitioners who spent years on the defender side before building tools to attack AI systems first.',
    members: [
      {
        initials: 'D.S.',
        role: 'Founder & CEO',
        focus: 'Product strategy, AI security research, customer outcomes',
        background:
          '20+ years in IT infrastructure and security operations. 4 successful SOC 2 Type II audits. Experienced in the regulatory pressure that drives demand for AI red team evidence.',
      },
    ],
  },
  {
    group: 'Security Engineering',
    description:
      'Responsible for the attack library, scan execution engine, and evidence pipeline that power every DefendML scan.',
    members: [
      {
        initials: 'SE',
        role: 'Security Engineering',
        focus: `Attack library governance — ${PRODUCT.attackLibrarySize} adversarial scenarios across 7 attack categories`,
        background:
          'Builds and maintains the adversarial prompt library, scan execution pipeline, and MITRE ATLAS / OWASP framework mapping logic.',
      },
    ],
  },
  {
    group: 'Product & Research',
    description:
      'Translates emerging AI attack research into structured scenarios and drives the evidence report experience for enterprise security teams.',
    members: [
      {
        initials: 'PR',
        role: 'Product & Research',
        focus: 'AI security research, evidence report design, framework alignment',
        background: `Maps real-world AI vulnerabilities into the ${PRODUCT.attackLibrarySize}-scenario attack library. Maintains ${PRODUCT.frameworkCount}-framework coverage across OWASP, NIST, MITRE, SOC 2, and EU AI Act.`,
      },
    ],
  },
];

const values = [
  {
    icon: '⚔️',
    title: 'Attack First',
    body: 'We find vulnerabilities before adversaries do. Every product decision starts with the attacker\'s perspective.',
  },
  {
    icon: '📋',
    title: 'Evidence Over Assertions',
    body: 'Claims that an AI system is safe are not enough. We produce structured, auditable evidence that security teams can stand behind.',
  },
  {
    icon: '🎯',
    title: 'Honest Positioning',
    body: 'We test AI applications pre-deployment. We don\'t provide runtime protection, and we don\'t overstate what a single scan can prove.',
  },
  {
    icon: '🔬',
    title: 'Practitioner-Built',
    body: 'DefendML is built by people who have been through SOC 2 audits, incident reviews, and security assessments — not just read about them.',
  },
];

export default function TeamPage() {
  return (
    <>
      <Head>
        <title>Team — DefendML | Offensive AI Red Team Testing</title>
        <meta
          name="description"
          content="Meet the DefendML team — security practitioners and engineers building offensive AI red team testing tools for enterprise security teams."
        />
      </Head>

      <div className="bg-[#0A0A0A] min-h-screen">
        <LandingNavbar />

        <main>
          {/* ── Hero ─────────────────────────────────────── */}
          <section className="relative overflow-hidden py-20 sm:py-28">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
                  The Team
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                Built by{' '}
                <span className="text-red-500">Security Practitioners.</span>
                <br />
                For Security Teams.
              </h1>
              <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
                DefendML was built by people who have sat on the auditor's side of the table —
                and who understand what security teams actually need when they say "prove your AI
                is tested."
              </p>
            </div>
          </section>

          {/* ── Team Groups ────────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {teamGroups.map((group) => (
                <div key={group.group}>
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-2">{group.group}</h2>
                    <p className="text-[#A0A0A0] text-sm max-w-2xl">{group.description}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.members.map((m) => (
                      <div
                        key={m.role}
                        className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-6 transition-colors"
                      >
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                          <span className="text-red-400 text-sm font-bold">{m.initials}</span>
                        </div>
                        <p className="text-white font-semibold mb-1">{m.role}</p>
                        <p className="text-red-400 text-xs mb-3">{m.focus}</p>
                        <p className="text-[#A0A0A0] text-sm leading-relaxed">{m.background}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Divider ────────────────────────────────── */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-[#1A1A1A]" />
          </div>

          {/* ── Values ─────────────────────────────────── */}
          <section className="py-16 sm:py-20 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  How We <span className="text-red-500">Work</span>
                </h2>
                <p className="text-[#A0A0A0] max-w-xl mx-auto">
                  Four principles that drive every product and engineering decision at DefendML.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-6 transition-colors"
                  >
                    <div className="text-3xl mb-4">{v.icon}</div>
                    <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Contact / Join ──────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Work With Us</h2>
                <p className="text-[#A0A0A0] mb-8 leading-relaxed">
                  DefendML is a small, focused team. We work with security engineers and AI
                  practitioners who want to build the offensive testing layer the AI security
                  industry is missing. If that's you, reach out.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:dsovan2004@gmail.com"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-8 py-4 rounded-lg transition-colors shadow-xl shadow-red-900/40"
                  >
                    Get in Touch
                  </a>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] text-white font-semibold text-base px-8 py-4 rounded-lg transition-colors"
                  >
                    Learn About DefendML
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
