// functions/api/kpis.js
// Cloudflare Pages Function: GET /api/kpis
// Derives KPIs from your Worker logs without exposing secrets to the browser.

export const onRequest = async ({ env }) => {
  try {
    const API_BASE =
      env.NEXT_PUBLIC_API_BASE ||
      "https://defendml-api.dsovan2004.workers.dev";
    const RANGE_DAYS = Number(env.DASHBOARD_RANGE_DAYS || "7");
    const url = `${API_BASE}/api/logs/recent?limit=1000&range_days=${RANGE_DAYS}`;
    const headers = {};
    if (env.ADMIN_TOKEN) headers["Authorization"] = `Bearer ${env.ADMIN_TOKEN}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return json({ ok: false, error: "api_unreachable", status: res.status }, 502);
    }
    const data = await res.json();
    const rows = Array.isArray(data?.data) ? data.data : [];
    let threatsBlocked = 0;
    let piiPrevented = 0;
    let policyViolations = 0;
    let errCount = 0;
    const latencies = [];
    const total = rows.length;
    for (const r of rows) {
      if (typeof r?.status_code === "number" && r.status_code >= 500) errCount++;
      const decision = String(r?.decision || "").toLowerCase();
      if (decision === "block" || decision === "sanitize") threatsBlocked++;
      const dets = Array.isArray(r?.detections) ? r.detections : [];
      if (dets.some(d => String(d?.type || "").toLowerCase().startsWith("pii"))) piiPrevented++;
      if (dets.some(d => String(d?.type || "").toLowerCase() === "policy_violation")) policyViolations++;
      if (typeof r?.latency_ms === "number") latencies.push(r.latency_ms);
    }
    const latency_p95_ms = percentile95(latencies);
    const error_rate = total ? Number(((errCount / total) * 100).toFixed(2)) : 0;
    const compliance_score = 90; // placeholder until policy flags are wired
    return json({
      ok: true,
      range_days: RANGE_DAYS,
      kpis: {
        threats_blocked: threatsBlocked,
        pii_prevented: piiPrevented,
        policy_violations: policyViolations,
        compliance_score,
        latency_p95_ms,
        error_rate,
      },
      sample_size: total,
    });
  } catch (e) {
    return json({ ok: false, error: "exception", detail: String(e?.message || e) }, 500);
  }
};

/* helpers */
function json(body, status = 200) {
  const securityHeaders = {
    "content-type": "application/json",
    "cache-control": "no-store",
    // Security Headers (Issue #3)
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.anthropic.com https://defendml-api.dsovan2004.workers.dev",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  };
  
  return new Response(JSON.stringify(body), {
    status,
    headers: securityHeaders
  });
}

function percentile95(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(0.95 * (sorted.length - 1));
  return sorted[idx];
}
