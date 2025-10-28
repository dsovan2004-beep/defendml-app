import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { 
  BarChart3, DollarSign, TrendingUp, Calendar, Zap, Users, 
  Shield, Activity, CheckCircle, Layers, AlertTriangle, Target 
} from 'lucide-react';

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

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* ASL-3 Cost & Usage Analysis */}
          <div className="relative bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-indigo-500/5 rounded-2xl p-8 border border-indigo-500/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl animate-pulse pointer-events-none"></div>
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">ASL-3 Cost & ROI Analysis</h2>
                    <p className="text-sm text-slate-400">Transparent security infrastructure costs with measurable value</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-sm text-green-400">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown by ASL-3 Component */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-black/40 rounded-xl p-5 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">Defense Layers</span>
                  </div>
                  <div className="text-3xl font-bold text-indigo-400 mb-1">$284</div>
                  <div className="text-xs text-slate-400 mb-2">Monthly operational cost</div>
                  <div className="text-xs text-green-400">33.5% of security budget</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-300">Classifiers</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-400 mb-1">$245</div>
                  <div className="text-xs text-slate-400 mb-2">Real-time scanning</div>
                  <div className="text-xs text-green-400">29% of security budget</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-300">Monitoring</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-1">$198</div>
                  <div className="text-xs text-slate-400 mb-2">Pattern detection</div>
                  <div className="text-xs text-green-400">23.4% of security budget</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-cyan-300">Response</span>
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mb-1">$118</div>
                  <div className="text-xs text-slate-400 mb-2">Incident handling</div>
                  <div className="text-xs text-green-400">14% of security budget</div>
                </div>
              </div>

              {/* ROI Metrics */}
              <div className="bg-black/40 rounded-xl p-6 border border-indigo-500/20 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-semibold text-white">ASL-3 Return on Investment</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">$48,750</div>
                    <div className="text-xs text-slate-400">Annual savings vs competitors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">2,847</div>
                    <div className="text-xs text-slate-400">Threats blocked (30d)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">$0</div>
                    <div className="text-xs text-slate-400">Breach costs prevented</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">57.5x</div>
                    <div className="text-xs text-slate-400">Cost vs value ratio</div>
                  </div>
                </div>
              </div>

              {/* Cost Efficiency Comparison */}
              <div className="bg-black/40 rounded-xl p-6 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Cost Per Scan Breakdown</span>
                  </div>
                  <span className="text-xs text-slate-400">Last 30 days</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-500/10 rounded-lg p-4 border border-indigo-500/20">
                    <div className="text-lg font-bold text-indigo-400 mb-1">$0.019</div>
                    <div className="text-xs text-slate-400 mb-2">Per security scan</div>
                    <div className="text-xs text-green-400">↓ 94% vs Lakera ($0.32)</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="text-lg font-bold text-purple-400 mb-1">$0.0054</div>
                    <div className="text-xs text-slate-400 mb-2">Per classifier check</div>
                    <div className="text-xs text-green-400">Real-time efficiency</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="text-lg font-bold text-blue-400 mb-1">$2.59</div>
                    <div className="text-xs text-slate-400 mb-2">Per incident handled</div>
                    <div className="text-xs text-green-400">Automated response</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Usage by Provider</h2>
            <div className="space-y-4">
              {[
                { provider: 'OpenAI (GPT-4)', requests: '18.2K', cost: '$342', percentage: 40, asl3Cost: '$68' },
                { provider: 'Anthropic (Claude)', requests: '15.6K', cost: '$289', percentage: 34, asl3Cost: '$58' },
                { provider: 'Google (Gemini)', requests: '8.4K', cost: '$156', percentage: 18, asl3Cost: '$31' },
                { provider: 'Perplexity AI', requests: '3.5K', cost: '$65', percentage: 8, asl3Cost: '$13' },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-slate-300 font-medium">{item.provider}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-slate-400 text-sm">{item.requests} requests</span>
                      <div className="flex flex-col items-end">
                        <span className="text-green-400 font-medium">{item.cost}</span>
                        <span className="text-indigo-400 text-xs">ASL-3: {item.asl3Cost}</span>
                      </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Enhanced Cost Breakdown with ASL-3 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-bold text-white">Cost Breakdown</h3>
              </div>
              <div className="space-y-4">
                {[
                  { category: 'API Requests', cost: '$652', percentage: 77, subtext: 'LLM provider costs' },
                  { category: 'Security Scans (ASL-3)', cost: '$145', percentage: 17, subtext: 'Constitutional classifiers' },
                  { category: 'Data Storage', cost: '$50', percentage: 6, subtext: 'Logs & audit trails' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="text-slate-300">{item.category}</span>
                        <span className="text-xs text-slate-500">{item.subtext}</span>
                      </div>
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
              <div className="text-slate-400 text-sm mb-1">5x faster than competitors</div>
              <div className="text-xs text-indigo-400">ASL-3 classifier latency</div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Active Users</h3>
              </div>
              <div className="text-3xl font-bold text-purple-400 mb-2">1,243</div>
              <div className="text-slate-400 text-sm mb-1">+8.5% this week</div>
              <div className="text-xs text-indigo-400">Secured by ASL-3</div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Success Rate</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.7%</div>
              <div className="text-slate-400 text-sm mb-1">Industry leading</div>
              <div className="text-xs text-indigo-400">99.6% classifier accuracy</div>
            </div>
          </div>

          {/* ASL-3 Cost Optimization Tips */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">ASL-3 Cost Optimization</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-indigo-500/20">
                <div className="text-lg font-bold text-indigo-400 mb-2">Layer Caching</div>
                <div className="text-sm text-slate-300 mb-2">Reduces repeat scans by 34%</div>
                <div className="text-xs text-green-400">✓ Enabled - Saving $124/mo</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                <div className="text-lg font-bold text-purple-400 mb-2">Batch Processing</div>
                <div className="text-sm text-slate-300 mb-2">Async monitoring efficiency</div>
                <div className="text-xs text-green-400">✓ Enabled - Saving $87/mo</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-blue-500/20">
                <div className="text-lg font-bold text-blue-400 mb-2">Tiered Scanning</div>
                <div className="text-sm text-slate-300 mb-2">Risk-based prioritization</div>
                <div className="text-xs text-green-400">✓ Enabled - Saving $65/mo</div>
              </div>
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
    <RequireAuth role={'super_admin' as any}>
      <UsagePageContent />
    </RequireAuth>
  );
}
