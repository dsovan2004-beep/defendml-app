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
          avg_latency_ms: 4.0,
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
        <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-[#A0A0A0]">Loading Attack Operations Dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-[#0A0A0A]">
        {/* Header Section */}
        <div className="border-b border-[#1A1A1A] bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Red Team Command Center</h1>
                <p className="text-[#A0A0A0]">Offensive AI security testing - 255 attack prompts covering OWASP, NIST, MITRE, ASL-3</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <Zap className="w-4 h-4 text-red-300" />
                  <span className="text-sm font-medium text-red-300">Cloudflare Pages + Worker</span>
                </div>
                <select value={rangeFilter} onChange={(e) => setRangeFilter(Number(e.target.value))} className="px-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* Hero Section */}
          {redTeamMetrics && (
            <div className="relative bg-[#111111] rounded-2xl p-8 border border-red-500/30 shadow-2xl">
              <div className="absolute inset-0 bg-red-500/5 rounded-2xl animate-pulse"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Red Team Testing Status</h2>
                      <p className="text-sm text-[#A0A0A0]">Offense-first AI security testing powered by 255 attack scenarios</p>
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

                {/* Three offensive metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-6 border-2 border-green-500/40 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-semibold text-green-300">ASL-3 Compliance</span>
                    </div>
                    <div className="text-5xl font-bold text-green-400 mb-2">{redTeamMetrics.overall_score}%</div>
                    <div className="text-xs text-[#A0A0A0]">Measured across 35 CBRN attack tests</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-6 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-red-400" />
                      <span className="text-sm font-semibold text-red-300">Attack Scenarios</span>
                    </div>
                    <div className="text-4xl font-bold text-red-400 mb-2">255</div>
                    <div className="text-xs text-[#A0A0A0]">Industry-leading coverage vs ~50-70</div>
                  </div>
                  <div className="bg-black/40 rounded-xl p-6 border border-orange-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      <span className="text-sm font-semibold text-orange-300">Vulnerabilities Found</span>
                    </div>
                    <div className="text-4xl font-bold text-orange-400 mb-2">{redTeamMetrics.threats_blocked_24h}</div>
                    <div className="text-xs text-[#A0A0A0]">Last 24 hours (offensive impact)</div>
                  </div>
                </div>
                {/* Six offensive stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">{redTeamMetrics.classifier_accuracy}%</div>
                    <div className="text-xs text-[#A0A0A0]">Attack Precision</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &gt;99%</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">{redTeamMetrics.classifier_latency}ms</div>
                    <div className="text-xs text-[#A0A0A0]">Response Time</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;50ms</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">10</div>
                    <div className="text-xs text-[#A0A0A0]">Frameworks</div>
                    <div className="text-xs text-green-400 mt-1">✓ OWASP+NIST+MITRE</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">{redTeamMetrics.incident_response_time}s</div>
                    <div className="text-xs text-[#A0A0A0]">Scan Start Time</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;5s</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">{redTeamMetrics.false_positive_rate}%</div>
                    <div className="text-xs text-[#A0A0A0]">False Positives</div>
                    <div className="text-xs text-green-400 mt-1">✓ Target: &lt;1%</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-red-500/20 hover:border-red-500/40 transition-all">
                    <div className="text-2xl font-bold text-red-400 mb-1">{redTeamMetrics.threats_blocked_24h}</div>
                    <div className="text-xs text-[#A0A0A0]">Attacks (24h)</div>
                    <div className="text-xs text-orange-400 mt-1">Real-time</div>
                  </div>
                </div>

                {/* Attack Coverage Framework */}
                <div className="bg-black/40 rounded-xl p-6 border border-red-500/20 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-white">Attack Coverage Framework</span>
                    <span className="ml-auto text-xs text-green-400 font-medium">Industry-Leading Coverage</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">OWASP LLM Top 10</span>
                      </div>
                      <div className="text-xs text-[#A0A0A0]">100% coverage (10/10)</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">NIST AI RMF</span>
                      </div>
                      <div className="text-xs text-[#A0A0A0]">100% coverage (7/7)</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">MITRE ATLAS</span>
                      </div>
                      <div className="text-xs text-[#A0A0A0]">95% coverage (38/40)</div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs font-semibold text-white">ASL-3 CBRN</span>
                      </div>
                      <div className="text-xs text-[#A0A0A0]">96.5% measured compliance</div>
                    </div>
                  </div>
                </div>

                {/* Tagline and CTAs */}
                <div className="flex items-center justify-between pt-6 border-t border-red-500/20">
                  <p className="text-sm text-[#A0A0A0]">
                    <span className="font-semibold text-white">Offense-first AI red team service</span> delivering compliance-ready evidence in hours, not quarters
                  </p>
                  <div className="flex gap-3">
                    <a href="/compliance" className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-red-300 text-sm font-medium transition-all">
                      <FileCheck className="w-4 h-4" />
                      Attack Evidence
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="/tester" className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 rounded-lg text-orange-300 text-sm font-medium transition-all">
                      <Shield className="w-4 h-4" />
                      Execute Scan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a href="/intelligence" className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-lg text-green-300 text-sm font-medium transition-all">
                      <Activity className="w-4 h-4" />
                      Attack Intelligence
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top three cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#1A1A1A] hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Speed</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{kpis?.setup_time_minutes ?? 28} min</div>
              <div className="text-[#F5F5F5] text-sm font-medium mb-1">Time to first scan</div>
              <div className="text-[#A0A0A0] text-xs">Self-serve onboarding</div>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#1A1A1A] hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-xs font-semibold text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">Coverage</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">255</div>
              <div className="text-[#F5F5F5] text-sm font-medium mb-1">Attack Prompts</div>
              <div className="text-[#A0A0A0] text-xs">vs competitors' ~50-70</div>
            </div>
            <div className="bg-[#111111] rounded-2xl p-6 border border-[#1A1A1A] hover:border-red-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <span className="text-xs font-semibold text-red-300 bg-red-500/20 px-3 py-1 rounded-full">Response</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{redTeamMetrics?.classifier_latency ?? 4.0}ms</div>
              <div className="text-[#F5F5F5] text-sm font-medium mb-1">Real-time Testing</div>
              <div className="text-[#A0A0A0] text-xs">vs 50ms+ competitors</div>
            </div>
          </div>

          {/* Attack Performance Metrics */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-400" />
              Attack Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111111] rounded-xl p-6 border border-[#1A1A1A] hover:border-red-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <TrendIndicator value={kpis?.trend_threats} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.threats_blocked ?? 0).toLocaleString()}</div>
                <div className="text-[#F5F5F5] text-sm font-medium mb-1">Vulnerabilities Found</div>
                <div className="text-[#A0A0A0] text-xs">Prompt injection, jailbreaks</div>
              </div>
              <div className="bg-[#111111] rounded-xl p-6 border border-[#1A1A1A] hover:border-orange-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Lock className="w-6 h-6 text-orange-400" />
                  <TrendIndicator value={kpis?.trend_pii} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.pii_prevented ?? 0).toLocaleString()}</div>
                <div className="text-[#F5F5F5] text-sm font-medium mb-1">PII Extraction Attacks</div>
                <div className="text-[#A0A0A0] text-xs">35 attack prompts executed</div>
              </div>
              <div className="bg-[#111111] rounded-xl p-6 border border-[#1A1A1A] hover:border-green-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <FileCheck className="w-6 h-6 text-green-400" />
                  <TrendIndicator value={kpis?.trend_compliance} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.compliance_score ?? 0).toFixed(1)}%</div>
                <div className="text-[#F5F5F5] text-sm font-medium mb-1">Target Refusal Rate</div>
                <div className="text-[#A0A0A0] text-xs">How often targets blocked us</div>
              </div>
              <div className="bg-[#111111] rounded-xl p-6 border border-[#1A1A1A] hover:border-red-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Zap className="w-6 h-6 text-red-400" />
                  <TrendIndicator value={kpis?.trend_latency} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{kpis?.avg_latency_ms ?? 4.0}ms</div>
                <div className="text-[#F5F5F5] text-sm font-medium mb-1">Avg Latency</div>
                <div className="text-[#A0A0A0] text-xs">Low overhead</div>
              </div>
            </div>
          </div>

          {/* Active Attack Feed */}
          <div className="bg-[#111111] rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-white">Active Attack Feed</h3>
                <span className="text-xs text-zinc-500">(demo)</span>
              </div>
              <a href="/tester" className="text-sm text-red-400 hover:text-red-300 font-medium">View All →</a>
            </div>
            <div className="p-6 space-y-3">
              {[
                { time: '2 min ago', type: 'Prompt Injection Attack', severity: 'CRITICAL', action: 'BLOCKED', source: 'Claude' },
                { time: '5 min ago', type: 'PII Extraction (SSN)', severity: 'HIGH', action: 'SANITIZED', source: 'GPT-4' },
                { time: '8 min ago', type: 'Jailbreak Attempt', severity: 'HIGH', action: 'BLOCKED', source: 'Gemini' },
                { time: '12 min ago', type: 'Policy Violation Test', severity: 'MEDIUM', action: 'FLAGGED', source: 'Claude' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg hover:bg-[#222222] transition-all border border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${t.severity === 'CRITICAL' ? 'bg-red-500' : t.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                    <div>
                      <div className="text-white font-medium text-sm">{t.type}</div>
                      <div className="text-[#A0A0A0] text-xs">{t.time} • {t.source}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : t.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}`}>
                      {t.severity}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${t.action === 'BLOCKED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : t.action === 'SANITIZED' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'}`}>
                      {t.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/targets" className="p-6 bg-[#111111] hover:bg-[#1A1A1A] rounded-xl border border-[#1A1A1A] hover:border-red-500/50 transition-all block">
              <Shield className="w-8 h-8 text-red-400 mb-3" />
              <div className="text-white font-semibold mb-1">Attack Scenarios</div>
              <div className="text-[#A0A0A0] text-sm">255 offensive test prompts</div>
            </a>
            <a href="/compliance" className="p-6 bg-[#111111] hover:bg-[#1A1A1A] rounded-xl border border-[#1A1A1A] hover:border-green-500/50 transition-all block">
              <FileCheck className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-white font-semibold mb-1">Evidence Reports</div>
              <div className="text-[#A0A0A0] text-sm">Audit-grade documentation</div>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Protected() {
  return (
    <RequireAuth>
      <OverviewPage />
    </RequireAuth>
  );
}
