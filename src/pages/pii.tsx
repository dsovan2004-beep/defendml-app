import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lock, Eye, EyeOff, AlertCircle, Shield, TrendingDown, DollarSign, FileCheck } from 'lucide-react';

/* =========================
   Types
========================= */
type Detection = string | { type?: string };

type ApiLog =
  | {
      id?: string | number;
      ts?: string;
      timestamp?: string;
      detections?: Detection[] | string[];
      action?: 'blocked' | 'sanitized' | string;
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
  action: 'blocked' | 'sanitized' | string;
  status?: string;
  redacted_count?: number;
  llm_provider?: string;
  compliance_impact?: string;
  cost_of_breach_prevented?: number;
};

/* =========================
   Local UI: Navigation & Footer
========================= */
function Navigation() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 grid place-items-center">
            <Shield className="w-4 h-4 text-purple-300" />
          </div>
          <span className="font-semibold text-white">DefendML</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <button onClick={() => router.push('/overview')} className="text-slate-300 hover:text-white">
            Overview
          </button>
          <button onClick={() => router.push('/security')} className="text-slate-300 hover:text-white">
            Security
          </button>
          <span className="text-white font-semibold">PII</span>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-400">
        © {new Date().getFullYear()} DefendML — Secure your AI infrastructure
      </div>
    </footer>
  );
}

/* =========================
   Role Resolver (Supports Demo Sessions)
========================= */
function normalizeRole(role: string): string {
  return role?.toLowerCase().replace('-', '_');
}

function getDemoSession(): { role?: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const demo = localStorage.getItem('defendml_demo_session');
    return demo ? JSON.parse(demo) : null;
  } catch {
    return null;
  }
}

function getLegacyMockRole(): string | null {
  if (typeof window === 'undefined') return null;
  const t = (window as any)._defendmlToken || localStorage.getItem('defendml_token');
  if (!t) return null;
  try {
    const d = JSON.parse(atob(t));
    return d?.role ? d.role.toString() : null;
  } catch {
    return null;
  }
}

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
        // 1️⃣ Prefer Demo Session
        const demo = getDemoSession();
        if (demo?.role) {
          setRole(normalizeRole(demo.role));
          return;
        }

        // 2️⃣ Legacy Mock Token
        const legacyRole = getLegacyMockRole();
        if (legacyRole) {
          setRole(normalizeRole(legacyRole));
          return;
        }

        // 3️⃣ Supabase Auth
        const [{ data: sessionData }, { data: userData }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        let jwtRole: string | undefined;
        const token = sessionData?.session?.access_token;
        if (token && typeof window !== 'undefined') {
          try {
            const payload = JSON.parse(atob(token.split('.')[1] || ''));
            jwtRole =
              payload?.role ??
              payload?.app_metadata?.role ??
              payload?.user_metadata?.role;
          } catch {/* ignore */}
        }

        const metaRole =
          (userData?.user?.app_metadata as any)?.role ??
          (userData?.user?.user_metadata as any)?.role;

        setRole(normalizeRole(jwtRole ?? metaRole ?? 'viewer'));
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  return { role, loading };
}

/* =========================
   Access Denied UI
========================= */
function AccessDenied({ role }: { role: string | null }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-xl max-w-md">
          <div className="text-4xl mb-4 text-red-500">⚠️</div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-slate-300 mt-3">You don’t have permission to access this page.</p>
          <p className="mt-4 text-sm text-slate-400">
            Your role: <span className="text-pink-400">{role ?? 'unknown'}</span>
            <br />
            Required role: <span className="text-purple-400">super_admin or admin</span>
          </p>
          <button
            onClick={() => router.push('/overview')}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

/* =========================
   PII Page
========================= */
const piiTypeColors: Record<string, string> = {
  email: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  phone: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  ssn: 'bg-red-500/20 text-red-300 border-red-400/30',
  credit_card: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  address: 'bg-green-500/20 text-green-300 border-green-400/30',
};

function PIIPageContent(): JSX.Element {
  const [piiEvents, setPiiEvents] = useState<PiiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSensitive, setShowSensitive] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchPIIEvents();
  }, []);

  async function fetchPIIEvents() {
    setLoading(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE || 'https://defendml-api.dsovan2004-beep.workers.dev';
      const response = await fetch(`${apiBase}/api/logs/recent?limit=500`);
      if (!response.ok) throw new Error('Failed to fetch PII events');
      const data = await response.json();
      const rawLogs: ApiLog[] = Array.isArray(data?.logs)
        ? data.logs
        : Array.isArray(data?.data)
        ? data.data
        : [];
      const normalized: PiiEvent[] = rawLogs
        .map((log) => {
          const detectionsRaw: Detection[] =
            (log as any)?.detections && Array.isArray((log as any).detections)
              ? ((log as any).detections as Detection[])
              : [];
          const detections = detectionsRaw
            .map((d) => (typeof d === 'string' ? d : d?.type || ''))
            .filter(Boolean);
          if (!detections.some((d) => d.startsWith('pii.'))) return null;
          const timestamp =
            (log as any).timestamp ||
            (log as any).ts ||
            new Date().toISOString();
          return {
            id: (log as any).id,
            timestamp,
            detections,
            action: (log as any).action || 'sanitized',
            status: (log as any).status || 'success',
            redacted_count: (log as any).redacted_count ?? 0,
            llm_provider: (log as any).llm_provider || 'Unknown',
            compliance_impact: (log as any).compliance_impact || 'GDPR',
            cost_of_breach_prevented: (log as any).cost_of_breach_prevented ?? 0,
          } as PiiEvent;
        })
        .filter(Boolean) as PiiEvent[];
      setPiiEvents(normalized);
    } catch (err) {
      console.error('Error fetching PII events:', err);
    } finally {
      setLoading(false);
    }
  }

  const piiTypeCounts: Record<string, number> = piiEvents.reduce(
    (acc, event) => {
      (event.detections || []).forEach((d) => {
        const type = d.replace('pii.', '');
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">PII Protection Center</h1>
        <p className="text-slate-400 mb-8">
          Detect, redact, and track personally identifiable information (PII) across LLM interactions.
        </p>
        {loading ? (
          <div className="text-center text-slate-400">Loading events...</div>
        ) : (
          <div className="space-y-4">
            {piiEvents.length === 0 ? (
              <div className="text-slate-500">No PII events detected — all clear! 🎉</div>
            ) : (
              piiEvents.slice(0, 10).map((e, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{new Date(e.timestamp).toLocaleString()}</div>
                      <div className="text-slate-400 text-sm">{e.llm_provider}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase">{e.action}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {e.detections.map((d, i) => {
                      const type = d.replace('pii.', '');
                      return (
                        <span key={i} className={`px-2 py-1 text-xs rounded border ${piiTypeColors[type] || 'bg-slate-600/30 border-slate-400/30'}`}>
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

/* =========================
   Export
========================= */
export default function PIIPage() {
  const { role, loading } = useResolvedRole();
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
        Checking access...
      </div>
    );
  }
  if (!role || !['superadmin', 'super_admin', 'admin'].includes(role)) {
    return <AccessDenied role={role} />;
  }
  return <PIIPageContent />;
}
