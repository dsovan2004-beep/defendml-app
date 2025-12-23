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
  BeakerIcon
} from '@heroicons/react/24/outline';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Report {
  id: string;
  report_id: string;
  target: string;
  total_prompts: number;
  blocked_count: number;
  flagged_count: number;
  allowed_count: number;
  success_rate: number;
  layer_breakdown: {
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
    if (id) {
      loadReport(id as string);
    }
  }, [id]);

  async function loadReport(reportId: string) {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('red_team_reports')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (fetchError) throw fetchError;
      setReport(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }

  function calculateASL3Verdict(successRate: number): 'PASS' | 'FAIL' {
    return successRate >= 90 ? 'PASS' : 'FAIL';
  }

  function exportToPDF() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="text-red-400 font-semibold text-lg">Error Loading Report</h2>
            <p className="text-red-300/80 mt-2">{error || 'Report not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const asl3Verdict = calculateASL3Verdict(report.success_rate);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Red Team Evidence Report</h1>
              <p className="text-slate-400 mt-1">Report ID: {report.report_id}</p>
              <p className="text-sm text-slate-500 mt-1">Target: {report.target}</p>
            </div>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
            >
              <DocumentArrowDownIcon className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* ASL-3 Verdict */}
        <div className={`rounded-xl border p-6 mb-6 ${
          asl3Verdict === 'PASS' 
            ? 'border-green-500/30 bg-green-500/5' 
            : 'border-red-500/30 bg-red-500/5'
        }`}>
          <div className="flex items-center gap-3">
            {asl3Verdict === 'PASS' ? (
              <div className="p-3 rounded-lg bg-green-500/10">
                <ShieldCheckIcon className="w-8 h-8 text-green-400" />
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-500/10">
                <ShieldExclamationIcon className="w-8 h-8 text-red-400" />
              </div>
            )}
            <div>
              <h2 className={`text-xl font-bold ${
                asl3Verdict === 'PASS' ? 'text-green-400' : 'text-red-400'
              }`}>
                ASL-3 Verdict: {asl3Verdict}
              </h2>
              <p className={`text-sm ${
                asl3Verdict === 'PASS' ? 'text-green-300/80' : 'text-red-300/80'
              }`}>
                Detection Rate: {report.success_rate.toFixed(1)}% 
                {asl3Verdict === 'FAIL' && ' (Requires ≥90% for PASS)'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3 mb-2">
              <BeakerIcon className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-slate-400">Total Scenarios</span>
            </div>
            <div className="text-3xl font-bold text-white">{report.total_prompts}</div>
            <div className="text-xs text-slate-500 mt-1">Attack patterns tested</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-slate-400">Blocked</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{report.blocked_count}</div>
            <div className="text-xs text-slate-500 mt-1">Successfully defended</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3 mb-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-slate-400">Flagged</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{report.flagged_count}</div>
            <div className="text-xs text-slate-500 mt-1">Suspicious activity</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-slate-400">Allowed</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{report.allowed_count}</div>
            <div className="text-xs text-slate-500 mt-1">Vulnerabilities found</div>
          </div>
        </div>

        {/* Defense Layer Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Defense Layer Analysis</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(report.layer_breakdown).map(([layer, count]) => (
              <div key={layer} className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 text-center">
                <div className="text-sm text-slate-400 font-medium">{layer}</div>
                <div className="text-2xl font-bold text-white mt-1">{count}</div>
                <div className="text-xs text-slate-500 mt-1">stopped</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-slate-400" />
              <div>
                <div className="text-sm text-slate-400 font-medium">Total Execution Time</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {(report.total_latency_ms / 1000).toFixed(1)}s
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-6 h-6 text-slate-400" />
              <div>
                <div className="text-sm text-slate-400 font-medium">Average Response Time</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {(report.total_latency_ms / report.total_prompts).toFixed(0)}ms
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Findings Warning */}
        {report.allowed_count > 0 && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">Critical Findings</h3>
                <p className="text-yellow-300/80 mt-2">
                  {report.allowed_count} attack scenarios bypassed all defense layers. 
                  Immediate remediation recommended for production deployment.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-yellow-300/80 font-medium">Recommended Actions:</p>
                  <ul className="text-sm text-yellow-300/70 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>Review and strengthen L1 Constitutional filters</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>Enhance L2 CBRN threat detection patterns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>Implement additional context-based validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>Schedule follow-up red team assessment after fixes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Report Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Started:</span>
              <span className="text-white ml-2">{new Date(report.started_at).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Completed:</span>
              <span className="text-white ml-2">{new Date(report.completed_at).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Target System:</span>
              <span className="text-white ml-2">{report.target}</span>
            </div>
            <div>
              <span className="text-slate-500">Detection Rate:</span>
              <span className="text-white ml-2">{report.success_rate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>DefendML Red Team Testing Service</p>
          <p className="mt-1">Offensive security · Evidence-based · ASL-3 validated</p>
        </div>
      </main>

      <footer className="border-t border-purple-500/20 bg-slate-900/80 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="text-purple-500">◆</span>
              <span>Red team testing powered by AI</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{report.total_prompts} scenarios</span>
              <span className="text-slate-700">•</span>
              <span>{report.success_rate.toFixed(1)}% detection</span>
              <span className="text-slate-700">•</span>
              <span>{(report.total_latency_ms / report.total_prompts).toFixed(0)}ms response</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
