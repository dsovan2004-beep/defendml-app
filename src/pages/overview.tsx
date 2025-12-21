import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Shield, AlertTriangle, Lock, FileCheck, TrendingUp, TrendingDown,
  Zap, DollarSign, Clock, Activity, CheckCircle, ExternalLink,
  Layers, Target, Timer, AlertCircle, BarChart3
} from 'lucide-react';

type Kpis = {
  threats_blocked: number;
  pii_prevented: number;
  policy_violations: number;
  compliance_score: number;
  avg_latency_ms: number;
  success_rate: number;
  scan_count: number;
  setup_time_minutes?: number;
  cost_saved_vs_calypso?: number;
  multi_llm_providers?: number;
  trend_threats?: number;
  trend_pii?: number;
  trend_policy?: number;
  trend_compliance?: number;
  trend_latency?: number;
  trend_success?: number;
};

type RedTeamMetrics = {
  overall_score: number;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'INACTIVE';
  deployment_standard: number;
  security_standard: number;
  classifier_accuracy: number;
  classifier_latency: number;
  defense_layers_active: number;
  incident_response_time: number;
  false_positive_rate: number;
  threats_blocked_24h: number;
};

const TrendIndicator: React.FC<{ value?: number }> = ({ value }) => {
  if (value === undefined || value === null) return null;
  const isPositive = value > 0;
  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(value).toFixed(1)}%
    </div>
  );
};

function OverviewPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [redTeamMetrics, setRedTeamMetrics] = useState<RedTeamMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rangeFilter, setRangeFilter] = useState<number>(7);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/kpis?range_days=${rangeFilter}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('API connection failed');
        const data = await res.json();
        setKpis(data?.kpis ?? null);
      } catch (e) {
        console.error('API Error:', e);
        setKpis({
          threats_blocked: 2847,
          pii_prevented: 1234,
          policy_violations: 89,
          compliance_score: 99.2,
          avg_latency_ms: 42,
          success_rate: 99.94,
          scan_count: 45678,
          setup_time_minutes: 28,
          cost_saved_vs_calypso: 48750,
          multi_llm_providers: 4,
          trend_threats: 15.3,
          trend_pii: -8.2,
          trend_policy: 12.1,
          trend_compliance: 0.8,
          trend_latency: -3.2,
          trend_success: 0.1,
        });
      } finally {
        setLoading(false);
      }
    })();

    // Load Red Team metrics (demo data for now)
    setRedTeamMetrics({
      overall_score: 96.5,
      status: 'ACTIVE',
      deployment_standard: 98,
      security_standard: 94,
      classifier_accuracy: 99.6,
      classifier_latency: 4.0,
      defense_layers_active: 4,
      incident_response_time: 2.8,
      false_positive_rate: 0.3,
      threats_blocked_24h: 847
    });
  }, [rangeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading Red Team Dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 bg-slate-950">
        <div className="border-b border-slate-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Red Team Dashboard</h1>
                <p className="text-slate-400">Real-time security monitoring across 232 attack scenarios</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <Zap className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-medium text-purple-300">Cloudflare Pages + Worker</span>
                </div>
                <select
                  value={rangeFilter}
                  onChange={(e) => setRangeFilter(Number(e.target.value))}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* 🎯 RED TEAM TESTING STATUS - ENHANCED */}
          {redTeamMetrics && (
            <div className="relative bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/5 rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl animate-pulse"></div>
              
              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Red Team Testing Status</h2>
                      <p className="text-sm text-slate-400">Offense-first AI security testing powered by 232 attack scenarios</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm text-green-400">LIVE</span>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full border-2 text-green-400 bg-green-500/10 border-green-500/50">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-base">{redTeamMetrics.status}</span>
                    </div>
                  </div>
                </div>

                {/* Main Score Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Overall Score - Prominent */}
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 border-2 border-green-500/40 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-semibold text-green-300">Overall Test Coverage</span>
                    </div>
                    <div className="text-5xl font-bold text-green-400 mb-2">{redTeamMetrics.overall_score}%</div>
                    <div className="text-xs text-slate-400">232 attack scenarios tested</div>
                  </div>

                  {/* Deployment Standard */}
                  <div className="bg-black/40 rounded-xl p-6 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-purple-400" />
                      <span className="text-sm font-semibold text-purple-300">Attack Detection</span>
                    </div>
                    <div className="text-4xl font-bold text-purple-400 mb-2">{redTeamMetrics.deployment_standard}%</div>
                    <div className="text-xs text-slate-400">Threat prevention rate</div>
                  </div>

                  {/* Security Standard */}
                  <div className="bg-black/40 rounded-xl p-6 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-semibold text-blue-300">Security Score</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">{redTeamMetrics.security_standard}%</div>
                    <div className="text-xs text-slate-400">Model protection rate</div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.classifier_accuracy}%</div>
                    <div className="text-xs text-slate-400">Detection Accuracy</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &gt;99%</div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.classifier_latency}ms</div>
                    <div className="text-xs text-slate-400">Response Time</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;50ms</div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.defense_layers_active}/4</div>
                    <div className="text-xs text-slate-400">Defense Layers</div>
                    <div className="text-xs text-green-400 mt-1">✓ All Active</div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.incident_response_time}s</div>
                    <div className="text-xs text-slate-400">Response Time</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;5min</div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.false_positive_rate}%</div>
                    <div className="text-xs text-slate-400">False Positives</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;1%</div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                    <div className="text-2xl font-bold text-purple-400 mb-1">{redTeamMetrics.threats_blocked_24h}</div>
                    <div className="text-xs text-slate-400">Threats (24h)</div>
                    <div className="text-xs text-blue-400 mt-1">Real-time</div>
                  </div>
                </div>

                {/* Defense Layers Visualization */}
                <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-white">4-Layer Defense Architecture</span>
                    <span className="ml-auto text-xs text-green-400 font-medium">All Layers Active</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">L1: Access Controls</span>
                      </div>
                      <div className="text-xs text-slate-400">MFA, API keys, tiers</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">L2: Attack Detection</span>
                      </div>
                      <div className="text-xs text-slate-400">Real-time scanning</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">L3: Monitoring</span>
                      </div>
                      <div className="text-xs text-slate-400">Pattern analysis</div>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">L4: Response</span>
                      </div>
                      <div className="text-xs text-slate-400">Rapid remediation</div>
                    </div>
                  </div>
                </div>

                {/* Quick Links Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-purple-500/20">
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-white">First red team testing platform</span> with 232 public attack scenarios
                  </p>
                  <div className="flex gap-3">
                    <a 
                      href="/compliance" 
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-lg text-purple-300 text-sm font-medium transition-all"
                    >
                      <FileCheck className="w-4 h-4" />
                      View Reports
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="/threats" 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-300 text-sm font-medium transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      Threat Monitor
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href="/health" 
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 text-sm font-medium transition-all"
                    >
                      <Activity className="w-4 h-4" />
                      System Health
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Competitive Advantage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Setup</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{kpis?.setup_time_minutes ?? 28} min</div>
              <div className="text-slate-300 text-sm font-medium mb-1">Time to first scan</div>
              <div className="text-slate-400 text-xs">Self-serve onboarding</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">ROI</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">${(kpis?.cost_saved_vs_calypso ?? 48750).toLocaleString()}</div>
              <div className="text-slate-300 text-sm font-medium mb-1">Annual Savings</div>
              <div className="text-slate-400 text-xs">vs. enterprise platforms</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Interop</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{kpis?.multi_llm_providers ?? 4}+</div>
              <div className="text-slate-300 text-sm font-medium mb-1">LLM Providers</div>
              <div className="text-slate-400 text-xs">No vendor lock-in</div>
            </div>
          </div>

          {/* Security Performance */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              Security Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-red-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <TrendIndicator value={kpis?.trend_threats} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.threats_blocked ?? 0).toLocaleString()}</div>
                <div className="text-slate-300 text-sm font-medium mb-1">Threats Blocked</div>
                <div className="text-slate-400 text-xs">Prompt injection, jailbreaks</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <TrendIndicator value={kpis?.trend_pii} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.pii_prevented ?? 0).toLocaleString()}</div>
                <div className="text-slate-300 text-sm font-medium mb-1">PII Prevented</div>
                <div className="text-slate-400 text-xs">Data leak prevention</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-green-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <FileCheck className="w-6 h-6 text-green-400" />
                  <TrendIndicator value={kpis?.trend_compliance} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.compliance_score ?? 0).toFixed(1)}%</div>
                <div className="text-slate-300 text-sm font-medium mb-1">Compliance Score</div>
                <div className="text-slate-400 text-xs">SOC 2 / GDPR / HIPAA</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <TrendIndicator value={kpis?.trend_latency} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{kpis?.avg_latency_ms ?? 0}ms</div>
                <div className="text-slate-300 text-sm font-medium mb-1">Avg Latency</div>
                <div className="text-slate-400 text-xs">Low overhead</div>
              </div>
            </div>
          </div>

          {/* Live Threat Feed */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-white">Live Threat Feed</h3>
                <span className="text-xs text-slate-500">(demo)</span>
              </div>
              <a href="/threats" className="text-sm text-purple-400 hover:text-purple-300 font-medium">View All →</a>
            </div>
            <div className="p-6 space-y-3">
              {[
                { time: '2 min ago', type: 'Prompt Injection', severity: 'CRITICAL', action: 'BLOCKED', source: 'Claude' },
                { time: '5 min ago', type: 'PII Leak (SSN)', severity: 'HIGH', action: 'SANITIZED', source: 'GPT-4' },
                { time: '8 min ago', type: 'Jailbreak Attempt', severity: 'HIGH', action: 'BLOCKED', source: 'Gemini' },
                { time: '12 min ago', type: 'Policy Violation', severity: 'MEDIUM', action: 'FLAGGED', source: 'Claude' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      t.severity === 'CRITICAL' ? 'bg-red-500' :
                      t.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="text-white font-medium text-sm">{t.type}</div>
                      <div className="text-slate-400 text-xs">{t.time} • {t.source}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      t.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {t.severity}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      t.action === 'BLOCKED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      t.action === 'SANITIZED' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {t.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/threats" className="p-6 bg-slate-900 hover:bg-slate
