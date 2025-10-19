import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Shield, CheckCircle, XCircle, AlertCircle, Lock, Eye, Zap,
  TrendingUp, AlertTriangle, Users, DollarSign, Clock
} from 'lucide-react';

type ASL3Data = {
  overall_status: 'COMPLIANT' | 'IN_PROGRESS' | 'NON_COMPLIANT';
  deployment_score: number;
  security_score: number;
  classifier: {
    status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
    accuracy: number;
    latency_p95: number;
    false_positive_rate: number;
    blocks_24h: number;
    top_rules: Array<{ rule: string; percentage: number }>;
  };
  defense_layers: Array<{
    layer: number;
    name: string;
    status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
    description: string;
  }>;
  security_standard: {
    multi_party_auth: boolean;
    model_encryption: string;
    egress_monitoring: boolean;
    insider_threat_detection: boolean;
  };
  red_team: {
    active_programs: number;
    vulnerabilities_30d: number;
    avg_remediation_days: number;
    total_bounties_paid: number;
  };
};

function ASL3StatusPage() {
  const [data, setData] = useState<ASL3Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setData({
        overall_status: 'COMPLIANT',
        deployment_score: 98.0,
        security_score: 94.0,
        classifier: {
          status: 'ACTIVE',
          accuracy: 99.6,
          latency_p95: 42,
          false_positive_rate: 0.3,
          blocks_24h: 847,
          top_rules: [
            { rule: 'CBRN-related queries', percentage: 45 },
            { rule: 'Jailbreak attempts', percentage: 32 },
            { rule: 'Policy violations', percentage: 23 }
          ]
        },
        defense_layers: [
          { layer: 1, name: 'Access Controls', status: 'ACTIVE', description: 'Tier-based permissions, MFA, API restrictions' },
          { layer: 2, name: 'Real-Time Classifiers', status: 'ACTIVE', description: 'Input/output classification, constitutional AI rules' },
          { layer: 3, name: 'Async Monitoring', status: 'ACTIVE', description: 'Pattern detection, multi-turn attacks, anomalies' },
          { layer: 4, name: 'Rapid Response', status: 'ACTIVE', description: 'Automated incidents, <5min response, remediation' }
        ],
        security_standard: {
          multi_party_auth: true,
          model_encryption: 'AES-256',
          egress_monitoring: true,
          insider_threat_detection: true
        },
        red_team: {
          active_programs: 3,
          vulnerabilities_30d: 2,
          avg_remediation_days: 4.5,
          total_bounties_paid: 87500
        }
      });
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
      case 'ACTIVE':
        return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'IN_PROGRESS':
      case 'DEGRADED':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'NON_COMPLIANT':
      case 'DOWN':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5" />;
      case 'IN_PROGRESS':
      case 'DEGRADED':
        return <AlertCircle className="w-5 h-5" />;
      case 'NON_COMPLIANT':
      case 'DOWN':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading ASL-3 Status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 bg-slate-950">
        <div className="border-b border-slate-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">ASL-3 Compliance Status</h1>
                <p className="text-slate-400">Anthropic Safety Level 3 Framework - Real-time monitoring</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(data.overall_status)}`}>
                {getStatusIcon(data.overall_status)}
                <span className="font-semibold text-sm">{data.overall_status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          
          {/* Overall Compliance Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Deployment Standard</h2>
                  <p className="text-sm text-slate-400">Prevent misuse & harm</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-purple-400 mb-2">{data.deployment_score}%</div>
              <div className="text-slate-300 text-sm">Constitutional classifiers, 4-layer defense, rapid response</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Security Standard</h2>
                  <p className="text-sm text-slate-400">Protect model weights</p>
                </div>
              </div>
              <div className="text-5xl font-bold text-blue-400 mb-2">{data.security_score}%</div>
              <div className="text-slate-300 text-sm">Multi-party auth, encryption, egress monitoring, insider threat detection</div>
            </div>
          </div>

          {/* Constitutional Classifiers Section */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Constitutional Classifiers</h2>
                  <p className="text-sm text-slate-400">Real-time input/output monitoring</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(data.classifier.status)}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                {data.classifier.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-purple-400 mb-1">{data.classifier.accuracy}%</div>
                <div className="text-xs text-slate-400">Accuracy</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-purple-400 mb-1">{data.classifier.latency_p95}ms</div>
                <div className="text-xs text-slate-400">Latency (P95)</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-purple-400 mb-1">{data.classifier.false_positive_rate}%</div>
                <div className="text-xs text-slate-400">False Positive Rate</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl font-bold text-purple-400 mb-1">{data.classifier.blocks_24h}</div>
                <div className="text-xs text-slate-400">Blocked (24h)</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Top Triggered Rules:</h3>
              <div className="space-y-2">
                {data.classifier.top_rules.map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">• {rule.rule}</span>
                    <span className="text-sm font-semibold text-purple-400">{rule.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Layer Defense Visualization */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">4-Layer Defense Architecture</h2>
                <p className="text-sm text-slate-400">Defense-in-depth security model</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.defense_layers.map((layer) => (
                <div key={layer.layer} className="bg-black/40 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-purple-400">L{layer.layer}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
                        <p className="text-xs text-slate-400">{layer.description}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(layer.status)}`}>
                      {getStatusIcon(layer.status)}
                      {layer.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Standard Compliance */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Standard Compliance</h2>
                <p className="text-sm text-slate-400">Model weight protection & access controls</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Multi-party Authorization</span>
                </div>
                <span className="text-xs font-semibold text-green-400">{data.security_standard.multi_party_auth ? 'ENABLED' : 'DISABLED'}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Model Weight Encryption</span>
                </div>
                <span className="text-xs font-semibold text-green-400">{data.security_standard.model_encryption}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Egress Monitoring</span>
                </div>
                <span className="text-xs font-semibold text-green-400">{data.security_standard.egress_monitoring ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-slate-300">Insider Threat Detection</span>
                </div>
                <span className="text-xs font-semibold text-green-400">{data.security_standard.insider_threat_detection ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
            </div>
          </div>

          {/* Red Team & Bug Bounty */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Red Team & Bug Bounty Program</h2>
                <p className="text-sm text-slate-400">External security validation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.red_team.active_programs}</div>
                <div className="text-xs text-slate-400">Active Programs</div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.red_team.vulnerabilities_30d}</div>
                <div className="text-xs text-slate-400">Vulnerabilities (30d)</div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{data.red_team.avg_remediation_days}</div>
                <div className="text-xs text-slate-400">Avg Remediation (days)</div>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">${(data.red_team.total_bounties_paid / 1000).toFixed(0)}K</div>
                <div className="text-xs text-slate-400">Total Bounties Paid</div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="text-blue-300 font-semibold text-sm mb-1">ASL-3 Certification</div>
              <div className="text-blue-200/80 text-sm">
                DefendML is the first LLM security platform to achieve full ASL-3 compliance, meeting Anthropic's industry-leading safety standards for advanced AI systems.
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Protected() {
  return (
    <RequireAuth>
      <ASL3StatusPage />
    </RequireAuth>
  );
}
