import React, { useState, useEffect } from 'react';
import { Shield, Eye, Clock, AlertTriangle, Database } from 'lucide-react';

// ============================================
// TypeScript Interfaces (MUST BE FIRST)
// ============================================

interface PIIDetection {
  id: string;
  timestamp: string;
  pii_type: string;
  confidence_score: number;
  action_taken: 'redacted' | 'blocked' | 'flagged';
  defense_layer: 1 | 2 | 3 | 4;
  user_id: string;
  provider: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  original_text_hash: string;
}

interface ClassifierMetrics {
  status: 'ACTIVE' | 'DEGRADED' | 'DOWN';
  accuracy: number;
  latency_p95: number;
  false_positive_rate: number;
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
  defense_layers_active: number[];
}

interface PIIType {
  type: string;
  count: number;
  percentage: number;
}

// ============================================
// Demo Data (AFTER Interfaces)
// ============================================

const demoPIIDetections: PIIDetection[] = [
  {
    id: 'pii-2025-1847',
    timestamp: '2025-10-26T14:54:22Z',
    pii_type: 'SSN',
    confidence_score: 98.7,
    action_taken: 'redacted',
    defense_layer: 2,
    user_id: 'user@example.com',
    provider: 'Claude 3.5 Sonnet',
    severity: 'CRITICAL',
    original_text_hash: 'a8f3bc9e2d1...'
  },
  {
    id: 'pii-2025-1846',
    timestamp: '2025-10-26T14:53:18Z',
    pii_type: 'Credit Card',
    confidence_score: 99.2,
    action_taken: 'blocked',
    defense_layer: 2,
    user_id: 'developer@company.com',
    provider: 'GPT-4',
    severity: 'CRITICAL',
    original_text_hash: 'b7d2ea4f1c8...'
  },
  {
    id: 'pii-2025-1845',
    timestamp: '2025-10-26T14:51:45Z',
    pii_type: 'Email',
    confidence_score: 95.4,
    action_taken: 'flagged',
    defense_layer: 1,
    user_id: 'analyst@company.com',
    provider: 'Claude 3.5 Sonnet',
    severity: 'MEDIUM',
    original_text_hash: 'c6e1fb3a9d4...'
  },
  {
    id: 'pii-2025-1844',
    timestamp: '2025-10-26T14:49:33Z',
    pii_type: 'Phone Number',
    confidence_score: 97.8,
    action_taken: 'redacted',
    defense_layer: 2,
    user_id: 'sales@company.com',
    provider: 'Gemini Pro',
    severity: 'HIGH',
    original_text_hash: 'd5f2gc4b8e5...'
  },
  {
    id: 'pii-2025-1843',
    timestamp: '2025-10-26T14:47:12Z',
    pii_type: 'Bank Account',
    confidence_score: 99.6,
    action_taken: 'blocked',
    defense_layer: 2,
    user_id: 'finance@company.com',
    provider: 'Claude 3.5 Sonnet',
    severity: 'CRITICAL',
    original_text_hash: 'e4g3hd5c9f6...'
  }
];

const demoPIITypes: PIIType[] = [
  { type: 'SSN', count: 342, percentage: 18.5 },
  { type: 'Credit Card', count: 189, percentage: 10.2 },
  { type: 'Email', count: 456, percentage: 24.7 },
  { type: 'Phone', count: 234, percentage: 12.7 },
  { type: 'Address', count: 178, percentage: 9.6 },
  { type: 'Date of Birth', count: 123, percentage: 6.7 },
  { type: 'Bank Account', count: 89, percentage: 4.8 },
  { type: 'Passport', count: 67, percentage: 3.6 },
  { type: 'Medical Record', count: 95, percentage: 5.1 },
  { type: 'Other', count: 74, percentage: 4.0 }
];

// ============================================
// Main Component
// ============================================

