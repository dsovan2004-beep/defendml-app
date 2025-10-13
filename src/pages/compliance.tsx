import { FileCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';

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
                <div className="text-sm text-green-400 mt-2">+3% this month</div>
              </div>
            </div>
          </div>

          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          </div>

          {/* Requirements Checklist */}
          <div className="bg-slate-900 rounded-lg border border-slate-800">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">Compliance Requirements</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { requirement: 'Data encryption at rest and in transit', status: 'complete', standard: 'SOC 2' },
                  { requirement: 'Access control and authentication', status: 'complete', standard: 'ISO 27001' },
                  { requirement: 'Audit logging and monitoring', status: 'complete', standard: 'SOC 2' },
                  { requirement: 'Data retention and deletion policies', status: 'in-progress', standard: 'GDPR' },
                  { requirement: 'Incident response procedures', status: 'complete', standard: 'ISO 27001' },
                  { requirement: 'Third-party risk assessment', status: 'pending', standard: 'SOC 2' }
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'complete' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                      item.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                    }`}>
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
    <RequireAuth role="admin">
      <CompliancePageContent />
    </RequireAuth>
  );
}
