// Cloudflare Pages Function: GET /api/kpis
// Turns recent Worker logs into KPI counters for the dashboard,
// keeping your admin token on the server (not exposed to the browser).

type Env = {
  ADMIN_TOKEN: string;
  NEXT_PUBLIC_API_BASE: string;
  DASHBOARD_RANGE_DAYS?: string;
};

export const onRequest = async ({ env }: { env: Env }) => {
  try {
    const API_BASE = env.NEXT_PUBLIC_API_BASE || "https://defendml-api.dsovan2004.workers.dev";
    const RANGE_DAYS = Number(env.DASHBOARD_RANGE_DAYS || "7");

    // Pull recent logs (cap for speed)
    const res = await fetch(
      `${API_BASE}/api/logs/recent?limit=1000&range_days=${RANGE_DAYS}`,
      {
        headers: {
          // Only include if your API requires it:
          Authorization: `Bearer ${env.ADMIN_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: "api_unreachable" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    const rows: any[] = Array.isArray(data.data) ? data.data : [];

    let threatsBlocked = 0;
    let piiPrevented = 0;
    let policyViolations = 0;
    let total = rows.length;
    let errCount = 0;
    let p95Latency = 0;

    const latencies: number[] = [];

    for (const r of rows) {
      if (r.status_code && r.status_code >= 500) errCount++;
      if (r.decision === "block" || r.decision === "sanitize") threatsBlocked++;
      if (Array.isArray(r.detections)) {
        if (r.detections.some((d: any) => String(d.type || "").startsWith("pii")))
          piiPrevented++;
        if (r.detections.some((d: any) => d.type === "policy_violation"))
          policyViolations++;
      }
      if (typeof r.latency_ms === "number") latencies.push(r.latency_ms);
    }

    if (latencies.length) {
      latencies.sort((a, b) => a - b);
      const idx = Math.floor(0.95 * (latencies.length - 1));
      p95Latency = latencies[idx];
    }

    const errorRate = total ? +(((errCount / total) * 100).toFixed(2)) : 0;

    // Placeholder compliance score (swap with real feature flags when available)
    const complianceScore = 90;

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
  } catch (e: any) {
    return new Response(
      JSON.stringify({ ok: false, error: "unhandled", detail: String(e?.message || e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
