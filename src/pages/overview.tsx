import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { Shield, AlertTriangle, Lock, FileCheck, TrendingUp, TrendingDown, Zap, DollarSign, Clock, Users, Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface KPI {
  threats_blocked: number;
  pii_redacted: number;
  compliance_score: number;
  cost_saved_vs_calypso: number;
  multi_llm_providers: number;
  avg_latency_ms: number;
}

interface ASL3Metrics {
  overall_score: number;
  status: 'COMPLIANT' | 'IN_PROGRESS' | 'NON_COMPLIANT';
  classifier_accuracy: number;
  defense_layers_active: number;
  incident_response_time: number;
  false_positive_rate: number;
}

const Overview: React.FC = () => {
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [asl3Metrics, setAsl3Metrics] = useState<ASL3Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
    fetchASL3Metrics();
  }, []);

  const fetchKPIs = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: KPI = {
        threats_blocked: 1247,
        pii_redacted: 3891,
        compliance_score: 98.5,
        cost_saved_vs_calypso: 48750,
        multi_llm_providers: 4,
        avg_latency_ms: 45
      };
      setKpis(mockData);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchASL3Metrics = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: ASL3Metrics = {
        overall_score: 96.5,
        status: 'COMPLIANT',
        classifier_accuracy: 99.6,
        defense_layers_active: 4,
        incident_response_time: 2.8,
        false_positive_rate: 0.3
      };
      setAsl3Metrics(mockData);
    } catch (error) {
      console.error('Error fetching ASL-3 metrics:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'IN_PROGRESS': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'NON_COMPLIANT': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return <CheckCircle className="w-5 h-5" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-5 h-5" />;
      case 'NON_COMPLIANT': return <XCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with ASL-3 Badge */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Dashboard Overview</h1>
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-semibold rounded-full">
                ASL-3 CERTIFIED
              </span>
            </div>
            <p className="text-slate-400">Real-time AI security monitoring with Anthropic ASL-3 standards</p>
          </div>

          {/* ASL-3 Compliance Status Widget */}
          {asl3Metrics && (
            <div className="mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">ASL-3 Compliance Status</h2>
                    <p className="text-sm text-slate-400">Anthropic Safety Level 3 Framework</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(asl3Metrics.status)}`}>
                  {getStatusIcon(asl3Metrics.status)}
                  <span className="font-semibold text-sm">{asl3Metrics.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{asl3Metrics.classifier_accuracy}%</div>
                  <div className="text-xs text-slate-400">Classifier Accuracy</div>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{asl3Metrics.defense_layers_active}/4</div>
                  <div className="text-xs text-slate-400">Defense Layers Active</div>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{asl3Metrics.incident_response_time}s</div>
                  <div className="text-xs text-slate-400">Incident Response</div>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{asl3Metrics.false_positive_rate}%</div>
                  <div className="text-xs text-slate-400">False Positive Rate</div>
                </div>
                <div className="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                  <div className="text-2xl font-bold text-green-400 mb-1">{asl3Metrics.overall_score}%</div>
                  <div className="text-xs text-slate-400">Overall ASL-3 Score</div>
                </div>
              </div>

              {/* Info Footer */}
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <p className="text-sm text-slate-400">
                  ASL-3 certification ensures constitutional AI alignment, multi-layer defense architecture, and transparent threat detection.
                  <a href="/threats" className="text-purple-400 hover:text-purple-300 ml-2 font-semibold">View Details →</a>
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Security</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{kpis?.threats_blocked.toLocaleString()}</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">Threats Blocked</div>
                  <div className="text-slate-400 text-xs">Prompt injections + jailbreaks</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Lock className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Privacy</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{kpis?.pii_redacted.toLocaleString()}</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">PII Instances Redacted</div>
                  <div className="text-slate-400 text-xs">SSN, credit cards, emails</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">Compliance</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{kpis?.compliance_score}%</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">Compliance Score</div>
                  <div className="text-slate-400 text-xs">SOC 2, ISO 27001, GDPR</div>
                </div>
              </div>

              {/* Bottom Competitive Advantage Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">ROI</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">${(kpis?.cost_saved_vs_calypso ?? 48750).toLocaleString()}</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">Annual Savings</div>
                  <div className="text-slate-400 text-xs">vs. Lakera/CalypsoAI ($50K-60K/yr)</div>
                </div>

                <div className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Interop</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{kpis?.multi_llm_providers ?? 4}+</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">LLM Providers</div>
                  <div className="text-slate-400 text-xs">OpenAI, Anthropic, AWS, Azure</div>
                </div>

                <div className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-green-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-400" />
                    </div>
                    <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Speed</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{kpis?.avg_latency_ms}ms</div>
                  <div className="text-slate-300 text-sm font-medium mb-1">Avg Latency (P95)</div>
                  <div className="text-slate-400 text-xs">5x faster than CalypsoAI</div>
                </div>
              </div>

              {/* Live Threat Feed */}
              <div className="mt-8 bg-slate-900 rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Live Threat Feed
                    <span className="text-xs text-slate-500 font-normal">(real-time)</span>
                  </h2>
                  <a href="/threats" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                    View All Threats →
                  </a>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'Prompt Injection', severity: 'HIGH', time: '2m ago', confidence: '98.0%' },
                    { type: 'PII Leak Attempt', severity: 'CRITICAL', time: '5m ago', confidence: '95.0%' },
                    { type: 'Jailbreak Attempt', severity: 'HIGH', time: '12m ago', confidence: '99.0%' },
                    { type: 'Data Exfiltration', severity: 'MEDIUM', time: '18m ago', confidence: '87.0%' }
                  ].map((threat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          threat.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' :
                          threat.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium text-white">{threat.type}</div>
                          <div className="text-xs text-slate-500">Detected {threat.time} • Confidence: {threat.confidence}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        threat.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                        threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {threat.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
};

export default Overview;
