import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Shield, AlertTriangle, Lock, FileCheck, TrendingUp, TrendingDown,
  Zap, DollarSign, Clock, Activity
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
        setError('Demo mode — API offline');
      } finally {
        setLoading(false);
      }
    })();
  }, [rangeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading DefendML Dashboard...</p>
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
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">DefendML Command Center</h1>
                <p className="text-slate-400">Real-time AI security (live logs → KPIs)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <Zap className="w-4 h-4 text-purple-300" />
                  <span className="text-sm font-medium text-purple-300">Cloudflare Pages + Worker</span>
                </div>
                <select
                  value={rangeFilter}
                  onChange={(e) => setRangeFilter(Number(e.target.value))}
                  className="px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300 text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-green-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Setup</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{kpis?.setup_time_minutes ?? 28} min</div>
              <div className="text-slate-300 text-sm font-medium mb-1">Time to value</div>
              <div className="text-slate-400 text-xs">Self-serve onboarding</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">ROI</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">${(kpis?.cost_saved_vs_calypso ?? 48750).toLocaleString()}</div>
              <div className="text-slate-300 text-sm font-medium mb-1">Annual Savings</div>
              <div className="text-slate-400 text-xs">vs. heavy enterprise stacks</div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Interop</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{kpis?.multi_llm_providers ?? 4}+</div>
              <div className="text-slate-300 text-sm font-medium mb-1">LLM Providers</div>
              <div className="text-slate-400 text-xs">No vendor lock-in</div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              Security Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <TrendIndicator value={kpis?.trend_threats} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.threats_blocked ?? 0).toLocaleString()}</div>
                <div className="text-slate-300 text-sm font-medium mb-1">Threats Blocked</div>
                <div className="text-slate-400 text-xs">Prompt injection, jailbreaks</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <TrendIndicator value={kpis?.trend_pii} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.pii_prevented ?? 0).toLocaleString()}</div>
                <div className="text-slate-300 text-sm font-medium mb-1">PII Prevented</div>
                <div className="text-slate-400 text-xs">Data leak prevention</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <FileCheck className="w-6 h-6 text-green-400" />
                  <TrendIndicator value={kpis?.trend_compliance} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{(kpis?.compliance_score ?? 0).toFixed(1)}%</div>
                <div className="text-slate-300 text-sm font-medium mb-1">Compliance Score</div>
                <div className="text-slate-400 text-xs">SOC 2 / GDPR / HIPAA</div>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
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

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
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
                <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all border border-slate-700/30">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/threats" className="p-6 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all block">
              <Shield className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-white font-semibold mb-1">View Threats</div>
              <div className="text-slate-400 text-sm">Live attack feed & analytics</div>
            </a>
            <a href="/pii" className="p-6 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all block">
              <Lock className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-white font-semibold mb-1">PII Protection</div>
              <div className="text-slate-400 text-sm">Data leak prevention logs</div>
            </a>
            <a href="/compliance" className="p-6 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800/80 rounded-xl border border-slate-700/50 hover:border-green-500/50 transition-all block">
              <FileCheck className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-white font-semibold mb-1">Compliance Reports</div>
              <div className="text-slate-400 text-sm">One-click audit packs</div>
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
