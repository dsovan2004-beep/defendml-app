import { FileCheck, CheckCircle2, AlertCircle, Clock, Shield, Activity, Award, TrendingUp } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { UserRole } from '../types/roles';

function CompliancePageContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-slate-950">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
            </div>
            <p className="text-slate-400">Track regulatory compliance and security standards</p>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Overall Compliance Score</h2>
                <p className="text-slate-400">Your organization's security posture</p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  94%
                </div>
                <div className="text-sm text-green-400 mt-2 flex items-center gap-1 justify-center">
                  <TrendingUp className="w-4 h-4" />
                  +3% this month
                </div>
              </div>
            </div>
          </div>

          {/* Standards Grid - NOW WITH 4 CARDS INCLUDING ASL-3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">SOC 2 Type II</h3>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-green-400 text-sm font-medium">Compliant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Last Audit</span>
                  <span className="text-slate-300 text-sm">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Next Review</span>
                  <span className="text-slate-300 text-sm">Jul 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">ISO 27001</h3>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-green-400 text-sm font-medium">Certified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Issued</span>
                  <span className="text-slate-300 text-sm">Mar 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Expires</span>
                  <span className="text-slate-300 text-sm">Mar 2027</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">GDPR</h3>
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-yellow-400 text-sm font-medium">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Completion</span>
                  <span className="text-slate-300 text-sm">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Target Date</span>
                  <span className="text-slate-300 text-sm">May 2024</span>
                </div>
              </div>
            </div>

            {/* NEW: ASL-3 Card */}
            <div className="bg-slate-900 rounded-lg p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">ASL-3</h3>
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Status</span>
                  <span className="text-green-400 text-sm font-medium">Compliant</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Overall Score</span>
                  <span className="text-slate-300 text-sm">96.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Last Assessed</span>
                  <span className="text-slate-300 text-sm">Oct 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: ASL-3 Detailed Compliance Section */}
          <div className="bg-slate-900 rounded-lg border border-purple-500/30 mb-8">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">ASL-3 Compliance</h2>
                  <p className="text-sm text-slate-400">Anthropic AI Safety Level 3 - Advanced AI System Protection</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall ASL-3 Scorecard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-slate-400">Overall Status</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">COMPLIANT</div>
                  <div className="text-sm text-slate-500 mt-1">96.5% Overall Score</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Deployment Standard</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">98%</div>
                  <div className="text-sm text-slate-500 mt-1">Prevent Misuse</div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-slate-400">Security Standard</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-400">94%</div>
                  <div className="text-sm text-slate-500 mt-1">Protect Model Weights</div>
                </div>
              </div>

              {/* Constitutional Classifiers Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Constitutional Classifiers
                </h3>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
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
                      <div className="text-xs text-slate-400 mb-1">False Positive Rate</div>
                      <div className="text-lg font-bold text-yellow-400">0.3%</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-xs text-slate-400 mb-2">Top Triggered Rules (24h)</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">CBRN-related queries</span>
                        <span className="text-sm text-slate-400">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Jailbreak attempts</span>
                        <span className="text-sm text-slate-400">32%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Policy violations</span>
                        <span className="text-sm text-slate-400">23%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4-Layer Defense Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  4-Layer Defense Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { num: 1, name: 'Access Controls', desc: 'Tier-based permissions, MFA', status: 'ACTIVE' },
                    { num: 2, name: 'Real-Time Classifiers', desc: 'Input/output classification', status: 'ACTIVE' },
                    { num: 3, name: 'Async Monitoring', desc: 'Pattern detection, anomalies', status: 'ACTIVE' },
                    { num: 4, name: 'Rapid Response', desc: 'Incident creation, <5min SLA', status: 'ACTIVE' }
                  ].map(layer => (
                    <div key={layer.num} className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                            <span className="text-green-400 font-bold text-sm">L{layer.num}</span>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <span className="text-xs text-green-400 font-semibold">{layer.status}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mb-1">{layer.name}</div>
                      <div className="text-xs text-slate-400">{layer.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Standard Components */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Security Standard Controls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Multi-party Authorization', desc: 'Required for sensitive operations', status: 'Enabled' },
                    { name: 'Model Weight Encryption', desc: 'AES-256 encryption at rest', status: 'Enabled' },
                    { name: 'Egress Monitoring', desc: 'Data exfiltration detection', status: 'Active' },
                    { name: 'Insider Threat Detection', desc: 'Behavioral analysis & alerts', status: 'Active' }
                  ].map((control, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-white mb-1">{control.name}</div>
                        <div className="text-xs text-slate-400 mb-2">{control.desc}</div>
                        <div className="text-xs text-green-400 font-semibold">✓ {control.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Team & Bug Bounty */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-400" />
                  Red Team & Bug Bounty Program
                </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
    <div className="text-xs text-slate-400 mb-1">Active Tests</div>
    <div className="text-2xl font-bold text-orange-400">24</div>
    <div className="text-xs text-slate-500 mt-1">ASL-3 Prompts</div>
  </div>
  
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
    <div className="text-xs text-slate-400 mb-1">Critical Bounties</div>
    <div className="text-2xl font-bold text-red-400">5</div>
    <div className="text-xs text-slate-500 mt-1">$5K-$15K payouts</div>
  </div>
  
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
    <div className="text-xs text-slate-400 mb-1">Attack Library</div>
    <div className="text-2xl font-bold text-green-400">100</div>
    <div className="text-xs text-slate-500 mt-1">Total prompts</div>
  </div>
  
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
    <div className="text-xs text-slate-400 mb-1">Bounties Paid</div>
    <div className="text-2xl font-bold text-orange-400">$87.5K</div>
    <div className="text-xs text-slate-500 mt-1">Program total</div>
  </div>
</div>
              </div>
            </div>
          </div>

          {/* Requirements Checklist - Enhanced with ASL-3 */}
          <div className="bg-slate-900 rounded-lg border border-slate-800">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Compliance Requirements</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { requirement: 'Data encryption at rest and in transit', status: 'complete', standard: 'SOC 2 + ASL-3' },
                  { requirement: 'Access control and authentication', status: 'complete', standard: 'ISO 27001 + ASL-3' },
                  { requirement: 'Audit logging and monitoring', status: 'complete', standard: 'SOC 2 + GDPR' },
                  { requirement: 'Data retention and deletion policies', status: 'in-progress', standard: 'GDPR' },
                  { requirement: 'Incident response procedures', status: 'complete', standard: 'ISO 27001 + ASL-3' },
                  { requirement: 'Third-party risk assessment', status: 'complete', standard: 'SOC 2' },
                  { requirement: 'Constitutional AI classifiers', status: 'complete', standard: 'ASL-3' },
                  { requirement: 'Multi-layer defense architecture', status: 'complete', standard: 'ASL-3' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-3">
                      {item.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : item.status === 'in-progress' ? (
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
                        item.status === 'complete'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : item.status === 'in-progress'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      {item.status === 'complete' ? 'Complete' : item.status === 'in-progress' ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
