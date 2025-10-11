import React from 'react';
import Navigation from '@/components/Navigation';
import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';

export default function UsagePage() {
  return (
    <>
      <Navigation />
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
    </>
  );
}
