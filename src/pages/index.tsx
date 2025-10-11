import React from 'react';
import Link from 'next/link';
import { Shield, Zap, DollarSign, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Powered by Anthropic ASL-3</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI Security in <span className="text-purple-400">30 Minutes</span>
            <br />
            Not 30 Days
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Real-time threat detection for your LLM applications. 
            <span className="text-white font-semibold"> 48x faster setup</span> and 
            <span className="text-white font-semibold"> 10x cheaper</span> than enterprise solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/overview"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30"
            >
              View Live Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tester"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20"
            >
              Try Demo
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-slate-400 text-sm">
            Trusted by AI-first startups • No credit card required
          </p>
        </div>

        {/* Competitive Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">28 min</div>
                <div className="text-sm text-slate-400">Setup Time</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              vs 2-4 weeks for CalypsoAI
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$999/mo</div>
                <div className="text-sm text-slate-400">Pricing</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              vs $50K+/year enterprise
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4+ LLMs</div>
                <div className="text-sm text-slate-400">No Lock-in</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm">
              Works with ANY provider
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Secure Your AI
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Real-time Threat Detection',
                description: '43ms response time. Blocks prompt injection, jailbreaks, and policy violations instantly.',
              },
              {
                title: 'PII Leak Prevention',
                description: 'Automatic detection and redaction of sensitive data. Track breach cost prevention ($41K+ saved).',
              },
              {
                title: 'One-Click Compliance',
                description: 'SOC 2, GDPR, and HIPAA reporting ready. Download audit packs instantly.',
              },
              {
                title: 'Multi-LLM Support',
                description: 'Works with OpenAI, Anthropic, Google, Azure. No vendor lock-in.',
              },
              {
                title: 'Live Threat Feed',
                description: 'See attacks in real-time by LLM provider. Feature CalypsoAI doesn\'t have.',
              },
              {
                title: 'Cost Transparency',
                description: 'ROI calculator built-in. See exactly how much you\'re saving vs enterprise.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Protecting Your AI Today
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join startups who are building secure AI without enterprise budgets or sales calls.
            </p>
            <Link
              href="/overview"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30"
            >
              View Live Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
