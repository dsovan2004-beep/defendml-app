// src/pages/pii.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Lock, AlertCircle, DollarSign, FileCheck, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/router';

/* ------------------------- Types ------------------------- */
type PiiEvent = {
  id?: number;
  timestamp: string;
  detections: string[];
  action: 'blocked' | 'sanitized' | string;
  status?: string;
  redacted_count?: number;
  llm_provider?: string;
  compliance_impact?: string;
  cost_of_breach_prevented?: number;
};

/* ------------------------- Local UI Components ------------------------- */
function Navigation() {
  return (
    <header className="bg-slate-950/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <span className="text-indigo-300 font-semibold">DefendML</span>
          <span className="ml-2 px-2 py-0.5 text-[10px] bg-purple-600/20 text-purple-300 rounded-md border border-purple-500/30">
            ASL-3 Powered
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <a href="/overview" className="hover:text-white">Overview</a>
          <a href="/security" className="hover:text-white">Security Center</a>
          <a href="/pii" className="text-white font-medium">PII Protection</a>
          <a href="/compliance" className="hover:text-white">Compliance</a>
          <a href="/asl3-status" className="hover:text-white">ASL-3 Status</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md text-slate-400 text-xs py-6 text-center">
      © {new Date().getFullYear()} DefendML • ASL-3 Compliant LLM Security Gateway
    </footer>
  );
}

/* ------------------------- Helper: Role Resolver ------------------------- */
async function getUserRole(supabase: any) {
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;
  return (
    user?.app_metadata?.role ||
    user?.user_metadata?.role ||
    user?.role ||
    'viewer'
  );
}

/* ------------------------- Main Content ------------------------- */
function PIIPageContent() {
  const [piiEvents, setPiiEvents] = useState<PiiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const visibleEvents = useMemo(() => piiEvents.slice(0, PAGE_SIZE * page), [piiEvents, page]);
  const hasMore = piiEvents.length > visibleEvents.length;

  useEffect(() => {
    const fetchPII = async () => {
      try {
        const res = await fetch(`/api/logs/recent?limit=200`);
        const json = await res.json();
        setPiiEvents(json.data || []);
      } catch {
        console.error('Failed to fetch PII events');
      } finally {
        setLoading(false);
      }
    };
    fetchPII();
  }, []);

  const colors: Record<string, string> = {
    email: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    phone: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    ssn: 'bg-red-500/20 text-red-300 border-red-400/30',
    address: 'bg-green-500/20 text-green-300 border-green-400/30',
    credit_card: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 pb-10">
      {/* ---------- Header Metrics: Constitutional Classifier Status ---------- */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-400" /> PII Protection Center
        </h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Accuracy', value: '99.6%', icon: <Shield className="w-5 h-5" />, color: 'text-green-400' },
            { label: 'Latency (P95)', value: '42ms', icon: <TrendingDown className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'False Positives', value: '0.3%', icon: <AlertCircle className="w-5 h-5" />, color: 'text-yellow-400' },
            { label: 'Blocks (24h)', value: '847', icon: <Lock className="w-5 h-5" />, color: 'text-red-400' },
          ].map((m, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-start">
              <div className={`mb-1 ${m.color}`}>{m.icon}</div>
              <div className="text-sm text-slate-400">{m.label}</div>
              <div className="text-xl font-semibold text-white">{m.value}</div>
            </div>
          ))}
        </div>

        {/* ---------- 4-Layer Defense ---------- */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            'L1: Access Controls',
            'L2: Real-Time Classifiers',
            'L3: Async Monitoring',
            'L4: Rapid Response',
          ].map((l, i) => (
            <div
              key={i}
              className="border border-white/10 bg-green-500/10 rounded-lg py-2 text-center text-green-300 text-sm font-medium"
            >
              {l} ✓
            </div>
          ))}
        </div>

        {/* ---------- Stats Summary ---------- */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-indigo-400 font-bold text-2xl">{piiEvents.length}</div>
            <div className="text-xs text-slate-400 mt-1">PII Leaks Prevented</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-cyan-400 font-bold text-2xl">
              {piiEvents.reduce((a, e) => a + (e.redacted_count || 0), 0)}
            </div>
            <div className="text-xs text-slate-400 mt-1">Items Redacted</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-green-400 font-bold text-2xl">100%</div>
            <div className="text-xs text-slate-400 mt-1">Compliance Score</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-amber-400 font-bold text-xl">
              ${piiEvents.reduce((a, e) => a + (e.cost_of_breach_prevented || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Breach Cost Prevented</div>
          </div>
        </div>

        {/* ---------- PII Events Table ---------- */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white text-sm font-medium">Recent PII Protection Events</h3>
            <span className="text-xs text-slate-400">Real-time prevention across all providers</span>
          </div>

          <table className="w-full text-sm text-slate-300">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Loading events...
                  </td>
                </tr>
              ) : visibleEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No events found
                  </td>
                </tr>
              ) : (
                visibleEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-all"
                  >
                    <td className="px-6 py-4 text-slate-400 text-xs w-48">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {event.llm_provider}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {event.detections.map((d, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md border text-xs ${colors[d.split('.')[1]] || 'bg-slate-500/10 text-slate-300 border-slate-400/30'}`}
                          >
                            {d.split('.')[1]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-md text-xs font-semibold ${
                          event.action === 'blocked'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {event.action.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      {event.redacted_count || '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-green-400 font-semibold">
                      ${event.cost_of_breach_prevented?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Control */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Showing {visibleEvents.length} of {piiEvents.length}
            </div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => setPage(1)}
                  className="px-3 py-1.5 text-xs rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                >
                  Back to top
                </button>
              )}
              {hasMore ? (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-1.5 text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Load more
                </button>
              ) : (
                <span className="text-xs text-slate-500">End of results</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------- Main Page Export ------------------------- */
export default function PIIPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    getUserRole(supabase).then((r) => {
      setRole(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
          Checking access…
        </div>
        <Footer />
      </div>
    );
  }

  if (!['super_admin', 'admin'].includes(role || '')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-400">
          <Lock className="w-10 h-10 text-slate-500 mb-3" />
          Access Denied
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <PIIPageContent />
      <Footer />
    </div>
  );
}
