import { useState } from 'react';
import Navigation from '../components/Navigation';

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState<'threats' | 'incidents' | 'asl3'>('threats');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Security Center</h1>
          </div>
          <p className="text-gray-400">Unified threat monitoring, incident response, and ASL-3 compliance</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 mb-6">
          <div className="flex gap-1 p-1">
            <button
              onClick={() => setActiveTab('threats')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'threats'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Live Threats
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'incidents'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Incidents & Response
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('asl3')}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === 'asl3'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ASL-3 Status
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'threats' && <ThreatsTab />}
        {activeTab === 'incidents' && <IncidentsTab />}
        {activeTab === 'asl3' && <ASL3Tab />}
      </main>

      {/* Footer - Matching Overview Page Exactly */}
      <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left side - Copyright and links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
              <span>© 2025 DefendML</span>
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">API Docs</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Status</a>
            </div>

            {/* Right side - Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-green-400 text-xs font-medium">SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-purple-400 text-xs font-medium">Powered by Anthropic ASL-3</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ===== THREATS TAB =====
function ThreatsTab() {
  const [threats] = useState([
    {
      id: 1,
      timestamp: '2 minutes ago',
      type: 'Jailbreak Attempt',
      severity: 'Critical',
      action: 'Blocked',
      confidence: 0.98,
      layer: 'L2',
      user: 'user_8472',
      details: 'Attempted to bypass content policy via role-play prompt',
      multiTurn: true,
      sessionRisk: 0.87
    },
    {
      id: 2,
      timestamp: '8 minutes ago',
      type: 'CBRN Query',
      severity: 'Critical',
      action: 'Blocked',
      confidence: 0.96,
      layer: 'L2',
      user: 'user_1203',
      details: 'Query related to chemical weapon synthesis',
      multiTurn: false,
      sessionRisk: 0.96
    },
    {
      id: 3,
      timestamp: '15 minutes ago',
      type: 'Policy Violation',
      severity: 'High',
      action: 'Flagged',
      confidence: 0.87,
      layer: 'L3',
      user: 'user_9384',
      details: 'Multi-turn attempt to extract prohibited information',
      multiTurn: true,
      sessionRisk: 0.78
    },
    {
      id: 4,
      timestamp: '23 minutes ago',
      type: 'PII Extraction',
      severity: 'Medium',
      action: 'Blocked',
      confidence: 0.94,
      layer: 'L2',
      user: 'user_5619',
      details: 'Attempted to extract training data containing PII',
      multiTurn: false,
      sessionRisk: 0.52
    },
    {
      id: 5,
      timestamp: '1 hour ago',
      type: 'Prompt Injection',
      severity: 'High',
      action: 'Blocked',
      confidence: 0.91,
      layer: 'L2',
      user: 'user_7241',
      details: 'System prompt override attempt detected',
      multiTurn: false,
      sessionRisk: 0.68
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Enhanced Classifier Performance Widget - ASL-3 ALIGNED */}
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Constitutional Classifier Performance</h3>
          <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p className="text-2xl font-bold text-green-400">99.6%</p>
            <p className="text-xs text-green-400 mt-1">✓ ASL-3 Target: &gt;99%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Latency (P95)</p>
            <p className="text-2xl font-bold text-blue-400">42ms</p>
            <p className="text-xs text-green-400 mt-1">✓ ASL-3 Target: &lt;50ms</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Confidence</p>
            <p className="text-2xl font-bold text-purple-400">High</p>
            <p className="text-xs text-gray-400 mt-1">Avg: 95.2%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">False Positives (24h)</p>
            <p className="text-2xl font-bold text-yellow-400">8</p>
            <p className="text-xs text-green-400 mt-1">✓ Rate: 0.3% (&lt;1%)</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Throughput</p>
            <p className="text-2xl font-bold text-cyan-400">2.4K/s</p>
            <p className="text-xs text-gray-400 mt-1">Processing rate</p>
          </div>
        </div>
      </div>

      {/* NEW: Defense Layer Status - ASL-3 4-LAYER ARCHITECTURE */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          4-Layer Defense Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">L1</span>
              <span className="text-green-400 text-xs font-medium">✓ ACTIVE</span>
            </div>
            <p className="text-white font-medium mb-1">Access Controls</p>
            <p className="text-xs text-gray-400">Uptime: 99.99%</p>
            <p className="text-xs text-gray-400">Latency: 5ms</p>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">L2</span>
              <span className="text-green-400 text-xs font-medium">✓ ACTIVE</span>
            </div>
            <p className="text-white font-medium mb-1">Real-Time Classifiers</p>
            <p className="text-xs text-gray-400">Uptime: 99.94%</p>
            <p className="text-xs text-gray-400">Latency: 42ms</p>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">L3</span>
              <span className="text-green-400 text-xs font-medium">✓ ACTIVE</span>
            </div>
            <p className="text-white font-medium mb-1">Async Monitoring</p>
            <p className="text-xs text-gray-400">Uptime: 99.98%</p>
            <p className="text-xs text-gray-400">Latency: 120ms</p>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">L4</span>
              <span className="text-green-400 text-xs font-medium">✓ ACTIVE</span>
            </div>
            <p className="text-white font-medium mb-1">Rapid Response</p>
            <p className="text-xs text-gray-400">Uptime: 99.95%</p>
            <p className="text-xs text-gray-400">Response: 2.8s</p>
          </div>
        </div>
      </div>

      {/* NEW: Top Triggered Rules - ASL-3 VISIBILITY */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Triggered Rules (24h)</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm">CBRN-related queries</span>
              <span className="text-red-400 text-sm font-medium">45%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm">Jailbreak attempts</span>
              <span className="text-orange-400 text-sm font-medium">32%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: '32%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white text-sm">Policy violations</span>
              <span className="text-yellow-400 text-sm font-medium">23%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: '23%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Live Threat Feed with ASL-3 Context */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live Threat Feed</h3>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                ● Real-time
              </span>
              <span className="text-gray-400 text-sm">847 threats blocked (24h)</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Layer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Session Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {threats.map((threat) => (
                <tr key={threat.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{threat.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{threat.type}</span>
                      {threat.multiTurn && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs" title="Part of multi-turn attack">
                          Multi-Turn
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">
                      {threat.layer}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        threat.confidence >= 0.95 ? 'text-green-400' :
                        threat.confidence >= 0.85 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {(threat.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            threat.sessionRisk >= 0.8 ? 'bg-red-500' :
                            threat.sessionRisk >= 0.6 ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${threat.sessionRisk * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">{(threat.sessionRisk * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      threat.action === 'Blocked' ? 'bg-green-500/20 text-green-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {threat.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{threat.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASL-3 Compliance Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-green-400 font-medium">ASL-3 Threat Detection Active</p>
            <p className="text-green-300/80 text-sm mt-1">
              Constitutional classifiers achieving 99.6% accuracy with 42ms latency. All 4 defense layers operational and meeting ASL-3 targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== INCIDENTS TAB =====
function IncidentsTab() {
  const [incidents] = useState([
    {
      id: 'INC-1847',
      created: '2m ago',
      severity: 'CRITICAL',
      type: 'Jailbreak Attack',
      status: 'OPEN',
      responseTime: 1.2,
      assignee: 'Auto-Response',
      details: 'Multi-turn jailbreak attempt detected across 3 queries',
      slaCompliant: true
    },
    {
      id: 'INC-1846',
      created: '15m ago',
      severity: 'HIGH',
      type: 'Policy Violation',
      status: 'IN_PROGRESS',
      responseTime: 4.5,
      assignee: 'Security Team',
      details: 'Repeated attempts to bypass content filters',
      slaCompliant: true
    },
    {
      id: 'INC-1845',
      created: '1h ago',
      severity: 'MEDIUM',
      type: 'PII Leak Attempt',
      status: 'RESOLVED',
      responseTime: 8.2,
      assignee: 'AI Safety',
      details: 'Attempted extraction of training data PII',
      slaCompliant: false
    },
    {
      id: 'INC-1844',
      created: '2h ago',
      severity: 'HIGH',
      type: 'CBRN Query',
      status: 'RESOLVED',
      responseTime: 3.1,
      assignee: 'Security Team',
      details: 'Chemical synthesis query blocked and logged',
      slaCompliant: true
    },
    {
      id: 'INC-1843',
      created: '4h ago',
      severity: 'MEDIUM',
      type: 'Prompt Injection',
      status: 'RESOLVED',
      responseTime: 6.7,
      assignee: 'Auto-Response',
      details: 'System prompt override attempt',
      slaCompliant: false
    }
  ]);

  const openIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS').length;
  const avgResponseTime = (incidents.reduce((sum, i) => sum + i.responseTime, 0) / incidents.length).toFixed(1);
  const slaCompliance = ((incidents.filter(i => i.slaCompliant).length / incidents.length) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Enhanced Incident Metrics with ASL-3 SLA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Open Incidents</p>
              <p className="text-3xl font-bold text-white">{openIncidents}</p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-green-400">{avgResponseTime}s</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-400 mt-2">✓ Under 5min target (ASL-3)</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">SLA Compliance</p>
              <p className="text-3xl font-bold text-green-400">{slaCompliance}%</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">ASL-3: &lt;5min response</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Incidents (24h)</p>
              <p className="text-3xl font-bold text-white">{incidents.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Incident Response Center</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-700 text-gray-300 rounded text-sm hover:bg-slate-600 transition-colors">
                Filter
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Incident ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Response Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-purple-400">{incident.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{incident.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      incident.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{incident.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'OPEN' ? 'bg-red-500/20 text-red-400' :
                      incident.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        incident.responseTime < 300 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {incident.responseTime}s
                      </span>
                      {incident.slaCompliant && (
                        <span className="text-green-400 text-xs">✓</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{incident.assignee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-purple-400 hover:text-purple-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASL-3 Compliance Note */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-green-400 font-medium">ASL-3 Compliant Incident Response</p>
            <p className="text-green-300/80 text-sm mt-1">
              Average response time of {avgResponseTime}s meets ASL-3 requirement of &lt;5 minutes ({slaCompliance}% SLA compliance). All critical incidents auto-escalated within seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ASL-3 TAB =====
function ASL3Tab() {
  return (
    <div className="space-y-6">
      {/* Overall Compliance */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">ASL-3 Compliance Status</h2>
          <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
            ✓ COMPLIANT
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Deployment Standard</p>
            <p className="text-3xl font-bold text-green-400">98%</p>
            <p className="text-xs text-green-300 mt-1">Prevent Misuse</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Security Standard</p>
            <p className="text-3xl font-bold text-green-400">94%</p>
            <p className="text-xs text-green-300 mt-1">Protect Model Weights</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Overall ASL-3 Score</p>
            <p className="text-3xl font-bold text-green-400">96.5%</p>
            <p className="text-xs text-green-300 mt-1">Last Assessed: Oct 2025</p>
          </div>
        </div>
      </div>

      {/* Constitutional Classifiers - ENHANCED */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Constitutional Classifiers</h3>
          <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p className="text-lg font-bold text-white">99.6%</p>
            <p className="text-xs text-green-400 mt-1">✓ Target: &gt;99%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Latency (P95)</p>
            <p className="text-lg font-bold text-white">42ms</p>
            <p className="text-xs text-green-400 mt-1">✓ Target: &lt;50ms</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">False Positive Rate</p>
            <p className="text-lg font-bold text-white">0.3%</p>
            <p className="text-xs text-green-400 mt-1">✓ Target: &lt;1%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Throughput</p>
            <p className="text-lg font-bold text-white">2.4K/s</p>
            <p className="text-xs text-gray-400 mt-1">Processing rate</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Blocked (24h)</p>
            <p className="text-lg font-bold text-white">847</p>
            <p className="text-xs text-gray-400 mt-1">Threats prevented</p>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-sm mb-3">Top Triggered Rules (24h):</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">• CBRN-related queries</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '45%' }}></div>
                </div>
                <span className="text-red-400 text-sm font-medium w-10 text-right">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">• Jailbreak attempts</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '32%' }}></div>
                </div>
                <span className="text-orange-400 text-sm font-medium w-10 text-right">32%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">• Policy violations</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '23%' }}></div>
                </div>
                <span className="text-yellow-400 text-sm font-medium w-10 text-right">23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Layer Defense - ENHANCED */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          4-Layer Defense Architecture
        </h3>
        <div className="space-y-3">
          {[
            { 
              layer: 1, 
              name: 'Access Controls', 
              status: 'ACTIVE',
              description: 'Tier-based permissions, MFA, API key restrictions',
              uptime: '99.99%',
              latency: '5ms'
            },
            { 
              layer: 2, 
              name: 'Real-Time Classifiers', 
              status: 'ACTIVE',
              description: 'Constitutional AI rules, input/output classification',
              uptime: '99.94%',
              latency: '42ms'
            },
            { 
              layer: 3, 
              name: 'Async Monitoring', 
              status: 'ACTIVE',
              description: 'Pattern detection, multi-turn attack analysis',
              uptime: '99.98%',
              latency: '120ms'
            },
            { 
              layer: 4, 
              name: 'Rapid Response', 
              status: 'ACTIVE',
              description: 'Auto-incident creation, <5min SLA, remediation',
              uptime: '99.95%',
              latency: '2.8s'
            }
          ].map((layer) => (
            <div key={layer.layer} className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded font-mono text-sm font-bold">
                    L{layer.layer}
                  </span>
                  <div>
                    <span className="text-white font-medium">{layer.name}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{layer.description}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  {layer.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Uptime: <span className="text-green-400 font-medium">{layer.uptime}</span></span>
                <span>•</span>
                <span>Response: <span className="text-blue-400 font-medium">{layer.latency}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Standard */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Security Standard Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
            <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <span className="text-white font-medium">Multi-party Authorization</span>
              <p className="text-sm text-gray-400 mt-0.5">2+ admins required for sensitive operations</p>
              <span className="text-green-400 text-xs mt-1 inline-block">Enabled</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
            <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <span className="text-white font-medium">Model Weight Encryption</span>
              <p className="text-sm text-gray-400 mt-0.5">Military-grade encryption at rest</p>
              <span className="text-green-400 text-xs mt-1 inline-block">AES-256</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
            <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <span className="text-white font-medium">Egress Monitoring</span>
              <p className="text-sm text-gray-400 mt-0.5">Real-time network traffic analysis</p>
              <span className="text-green-400 text-xs mt-1 inline-block">Active</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
            <svg className="w-5 h-5 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <span className="text-white font-medium">Insider Threat Detection</span>
              <p className="text-sm text-gray-400 mt-0.5">Behavioral anomaly monitoring</p>
              <span className="text-green-400 text-xs mt-1 inline-block">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Red Team & Bug Bounty - ENHANCED */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Red Team & Bug Bounty Program</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Active Programs</p>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-gray-400 mt-1">HackerOne, Internal, Partners</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Vulnerabilities Found (30d)</p>
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-green-400 mt-1">Both resolved</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Avg Remediation Time</p>
            <p className="text-2xl font-bold text-green-400">4.5 days</p>
            <p className="text-xs text-green-400 mt-1">✓ Target: &lt;7 days</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Bounties Paid</p>
            <p className="text-2xl font-bold text-purple-400">$87.5K</p>
            <p className="text-xs text-gray-400 mt-1">15 researchers</p>
          </div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <p className="text-purple-300 text-sm">
            <span className="font-medium">External Red Teaming:</span> Continuous adversarial testing by security researchers helps identify edge cases and novel attack vectors before they can be exploited.
          </p>
        </div>
      </div>

      {/* Certification Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-blue-400 font-semibold text-lg mb-2">About ASL-3 Certification</p>
            <p className="text-blue-300/90 text-sm leading-relaxed mb-3">
              AI Safety Level 3 (ASL-3) is Anthropic's framework for advanced AI systems that could potentially assist in creating CBRN weapons. DefendML implements both the <span className="font-medium">Deployment Standard</span> (preventing misuse through 4-layer defense) and <span className="font-medium">Security Standard</span> (protecting model weights through encryption and access controls).
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">Learn More</a>
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">View Documentation</a>
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">Certification Report</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
