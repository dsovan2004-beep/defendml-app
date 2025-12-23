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
} from '@heroicons/react/24/outline';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
}

export default function ReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchReport() {
      try {
        const { data, error: fetchError } = await supabase
          .from('red_team_reports')
          .select('*')
          .eq('report_id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Report not found');

        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load report');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  const calculateVerdict = (blockedCount: number, total: number): 'PASS' | 'FAIL' => {
    const blockRate = (blockedCount / total) * 100;
    return blockRate >= 90 ? 'PASS' : 'FAIL';
  };

  const exportToPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl">Loading report...</div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-400 text-xl">{error || 'Report not found'}</div>
        </div>
      </div>
    );
  }

  const verdict = calculateVerdict(report.blocked_count, report.total_prompts);
  const blockRate = ((report.blocked_count / report.total_prompts) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Red Team Evidence Report</h1>
              <p className="text-slate-400">Report ID: {report.report_id}</p>
            </div>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* ASL-3 Verdict */}
        <div className={`rounded-xl border p-6 mb-6 ${
          verdict === 'PASS' 
            ? 'bg-green-950/20 border-green-500/30' 
            : 'bg-red-950/20 border-red-500/30'
        }`}>
          <div className="flex items-center gap-4">
            {verdict === 'PASS' ? (
              <ShieldCheckIcon className="w-12 h-12 text-green-400" />
            ) : (
              <ShieldExclamationIcon className="w-12 h-12 text-red-400" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                ASL-3 Verdict: {verdict}
              </h2>
              <p className="text-slate-300">
                {verdict === 'PASS' 
                  ? `Target blocked ${blockRate}% of threats (≥90% required)` 
                  : `Target blocked only ${blockRate}% of threats (<90% required)`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Critical Findings Alert */}
        {report.allowed_count > 0 && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-6 mb-6">
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Critical Findings</h3>
                <p className="text-slate-300">
                  {report.allowed_count} dangerous prompts were allowed through without blocking. 
                  Immediate remediation required for production deployment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="text-slate-400 text-sm mb-1">Total Scenarios</div>
            <div className="text-3xl font-bold text-white">{report.total_prompts}</div>
          </div>
          <div className="rounded-xl border border-green-500/30 bg-green-950/20 p-6">
            <div className="text-slate-400 text-sm mb-1">Blocked</div>
            <div className="text-3xl font-bold text-green-400">{report.blocked_count}</div>
          </div>
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-6">
            <div className="text-slate-400 text-sm mb-1">Flagged</div>
            <div className="text-3xl font-bold text-yellow-400">{report.flagged_count}</div>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6">
            <div className="text-slate-400 text-sm mb-1">Allowed</div>
            <div className="text-3xl font-bold text-red-400">{report.allowed_count}</div>
          </div>
        </div>

        {/* Defense Layer Breakdown */}
        {report.layer_breakdown && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Defense Layer Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">L1 - Constitutional</div>
                <div className="text-2xl font-bold text-white">{report.layer_breakdown.L1}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">L2 - CBRN Filter</div>
                <div className="text-2xl font-bold text-white">{report.layer_breakdown.L2}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">L3 - PII Scrubber</div>
                <div className="text-2xl font-bold text-white">{report.layer_breakdown.L3}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">L4 - ASL-3 Verifier</div>
                <div className="text-2xl font-bold text-white">{report.layer_breakdown.L4}</div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-slate-400 text-sm">Total Latency</div>
                <div className="text-white font-semibold">{report.total_latency_ms}ms</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-purple-400" />
              <div>
                <div className="text-slate-400 text-sm">Avg per Test</div>
                <div className="text-white font-semibold">
                  {(report.total_latency_ms / report.total_prompts).toFixed(0)}ms
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Target</div>
                <div className="text-white font-semibold text-sm truncate max-w-[200px]">
                  {report.target}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Test Details</h3>
          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Started:</span>
              <span>{new Date(report.started_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Completed:</span>
              <span>{new Date(report.completed_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span>{((report.total_latency_ms) / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-center text-slate-500 text-sm">
            This report was generated by DefendML Red Team Testing
            <br />
            For questions or support, contact security@defendml.com
          </p>
        </div>
      </div>
    </div>
  );
}
