import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { UserRole } from '../types/roles';
import { 
  ScrollText, Search, Download, Filter, Shield, AlertTriangle, 
  CheckCircle, Layers, Target, Activity, Clock 
} from 'lucide-react';

function AuditPageContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLayer, setFilterLayer] = useState('all');

  const auditLogs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      event: 'PII Detection',
      user: 'admin@defendml.com',
      action: 'blocked',
      details: 'Email address detected and sanitized',
      severity: 'high',
      provider: 'Claude 3.5 Sonnet',
      asl3Category: 'deployment',
      defenseLayer: 2,
      responseTime: 45
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      event: 'Prompt Injection',
      user: 'developer@company.com',
      action: 'blocked',
      details: 'Attempted system prompt override',
      severity: 'critical',
      provider: 'GPT-4',
      asl3Category: 'deployment',
      defenseLayer: 2,
      responseTime: 38
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      event: 'Security Scan',
      user: 'system',
      action: 'completed',
      details: 'Routine security scan completed successfully',
      severity: 'info',
      provider: 'All Providers',
      asl3Category: 'monitoring',
      defenseLayer: 3,
      responseTime: 120
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      event: 'Policy Violation',
      user: 'user@company.com',
      action: 'flagged',
      details: 'Sensitive content detected in prompt',
      severity: 'medium',
      provider: 'Gemini Pro',
      asl3Category: 'deployment',
      defenseLayer: 2,
      responseTime: 52
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      event: 'Compliance Report',
      user: 'admin@defendml.com',
      action: 'completed',
      details: 'ASL-3 compliance report exported',
      severity: 'info',
      provider: 'DefendML',
      asl3Category: 'security',
      defenseLayer: 4,
      responseTime: 180
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      event: 'Jailbreak Attempt',
      user: 'unknown@suspicious.com',
      action: 'blocked',
      details: 'DAN prompt detected and blocked',
      severity: 'critical',
      provider: 'Claude 3.5 Sonnet',
      asl3Category: 'deployment',
      defenseLayer: 2,
      responseTime: 42
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      event: 'API Key Exposure',
      user: 'developer@company.com',
      action: 'sanitized',
      details: 'API key removed from prompt',
      severity: 'high',
      provider: 'GPT-4',
      asl3Category: 'security',
      defenseLayer: 1,
      responseTime: 28
    },
    {
      id: 8,
      timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      event: 'Compliance Check',
      user: 'system',
      action: 'passed',
      details: 'SOC 2 compliance verification successful',
      severity: 'info',
      provider: 'DefendML',
      asl3Category: 'security',
      defenseLayer: 4,
      responseTime: 240
    },
    {
      id: 9,
      timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
      event: 'Multi-Turn Attack',
      user: 'attacker@malicious.com',
      action: 'blocked',
      details: 'Coordinated multi-turn jailbreak detected',
      severity: 'critical',
      provider: 'GPT-4',
      asl3Category: 'deployment',
      defenseLayer: 3,
      responseTime: 95
    },
    {
      id: 10,
      timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
      event: 'Defense Layer Check',
      user: 'system',
      action: 'healthy',
      details: 'All 4 defense layers operational',
      severity: 'info',
      provider: 'DefendML',
      asl3Category: 'monitoring',
      defenseLayer: 4,
      responseTime: 5
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || log.asl3Category === filterCategory;
    const matchesLayer = filterLayer === 'all' || log.defenseLayer.toString() === filterLayer;
    
    return matchesSearch && matchesCategory && matchesLayer;
  });

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
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLayerBadge = (layer: number) => {
    const colors = [
      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'bg-green-500/20 text-green-300 border-green-500/30'
    ];
    return colors[layer - 1] || colors[0];
  };

  // Calculate ASL-3 stats
  const deploymentEvents = auditLogs.filter(log => log.asl3Category === 'deployment').length;
  const securityEvents = auditLogs.filter(log => log.asl3Category === 'security').length;
  const monitoringEvents = auditLogs.filter(log => log.asl3Category === 'monitoring').length;
  const avgResponseTime = Math.round(auditLogs.reduce((sum, log) => sum + log.responseTime, 0) / auditLogs.length);

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
              Complete audit trail for compliance and security with ASL-3 tracking
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* ASL-3 Compliance Overview */}
          <div className="relative bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl animate-pulse pointer-events-none"></div>
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">ASL-3 Audit Compliance</h2>
                    <p className="text-sm text-slate-400">Complete audit trail with 90-day retention</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-sm text-green-400">COMPLIANT</span>
                  </div>
                </div>
              </div>

              {/* ASL-3 Category Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/40 rounded-xl p-5 border border-amber-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-300">Deployment Events</span>
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mb-1">{deploymentEvents}</div>
                  <div className="text-xs text-slate-400">Constitutional classifiers</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-semibold text-orange-300">Security Events</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-400 mb-1">{securityEvents}</div>
                  <div className="text-xs text-slate-400">Access controls</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-300">Monitoring Events</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{monitoringEvents}</div>
                  <div className="text-xs text-slate-400">Pattern detection</div>
                </div>

                <div className="bg-black/40 rounded-xl p-5 border border-green-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-300">Avg Response</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-1">{avgResponseTime}ms</div>
                  <div className="text-xs text-slate-400">Within SLA targets</div>
                </div>
              </div>

              {/* Defense Layer Distribution */}
              <div className="bg-black/40 rounded-xl p-6 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-semibold text-white">Events by Defense Layer</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map(layer => {
                    const count = auditLogs.filter(log => log.defenseLayer === layer).length;
                    const layerNames = ['Access Controls', 'Real-Time Classifiers', 'Async Monitoring', 'Rapid Response'];
                    return (
                      <div key={layer} className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
                        <div className="text-lg font-bold text-amber-400 mb-1">L{layer}: {count}</div>
                        <div className="text-xs text-slate-400">{layerNames[layer - 1]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">45,678</div>
              <div className="text-slate-300 font-medium">Events Logged</div>
              <div className="text-xs text-slate-500 mt-1">All ASL-3 categories tracked</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
              <div className="text-slate-300 font-medium">Coverage</div>
              <div className="text-xs text-slate-500 mt-1">All layers monitored</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl font-bold text-amber-400 mb-2">90d</div>
              <div className="text-slate-300 font-medium">Retention</div>
              <div className="text-xs text-slate-500 mt-1">ASL-3 compliant storage</div>
            </div>
          </div>

          {/* Search, Filters and Export */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-2xl p-6 border border-amber-500/20">
            <div className="flex flex-col gap-4">
              {/* Search and Export Row */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
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
                  Export ASL-3 Report
                </button>
              </div>

              {/* ASL-3 Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">ASL-3 Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="deployment">Deployment Standard</option>
                    <option value="security">Security Standard</option>
                    <option value="monitoring">Monitoring & Response</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Defense Layer</label>
                  <select
                    value={filterLayer}
                    onChange={(e) => setFilterLayer(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Layers</option>
                    <option value="1">L1: Access Controls</option>
                    <option value="2">L2: Real-Time Classifiers</option>
                    <option value="3">L3: Async Monitoring</option>
                    <option value="4">L4: Rapid Response</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-bold text-white">ASL-3 Security Events</h3>
              <p className="text-slate-400 text-sm">
                {filteredLogs.length} event{filteredLogs.length !== 1 ? 's' : ''} found • All events tracked for compliance
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
                      Layer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                      Severity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                        <Filter className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <div className="font-medium">No audit logs found</div>
                        <div className="text-sm text-slate-500 mt-1">Try adjusting your filters</div>
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
                          <div className="text-sm font-medium text-white">{log.event}</div>
                          <div className="text-xs text-slate-500">{log.provider}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getLayerBadge(log.defenseLayer)}`}>
                            L{log.defenseLayer}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-300">{log.responseTime}ms</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400">{log.details}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
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
    <RequireAuth role={UserRole.SUPER_ADMIN}>
      <AuditPageContent />
    </RequireAuth>
  );
}
