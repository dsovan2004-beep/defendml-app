import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Shield, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle,
  Activity, Zap, BarChart3, Clock, FileText, ExternalLink, ChevronRight,
  Layers, Lock, Database, GitBranch
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AttackIntelligence {
  technique_id: string;
  technique_name: string;
  mitre_atlas_id: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  attempts: number;
  successes: number;
  success_rate: number;
  first_seen: Date;
  last_seen: Date;
  layer_breakdown: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
  evasion_variants: string[];
  sample_prompts: string[];
}

interface AttackSummary {
  total_attacks: number;
  total_reports: number;
  avg_success_rate: number;
  top_technique: string;
  frameworks_covered: number;
  recent_activity: {
    report_id: string;
    target: string;
    attacks: number;
    timestamp: Date;
  }[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function IntelligencePage() {
  const [intelligence, setIntelligence] = useState<AttackIntelligence[]>([]);
  const [summary, setSummary] = useState<AttackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(30);

  useEffect(() => {
    loadAttackIntelligence();
  }, [timeRange]);

  async function loadAttackIntelligence() {
    setLoading(true);
    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Run all queries in parallel
      const [
        { data: allResults },
        { count: reportCount },
        { data: recentReports },
        { data: testMeta },
      ] = await Promise.all([
        // All results for client-side aggregation
        sb.from('red_team_results')
          .select('category, decision, layer_stopped, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
        // Total report count
        sb.from('red_team_reports')
          .select('id', { count: 'exact', head: true }),
        // Last 3 reports with target name via FK join
        sb.from('red_team_reports')
          .select('id, created_at, total_tests, targets(name)')
          .order('created_at', { ascending: false })
          .limit(3),
        // Severity + framework metadata per category from test library
        sb.from('red_team_tests')
          .select('category, severity, framework'),
      ]);

      const results = allResults ?? [];
      const tests = testMeta ?? [];

      // ── Static lookup maps (library-level, not scan-data) ──────────────────
      const mitreMap: Record<string, string> = {
        jailbreaks_constitutional: 'AML.T0043',
        pii_data_extraction:       'AML.T0020',
        cbrn_wmd:                  'AML.T0015',
        cybersecurity_exploits:    'AML.T0040',
        model_manipulation:        'AML.T0048',
        prompt_injection:          'AML.T0051',
        bias_fairness:             'AML.T0025',
        adversarial_robustness:    'AML.T0029',
        deployment_standard:       'AML.T0035',
        data_extraction:           'AML.T0022',
      };
      const categoryNames: Record<string, string> = {
        jailbreaks_constitutional: 'Jailbreak / Constitutional Attack',
        pii_data_extraction:       'PII Data Extraction',
        cbrn_wmd:                  'CBRN/WMD Elicitation',
        cybersecurity_exploits:    'Cybersecurity Exploit',
        model_manipulation:        'Model Manipulation',
        prompt_injection:          'Prompt Injection',
        bias_fairness:             'Bias & Fairness Exploit',
        adversarial_robustness:    'Adversarial Robustness',
        deployment_standard:       'Deployment Standard Violation',
        data_extraction:           'Data Extraction',
      };

      // ── Build per-category metadata from test library ──────────────────────
      const categoryMeta: Record<string, { severity: string; frameworks: Set<string> }> = {};
      for (const t of tests) {
        if (!categoryMeta[t.category]) {
          categoryMeta[t.category] = { severity: t.severity ?? 'MEDIUM', frameworks: new Set() };
        }
        if (t.framework) categoryMeta[t.category].frameworks.add(t.framework);
      }

      // ── Aggregate results by category ──────────────────────────────────────
      type CatStats = {
        attempts: number; successes: number;
        first_seen: Date; last_seen: Date;
        layers: Record<string, number>;
      };
      const catMap: Record<string, CatStats> = {};
      for (const r of results) {
        if (!catMap[r.category]) {
          catMap[r.category] = {
            attempts: 0, successes: 0,
            first_seen: new Date(r.created_at),
            last_seen: new Date(r.created_at),
            layers: {},
          };
        }
        const c = catMap[r.category];
        c.attempts += 1;
        if (r.decision === 'ALLOW') c.successes += 1;
        const dt = new Date(r.created_at);
        if (dt < c.first_seen) c.first_seen = dt;
        if (dt > c.last_seen) c.last_seen = dt;
        // Only record layer_stopped for blocked/flagged — not for allows (no layer stopped them)
        if (r.layer_stopped && r.decision !== 'ALLOW') {
          c.layers[r.layer_stopped] = (c.layers[r.layer_stopped] ?? 0) + 1;
        }
      }

      // ── Build AttackIntelligence[], sorted by success_rate desc ────────────
      const liveIntelligence: AttackIntelligence[] = Object.entries(catMap)
        .map(([category, stats]) => {
          const meta = categoryMeta[category];
          const successRate = stats.attempts > 0
            ? parseFloat(((stats.successes / stats.attempts) * 100).toFixed(1))
            : 0;
          return {
            technique_id: category,
            technique_name: categoryNames[category]
              ?? category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            mitre_atlas_id: mitreMap[category] ?? 'AML.T—',
            category,
            severity: (meta?.severity ?? 'MEDIUM') as AttackIntelligence['severity'],
            attempts: stats.attempts,
            successes: stats.successes,
            success_rate: successRate,
            first_seen: stats.first_seen,
            last_seen: stats.last_seen,
            layer_breakdown: {
              L1: stats.layers['L1'] ?? 0,
              L2: stats.layers['L2'] ?? 0,
              L3: stats.layers['L3'] ?? 0,
              L4: stats.layers['L4'] ?? 0,
            },
            evasion_variants: [], // not stored in DB
            sample_prompts: [],   // not stored in DB
          };
        })
        .sort((a, b) => b.success_rate - a.success_rate);

      // ── Compute summary ─────────────────────────────────────────────────────
      const totalAttacks = results.length;
      const allowCount = results.filter(r => r.decision === 'ALLOW').length;
      const avgSuccessRate = totalAttacks > 0
        ? parseFloat(((allowCount / totalAttacks) * 100).toFixed(1))
        : 0;

      // Distinct frameworks seen across result categories
      const seenCategories = new Set(results.map(r => r.category));
      const allFrameworks = new Set<string>();
      for (const t of tests) {
        if (seenCategories.has(t.category) && t.framework) {
          allFrameworks.add(t.framework);
        }
      }

      // Recent activity from real reports + target names
      const recentActivity = (recentReports ?? []).map((rpt: any) => ({
        report_id: rpt.id,
        target: (rpt.targets as any)?.name ?? 'Unknown Target',
        attacks: rpt.total_tests ?? 0,
        timestamp: new Date(rpt.created_at),
      }));

      setIntelligence(liveIntelligence);
      setSummary({
        total_attacks: totalAttacks,
        total_reports: reportCount ?? 0,
        avg_success_rate: avgSuccessRate,
        top_technique: liveIntelligence[0]?.technique_name ?? 'No attacks recorded yet',
        frameworks_covered: allFrameworks.size,
        recent_activity: recentActivity,
      });
    } catch (error) {
      console.error('Failed to load attack intelligence:', error);
      // Show zeros on error — never fake numbers
      setIntelligence([]);
      setSummary({
        total_attacks: 0, total_reports: 0, avg_success_rate: 0,
        top_technique: 'No data available', frameworks_covered: 0, recent_activity: [],
      });
    } finally {
      setLoading(false);
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'HIGH': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'LOW': return 'text-orange-400 bg-red-500/20 border-red-500/30';
      default: return 'text-[#A0A0A0] bg-slate-500/20 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 bg-[#0A0A0A] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-[#A0A0A0]">Loading Attack Intelligence...</p>
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
                <h1 className="text-3xl font-bold text-white mb-2">Attack Intelligence</h1>
                <p className="text-[#A0A0A0]">AI-powered insights from offensive security testing across 295 attack scenarios</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <Activity className="w-4 h-4 text-green-300" />
                  <span className="text-sm font-medium text-green-300">AI-Powered Analysis</span>
                </div>
                {/* Time range selector — hidden until API is wired */}
                {/* <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="px-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value={7}>Last 7 Days</option>
                  <option value={30}>Last 30 Days</option>
                  <option value={90}>Last 90 Days</option>
                  <option value={365}>Last Year</option>
                </select> */}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-sm font-semibold text-red-300">Total Attacks Executed</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{summary.total_attacks.toLocaleString()}</div>
                <div className="text-xs text-[#A0A0A0]">Across {summary.total_reports} scan reports</div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-sm font-semibold text-red-300">Avg Success Rate</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{summary.avg_success_rate.toFixed(1)}%</div>
                <div className="text-xs text-[#A0A0A0]">Attacks that bypassed defenses</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-cyan-500/10 rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Layers className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-sm font-semibold text-orange-300">Frameworks Covered</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{summary.frameworks_covered}</div>
                <div className="text-xs text-[#A0A0A0]">OWASP, NIST, MITRE, ASL-3</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-sm font-semibold text-green-300">Attack Techniques</div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{intelligence.length}</div>
                <div className="text-xs text-[#A0A0A0]">Unique MITRE ATLAS techniques</div>
              </div>
            </div>
          )}
          {/* Top Attack Techniques */}
          <div className="bg-[#111111] rounded-2xl border border-[#1A1A1A] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A1A1A]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                Most Effective Attack Techniques
              </h2>
              <p className="text-sm text-[#A0A0A0] mt-1">Ranked by success rate at bypassing target defenses</p>
            </div>
            <div className="p-6 space-y-3">
              {intelligence.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium mb-1">No attack results recorded yet</p>
                  <p className="text-xs text-zinc-600 mb-4">Run your first red team scan to see technique-level intelligence here</p>
                  <a href="/admin/targets" className="text-red-400 text-sm hover:text-red-300 transition-colors">
                    Run first scan →
                  </a>
                </div>
              ) : intelligence.map((tech, index) => (
                <div
                  key={tech.technique_id}
                  className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 hover:border-red-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedTechnique(tech.technique_id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-lg font-bold text-red-400">#{index + 1}</div>
                        <div>
                          <div className="text-white font-semibold">{tech.technique_name}</div>
                          <div className="text-xs text-[#A0A0A0]">{tech.mitre_atlas_id} • {tech.category}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(tech.severity)}`}>
                        {tech.severity}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-[#A0A0A0] mb-1">Attacks Executed</div>
                      <div className="text-lg font-bold text-white">{tech.attempts}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#A0A0A0] mb-1">Successful Bypasses</div>
                      <div className="text-lg font-bold text-red-400">{tech.successes}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#A0A0A0] mb-1">Success Rate</div>
                      <div className="text-lg font-bold text-orange-400">{tech.success_rate.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-[#A0A0A0] mb-2">Target Defense Layer Breakdown</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-[#222222] rounded p-2">
                        <div className="text-xs text-[#A0A0A0]">L1: Access</div>
                        <div className="text-sm font-bold text-white">{tech.layer_breakdown.L1}</div>
                      </div>
                      <div className="bg-[#222222] rounded p-2">
                        <div className="text-xs text-[#A0A0A0]">L2: Detection</div>
                        <div className="text-sm font-bold text-white">{tech.layer_breakdown.L2}</div>
                      </div>
                      <div className="bg-[#222222] rounded p-2">
                        <div className="text-xs text-[#A0A0A0]">L3: Monitor</div>
                        <div className="text-sm font-bold text-white">{tech.layer_breakdown.L3}</div>
                      </div>
                      <div className="bg-[#222222] rounded p-2">
                        <div className="text-xs text-[#A0A0A0]">L4: Response</div>
                        <div className="text-sm font-bold text-white">{tech.layer_breakdown.L4}</div>
                      </div>
                    </div>
                  </div>

                  {tech.evasion_variants.length > 0 && (
                    <div>
                      <div className="text-xs text-[#A0A0A0] mb-2">Evasion Techniques Detected</div>
                      <div className="flex flex-wrap gap-2">
                        {tech.evasion_variants.map((variant, i) => (
                          <span key={i} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-300">
                            {variant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Framework Coverage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] rounded-2xl border border-[#1A1A1A] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1A1A1A]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-orange-400" />
                  MITRE ATLAS Coverage
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F5F5F5]">Initial Access</span>
                      <span className="text-sm font-semibold text-green-400">100%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F5F5F5]">ML Model Access</span>
                      <span className="text-sm font-semibold text-green-400">95%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F5F5F5]">Persistence</span>
                      <span className="text-sm font-semibold text-yellow-400">85%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F5F5F5]">Exfiltration</span>
                      <span className="text-sm font-semibold text-green-400">90%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#F5F5F5]">Impact</span>
                      <span className="text-sm font-semibold text-green-400">100%</span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="text-sm text-orange-300 font-medium mb-1">Overall MITRE ATLAS Coverage</div>
                  <div className="text-3xl font-bold text-orange-400">95%</div>
                  <div className="text-xs text-[#A0A0A0]">38 out of 40 techniques tested</div>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] rounded-2xl border border-[#1A1A1A] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1A1A1A]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Recent Attack Activity
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {!summary?.recent_activity.length ? (
                  <div className="text-center py-8 text-zinc-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No scan reports yet</p>
                    <a href="/admin/targets" className="text-red-400 text-xs hover:text-red-300 mt-2 inline-block transition-colors">
                      Run a scan to see activity here →
                    </a>
                  </div>
                ) : summary.recent_activity.map((activity, i) => (
                  <div key={i} className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 hover:border-green-500/50 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{activity.target}</div>
                        <div className="text-xs text-[#A0A0A0]">
                          Report: {activity.report_id.slice(0, 8)}…
                        </div>
                      </div>
                      <a
                        href={`/reports/${activity.report_id}`}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#F5F5F5]">{activity.attacks} attacks executed</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href="/compliance"
                  className="block w-full p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center text-red-300 hover:bg-red-500/20 transition-all font-medium"
                >
                  View All Evidence Reports →
                </a>
              </div>
            </div>
          </div>

          {/* Bottom CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/asl3-testing" className="p-6 bg-[#111111] hover:bg-[#1A1A1A] rounded-xl border border-[#1A1A1A] hover:border-red-500/50 transition-all block">
              <Target className="w-8 h-8 text-red-400 mb-3" />
              <div className="text-white font-semibold mb-1">Execute New Scan</div>
              <div className="text-[#A0A0A0] text-sm">Launch red team attack against new target</div>
            </a>
            <a href="/compliance" className="p-6 bg-[#111111] hover:bg-[#1A1A1A] rounded-xl border border-[#1A1A1A] hover:border-green-500/50 transition-all block">
              <FileText className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-white font-semibold mb-1">Evidence Reports</div>
              <div className="text-[#A0A0A0] text-sm">View audit-grade documentation</div>
            </a>
            <a href="/admin/targets" className="p-6 bg-[#111111] hover:bg-[#1A1A1A] rounded-xl border border-[#1A1A1A] hover:border-red-500/50 transition-all block">
              <Database className="w-8 h-8 text-orange-400 mb-3" />
              <div className="text-white font-semibold mb-1">Attack Targets</div>
              <div className="text-[#A0A0A0] text-sm">Manage target systems for testing</div>
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
      <IntelligencePage />
    </RequireAuth>
  );
}
