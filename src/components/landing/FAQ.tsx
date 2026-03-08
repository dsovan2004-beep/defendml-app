// src/components/landing/FAQ.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What makes DefendML different from defensive AI security platforms?',
    a: 'DefendML is OFFENSIVE — we attack AI systems to find vulnerabilities. Defensive platforms provide guardrails and monitoring. We provide red team testing and audit-grade evidence. That\'s why we\'re 10–80× cheaper and have zero direct competitors in the offensive testing category.',
  },
  {
    q: 'Are the 295 scenarios real AI red team tests?',
    a: 'Yes. The 295 attack prompts represent a comprehensive offensive testing library covering CBRN synthesis, jailbreaks, PII leakage, cyber enablement, and prompt injection. Each scan randomly selects 100 prompts, ensuring no two scans are identical and comprehensive coverage is maintained.',
  },
  {
    q: 'What is AI-powered remediation?',
    a: 'Every vulnerability found generates a context-aware security playbook. Instead of generic recommendations, our AI analyzes your specific implementation and provides actionable fixes tailored to your defense layers (L1–L4).',
  },
  {
    q: 'Do you train on our data?',
    a: 'No. DefendML does not train models on customer data. Testing is multi-tenant isolated by design — your prompts and results are never shared across tenants or used for model training.',
  },
  {
    q: 'What kinds of AI systems can I test?',
    a: 'Any AI endpoint, agent, or application flow — including systems with custom system prompts, tools, and retrieval (RAG). DefendML tests your implementation, not just the base model.',
  },
  {
    q: 'How is this different from traditional security testing?',
    a: 'Traditional testing focuses on infrastructure and application vulnerabilities. DefendML focuses on AI-specific failure modes: jailbreaks, injection, misuse enablement, leakage/exfiltration, and unsafe autonomous behavior — and produces evidence-ready reports.',
  },
  {
    q: 'Can we add custom red team scenarios?',
    a: 'Yes (Enterprise tier). Custom scenarios are tenant-private by default and designed to avoid cross-tenant leakage. We never train on customer data without explicit opt-in.',
  },
  {
    q: 'What does 6-framework coverage mean?',
    a: 'Our 295-scenario library maps simultaneously to OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, ASL-3, SOC 2/ISO 27001, and EU AI Act. Every finding is tagged to the relevant framework controls so your auditors get complete evidence packages.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1A1A1A] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-[#111111] hover:bg-[#1A1A1A] transition-colors"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-red-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 py-5 bg-[#0D0D0D] border-t border-[#1A1A1A]">
          <p className="text-[#A0A0A0] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#0A0A0A] py-20 sm:py-24 scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
