import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { ScrollText, Search, Download, Filter, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

function AuditPageContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const auditLogs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      event: 'PII Detection',
      user: 'admin@defendml.com',
      action: 'blocked',
      details: 'Email address detected and sanitized',
      severity: 'high',
      provider: 'Claude 3.5 Sonnet'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      event: 'Prompt Injection',
      user: 'developer@company.com',
      action: 'blocked',
      details: 'Attempted system prompt override',
      severity: 'critical',
      provider: 'GPT-4'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      event: 'Security Scan',
      user: 'system',
      action: 'completed',
      details: 'Routine security scan completed successfully',
      severity: 'info',
      provider: 'All Providers'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      event: 'Policy Violation',
      user: 'user@company.com',
      action: 'flagged',
      details: 'Sensitive content detected in prompt',
      severity: 'medium',
      provider: 'Gemini Pro'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      event: 'Data Export',
      user: 'admin@defendml.com',
      action: 'completed',
      details: 'Compliance report exported',
      severity: 'info',
      provider: 'DefendML'
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      event: 'Jailbreak Attempt',
      user: 'unknown@suspicious.com',
      action: 'blocked',
      details: 'DAN prompt detected and blocked',
      severity: 'critical',
      provider: 'Claude 3.5 Sonnet'
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      event: 'API Key Exposure',
      user: 'developer@company.com',
      action: 'sanitized',
      details: 'API key removed from prompt',
      severity: 'high',
      provider: 'GPT-4'
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      event: 'Compliance Check',
      user: 'system',
      action: 'passed',
      details: 'SOC 2 compliance verification successful',
      severity: 'info',
      provider: 'DefendML'
    }
  ];

  const filteredLogs = auditLogs.filter(log =>
    log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'blocked':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'completed':
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <ScrollText className="w-8 h-8 text-amber-400" />
              <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
            </div>
            <p className="text-slate-300">
              Complete audit trail for compliance and security
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">45,678</div>
              <div className="text-slate-300 font-medium">Events Logged</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium">Coverage</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">90d</div>
              <div className="text-slate-300 font-medium">Retention</div>
            </div>
          </div>

          {/* Search and Export */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-2xl p-6 border border-amber-500/20 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search audit logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-amber-500/30"
              >
                <Download className="w-5 h-5" />
                Export to CSV
              </button>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-white">Recent Security Events</h3>
              <p className="text-slate-400 text-sm">
                {filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Provider
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        <Filter className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <div className="font-medium">No audit logs found</div>
                        <div className="text-sm text-slate-500 mt-1">Try adjusting your search</div>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-white">{log.event}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300">{log.user}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getActionIcon(log.action)}
                            <span className="text-sm text-slate-300 capitalize">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400">{log.details}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300">{log.provider}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AuditPage() {
  return (
    <RequireAuth role="admin">
      <AuditPageContent />
    </RequireAuth>
  );
}