export default function PIIProtectionPage() {
  const [detections, setDetections] = useState<PIIDetection[]>(demoPIIDetections);
  const [piiTypes] = useState<PIIType[]>(demoPIITypes);
  const [metrics] = useState<ClassifierMetrics>({
    status: 'ACTIVE',
    accuracy: 99.6,
    latency_p95: 42,
    false_positive_rate: 0.3,
    confidence_level: 'HIGH',
    defense_layers_active: [1, 2, 3, 4]
  });
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold">PII Protection Center</h1>
        </div>
        <p className="text-gray-400">
          Real-time detection and redaction across all LLM providers
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<Database className="w-6 h-6" />}
          label="PII Detections (24h)"
          value="1,847"
          change="+12% from yesterday"
          color="purple"
        />
        <MetricCard
          icon={<Shield className="w-6 h-6" />}
          label="Detection Accuracy"
          value="99.6%"
          change="Above 99% target ✓"
          color="green"
        />
        <MetricCard
          icon={<Clock className="w-6 h-6" />}
          label="P95 Latency"
          value="42ms"
          change="8ms faster than target"
          color="blue"
        />
        <MetricCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="False Positive Rate"
          value="0.3%"
          change="Below 1% target ✓"
          color="yellow"
        />
      </div>

      {/* Constitutional Classifier Performance Widget */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <h2 className="text-xl font-semibold">Constitutional Classifier Performance</h2>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
            {metrics.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-green-400">{metrics.accuracy}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Latency (P95)</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.latency_p95}ms</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">Confidence Level</p>
            <p className="text-2xl font-bold text-purple-400">{metrics.confidence_level}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-1">False Positive Rate</p>
            <p className="text-2xl font-bold text-yellow-400">{metrics.false_positive_rate}%</p>
          </div>
        </div>

        {/* Defense Layers */}
        <div className="mt-6 pt-6 border-t border-purple-500/30">
          <p className="text-sm text-gray-400 mb-3">Defense Layers Active</p>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map(layer => (
              <div
                key={layer}
                className={`flex items-center justify-center w-16 h-16 rounded-lg border-2 ${
                  metrics.defense_layers_active.includes(layer)
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-600 bg-gray-700/30'
                }`}
              >
                <div className="text-center">
                  <p className="text-xs text-gray-400">Layer</p>
                  <p className="text-lg font-bold">{layer}</p>
                  {metrics.defense_layers_active.includes(layer) && (
                    <p className="text-xs text-green-400">✓</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-2 text-xs text-gray-400">
            <div>Access Controls</div>
            <div>Real-Time Classifiers</div>
            <div>Async Monitoring</div>
            <div>Rapid Response</div>
          </div>
        </div>
      </div>

      {/* PII Types Detected */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">PII Types Detected (Last 24h)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {piiTypes.map((piiType) => (
            <PIITypeCard
              key={piiType.type}
              type={piiType.type}
              count={piiType.count}
              percentage={piiType.percentage}
            />
          ))}
        </div>
      </div>

      {/* Recent PII Detections Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent PII Detections</h2>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded text-sm">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">PII Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Layer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {detections.map((detection) => (
                <PIIDetectionRow key={detection.id} detection={detection} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Child Components
// ============================================

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: 'purple' | 'green' | 'blue' | 'yellow';
}

function MetricCard({ icon, label, value, change, color }: MetricCardProps) {
  const colorClasses = {
    purple: 'from-purple-900/30 to-purple-800/20 border-purple-500/30',
    green: 'from-green-900/30 to-green-800/20 border-green-500/30',
    blue: 'from-blue-900/30 to-blue-800/20 border-blue-500/30',
    yellow: 'from-yellow-900/30 to-yellow-800/20 border-yellow-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-opacity-20">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{change}</p>
    </div>
  );
}

interface PIITypeCardProps {
  type: string;
  count: number;
  percentage: number;
}

function PIITypeCard({ type, count, percentage }: PIITypeCardProps) {
  return (
    <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-4">
      <p className="text-sm text-gray-400 mb-1">{type}</p>
      <p className="text-2xl font-bold mb-1">{count}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400">{percentage}%</p>
      </div>
    </div>
  );
}

interface PIIDetectionRowProps {
  detection: PIIDetection;
}

function PIIDetectionRow({ detection }: PIIDetectionRowProps) {
  const actionColors = {
    redacted: 'bg-blue-500/20 text-blue-300',
    blocked: 'bg-red-500/20 text-red-300',
    flagged: 'bg-yellow-500/20 text-yellow-300'
  };

  const severityColors = {
    CRITICAL: 'bg-red-500/20 text-red-300',
    HIGH: 'bg-orange-500/20 text-orange-300',
    MEDIUM: 'bg-yellow-500/20 text-yellow-300',
    LOW: 'bg-blue-500/20 text-blue-300'
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <tr className="hover:bg-gray-700/30">
      <td className="px-6 py-4 text-sm">{formatTimestamp(detection.timestamp)}</td>
      <td className="px-6 py-4 text-sm font-medium">{detection.pii_type}</td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${detection.confidence_score}%` }}
            ></div>
          </div>
          <span className="text-green-400">{detection.confidence_score}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs">
          L{detection.defense_layer}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-medium ${actionColors[detection.action_taken]}`}>
          {detection.action_taken.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-medium ${severityColors[detection.severity]}`}>
          {detection.severity}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-400">{detection.user_id}</td>
      <td className="px-6 py-4 text-sm text-gray-400">{detection.provider}</td>
    </tr>
  );
}
```

---

## 🔧 WHAT I FIXED

1. ✅ **Moved all TypeScript interfaces to the TOP of the file** (before any usage)
2. ✅ **Defined all required interfaces:**
   - `PIIDetection`
   - `ClassifierMetrics`
   - `PIIType`
3. ✅ **Properly typed all demo data arrays**
4. ✅ **Added proper TypeScript types to all component props**
5. ✅ **Fixed color classes to avoid dynamic Tailwind issues**
6. ✅ **Simplified icon rendering (removed dynamic color classes)**

---

## 📁 FILE STRUCTURE

Make sure your file is in the correct location:
```
defendml-app/
├── src/
│   └── pages/
│       └── pii.tsx  ← THIS FILE
