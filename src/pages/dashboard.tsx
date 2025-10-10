import { useEffect, useState } from "react";

const API = "https://defendml-api.dsovan2004.workers.dev";
// NOTE: For MVP only. Later: proxy this server-side.
const ADMIN_TOKEN = "defendml_admin_2025_x9AqT7bL";

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/logs/recent?limit=10`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
    })
      .then(r => r.json())
      .then(d => { if (d.ok) setLogs(d.data || []); else setErr(d.error || "Unknown error"); })
      .catch(() => setErr("Network error"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">DefendML Dashboard</h1>
      {err && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>}
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">{log.ts}</div>
            <div className="font-medium text-gray-900">{log.input_preview}</div>
            <div className="text-gray-700">
              <b>Risk:</b> {log.risk} · <b>Model:</b> {log.result_model} · <b>Status:</b> {log.status_code}
            </div>
            {log.reason && <div className="text-gray-700"><b>Reason:</b> {log.reason}</div>}
          </div>
        ))}
        {logs.length === 0 && !err && <div className="text-gray-600">No logs yet.</div>}
      </div>
    </div>
  );
}
