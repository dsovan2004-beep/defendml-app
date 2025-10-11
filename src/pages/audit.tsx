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
