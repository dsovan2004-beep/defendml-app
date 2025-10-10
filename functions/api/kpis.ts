// Cloudflare Pages Function: GET /api/kpis
// Turns recent Worker logs into KPI counters for the dashboard,
// keeping your admin token on the server (not exposed to the browser).

export const onRequest: PagesFunction<{
  ADMIN_TOKEN: string;
  NEXT_PUBLIC_API_BASE: string;
  DASHBOARD_RANGE_DAYS: string;
}> = async ({ env }) => {
  try {
    const API_BASE =
      env.NEXT_PUBLIC_API_BASE || "https://defendml-api.dsovan2004.workers.dev";
    const RANGE_DAYS = Number(env.DASHBOARD_RANGE_DAYS || "7");

    // Pull recent logs (cap for speed)
    const r = await fetch(
      `${API_BASE}/api/logs/recent?limit=1000&range_days=${RANGE_DAYS}`,
      {
        headers: {
          Authorization: `Bearer ${env.ADMIN_TOKEN}`,
        },
      }
    );

    if (!r.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: "api_unreachable" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await r.json();
    const rows: any[] = Array.isArray(data?.data) ? data.data : [];

    let threatsBlocked = 0;
    let piiPrevented = 0;
    let policyViolations = 0;
    let errCount = 0;
    const latencies: number[] = [];

    for (const row of rows) {
      if (Number(row?.status_code) >= 500) errCount++;

      if (row?.decision === "block" || row?.decision === "sanitize") {
        threatsBlocked++;
      }

      const det = Array.isArray(row?.detections) ? row.detections : [];
      if (det.some((d: any) => String(d?.type ?? "").startsWith("pii"))) {
        piiPrevented++;
      }
      if (det.some((d: any) => d?.type === "policy_violation")) {
        policyViolations++;
      }

      if (typeof row?.latency_ms === "number") latencies.push(row.latency_ms);
    }

    let p95Latency = 0;
    if (latencies.length) {
      latencies.sort((a, b) => a - b);
      const idx = Math.floor(0.95 * (latencies.length - 1));
      p95Latency = latencies[idx];
    }

    const total = rows.length || 1;
    const errorRate = +((errCount / total) * 100).toFixed(2);
    const complianceScore = 90; // placeholder until we wire policy flags

    return new Response(
      JSON.stringify({
        ok: true,
        range_days: RANGE_DAYS,
        kpis: {
          threats_blocked: threatsBlocked,
          pii_prevented: piiPrevented,
          policy_violations: policyViolations,
          compliance_score: complianceScore,
          latency_p95_ms: p95Latency,
          error_rate: errorRate,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "exception" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
