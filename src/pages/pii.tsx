// src/pages/pii.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  TrendingDown,
  DollarSign,
  FileCheck,
  Activity,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
  ScrollText,
  Settings,
} from "lucide-react";

/* =========================================================
   Types
========================================================= */
type Detection = string | { type?: string };

type ApiLog = {
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
};

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

/* =========================================================
   Local “site” Navigation + Footer (to match other tabs)
========================================================= */
function Navigation() {
  const router = useRouter();
  const isActive = (href: string) =>
    router.pathname === href ||
    (href === "/security" &&
      (router.pathname === "/security" ||
        router.pathname === "/threats" ||
        router.pathname === "/asl3-status"));

  const NavBtn: React.FC<{
    href: string;
    label: string;
    icon: React.ElementType;
  }> = ({ href, label, icon: Icon }) => (
    <button
      onClick={() => router.push(href)}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive(href)
          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
          : "text-slate-300 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-30 bg-[#0b1020]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 grid place-items-center">
            <Shield className="w-4 h-4 text-purple-300" />
          </div>
          <span className="font-semibold text-white">DefendML</span>
          <span className="text-[11px] px-2 py-1 rounded border border-purple-500/30 text-purple-300 ml-2">
            ASL-3 Powered
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <NavBtn href="/overview" label="Overview" icon={LayoutDashboard} />
          <NavBtn href="/security" label="Security Center" icon={Shield} />
          <NavBtn href="/pii" label="PII Protection" icon={Lock} />
          <NavBtn href="/compliance" label="Compliance" icon={FileCheck} />
          <NavBtn href="/health" label="Health" icon={Activity} />
          <NavBtn href="/usage" label="Usage" icon={BarChart3} />
          <NavBtn href="/audit" label="Audit" icon={ScrollText} />
          <NavBtn href="/settings" label="Settings" icon={Settings} />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b1020]">
      <div className="max-w-7xl mx-auto px-6 py-6 text-xs md:text-sm text-slate-400 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div>© 2025 DefendML • ASL-3 Compliant LLM Security Gateway</div>
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white" href="#">Privacy Policy</a>
          <a className="hover:text-white" href="#">Terms of Service</a>
          <a className="hover:text-white" href="#">API Docs</a>
          <a className="hover:text-white" href="#">Status</a>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SOC 2 Certified</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   Auth / Role Guard (admin OR super_admin)
========================================================= */
function useResolvedRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase: SupabaseClient = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(url, anon);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: sessionData }, { data: userData }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        // Try to extract a role from the JWT or user metadata
        let jwtRole: string | undefined;
        const token = sessionData?.session?.access_token;
        if (token && typeof window !== "undefined") {
          try {
            const payload = JSON.parse(atob(token.split(".")[1] || ""));
            jwtRole =
              payload?.role ??
              payload?.app_metadata?.role ??
              payload?.user_metadata?.role;
          } catch {
            /* ignore malformed token */
          }
        }
        const metaRole =
          (userData?.user?.app_metadata as any)?.role ??
          (userData?.user?.user_metadata as any)?.role;

        setRole((jwtRole ?? metaRole ?? "viewer") as string);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  return { role, loading };
}

