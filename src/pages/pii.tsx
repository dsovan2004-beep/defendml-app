// src/pages/pii.tsx
/* PII Protection Center
   - Uses shared <Navigation/> and <Footer/> so the UI stays consistent.
   - Works with your demo login (local mock token) and Supabase sessions.
   - ASL-3 aligned widgets: Classifier Status + 4-Layer Defense overview.
   - Pulls recent PII events from /api/logs/recent (with graceful fallback).
*/

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Shield, Lock, Eye, EyeOff, FileCheck, TrendingDown, DollarSign, Activity } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

/* ------------------------------------------------
   Auth helpers (demo-friendly)
------------------------------------------------- */
type Role = "admin" | "super_admin" | "analyst" | "viewer" | string;

function getMockToken(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any)._defendmlToken || localStorage.getItem("defendml_token");
}

function decodeMockRole(token: string | null): Role | null {
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded?.exp && decoded.exp < Date.now()) return null;
    return (decoded?.role as Role) ?? null;
  } catch {
    return null;
  }
}

function useResolvedRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    return createClient(url, anon);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // 1) Try mock/demo token first (fast path for your demo accounts)
        const mock = getMockToken();
        const mockRole = decodeMockRole(mock);
        if (mockRole) {
          setRole(mockRole);
          return;
        }

        // 2) Supabase session (fallback)
        const [{ data: sessionData }, { data: userData }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        let r: Role | null = null;

        // Try to read role from JWT payload (if any)
        const token = sessionData?.session?.access_token;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1] || ""));
            r =
              (payload?.role as Role) ??
              (payload?.app_metadata?.role as Role) ??
              (payload?.user_metadata?.role as Role) ??
              null;
          } catch {
            /* ignore */
          }
        }

        // Try to read role from supabase user metadata
        if (!r) {
          const meta =
            (userData?.user?.app_metadata as any)?.role ??
            (userData?.user?.user_metadata as any)?.role;
          if (meta) r = meta as Role;
        }

        setRole(r ?? "viewer");
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  return { role, loading };
}

/* ------------------------------------------------
   Types
------------------------------------------------- */
type Detection = string | { type?: string };

type ApiLog =
  | {
      id?: string | number;
      ts?: string;
      timestamp?: string;
      detections?: Detection[] | string[];
      action?: "blocked" | "sanitized" | string;
      status?: string;
      redacted_count?: number;
      llm_provider?: string;
      compliance_impact?: string;
      cost_of_breach_prevented?: number;
    }
  | Record<string, any>;

type PiiEvent = {
  id?: string | number;
  timestamp: string;
  detections: string[];
  action: "blocked" | "sanitized" | string;
  status?: string;
  redacted_count?: number;
  llm_provider?: string;
  compliance_impact?: string;
  cost_of_breach_prevented?: number;
};

/* ------------------------------------------------
   Styling helpers
------------------------------------------------- */
const pill = (cls: string) =>
  `inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${cls}`;

const typeColors: Record<string, string> = {
  email: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  phone: "bg-purple-500/15 text-purple-300 border-purple-400/30",
  ssn: "bg-red-500/15 text-red-300 border-red-400/30",
  credit_card: "bg-orange-500/15 text-orange-300 border-orange-400/30",
  address: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
};

/* ------------------------------------------------
   ASL-3 widgets (demo-friendly)
   - In production, wire to:
     • GET /api/classifiers/performance
     • GET /api/defense-layers
   (These are proposed in your ASL-3 guide.)
------------------------------------------------- */
type ClassifierPerf = {
  accuracy: number; // 0-100
  latency_p95: number; // ms
  false_positive_rate: number; // 0-100
  blocks_24h: number;
  status: "ACTIVE" | "DEGRADED" | "DOWN";
};

const demoPerf: ClassifierPerf = {
  accuracy: 99.6,
  latency_p95: 42,
  false_positive_rate: 0.3,
  blocks_24h: 847,
  status: "ACTIVE",
};

