// src/pages/about.tsx
import Head from 'next/head';
import Link from 'next/link';
import LandingNavbar from '../components/landing/Navbar';
import LandingFooter from '../components/landing/Footer';
import { PRODUCT } from '../lib/productConstants';

const capabilities = [
  {
    icon: '⚔️',
    title: 'Offensive Red Team Testing',
    body: `Execute ${PRODUCT.attackLibrarySize} adversarial attack scenarios against your AI system. We simulate real attack techniques — prompt injection, jailbreaks, data extraction, agent abuse — and produce audit-ready evidence of what your system blocked and what it didn't.`,
  },
  {
    icon: '📋',
    title: 'Audit-Ready Evidence',
    body: `Every scan produces a structured evidence report mapping results to ${PRODUCT.frameworkCount} industry frameworks: OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, SOC 2 / ISO 27001, and EU AI Act. Built for security teams, auditors, and enterprise procurement reviews.`,
  },
  {
    icon: '🎯',
    title: 'Architecture-Aware Scanning',
    body: 'The scan engine detects whether your AI system is a chat assistant, RAG pipeline, AI agent, or developer API — and weights attack categories accordingly. Testing a RAG system runs more context-injection and retrieval-leakage scenarios than a generic scan would.',
  },
  {
    icon: '⚡',
    title: '24-Hour Delivery',
    body: `From target registration to signed-off evidence report in ${PRODUCT.deliveryHours} hours. Purpose-built for teams under SOC 2, ISO 27001, or EU AI Act pressure who need evidence quickly — not months from now.`,
  },
];

const frameworks = PRODUCT.frameworks.map((f) => f);

const stats = [
  { value: `${PRODUCT.attackLibrarySize}`, label: 'Attack Scenarios' },
  { value: `${PRODUCT.scanPromptCount}`, label: 'Prompts Per Scan' },
  { value: `${PRODUCT.frameworkCount}`, label: 'Security Frameworks' },
  { value: `${PRODUCT.deliveryHours}hr`, label: 'Delivery Window' },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — DefendML | Offensive AI Red Team Testing</title>
        <meta
          name="description"
          content="DefendML delivers offensive AI red team testing and audit-ready evidence reports. Learn how our attack library and framework-aligned scanning helps security teams prove AI safety."
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
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                Offensive AI Red Team Testing.{' '}
                <span className="text-red-500">Audit-Grade Evidence.</span>
              </h1>
              <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
                DefendML was purpose-built to attack AI systems before adversaries do — and to
                generate the evidence security teams need to prove it.
              </p>
            </div>
          </section>

          {/* ── Stats bar ──────────────────────────────── */}
          <section className="border-y border-[#1A1A1A] bg-[#0D0D0D]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold text-white">{s.value}</p>
                    <p className="text-sm text-[#A0A0A0] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Mission ────────────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Why We Built This
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
                DefendML attacks your AI application with real adversarial scenarios, maps
                findings to recognized security frameworks, and delivers audit-grade evidence —
                so you can prove your system is tested before auditors, customers, or adversaries
                ask.
              </p>
            </div>
          </section>

          {/* ── Core Capabilities ──────────────────────── */}
          <section className="py-16 sm:py-20 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  What DefendML <span className="text-red-500">Does</span>
                </h2>
                <p className="text-[#A0A0A0] max-w-xl mx-auto">
                  Four core capabilities that drive every customer engagement.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {capabilities.map((c) => (
                  <div
                    key={c.title}
                    className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors"
                  >
                    <div className="text-3xl mb-4">{c.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-3">{c.title}</h3>
                    <p className="text-[#A0A0A0] leading-relaxed text-sm">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Framework Coverage ─────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Framework-Aligned Evidence
              </h2>
              <p className="text-[#A0A0A0] mb-10 max-w-xl mx-auto">
                Every scan maps findings to {PRODUCT.frameworkCount} recognized security
                frameworks so your evidence report is ready for compliance reviews and auditor
                requests.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {frameworks.map((f) => (
                  <span
                    key={f}
                    className="px-4 py-2 rounded-lg bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 text-[#F5F5F5] text-sm font-medium transition-colors"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── What We're Not ─────────────────────────── */}
          <section className="py-16 sm:py-20 bg-[#0D0D0D]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
                What DefendML Is — and Isn't
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-[#111111] border border-green-500/20 rounded-xl p-6">
                  <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    What we do
                  </p>
                  <ul className="space-y-2 text-sm text-[#A0A0A0]">
                    {[
                      'Attack AI applications with adversarial prompts',
                      'Identify system prompt and data leakage risks',
                      'Test multi-turn jailbreak sequences',
                      'Validate agent and tool-use security',
                      'Produce audit-ready evidence reports',
                      'Map findings to 6 security frameworks',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#111111] border border-red-500/20 rounded-xl p-6">
                  <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
                    What we don't do
                  </p>
                  <ul className="space-y-2 text-sm text-[#A0A0A0]">
                    {[
                      'Runtime prompt filtering or guardrails',
                      'Nation-state volume attack simulation',
                      'Internal employee misuse monitoring',
                      'Data governance or DLP enforcement',
                      'Replace your runtime security stack',
                      'Certify AI systems as fully secure',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
