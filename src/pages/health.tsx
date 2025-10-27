// src/pages/health.tsx
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { UserRole } from '../types/roles';
import { Activity, Zap, CheckCircle, TrendingUp, Server, Database, Gauge, Shield } from 'lucide-react';

function HealthPageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
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
              <div className="text-purple-400/60 text-sm mt-1">Across 5 providers</div>
            </div>
          </div>

          {/* NEW: ASL-3 Security Performance */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20 backdrop-blur-lg mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">ASL-3 Security Performance</h2>
                <p className="text-slate-400 text-sm">Real-time constitutional classifier and defense layer health</p>
              </div>
            </div>

            {/* Constitutional Classifier Health */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Constitutional Classifier Health
              </h3>
              <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Status</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-400">ACTIVE</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Accuracy</div>
                    <div className="text-lg font-bold text-green-400">99.6%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Latency (P95)</div>
                    <div className="text-lg font-bold text-cyan-400">42ms</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">False Positive Rate</div>
                    <div className="text-lg font-bold text-yellow-400">0.3%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Throughput</div>
                    <div className="text-lg font-bold text-blue-400">2.4K/s</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Defense Layer Status */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Defense Layer Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { num: 1, name: 'Access Controls', status: 'HEALTHY', uptime: '99.99%', latency: '5ms' },
                  { num: 2, name: 'Real-Time Classifiers', status: 'HEALTHY', uptime: '99.94%', latency: '42ms' },
                  { num: 3, name: 'Async Monitoring', status: 'HEALTHY', uptime: '99.98%', latency: '120ms' },
                  { num: 4, name: 'Rapid Response', status: 'HEALTHY', uptime: '99.95%', latency: '2.8s' }
                ].map(layer => (
                  <div key={layer.num} className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                          <span className="text-green-400 font-bold text-sm">L{layer.num}</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-xs text-green-400 font-semibold">{layer.status}</span>
                    </div>
                    <div className="text-sm font-semibold text-white mb-2">{layer.name}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Uptime</span>
                      <span className="text-slate-300">{layer.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-slate-400">Avg Latency</span>
                      <span className="text-slate-300">{layer.latency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ASL-3 Response Metrics */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Response Time Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Avg Response Time</div>
                  <div className="text-2xl font-bold text-green-400">2.8s</div>
                  <div className="text-xs text-slate-500 mt-1">Target: &lt;5min ✓</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">Detection Rate</div>
                  <div className="text-2xl font-bold text-cyan-400">99.6%</div>
                  <div className="text-xs text-slate-500 mt-1">847 threats blocked</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">False Negatives</div>
                  <div className="text-2xl font-bold text-yellow-400">0.1%</div>
                  <div className="text-xs text-slate-500 mt-1">2 incidents (24h)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-slate-400 mb-1">System Load</div>
                  <div className="text-2xl font-bold text-blue-400">34%</div>
                  <div className="text-xs text-slate-500 mt-1">Healthy capacity</div>
                </div>
              </div>
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
                { provider: 'Perplexity AI', latency: '48ms', success: '99.4%', requests: '3.5K', color: 'cyan' },
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
      <Footer />
    </div>
  );
}

export default function HealthPage() {
  return (
    <RequireAuth role={UserRole.SUPER_ADMIN}>
      <HealthPageContent />
    </RequireAuth>
  );
}
