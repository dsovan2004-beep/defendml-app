// src/pages/about.tsx
import Head from 'next/head';
import Link from 'next/link';
import LandingNavbar from '../components/landing/Navbar';
import LandingFooter from '../components/landing/Footer';
import { PRODUCT } from '../lib/productConstants';

const whyDifferent = [
  {
    icon: '⚔️',
    title: 'Security-First',
    body: 'Built by security practitioners — not software vendors retrofitting security features. Every decision starts from the attacker\'s perspective.',
  },
  {
    icon: '🔍',
    title: 'Fully Transparent',
    body: 'You see every attack prompt, every response, and every framework mapping. No black-box scoring. Audit-grade evidence you can stand behind.',
  },
  {
    icon: '⚡',
    title: 'Self-Service Speed',
    body: `Register your AI endpoint, configure authentication, and get a full evidence report in ${PRODUCT.deliveryHours} hours — no lengthy onboarding or professional services required.`,
  },
  {
    icon: '💰',
    title: 'Accessible Pricing',
    body: `${PRODUCT.pricing.pilot} Pilot gets you ${PRODUCT.scanPromptCount} real attack scenarios, 6-framework evidence, and 24hr delivery. Traditional manual engagements start at $16,000+.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — DefendML | Offensive AI Red Team Testing</title>
        <meta
          name="description"
          content="DefendML delivers offensive AI red team testing and audit-ready evidence reports. Offense-first AI red teaming from startups to Fortune 500."
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
                  About DefendML
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                Offense-first AI red teaming.
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-[#A0A0A0] mb-8">
                From startups to Fortune 500.
              </p>
              <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
                DefendML attacks AI systems with real adversarial scenarios — so you find
                vulnerabilities before adversaries do, and generate the audit-grade evidence
                security teams need to prove it.
              </p>
            </div>
          </section>

          {/* ── What We Do ─────────────────────────────── */}
          <section className="border-y border-[#1A1A1A] bg-[#0D0D0D]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                    What We <span className="text-red-500">Do</span>
                  </h2>
                  <p className="text-[#A0A0A0] leading-relaxed mb-4">
                    DefendML is an offensive AI red team testing service. We simulate real
                    adversarial attacks against your AI applications — prompt injection,
                    jailbreaks, data extraction, agent abuse, and more — using a library of{' '}
                    <span className="text-white font-semibold">{PRODUCT.attackLibrarySize} documented attack scenarios</span>.
                  </p>
                  <p className="text-[#A0A0A0] leading-relaxed mb-4">
                    Every scan produces a structured evidence report mapping results to{' '}
                    <span className="text-white font-semibold">{PRODUCT.frameworkCount} industry frameworks</span>:
                    OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, SOC 2 / ISO 27001, and EU AI Act.
                  </p>
                  <p className="text-[#A0A0A0] leading-relaxed">
                    Built for security teams, auditors, and enterprise procurement reviews — not
                    just internal developers.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: `${PRODUCT.attackLibrarySize}`, label: 'Attack Scenarios' },
                    { value: `${PRODUCT.scanPromptCount}`, label: 'Prompts Per Scan' },
                    { value: `${PRODUCT.frameworkCount}`, label: 'Security Frameworks' },
                    { value: `${PRODUCT.deliveryHours}hr`, label: 'Delivery Window' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-5 text-center"
                    >
                      <p className="text-3xl font-extrabold text-white">{s.value}</p>
                      <p className="text-xs text-[#A0A0A0] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Our Approach ───────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Our <span className="text-red-500">Approach</span>
                </h2>
                <p className="text-[#A0A0A0] max-w-xl mx-auto">
                  Two principles that shape every scan, every report, and every product decision.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Red Team First */}
                <div className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
                      ⚔️
                    </div>
                    <h3 className="text-lg font-bold text-white">Red Team First</h3>
                  </div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-5">
                    We approach every AI system the way an attacker would — looking for gaps in
                    safety layers, prompt handling, and data isolation before they become
                    exploitable vulnerabilities.
                  </p>
                  <ul className="space-y-2">
                    {[
                      `${PRODUCT.attackLibrarySize} documented adversarial scenarios`,
                      '7 attack categories covering all major AI threat classes',
                      'Architecture-aware scanning (Chat, RAG, Agent, API)',
                      'Real attack prompts — not synthetic safety checks',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                        <span className="text-red-400 mt-0.5 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Speed & Transparency */}
                <div className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
                      📋
                    </div>
                    <h3 className="text-lg font-bold text-white">Speed & Transparency</h3>
                  </div>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-5">
                    Evidence in {PRODUCT.deliveryHours} hours — not months. Every attack prompt,
                    every response, and every framework mapping is visible in your report. No
                    black-box scoring. No opaque results.
                  </p>
                  <ul className="space-y-2">
                    {[
                      `${PRODUCT.deliveryHours}hr from target registration to signed evidence`,
                      'Full attack transcripts — prompt, response, classification',
                      `${PRODUCT.frameworkCount}-framework coverage in every scan`,
                      'PDF, JSON, and CSV export for auditors',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-[#A0A0A0]">
                        <span className="text-red-400 mt-0.5 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Our Mission ────────────────────────────── */}
          <section className="py-16 sm:py-20 bg-[#0D0D0D]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-[#A0A0A0] text-lg leading-relaxed mb-6">
                AI applications are being deployed faster than they are being tested. Most teams
                rely on the model provider's safety layers — but the model provider secures the
                model, not the application built on top of it.
              </p>
              <p className="text-[#A0A0A0] text-lg leading-relaxed mb-6">
                Vulnerabilities live in system prompts, API integrations, RAG pipelines, and
                multi-turn flows. These are not model problems. They are application problems —
                and most are discoverable before they become breaches.
              </p>
              <p className="text-[#A0A0A0] text-lg leading-relaxed">
                Our mission is to make offensive AI red team testing accessible to every team
                building on AI — not just enterprises with six-figure security budgets.
              </p>
            </div>
          </section>

          {/* ── Why We're Different ────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Why We're <span className="text-red-500">Different</span>
                </h2>
                <p className="text-[#A0A0A0] max-w-xl mx-auto">
                  Purpose-built for offensive red team testing — not retrofitted from a defensive
                  security platform.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyDifferent.map((card) => (
                  <div
                    key={card.title}
                    className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-6 transition-colors"
                  >
                    <div className="text-3xl mb-4">{card.icon}</div>
                    <h3 className="text-base font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── The Team ───────────────────────────────── */}
          <section className="py-16 sm:py-20 bg-[#0D0D0D]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                The Team
              </h2>
              <p className="text-[#A0A0A0] leading-relaxed mb-8">
                DefendML is built by security and engineering practitioners with 20+ years of
                hands-on experience in IT operations, AI architecture, and enterprise security
                assessments. We've been on the auditor's side of the table — and we built the tool
                we wished we'd had.
              </p>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
              >
                Meet the Team →
              </Link>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────── */}
          <section className="relative py-20 sm:py-24 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(220,38,38,0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Attack Your AI?
              </h2>
              <p className="text-[#A0A0A0] text-lg mb-10">
                Run {PRODUCT.scanPromptCount} adversarial scenarios. Get audit-grade evidence in{' '}
                {PRODUCT.deliveryHours} hours. {PRODUCT.pricing.pilot} Pilot.
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
                  Talk to the Team
                </a>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
