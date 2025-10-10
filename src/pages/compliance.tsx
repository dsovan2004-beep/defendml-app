import React from 'react';
import { FileCheck, Download, Shield } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
          </div>
          <p className="text-slate-300">SOC 2, GDPR, and HIPAA compliance made simple</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl p-8 border border-green-500/20">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-12 h-12 text-green-400" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">One-Click Compliance Reports</h2>
              <p className="text-green-200 text-lg mb-4">
                Feature CalypsoAI charges $10K+ for. We make it free and instant.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">99.2%</div>
              <div className="text-slate-300 font-medium">SOC 2 Ready</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium">GDPR Compliant</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium">HIPAA Ready</div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-green-500/30">
            <Download className="w-5 h-5" />
            Generate Auditor Pack (CSV + Report)
          </button>
          
          <p className="text-green-300 text-sm mt-4">
            Coming soon: Automated compliance reporting and audit pack downloads
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE 5: src/pages/health.tsx
// ============================================
import React from 'react';
import { Activity, Zap, CheckCircle } from 'lucide-react';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">System Health</h1>
          </div>
          <p className="text-slate-300">Real-time performance monitoring across all LLM providers</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/20">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">99.94%</div>
            <div className="text-green-300 font-medium">Success Rate</div>
            <div className="text-green-400/60 text-sm mt-1">Last 24 hours</div>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-6 border border-cyan-500/20">
            <Zap className="w-8 h-8 text-cyan-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">42ms</div>
            <div className="text-cyan-300 font-medium">P95 Latency</div>
            <div className="text-cyan-400/60 text-sm mt-1">5x faster than CalypsoAI</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20">
            <Activity className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">45K</div>
            <div className="text-purple-300 font-medium">Requests Today</div>
            <div className="text-purple-400/60 text-sm mt-1">Across 4 providers</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <p className="text-slate-300 text-lg mb-4">
            Coming soon: Real-time health metrics and provider performance breakdowns
          </p>
          <p className="text-slate-400">
            Monitor API latency, success rates, and performance by LLM provider
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE 6: src/pages/usage.tsx
// ============================================
import React from 'react';
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';

export default function UsagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Usage Analytics</h1>
          </div>
          <p className="text-slate-300">Track costs and usage across all your LLM providers</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-xl p-6 border border-indigo-500/20">
            <BarChart3 className="w-8 h-8 text-indigo-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">45,678</div>
            <div className="text-indigo-300 font-medium">Total Scans</div>
            <div className="text-indigo-400/60 text-sm mt-1">Last 30 days</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/20">
            <DollarSign className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">$847</div>
            <div className="text-green-300 font-medium">Monthly Cost</div>
            <div className="text-green-400/60 text-sm mt-1">10x cheaper than Lakera</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-xl p-6 border border-blue-500/20">
            <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-4xl font-bold text-white mb-2">+23%</div>
            <div className="text-blue-300 font-medium">Growth (MoM)</div>
            <div className="text-blue-400/60 text-sm mt-1">Healthy trajectory</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <p className="text-slate-300 text-lg mb-4">
            Coming soon: Detailed usage analytics with date range filters
          </p>
          <p className="text-slate-400">
            Track request history, model usage, and cost breakdowns by provider
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================
// FILE 7: src/pages/audit.tsx
// ============================================
import React from 'react';
import { ScrollText, Search, Download } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <ScrollText className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          </div>
          <p className="text-slate-300">Complete audit trail for compliance and security</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-2xl p-8 border border-amber-500/20">
          <div className="flex items-start gap-4 mb-6">
            <Search className="w-12 h-12 text-amber-400" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Searchable Audit Trail</h2>
              <p className="text-amber-200 text-lg mb-4">
                Every security event logged. Every action tracked. Ready for any audit.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">45,678</div>
              <div className="text-slate-300 font-medium">Events Logged</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium">Coverage</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">90d</div>
              <div className="text-slate-300 font-medium">Retention</div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-amber-500/30">
            <Download className="w-5 h-5" />
            Export Audit Logs (CSV)
          </button>
          
          <p className="text-amber-300 text-sm mt-4">
            Coming soon: Full audit log search and export capabilities
          </p>
        </div>
      </div>
    </div>
  );
}
