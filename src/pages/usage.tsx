import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { BarChart3, DollarSign, TrendingUp, Calendar, Zap, Users } from 'lucide-react';

function UsagePageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
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
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Usage by Provider */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Usage by Provider</h2>
            <div className="space-y-4">
              {[
                { provider: 'OpenAI (GPT-4)', requests: '18.2K', cost: '$342', percentage: 40 },
                { provider: 'Anthropic (Claude)', requests: '15.6K', cost: '$289', percentage: 34 },
                { provider: 'Google (Gemini)', requests: '8.4K', cost: '$156', percentage: 18 },
                { provider: 'Perplexity AI', requests: '3.5K', cost: '$65', percentage: 8 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-slate-300 font-medium">{item.provider}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-400 text-sm">{item.requests} requests</span>
                      <span className="text-green-400 font-medium">{item.cost}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request History & Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Request History */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Request History</h3>
              </div>
              <div className="space-y-4">
                {[
                  { date: 'Today', requests: '1,847', change: '+12%' },
                  { date: 'Yesterday', requests: '1,652', change: '+8%' },
                  { date: 'Last 7 days', requests: '12,456', change: '+15%' },
                  { date: 'Last 30 days', requests: '45,678', change: '+23%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-slate-300">{item.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{item.requests}</span>
                      <span className="text-green-400 text-sm">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">Cost Breakdown</h3>
              </div>
              <div className="space-y-4">
                {[
                  { category: 'API Requests', cost: '$652', percentage: 77 },
                  { category: 'Security Scans', cost: '$145', percentage: 17 },
                  { category: 'Data Storage', cost: '$50', percentage: 6 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">{item.category}</span>
                      <span className="text-green-400 font-medium">{item.cost}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Avg Response Time</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">42ms</div>
              <div className="text-slate-400 text-sm">5x faster than competitors</div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Active Users</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">1,243</div>
              <div className="text-slate-400 text-sm">+8.5% this week</div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Success Rate</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.7%</div>
              <div className="text-slate-400 text-sm">Industry leading</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function UsagePage() {
  return (
    <RequireAuth role="admin">
      <UsagePageContent />
    </RequireAuth>
  );
}