type DefenseLayer = { id: 1 | 2 | 3 | 4; name: string; active: boolean };
const demoLayers: DefenseLayer[] = [
  { id: 1, name: "Access Controls", active: true },
  { id: 2, name: "Real-Time Classifiers", active: true },
  { id: 3, name: "Async Monitoring", active: true },
  { id: 4, name: "Rapid Response", active: true },
];

/* ------------------------------------------------
   Data: PII events
------------------------------------------------- */
function usePiiEvents(limit = 500) {
  const [events, setEvents] = useState<PiiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // Relative path so it works on Pages: /functions/api/recent.js -> /api/logs/recent
        const res = await fetch(`/api/logs/recent?limit=${limit}`, { credentials: "omit" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json().catch(() => ({}));

        const raw: ApiLog[] = Array.isArray((data as any)?.logs)
          ? (data as any).logs
          : Array.isArray((data as any)?.data)
          ? (data as any).data
          : [];

        const norm: PiiEvent[] = raw
          .map((log) => {
            const dRaw: Detection[] = Array.isArray((log as any)?.detections)
              ? ((log as any).detections as Detection[])
              : [];
            const detections = dRaw
              .map((d) => (typeof d === "string" ? d : d?.type || ""))
              .filter(Boolean);

            const hasPii = detections.some((d) => d.startsWith("pii."));
            if (!hasPii) return null;

            const t = (log as any).timestamp || (log as any).ts || new Date().toISOString();

            return {
              id: (log as any).id,
              timestamp: t,
              detections,
              action: (log as any).action || "sanitized",
              status: (log as any).status || "success",
              redacted_count: (log as any).redacted_count ?? 0,
              llm_provider: (log as any).llm_provider || "Unknown",
              compliance_impact: (log as any).compliance_impact || "GDPR",
              cost_of_breach_prevented: (log as any).cost_of_breach_prevented ?? 0,
            } as PiiEvent;
          })
          .filter(Boolean) as PiiEvent[];

        setEvents(norm);
      } catch (e: any) {
        setErr(e?.message || "Failed to fetch PII events");
        // Fallback demo data
        setEvents([
          {
            id: 1,
            timestamp: new Date().toISOString(),
            detections: ["pii.email", "pii.phone"],
            action: "sanitized",
            status: "success",
            redacted_count: 2,
            llm_provider: "Claude 3.5 Sonnet",
            compliance_impact: "GDPR",
            cost_of_breach_prevented: 5200,
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            detections: ["pii.ssn", "pii.address"],
            action: "blocked",
            status: "success",
            redacted_count: 2,
            llm_provider: "GPT-4",
            compliance_impact: "HIPAA",
            cost_of_breach_prevented: 8500,
          },
          {
            id: 3,
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            detections: ["pii.credit_card"],
            action: "sanitized",
            status: "success",
            redacted_count: 1,
            llm_provider: "Gemini 1.5",
            compliance_impact: "PCI-DSS",
            cost_of_breach_prevented: 12000,
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  return { events, loading, error };
}

/* ------------------------------------------------
   Small UI bits
------------------------------------------------- */
function Tile({
  icon,
  title,
  value,
  sub,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub?: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-xl p-6 border border-white/10 ${gradient}`}>
      <div className="flex items-center justify-between mb-2">{icon}<div /></div>
      <div className="text-4xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-300 text-sm font-medium">{title}</div>
      {sub && <div className="text-slate-400/70 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function ClassifierStatus({ perf }: { perf: ClassifierPerf }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Constitutional Classifier Status</h3>
        </div>
        <span
          className={pill(
            perf.status === "ACTIVE"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/30"
              : perf.status === "DEGRADED"
              ? "bg-yellow-500/15 text-yellow-300 border-yellow-400/30"
              : "bg-red-500/15 text-red-300 border-red-400/30"
          )}
        >
          ● {perf.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile
          icon={<Shield className="w-6 h-6 text-emerald-400" />}
          title="Accuracy"
          value={`${perf.accuracy.toFixed(1)}%`}
          sub="Target ≥ 99%"
          gradient="from-emerald-500/10 to-green-600/10 bg-gradient-to-br"
        />
        <Tile
          icon={<TrendingDown className="w-6 h-6 text-cyan-400" />}
          title="Latency (P95)"
          value={`${perf.latency_p95}ms`}
          sub="Target ≤ 50ms"
          gradient="from-cyan-500/10 to-blue-600/10 bg-gradient-to-br"
        />
        <Tile
          icon={<Eye className="w-6 h-6 text-purple-400" />}
          title="False Positives"
          value={`${perf.false_positive_rate.toFixed(1)}%`}
          sub="Target ≤ 1%"
          gradient="from-purple-500/10 to-pink-600/10 bg-gradient-to-br"
        />
        <Tile
          icon={<Lock className="w-6 h-6 text-orange-400" />}
          title="Blocks (24h)"
          value={perf.blocks_24h.toLocaleString()}
          sub="Across all providers"
          gradient="from-orange-500/10 to-red-600/10 bg-gradient-to-br"
        />
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Built to align with ASL-3 Deployment Standard (classifiers + defense-in-depth).{" "}
        <Link href="/asl3-status" className="text-cyan-300 hover:underline">View ASL-3 Status →</Link>
      </div>
    </div>
  );
}

function DefenseLayers({ layers }: { layers: DefenseLayer[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">4-Layer Defense</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {layers.map((l) => (
          <div
            key={l.id}
            className={`rounded-lg px-4 py-3 border text-sm font-semibold ${
              l.active
                ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-300"
                : "bg-red-500/10 border-red-400/30 text-red-300"
            }`}
          >
            L{l.id}: {l.name} {l.active ? "✓" : "•"}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------
   Page
------------------------------------------------- */
export default function PIIPage() {
  const { role, loading } = useResolvedRole();
  const { events, loading: eventsLoading } = usePiiEvents(500);
  const [showSensitive, setShowSensitive] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // Gate: allow admin & super_admin (demo token supports "admin")
  const allowed =
    role === "admin" ||
    role === "super_admin" ||
    role === "SuperAdmin" || // just in case capitalization appears
    role === "owner"; // optional future-proof

  // Aggregate metrics
  const typeCounts = events.reduce<Record<string, number>>((acc, e) => {
    (e.detections || []).forEach((d) => {
      const t = d.replace("pii.", "");
      acc[t] = (acc[t] || 0) + 1;
    });
    return acc;
  }, {});
  const totalPrevented = events.length;
  const totalRedacted = events.reduce((s, e) => s + (e.redacted_count || 0), 0);
  const totalSavings = events.reduce((s, e) => s + (e.cost_of_breach_prevented || 0), 0);

  const filtered =
    filterType === "all"
      ? events
      : events.filter((e) => e.detections.some((d) => d === `pii.${filterType}`));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navigation />

      <main className="max-w-7xl mx-auto w-full px-6 md:px-8 py-8 space-y-8">
        <header className="border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-white">PII Protection Center</h1>
              </div>
              <p className="text-slate-300">
                Detect, redact, and track personally identifiable information (PII) across LLM interactions.
              </p>
            </div>
            <button
              onClick={() => setShowSensitive((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all text-blue-300"
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm font-medium">{showSensitive ? "Hide" : "Show"} details</span>
            </button>
          </div>
        </header>

        {/* ASL-3 aligned widgets */}
        <ClassifierStatus perf={demoPerf} />
        <DefenseLayers layers={demoLayers} />

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Tile
            icon={<Shield className="w-6 h-6 text-blue-400" />}
            title="PII Leaks Prevented"
            value={totalPrevented.toLocaleString()}
            sub="Across all LLM providers"
            gradient="from-blue-500/10 to-cyan-600/10 bg-gradient-to-br"
          />
          <Tile
            icon={<Eye className="w-6 h-6 text-purple-400" />}
            title="Items Redacted"
            value={totalRedacted.toLocaleString()}
            sub="Real-time sanitization"
            gradient="from-purple-500/10 to-pink-600/10 bg-gradient-to-br"
          />
          <Tile
            icon={<FileCheck className="w-6 h-6 text-emerald-400" />}
            title="Compliance Score"
            value="100%"
            sub="SOC 2, GDPR, HIPAA ready"
            gradient="from-emerald-500/10 to-green-600/10 bg-gradient-to-br"
          />
          <Tile
            icon={<DollarSign className="w-6 h-6 text-orange-400" />}
            title="Breach Cost Prevented"
            value={`$${(totalSavings / 1000).toFixed(1)}K`}
            sub="Calculated per PII type"
            gradient="from-orange-500/10 to-red-600/10 bg-gradient-to-br"
          />
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">PII Types Detected</h3>
            <div className="flex items-center gap-2 text-sm">
              <Link
                href="/audit"
                className="px-3 py-2 rounded-lg border border-slate-700/60 text-slate-300 hover:bg-white/5"
              >
                Open Audit Logs
              </Link>
              <Link
                href="/asl3-status"
                className="px-3 py-2 rounded-lg border border-slate-700/60 text-slate-300 hover:bg-white/5"
              >
                ASL-3 Status
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-3 rounded-lg border transition-all ${
                filterType === "all"
                  ? "bg-blue-500 text-white border-blue-400"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="text-xs uppercase tracking-wide mb-1">All Types</div>
              <div className="text-2xl font-bold">{totalPrevented}</div>
            </button>

            {Object.entries(typeCounts).map(([type, count]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  filterType === type
                    ? typeColors[type] || "bg-blue-500/15 text-blue-300 border-blue-400/30"
                    : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-1">{type.replace("_", " ")}</div>
                <div className="text-2xl font-bold">{count}</div>
              </button>
            ))}

            {Object.keys(typeCounts).length === 0 && (
              <div className="text-slate-400 text-sm py-3">No PII events detected — all clear! 🎉</div>
            )}
          </div>
        </div>

        {/* Events list */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">Recent PII Protection Events</h3>
            <p className="text-slate-400 text-sm">Real-time prevention across all providers</p>
          </div>

          {eventsLoading ? (
            <div className="px-6 py-12 text-center text-slate-400">Loading PII events…</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">No events in this filter.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {filtered.map((e, i) => (
                <li key={(e.id as any) ?? i} className="px-6 py-5 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-slate-300 text-sm">
                        {new Date(e.timestamp).toLocaleString()}
                      </div>
                      <div className="text-slate-400 text-xs">{e.llm_provider}</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(e.detections || []).map((d, idx) => {
                          const type = d.replace("pii.", "");
                          return (
                            <span
                              key={`${idx}-${type}`}
                              className={pill(typeColors[type] || "bg-blue-500/15 text-blue-300 border-blue-400/30")}
                            >
                              {type.replace("_", " ")}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span
                        className={pill(
                          e.action === "blocked"
                            ? "bg-red-500/15 text-red-300 border-red-400/30"
                            : "bg-yellow-500/15 text-yellow-300 border-yellow-400/30"
                        )}
                      >
                        {e.action.toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold text-blue-400">{e.redacted_count || 0}</span>
                      <span className={pill("bg-emerald-500/15 text-emerald-300 border-emerald-400/30")}>
                        {showSensitive ? e.compliance_impact : "Compliance"}
                      </span>
                      <span className="flex items-center gap-1 text-green-400 font-bold">
                        <DollarSign className="w-4 h-4" />
                        {(e.cost_of_breach_prevented || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Access control notice (rendered last so layout doesn't jump) */}
      {!loading && !allowed && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black/60 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-300 mb-4">
              Your role <span className="text-pink-300">{role ?? "unknown"}</span> doesn&apos;t have access to this
              page. Required: <span className="text-purple-300">admin or super_admin</span>.
            </p>
            <Link
              href="/overview"
              className="inline-block px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
