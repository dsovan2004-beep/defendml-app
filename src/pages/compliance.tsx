// src/pages/compliance.tsx - PART 1 OF 2
"use client";

import React from "react";
import { useRouter } from "next/router";
import {
  FileText,
  Download,
  Shield,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Activity,
  CheckCircle2,
} from "lucide-react";

import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import RequireAuth from "../components/RequireAuth";
import { UserRole } from "../types/roles";

/* -----------------------------
   Demo data (replace later)
------------------------------ */
type Decision = "BLOCK" | "FLAG" | "ALLOW";
type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type EvidenceRow = {
  reportId: string;
  target: string;
  scan: string;
  decision: Decision;
  category: string;
  severity: Severity;
  layer: string;
  timestamp: string;
};

const demoEvidence: EvidenceRow[] = [
  {
    reportId: "RPT-2025-12-21-0007",
    target: "Customer AI System A",
    scan: "ASL-3 Pack (40)",
    decision: "ALLOW",
    category: "CBRN Threat",
    severity: "CRITICAL",
    layer: "L1",
    timestamp: "2025-12-21 04:35 PST",
  },
  {
    reportId: "RPT-2025-12-21-0006",
    target: "Customer AI System B",
    scan: "ASL-3 Pack (40)",
    decision: "ALLOW",
    category: "Jailbreak Attempt",
    severity: "HIGH",
    layer: "L2",
    timestamp: "2025-12-21 04:33 PST",
  },
  {
    reportId: "RPT-2025-12-21-0005",
    target: "Customer AI System C",
    scan: "ASL-3 Pack (40)",
    decision: "ALLOW",
    category: "PII Extraction",
    severity: "HIGH",
    layer: "L1",
    timestamp: "2025-12-21 04:31 PST",
  },
];

function pillForDecision(d: Decision) {
  if (d === "BLOCK") return "bg-green-500/10 text-green-300 border border-green-500/30";
  if (d === "FLAG") return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
  return "bg-red-500/10 text-red-300 border border-red-500/30";
}

function pillForSeverity(s: Severity) {
  if (s === "CRITICAL") return "bg-red-500/10 text-red-300 border border-red-500/30";
  if (s === "HIGH") return "bg-orange-500/10 text-orange-300 border border-orange-500/30";
  if (s === "MEDIUM") return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
  return "bg-slate-500/10 text-slate-300 border border-slate-500/30";
}

