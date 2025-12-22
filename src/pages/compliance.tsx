// src/pages/compliance.tsx
"use client";

import React from "react";
import {
  FileText,
  Download,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Award,
  TrendingUp,
  FileCheck,
  Sparkles,
  Wrench,
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
type Layer = "L1" | "L2" | "L3" | "L4";

type EvidenceRow = {
  reportId: string;
  target: string;
  scan: string;
  decision: Decision;
  category: string;
  severity: Severity;
  layer: Layer;
  timestamp: string;
};

const demoEvidence: EvidenceRow[] = [
  {
    reportId: "RPT-2025-12-21-0007",
    target: "Demo Chat Target",
    scan: "ASL-3 Pack (232)",
    decision: "BLOCK",
    category: "CBRN Threat",
    severity: "CRITICAL",
    layer: "L3",
    timestamp: "2025-12-21 04:35 PST",
  },
  {
    reportId: "RPT-2025-12-21-0006",
    target: "Demo API Target",
    scan: "ASL-3 Pack (232)",
    decision: "FLAG",
    category: "Jailbreak Attempt",
    severity: "HIGH",
    layer: "L2",
    timestamp: "2025-12-21 04:33 PST",
  },
  {
    reportId: "RPT-2025-12-21-0005",
    target: "Demo Internal Agent",
    scan: "ASL-3 Pack (232)",
    decision: "ALLOW",
    category: "Benign",
    severity: "LOW",
    layer: "L1",
    timestamp: "2025-12-21 04:31 PST",
  },
];

function pillForDecision(d: Decision) {
  if (d === "BLOCK") return "bg-red-500/10 text-red-300 border border-red-500/30";
  if (d === "FLAG") return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
  return "bg-green-500/10 text-green-300 border border-green-500/30";
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

function topByCount(map: Record<string, number>) {
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0] : null;
}

function CompliancePageContent() {
  // -----------------------------
  // Demo “Trend framing” metrics derived from evidence
  // (Real wiring later: scans → reports → evidence rows)
  // -----------------------------
  const total = demoEvidence.length;

  const decisionCounts: Record<Decision, number> = { BLOCK: 0, FLAG: 0, ALLOW: 0 };
  const severityCounts: Record<Severity, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const layerCounts: Record<Layer, number> = { L1: 0, L2: 0, L3: 0, L4: 0 };
  const categoryCounts: Record<string, number> = {};

  for (const r of demoEvidence) {
    decisionCounts[r.decision] += 1;
    severityCounts[r.severity] += 1;
    layerCounts[r.layer] += 1;
    categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1;
  }

  const topCategory = topByCount(categoryCounts);
  const topLayer = topByCount(layerCounts as unknown as Record<string, number>);

  // -----------------------------
  // Demo “Recommendations” logic (deterministic)
  // (Real wiring later: tie to scenario IDs + scan metadata)
  // -----------------------------
  const recs = [
    {
      icon: <Shield className="w-5 h-5 text-red-300" />,
      title: "Block critical categories with explicit policy + enforcement",
      why: topCategory
        ? `Top category by volume is "${topCategory[0]}" (${topCategory[1]} of ${total}).`
        : "No category data available yet.",
      what: [
        "Add explicit deny rules for the top critical categories",
        "Route BLOCK decisions to a hardened refusal template",
        "Log decision rationale + matched rule IDs for audit export",
      ],
      badge: "High impact",
      badgeClass: "bg-red-500/10 text-red-300 border border-red-500/30",
    },
    {
      icon: <Wrench className="w-5 h-5 text-yellow-300" />,
      title: "Reduce FLAG noise with tighter thresholds + explanations",
      why: `FLAG rate is ${pct(decisionCounts.FLAG, total)}% (${decisionCounts.FLAG}/${total}).`,
      what: [
        "Separate “review required” vs “policy uncertain” flags",
        "Capture a short, structured rationale for each FLAG",
        "Add “recommended fix” hints tied to scenario class (demo-safe)",
      ],
      badge: "Quick win",
      badgeClass: "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-300" />,
      title: "Harden the most-used defense layer and prove drift over time",
      why: topLayer
        ? `Most-attributed layer is ${topLayer[0]} (${topLayer[1]} of ${total}).`
        : "No layer attribution yet.",
      what: [
        "Track layer attribution by scenario class (jailbreak, leakage, misuse)",
        "Add 30-day rolling trend cards (pass/fail/flag + severity mix)",
        "Show “before vs after” improvements when configs change",
      ],
      badge: "Strategy-aligned",
      badgeClass: "bg-purple-500/10 text-purple-300 border border-purple-500/30",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <h1 className="text-3xl font-bold text-white">Reports</h1>
                </div>
                <p className="text-slate-400">
                  Export evidence for audits, customers, and internal reviews.
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  Report pack:{" "}
                  <span className="text-slate-300 font-semibold">ASL-3 (demo)</span> • Source:{" "}
                  <span className="text-slate-300 font-semibold">Scans → Evidence rows</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Generate Report
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium border border-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Latest Report</div>
              <div className="text-lg font-semibold text-white">RPT-2025-12-21-0007</div>
              <div className="text-xs text-slate-500 mt-1">Generated: 2025-12-21 04:35 PST</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Scenario Pack Size</div>
              <div className="text-3xl font-bold text-orange-400">232</div>
              <div className="text-xs text-slate-500 mt-1">Demo policy pack coverage</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">High-severity Findings</div>
              <div className="text-3xl font-bold text-red-400">88</div>
              <div className="text-xs text-slate-500 mt-1">Critical categories (demo)</div>
            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Risk Trend (30d)</div>
              <div className="text-3xl font-bold text-green-400">94%</div>
              <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +3 pts vs prior 30d (demo)
              </div>
            </div>
          </div>

          {/* Trend framing (metrics + visuals) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Decision mix */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-blue-300" />
                <h2 className="text-lg font-semibold text-white">Decision Mix</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Snapshot distribution (demo). Wire to 30d rolling windows later.
              </p>

              {(["BLOCK", "FLAG", "ALLOW"] as Decision[]).map((d) => (
                <div key={d} className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{d}</span>
                    <span className="text-slate-400">
                      {decisionCounts[d]} ({pct(decisionCounts[d], total)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-slate-500/70"
                      style={{ width: `${pct(decisionCounts[d], total)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Severity mix */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-5 h-5 text-yellow-300" />
                <h2 className="text-lg font-semibold text-white">Severity Mix</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                What’s driving risk (demo). Later: stack by scenario class + target.
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

            {/* Top drivers */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-purple-300" />
                <h2 className="text-lg font-semibold text-white">Top Drivers</h2>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                “What moved the needle” (demo). Later: show deltas vs prior period.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Top Category</span>
                  <span className="text-slate-400">
                    {topCategory ? `${topCategory[0]} (${topCategory[1]})` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Most-hit Layer</span>
                  <span className="text-slate-400">
                    {topLayer ? `${topLayer[0]} (${topLayer[1]})` : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">FLAG Rate</span>
                  <span className="text-slate-400">{pct(decisionCounts.FLAG, total)}%</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Next: trend these by target + scan pack and export them in the report artifact.
              </div>
            </div>
          </div>

          {/* Evidence table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Evidence & Exports</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Reports are generated from Scans and include decision + rationale fields suitable for audits.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Export PDF
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    <th className="px-6 py-3 font-medium">Target</th>
                    <th className="px-6 py-3 font-medium">Scan</th>
                    <th className="px-6 py-3 font-medium">Decision</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Layer</th>
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
                          disabled
                          title="Coming soon"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
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
                        No reports yet. Run a scan to generate audit evidence.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 2: Recommendations (UI + logic) */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 mb-8 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Recommendations</h2>
              <p className="text-sm text-slate-400 mt-1">
                Actionable fixes derived from evidence outputs (demo logic). Wire to scenario IDs + scan metadata next.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {recs.map((r) => (
                <div key={r.title} className="bg-slate-950/40 rounded-xl border border-slate-800 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {r.icon}
                      <h3 className="text-white font-semibold">{r.title}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.badgeClass}`}>
                      {r.badge}
                    </span>
                  </div>

                  <div className="text-sm text-slate-300 mb-3">
                    <span className="text-slate-400">Why:</span> {r.why}
                  </div>

                  <div className="text-sm text-slate-300">
                    <div className="text-slate-400 mb-2">What to do:</div>
                    <ul className="space-y-2">
                      {r.what.map((w) => (
                        <li key={w} className="flex items-start gap-2">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 text-xs text-slate-500">
                    Next: attach “recommended fix” to each evidence row and export it in PDF/CSV/JSON.
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keep your “standards” view, but framed as Report Coverage */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 mb-8">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Report Coverage</h2>
              <p className="text-sm text-slate-400 mt-1">Evidence mapped to assurance frameworks (demo mapping).</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">SOC 2 Type II</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-medium">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Audit</span>
                    <span className="text-slate-300">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Next Review</span>
                    <span className="text-slate-300">Jul 2024</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">ISO 27001</h3>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-medium">Certified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Issued</span>
                    <span className="text-slate-300">Mar 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Expires</span>
                    <span className="text-slate-300">Mar 2027</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">GDPR</h3>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-yellow-400 font-medium">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Completion</span>
                    <span className="text-slate-300">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Date</span>
                    <span className="text-slate-300">May 2024</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-lg p-5 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">ASL-3</h3>
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-medium">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Overall Score</span>
                    <span className="text-slate-300">96.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Assessed</span>
                    <span className="text-slate-300">Oct 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ASL-3 detail retained, but presented as “ASL-3 Evidence Summary” */}
          <div className="bg-slate-900 rounded-xl border border-purple-500/30 mb-8 overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Shield className="w-7 h-7 text-purple-400" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">ASL-3 Evidence Summary</h2>
                  <p className="text-sm text-slate-400">
                    Evidence mapped to ASL-3 control expectations (demo mapping).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-400">Overall Status</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">COMPLIANT</div>
                  <div className="text-sm text-slate-500 mt-1">96.5% overall score</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Deployment Standard</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">98%</div>
                  <div className="text-sm text-slate-500 mt-1">Prevent misuse</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Security Standard</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">94%</div>
                  <div className="text-sm text-slate-500 mt-1">Protect model weights</div>
                </div>
              </div>

              {/* Classifiers */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Constitutional Classifiers</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                    <div className="text-lg font-bold text-blue-400">42ms</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">False Positive</div>
                    <div className="text-lg font-bold text-yellow-400">0.3%</div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="text-xs text-slate-400 mb-2">Top Triggered Rules (24h)</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">CBRN-related queries</span>
                      <span className="text-slate-400">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Jailbreak attempts</span>
                      <span className="text-slate-400">32%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Policy violations</span>
                      <span className="text-slate-400">23%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Red team / bounty */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">Red Team & Bug Bounty</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Active Tests</div>
                    <div className="text-2xl font-bold text-orange-400">107</div>
                    <div className="text-xs text-slate-500 mt-1">ASL-3 prompts</div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Critical Bounties</div>
                    <div className="text-2xl font-bold text-red-400">38</div>
                    <div className="text-xs text-slate-500 mt-1">$5K-$15K payouts</div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Attack Library</div>
                    <div className="text-2xl font-bold text-green-400">107</div>
                    <div className="text-xs text-slate-500 mt-1">Total prompts</div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-4">
                    <div className="text-xs text-slate-400 mb-1">Bounty Pool</div>
                    <div className="text-2xl font-bold text-yellow-400">$570K</div>
                    <div className="text-xs text-slate-500 mt-1">Max potential</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements checklist retained (still useful as “evidence checklist”) */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Evidence Checklist</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { requirement: "Data encryption at rest and in transit", status: "complete", standard: "SOC 2 + ASL-3" },
                  { requirement: "Access control and authentication", status: "complete", standard: "ISO 27001 + ASL-3" },
                  { requirement: "Audit logging and monitoring", status: "complete", standard: "SOC 2 + GDPR" },
                  { requirement: "Data retention and deletion policies", status: "in-progress", standard: "GDPR" },
                  { requirement: "Incident response procedures", status: "complete", standard: "ISO 27001 + ASL-3" },
                  { requirement: "Third-party risk assessment", status: "complete", standard: "SOC 2" },
                  { requirement: "Constitutional AI classifiers", status: "complete", standard: "ASL-3" },
                  { requirement: "Multi-layer defense architecture", status: "complete", standard: "ASL-3" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-950/30 rounded-lg border border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      {item.status === "complete" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : item.status === "in-progress" ? (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-slate-500" />
                      )}
                      <div>
                        <div className="text-white font-medium">{item.requirement}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.standard}</div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "complete"
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : item.status === "in-progress"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                      }`}
                    >
                      {item.status === "complete"
                        ? "Complete"
                        : item.status === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Small note to clarify future wiring */}
          <div className="mt-8 text-xs text-slate-500">
            Note: Exports are stubbed (Coming soon). Next step is wiring Reports to scan history + targets and generating PDF/CSV/JSON.
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
