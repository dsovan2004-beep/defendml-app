// src/pages/reports/[id].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navigation from '../../components/Navigation';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

/* ------------------------------------------------------------------
   Supabase helpers
------------------------------------------------------------------- */

// Base client (auth only)
const supabaseAuth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Auth-bound client (used ONLY after session is confirmed)
function getAuthedSupabase(accessToken: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
}

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------- */

interface Report {
  report_id: string;
  target: string;
  total_prompts: number;
  blocked_count: number;
  flagged_count: number;
  allowed_count: number;
  success_rate: number;
  layer_breakdown?: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
  };
  started_at: string;
  completed_at: string;
  total_latency_ms: number;
  attack_intelligence?: any;
  remediation_playbook?: any;
  analysis_completed_at?: string;
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */

export default function ReportPage() {
  const router = useRouter();
  const { id } = router.query;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let pollInterval: NodeJS.Timeout | null = null;

    async function loadReport() {
      try {
        setLoading(true);

        // 1️⃣ Ensure session exists
        const { data: sessionData, error: sessionError } =
          await supabaseAuth.auth.getSession();

        if (sessionError || !sessionData.session) {
          throw new Error('Authentication required');
        }

        const accessToken = sessionData.session.access_token;
        const supabase = getAuthedSupabase(accessToken);

        // 2️⃣ Initial fetch
        const { data, error } = await supabase
          .from('red_team_reports')
          .select('*')
          .eq('report_id', id)
          .single();

        if (error) throw error;
        setReport(data);

        // 3️⃣ Poll for AI analysis completion
        pollInterval = setInterval(async () => {
          if (data.analysis_completed_at) {
            if (pollInterval) clearInterval(pollInterval);
            return;
          }

          const { data: pollData } = await supabase
            .from('red_team_reports')
            .select('analysis_completed_at, attack_intelligence, remediation_playbook')
            .eq('report_id', id)
            .single();

          if (pollData?.analysis_completed_at) {
            setReport((prev) =>
              prev
                ? {
                    ...prev,
                    analysis_completed_at: pollData.analysis_completed_at,
                    attack_intelligence: pollData.attack_intelligence,
                    remediation_playbook: pollData.remediation_playbook,
                  }
                : prev
            );
            if (pollInterval) clearInterval(pollInterval);
          }
        }, 3000);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }

    loadReport();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id]);

  const calculateVerdict = (
    blocked: number,
    total: number
  ): 'PASS' | 'FAIL' => {
    return (blocked / total) * 100 >= 90 ? 'PASS' : 'FAIL';
  };

  const exportToPDF = () => window.print();

  /* ------------------------------------------------------------------
     UI states
  ------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-screen text-center">
          <div>
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 text-xl mb-4">
              Failed to load report
            </div>
            <div className="text-slate-400 mb-6">{error}</div>
            <button
              onClick={() => router.push('/compliance')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Back to Reports Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
     Derived values
  ------------------------------------------------------------------- */

  const verdict = calculateVerdict(
    report.blocked_count,
    report.total_prompts
  );
  const blockRate = (
    (report.blocked_count / report.total_prompts) *
    100
  ).toFixed(1);
  const analysisReady = !!report.analysis_completed_at;

  /* ------------------------------------------------------------------
     Render (UI UNCHANGED)
  ------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      {/* 🔒 UI content unchanged from your version */}
      {/* (Intentionally omitted here for brevity — keep exactly as-is) */}
    </div>
  );
}
