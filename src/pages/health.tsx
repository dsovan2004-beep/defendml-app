// src/pages/health.tsx
import React from 'react';
import Navigation from '../components/Navigation';
import RequireAuth from '../components/RequireAuth';
import { Activity, Zap, CheckCircle, TrendingUp, Server, Database, Gauge } from 'lucide-react';

function HealthPageContent() {
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
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

          {/* Provider Performance */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Provider Performance</h2>
            <div className="space-y-4">
              {[
                { provider: 'OpenAI (GPT-4)', latency: '38ms', success: '99.8%', requests: '18.2K', color: 'green' },
                { provider: 'Anthropic (Claude)', latency: '42ms', success: '99.9%', requests: '15.6K', color: 'purple' },
                { provider: 'Google (Gemini)', latency: '45ms', success: '99.6%', requests: '8.4K', color: 'blue' },
                { provider: 'Mistral AI', latency: '51ms', success: '99.2%', requests: '2.8K', color: 'orange' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <Server className={`w-5 h-5 text-${item.color}-400`} />
                    <div>
                      <div className="text-white font-medium">{item.provider}</div>
                      <div className="text-slate-400 text-sm">{item.requests} requests</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-cyan-400 font-medium">{item.latency}</div>
                      <div className="text-slate-500 text-xs">Latency</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">{item.success}</div>
                      <div className="text-slate-500 text-xs">Success</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Resources & Database */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Resources */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Gauge className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">System Resources</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">CPU Usage</span>
                    <span className="text-cyan-400 font-medium">34%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-purple-400 font-medium">2.8 GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '56%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Network I/O</span>
                    <span className="text-green-400 font-medium">1.2 GB/s</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Health */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Database Health</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Connection Pool</span>
                  <span className="text-green-400 font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Query Latency</span>
                  <span className="text-cyan-400 font-medium">12ms avg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Cache Hit Rate</span>
                  <span className="text-purple-400 font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-slate-300">Active Connections</span>
                  <span className="text-blue-400 font-medium">47 / 100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Uptime Trend */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mt-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">30-Day Uptime</h3>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-12 rounded ${
                    Math.random() > 0.02 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={`Day ${i + 1}`}
                ></div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-slate-400 text-sm">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-slate-400 text-sm">Downtime</span>
              </div>
              <div className="text-green-400 font-medium">99.94% Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HealthPage() {
  return (
    <RequireAuth role="admin">
      <HealthPageContent />
    </RequireAuth>
  );
}