function pct(n: number, d: number) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function CompliancePageContent() {
  const router = useRouter();
  const total = demoEvidence.length;

  const decisionCounts: Record<Decision, number> = { BLOCK: 0, FLAG: 0, ALLOW: 0 };
  const severityCounts: Record<Severity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const categoryCounts: Record<string, number> = {};

  for (const r of demoEvidence) {
    decisionCounts[r.decision] += 1;
    severityCounts[r.severity] += 1;
    categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
  }

  const attackSuccessRate = pct(decisionCounts.ALLOW, total);

  // Export functions
  const exportToJSON = () => {
    const dataStr = JSON.stringify(demoEvidence, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `defendml-attack-evidence-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    const headers = ['Report ID', 'Target System', 'Attack Scan', 'Result', 'Attack Type', 'Severity', 'Failed Layer', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...demoEvidence.map(row => 
        [row.reportId, row.target, row.scan, row.decision, row.category, row.severity, row.layer, row.timestamp]
          .map(field => `"${field}"`)
          .join(',')
      )
    ].join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `defendml-attack-evidence-${new Date().toISOString().split('T')[0]}.csv`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportToPDF = () => {
    alert('PDF export coming soon! Use CSV or JSON for now.');
  };

  const targetRecs = [
    {
      icon: <Shield className="w-5 h-5 text-red-300" />,
      title: "Target should block CBRN categories immediately",
      why: `Attack succeeded: ${decisionCounts.ALLOW} dangerous prompts bypassed target's defenses.`,
      what: [
        "Target must deploy explicit CBRN deny rules at L1",
        "Target's system requires constitutional AI filters",
        "Target needs logging of blocked attempts for compliance",
      ],
      badge: "Critical",
      badgeClass: "bg-red-500/10 text-red-300 border border-red-500/30",
    },
    {
      icon: <Target className="w-5 h-5 text-orange-300" />,
      title: "Target's jailbreak detection is non-existent",
      why: `Jailbreak attacks bypassed target's L2 layer (${pct(decisionCounts.FLAG, total)}% detection).`,
      what: [
        "Target should implement DAN/role-play detection",
        "Target needs system message override protection",
        "Target requires context confusion monitoring",
      ],
      badge: "High Priority",
      badgeClass: "bg-orange-500/10 text-orange-300 border border-orange-500/30",
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-300" />,
      title: "Target needs PII extraction safeguards",
      why: `PII extraction attempts succeeded against target's system.`,
      what: [
        "Target should scrub PII before processing prompts",
        "Target needs training data leakage prevention",
        "Target requires credential harvesting detection",
      ],
      badge: "Medium Priority",
      badgeClass: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />

      <main className="flex-1">
        {/* Header - WIRED BUTTONS */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <h1 className="text-3xl font-bold text-white">Red Team Attack Reports</h1>
                </div>
                <p className="text-slate-400">
                  Evidence of vulnerabilities found in customer AI systems through offensive red team testing.
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  Attack Library:{" "}
                  <span className="text-slate-300 font-semibold">255 scenarios</span> • Currently Testing:{" "}
                  <span className="text-slate-300 font-semibold">40 prompts per scan</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/tester')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Generate Report
                </button>
                <button
                  type="button"
                  onClick={exportToPDF}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium border border-purple-500/50 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Evidence
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Latest Attack</div>
              <div className="text-lg font-semibold text-white">RPT-2025-12-21-0007</div>
              <div className="text-xs text-slate-500 mt-1">Executed: 2025-12-21 04:35 PST</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Attack Library Size</div>
              <div className="text-3xl font-bold text-purple-400">255</div>
              <div className="text-xs text-slate-500 mt-1">Total attack scenarios</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Critical Bypasses</div>
              <div className="text-3xl font-bold text-red-400">{decisionCounts.ALLOW}</div>
              <div className="text-xs text-slate-500 mt-1">Dangerous prompts allowed</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Attack Success Rate</div>
              <div className="text-3xl font-bold text-red-400">{attackSuccessRate}%</div>
              <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Target defenses failed
              </div>
            </div>
          </div>

          {/* Attack Results Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Target Defense Performance */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-red-300" />
                <h2 className="text-lg font-semibold text-white">Target Defense Performance</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                How customer's system responded to attacks.
              </p>

              {(["BLOCK", "FLAG", "ALLOW"] as Decision[]).map((d) => {
                const isGood = d === "BLOCK";
                const isBad = d === "ALLOW";
                return (
                  <div key={d} className="mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${isGood ? 'text-green-300' : isBad ? 'text-red-300' : 'text-yellow-300'}`}>
                        {d} {isGood && '✓'} {isBad && '✗'}
                      </span>
                      <span className="text-slate-400">
                        {decisionCounts[d]} ({pct(decisionCounts[d], total)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          isGood ? 'bg-green-500/70' : isBad ? 'bg-red-500/70' : 'bg-yellow-500/70'
                        }`}
                        style={{ width: `${pct(decisionCounts[d], total)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vulnerabilities by Severity */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-orange-300" />
                <h2 className="text-lg font-semibold text-white">Vulnerabilities Found</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Severity of attacks that bypassed target's defenses.
              </p>

              {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Severity[]).map((s) => (
                <div key={s} className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{s}</span>
                    <span className="text-slate-400">
                      {severityCounts[s]} ({pct(severityCounts[s], total)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-slate-500/70"
                      style={{ width: `${pct(severityCounts[s], total)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Attack Coverage */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-purple-300" />
                <h2 className="text-lg font-semibold text-white">Attack Coverage</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Threat categories tested against target system.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Jailbreaks</span>
                  <span className="text-purple-400">40 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">CBRN/WMD</span>
                  <span className="text-purple-400">35 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">PII Extraction</span>
                  <span className="text-purple-400">35 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Cybersecurity</span>
                  <span className="text-purple-400">30 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Bias & Fairness</span>
                  <span className="text-purple-400">30 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">+5 more categories</span>
                  <span className="text-purple-400">85 prompts</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Full 255-prompt library available for comprehensive testing.
              </div>
            </div>
          </div>

// PART 1 ENDS HERE - Continue to Part 2 for Evidence Table and remaining sections
          // src/pages/compliance.tsx - PART 2 OF 2
// Continue from Part 1...

          {/* Evidence table - WIRED BUTTONS */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Attack Evidence & Exports</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Detailed results from red team attacks against customer AI systems.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportToPDF}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={exportToJSON}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors"
                >
                  Export JSON
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-950/60">
                  <tr className="text-left text-slate-400">
                    <th className="px-6 py-3 font-medium">Report ID</th>
                    <th className="px-6 py-3 font-medium">Target System</th>
                    <th className="px-6 py-3 font-medium">Attack Scan</th>
                    <th className="px-6 py-3 font-medium">Result</th>
                    <th className="px-6 py-3 font-medium">Attack Type</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Failed Layer</th>
                    <th className="px-6 py-3 font-medium">Timestamp</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {demoEvidence.map((row) => (
                    <tr key={row.reportId} className="text-slate-200 hover:bg-slate-950/40">
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">{row.reportId}</td>
                      <td className="px-6 py-4">{row.target}</td>
                      <td className="px-6 py-4">{row.scan}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pillForDecision(
                            row.decision
                          )}`}
                        >
                          {row.decision}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{row.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pillForSeverity(
                            row.severity
                          )}`}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
                          {row.layer}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{row.timestamp}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/reports/${row.reportId}`)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </td>
                    </tr>
                  ))}

                  {demoEvidence.length === 0 && (
                    <tr>
                      <td className="px-6 py-10 text-slate-400" colSpan={9}>
                        No attack reports yet. Run a red team scan to generate evidence.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Target Remediation Recommendations */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 mb-8 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Target Remediation Recommendations</h2>
              <p className="text-sm text-slate-400 mt-1">
                What the TARGET system needs to fix based on attack results.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {targetRecs.map((r) => (
                <div key={r.title} className="bg-slate-950/40 rounded-xl border border-slate-800 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {r.icon}
                      <h3 className="text-white font-semibold text-sm">{r.title}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.badgeClass}`}>
                      {r.badge}
                    </span>
                  </div>

                  <div className="text-sm text-slate-300 mb-3">
                    <span className="text-slate-400">Finding:</span> {r.why}
                  </div>

                  <div className="text-sm text-slate-300">
                    <div className="text-slate-400 mb-2">Target must implement:</div>
                    <ul className="space-y-2">
                      {r.what.map((w) => (
                        <li key={w} className="flex items-start gap-2">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attack Coverage Standards */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 mb-8">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Attack Coverage Standards</h2>
              <p className="text-sm text-slate-400 mt-1">DefendML's 255-prompt library mapped to security frameworks.</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">NIST AI RMF</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="text-green-400 font-medium">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Categories</span>
                    <span className="text-slate-300">All 7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Prompts</span>
                    <span className="text-slate-300">255</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">OWASP LLM Top 10</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="text-green-400 font-medium">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Categories</span>
                    <span className="text-slate-300">All 10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Depth</span>
                    <span className="text-slate-300">2.5x Lakera</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">MITRE ATLAS</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="text-green-400 font-medium">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Techniques</span>
                    <span className="text-slate-300">38/40</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tactics</span>
                    <span className="text-slate-300">14/14</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">ASL-3</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coverage</span>
                    <span className="text-green-400 font-medium">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Compliance</span>
                    <span className="text-green-400 font-medium">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">CBRN Tests</span>
                    <span className="text-slate-300">35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 text-xs text-slate-500 border border-slate-800 rounded-lg p-4 bg-slate-900">
            <div className="font-semibold text-slate-400 mb-2">About this dashboard:</div>
            <div className="space-y-1">
              <p>• This shows evidence from red team attacks against <span className="text-slate-300">customer AI systems</span></p>
              <p>• ALLOW = Attack succeeded (bad for target, good for finding vulnerabilities)</p>
              <p>• BLOCK = Target's defenses worked (good for target)</p>
              <p>• Recommendations are for what the TARGET needs to fix, not DefendML</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CompliancePage() {
  return (
    <RequireAuth role={UserRole.SUPER_ADMIN}>
      <CompliancePageContent />
    </RequireAuth>
  );
}

// PART 2 COMPLETE - Combine Part 1 + Part 2 to create full compliance.tsx file
