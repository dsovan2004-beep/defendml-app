import { useEffect, useState } from "react";

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://defendml-api.dsovan2004.workers.dev/api/logs/recent?limit=5", {
      headers: { Authorization: "Bearer defendml_admin_2025_x9AqT7bL" }
    })
      .then((r) => r.json())
      .then((d) => setLogs(d.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">Admin Dashboard</h1>
      <div className="space-y-3">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-700"><b>ID:</b> {log.id}</p>
            <p><b>Input:</b> {log.input_preview}</p>
            <p><b>Model:</b> {log.result_model}</p>
            <p><b>Risk:</b> {log.risk}</p>
            <p><b>Reason:</b> {log.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
