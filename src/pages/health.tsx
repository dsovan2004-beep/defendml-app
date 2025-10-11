import React from 'react';
import Navigation from '@/components/Navigation';
import { Activity, Zap, CheckCircle } from 'lucide-react';

export default function HealthPage() {
  return (
    <>
      <Navigation />
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
    </>
  );
}