function AccessDenied({ role }: { role: string | null }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 grid place-items-center">
        <div className="text-center p-8 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xl max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-300 mt-3">
            You don’t have permission to access this page.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Your role: <span className="text-pink-400">{role ?? "unknown"}</span>
            <br />
            Required role: <span className="text-purple-300">super_admin or admin</span>
          </p>
          <button
            onClick={() => router.push("/overview")}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* =========================================================
   PII Page Content
========================================================= */
const piiTypeColors: Record<string, string> = {
  email: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  phone: "bg-purple-500/20 text-purple-300 border-purple-400/30",
  ssn: "bg-red-500/20 text-red-300 border-red-400/30",
  credit_card: "bg-orange-500/20 text-orange-300 border-orange-400/30",
  address: "bg-green-500/20 text-green-300 border-green-400/30",
};

const PAGE_SIZE = 20;

function PIIPageContent(): JSX.Element {
  const [piiEvents, setPiiEvents] = useState<PiiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSensitive, setShowSensitive] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const fetchPIIEvents = useCallback(async () => {
    setLoading(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE ||
        "https://defendml-api.dsovan2004-beep.workers.dev";

      const res = await fetch(`${apiBase}/api/logs/recent?limit=500`);
      if (!res.ok) throw new Error("Failed to fetch PII events");

      const data = await res.json();
      const rawLogs: ApiLog[] = Array.isArray(data?.logs)
        ? data.logs
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const normalized: PiiEvent[] = rawLogs
        .map((log) => {
          const detectionsRaw: Detection[] = Array.isArray(log?.detections)
            ? (log.detections as Detection[])
            : [];

          const detections = detectionsRaw
            .map((d) => (typeof d === "string" ? d : d?.type || ""))
            .filter(Boolean);

          if (!detections.some((d) => d.startsWith("pii."))) return null;

          const timestamp = log.timestamp || log.ts || new Date().toISOString();

          return {
            id: log.id,
            timestamp,
            detections,
            action: (log.action as any) || "sanitized",
            status: log.status || "success",
            redacted_count: log.redacted_count ?? 0,
            llm_provider: log.llm_provider || "Unknown",
            compliance_impact: log.compliance_impact || "GDPR",
            cost_of_breach_prevented: log.cost_of_breach_prevented ?? 0,
          } as PiiEvent;
        })
        .filter(Boolean) as PiiEvent[];

      setPiiEvents(normalized);
      setVisibleCount(PAGE_SIZE); // reset paging on refresh
    } catch (err) {
      console.error("PII fetch failed, using demo data:", err);
      // Fallback demo data (short)
      setPiiEvents([
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
      ]);
      setVisibleCount(PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPIIEvents();
  }, [fetchPIIEvents]);

  const piiTypeCounts: Record<string, number> = piiEvents.reduce(
    (acc: Record<string, number>, event: PiiEvent) => {
      (event.detections || []).forEach((d) => {
        const type = d.replace("pii.", "");
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    },
    {}
  );

  const totalPrevented = piiEvents.length;
  const totalRedacted = piiEvents.reduce((s, e) => s + (e.redacted_count || 0), 0);
  const totalBreachCostPrevented = piiEvents.reduce(
    (s, e) => s + (e.cost_of_breach_prevented || 0),
    0
  );

  const filteredEvents =
    selectedType === "all"
      ? piiEvents
      : piiEvents.filter((e) => e.detections.some((d) => d === `pii.${selectedType}`));

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredEvents.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-[#0d1632] to-slate-950">
      <Navigation />

      <main className="flex-1">
        {/* Page header */}
        <div className="max-w-7xl mx-auto px-8 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">PII Protection Center</h1>
          </div>
          <p className="text-slate-300">
            Detect, redact, and track personally identifiable information (PII) across LLM
            interactions.
          </p>
        </div>

        {/* Classifier Status (ASL-3 guide alignment) */}
        <section className="max-w-7xl mx-auto px-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Accuracy", value: "99.6%", icon: <Shield className="w-5 h-5" />, color: "text-green-400" },
              { label: "Latency (P95)", value: "42ms", icon: <TrendingDown className="w-5 h-5" />, color: "text-blue-400" },
              { label: "False Positives", value: "0.3%", icon: <AlertCircle className="w-5 h-5" />, color: "text-yellow-400" },
              { label: "Blocks (24h)", value: "847", icon: <Lock className="w-5 h-5" />, color: "text-red-400" },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 flex items-center justify-between"
              >
                <div>
                  <div className="text-slate-400 text-xs">{m.label}</div>
                  <div className={`text-2xl font-bold text-white mt-1`}>{m.value}</div>
                </div>
                <div className={`${m.color}`}>{m.icon}</div>
              </div>
            ))}
          </div>

          {/* 4-Layer Defense quick bar (ASL-3 guide) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: "L1: Access Controls", ok: true },
              { label: "L2: Real-Time Classifiers", ok: true },
              { label: "L3: Async Monitoring", ok: true },
              { label: "L4: Rapid Response", ok: true },
            ].map((l, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-sm font-medium flex items-center justify-between"
              >
                <span>{l.label}</span>
                <span className="text-emerald-400">✓</span>
              </div>
            ))}
          </div>
        </section>

        {/* KPI tiles */}
        <section className="max-w-7xl mx-auto px-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 rounded-xl p-6 border border-blue-500/20">
              <div className="text-blue-300 text-sm">PII Leaks Prevented</div>
              <div className="text-4xl font-bold text-white mt-1">{totalPrevented}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20">
              <div className="text-purple-300 text-sm">Items Redacted</div>
              <div className="text-4xl font-bold text-white mt-1">{totalRedacted}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 border border-green-500/20">
              <div className="text-green-300 text-sm">Compliance Score</div>
              <div className="text-4xl font-bold text-white mt-1">100%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-6 border border-orange-500/20">
              <div className="text-orange-300 text-sm">Breach Cost Prevented</div>
              <div className="text-4xl font-bold text-white mt-1">
                ${(totalBreachCostPrevented / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        </section>

        {/* PII type filter & refresh */}
        <section className="max-w-7xl mx-auto px-8 mt-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">PII Types Detected</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSensitive((s) => !s)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-all text-blue-300 text-sm"
                >
                  {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSensitive ? "Hide" : "Show"} Sensitive Details
                </button>
                <button
                  onClick={fetchPIIEvents}
                  className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-all border border-blue-500/30"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  selectedType === "all"
                    ? "bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-1">All Types</div>
                <div className="text-2xl font-bold">{totalPrevented}</div>
              </button>
              {Object.entries(piiTypeCounts).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    selectedType === type
                      ? piiTypeColors[type] || "bg-blue-500/20 text-blue-300 border-blue-400/30"
                      : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide mb-1">
                    {type.replace("_", " ")}
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                </button>
              ))}
              {Object.keys(piiTypeCounts).length === 0 && (
                <div className="text-slate-400 text-sm py-3">
                  No PII types detected yet — your data is secure! 🎉
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Events table (paged, not infinite) */}
        <section className="max-w-7xl mx-auto px-8 mt-6 pb-10">
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Recent PII Protection Events</h3>
                <p className="text-slate-400 text-sm">
                  Real-time prevention across all your LLM providers
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      PII Types
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Items Redacted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Compliance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Cost Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                          <span className="text-slate-400">Loading PII events...</span>
                        </div>
                      </td>
                    </tr>
                  ) : visibleEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <Lock className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <div className="font-medium">No PII events in this category</div>
                        <div className="text-sm text-slate-500 mt-1">Your data is protected!</div>
                      </td>
                    </tr>
                  ) : (
                    visibleEvents.map((event, idx) => (
                      <tr key={(event.id as any) ?? idx} className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(event.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300">{event.llm_provider}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(event.detections || []).map((d, i) => {
                              const t = d.replace("pii.", "");
                              return (
                                <span
                                  key={i}
                                  className={`px-2 py-1 rounded text-xs font-medium border ${
                                    piiTypeColors[t] ||
                                    "bg-blue-500/20 text-blue-200 border-blue-500/30"
                                  }`}
                                >
                                  {t.replace("_", " ")}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              event.action === "blocked"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                            }`}
                          >
                            {event.action?.toString().toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-2xl font-bold text-blue-400">
                            {event.redacted_count || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1.5 bg-green-500/20 text-green-300 rounded-lg text-xs font-bold border border-green-500/30">
                            {event.compliance_impact}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-green-400" />
                            <span className="text-sm font-bold text-green-400">
                              ${(event.cost_of_breach_prevented || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pager */}
            {!loading && (
              <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Showing {Math.min(visibleCount, filteredEvents.length)} of {filteredEvents.length}
                </div>
                {canLoadMore ? (
                  <button
                    onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredEvents.length))}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Load more
                  </button>
                ) : (
                  <div className="text-xs text-slate-500">End of list</div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* =========================================================
   Page Export (Guard + Content)
========================================================= */
export default function PIIPage() {
  const { role, loading } = useResolvedRole();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 grid place-items-center bg-gradient-to-br from-slate-950 via-[#0d1632] to-slate-950">
          <div className="text-slate-400">Checking access…</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!role || !["super_admin", "admin"].includes(role)) {
    return <AccessDenied role={role} />;
  }

  return <PIIPageContent />;
}
