// src/pages/team.tsx
import Head from 'next/head';
import Link from 'next/link';
import LandingNavbar from '../components/landing/Navbar';
import LandingFooter from '../components/landing/Footer';
import { PRODUCT } from '../lib/productConstants';

const team = [
  {
    emoji: '👨‍💻',
    name: 'Sareth Dustin Sovan',
    role: 'Co-Founder & CEO',
    tags: ['IT Operations', 'Security', 'SOC 2'],
    bio: '20+ years in IT and cybersecurity. Chief architect leading enterprise security systems for large-scale organizations. Led 4 successful SOC 2 Type II audits and brings deep operational knowledge of the regulatory pressure driving demand for AI red team evidence.',
  },
  {
    emoji: '👨‍💻',
    name: 'Sareth Dustin Sovan',
    role: 'Co-Founder, Chief Architect',
    tags: ['AI Security', 'Architecture', 'Frameworks'],
    bio: 'AI security architecture expert with deep specialization in adversarial machine learning and security framework alignment. Designs the scanning infrastructure and framework mapping logic that powers every DefendML evidence report.',
  },
  {
    emoji: '👩‍💻',
    role: 'Co-Founder, CTO — AI & CX Solutions',
    tags: ['AI', 'LLM', 'Customer Experience'],
    bio: '10+ years specializing in AI-powered customer experience and LLM implementations. Brings hands-on experience deploying AI applications in production environments — and the attacker\'s knowledge of where those deployments break.',
  },
  {
    emoji: '👨‍💻',
    role: 'Founding Full-Stack Engineer',
    tags: ['Next.js', 'Cloudflare Workers', 'Supabase'],
    bio: 'Built DefendML\'s entire tech stack from the ground up. Expertise in Next.js, Cloudflare Workers, and Supabase — the infrastructure that powers the scan engine, evidence pipeline, and customer-facing dashboard.',
  },
];

const values = [
  {
    icon: '⚔️',
    title: 'Attack First',
    body: "We find vulnerabilities before adversaries do. Every product decision starts with the attacker's perspective.",
  },
  {
    icon: '📋',
    title: 'Evidence Over Assertions',
    body: 'Claims that an AI system is safe are not enough. We produce structured, auditable evidence that security teams can stand behind.',
  },
  {
    icon: '🎯',
    title: 'Honest Positioning',
    body: "We test AI applications pre-deployment. We don't provide runtime protection, and we don't overstate what a single scan can prove.",
  },
  {
    icon: '🔬',
    title: 'Practitioner-Built',
    body: "DefendML is built by people who have been through SOC 2 audits, incident reviews, and security assessments — not just read about them.",
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

          {/* ── Team Cards ─────────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {team.map((member) => (
                  <div
                    key={member.role}
                    className="bg-[#111111] border border-[#1A1A1A] hover:border-red-500/30 rounded-xl p-8 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                      <span style={{ fontSize: '28px', lineHeight: 1 }}>{member.emoji}</span>
                    </div>

                    {'name' in member && member.name && (
                      <p className="text-white font-bold text-lg mb-0.5">{member.name}</p>
                    )}
                    <p className="text-[#A0A0A0] font-medium text-sm mb-2">{member.role}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-[#A0A0A0] text-sm leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

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

          {/* ── Join Our Mission ────────────────────────── */}
          <section className="py-16 sm:py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#111111] border border-[#1A1A1A] rounded-2xl p-8 sm:p-12 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Join Our Mission</h2>
                <p className="text-[#A0A0A0] mb-4 leading-relaxed">
                  We're building the offensive AI red team testing layer the security industry
                  needs — starting with a library of{' '}
                  <span className="text-white font-semibold">{PRODUCT.attackLibrarySize} adversarial scenarios</span>{' '}
                  and evidence reports that hold up to enterprise scrutiny.
                </p>
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
