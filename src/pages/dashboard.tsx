import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { UserRole } from "../types/roles";

type ScanLog = {
  id: string;
  ts: string;
  input_preview?: string | null;
  risk?: string | null;
  result_model?: string | null;
  status_code?: number | null;
  reason?: string | null;
};

const API =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ||
  "https://defendml-api.dsovan2004.workers.dev";

function DashboardPage() {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          setErr("Not authenticated.");
          setLoading(false);
          return;
        }

        const resp = await fetch(`${API}/api/logs/recent?limit=10`, {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data?.ok) {
          setLogs(Array.isArray(data.data) ? data.data : []);
        } else if (resp.status === 401 || resp.status === 403) {
          setErr("Unauthorized. Please log in again.");
        } else {
          setErr(data?.error || `Request failed (${resp.status})`);
        }
      } catch (_e) {
        setErr("Network error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900">
        DefendML Dashboard
      </h1>

      {loading && (
        <div className="mb-4 p-3 bg-gray-100 text-gray-700 rounded">Loading…</div>
      )}
      {err && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{err}</div>
      )}

      {!loading && !err && (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">{log.ts}</div>
              {log.input_preview && (
                <div className="font-medium text-gray-900">
                  {log.input_preview}
                </div>
              )}
              <div className="text-gray-700">
                <b>Risk:</b> {log.risk ?? "—"} · <b>Model:</b>{" "}
                {log.result_model ?? "—"} · <b>Status:</b>{" "}
                {log.status_code ?? "—"}
              </div>
              {log.reason && (
                <div className="text-gray-700">
                  <b>Reason:</b> {log.reason}
                </div>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-600">No logs yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Protected() {
  return (
    <RequireAuth role={UserRole.SUPER_ADMIN}>
      <DashboardPage />
    </RequireAuth>
  );
}
