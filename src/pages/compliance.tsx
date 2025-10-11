// src/pages/compliance.tsx

import { FileCheck, Download as DownloadIcon, Shield } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Compliance</h1>

      {/* Controls / badges */}
      <div className="rounded-2xl p-5 border bg-white">
        <div className="font-medium mb-3">Controls & Standards</div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            <FileCheck className="inline-block w-4 h-4 mr-1" />
            Immutable Audit
          </span>
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
            <Shield className="inline-block w-4 h-4 mr-1" />
            SOC2-Ready
          </span>
        </div>
      </div>

      {/* Export pack */}
      <div className="rounded-2xl p-5 border bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Auditor Pack</div>
            <div className="text-sm text-gray-500">
              Export logs & summaries for external audits.
            </div>
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert('Coming soon: ZIP export (CSV + README).');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
          >
            <DownloadIcon className="w-4 h-4" />
            Download ZIP
          </a>
        </div>
      </div>
    </div>
  );
}
