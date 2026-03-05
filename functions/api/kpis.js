// functions/api/kpis.js
// Cloudflare Pages Function: GET /api/kpis
// Primary: derives KPIs from Worker logs.
// Fallback: queries Supabase red_team_results directly when Worker is unreachable.

export const onRequest = async ({ env, request }) => {
  const RANGE_DAYS = Number(env.DASHBOARD_RANGE_DAYS || env.range_days || "7");

  // Allow ?range_days= override from query string
  const urlObj = new URL(request.url);
  const qRangeDays = urlObj.searchParams.get("range_days");
  const rangeDays = qRangeDays ? Number(qRangeDays) : RANGE_DAYS;

  // ── 1) Try Worker logs endpoint first ──────────────────────────────────────
  try {
    const API_BASE =
      env.NEXT_PUBLIC_API_BASE ||
      "https://defendml-api.dsovan2004.workers.dev";
    const url = `${API_BASE}/api/logs/recent?limit=1000&range_days=${rangeDays}`;
    const headers = {};
    if (env.ADMIN_TOKEN) headers["Authorization"] = `Bearer ${env.ADMIN_TOKEN}`;

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });

    if (res.ok) {
      const data = await res.json();
      const rows = Array.isArray(data?.data) ? data.data : [];
      return json(buildKpisFromWorkerRows(rows, rangeDays), 200);
    }
    // Worker returned non-200 → fall through to Supabase fallback
    console.warn(`[kpis] Worker returned ${res.status} — falling back to Supabase`);
  } catch (workerErr) {
    console.warn("[kpis] Worker unreachable:", String(workerErr?.message || workerErr));
  }

  // ── 2) Supabase fallback — query red_team_results directly ─────────────────
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // No credentials available — return safe zeroed response
    return json(zeroedKpis(rangeDays), 200);
  }

  try {
    const since = new Date(
      Date.now() - rangeDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const apiUrl =
      `${supabaseUrl}/rest/v1/red_team_results` +
      `?select=decision,latency_ms,created_at` +
      `&created_at=gte.${since}` +
      `&limit=5000`;

    const sbRes = await fetch(apiUrl, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!sbRes.ok) {
      console.warn("[kpis] Supabase fallback returned", sbRes.status);
      return json(zeroedKpis(rangeDays), 200);
    }

    const rows = await sbRes.json();
    return json(buildKpisFromSupabaseRows(Array.isArray(rows) ? rows : [], rangeDays), 200);
  } catch (sbErr) {
    console.error("[kpis] Supabase fallback error:", String(sbErr?.message || sbErr));
    return json(zeroedKpis(rangeDays), 200);
  }
};

// ── Builders ────────────────────────────────────────────────────────────────

function buildKpisFromWorkerRows(rows, rangeDays) {
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

  return {
    ok: true,
    source: "worker",
    range_days: rangeDays,
    kpis: {
      threats_blocked: threatsBlocked,
      pii_prevented: piiPrevented,
      policy_violations: policyViolations,
      compliance_score: 90,
      latency_p95_ms: percentile95(latencies),
      error_rate: total ? Number(((errCount / total) * 100).toFixed(2)) : 0,
    },
    sample_size: total,
  };
}

function buildKpisFromSupabaseRows(rows, rangeDays) {
  let threatsBlocked = 0;
  let errCount = 0;
  const latencies = [];
  const total = rows.length;

  for (const r of rows) {
    const decision = String(r?.decision || "").toUpperCase();
    if (decision === "BLOCK") threatsBlocked++;
    if (decision === "ERROR") errCount++;
    if (typeof r?.latency_ms === "number") latencies.push(r.latency_ms);
  }

  return {
    ok: true,
    source: "supabase",
    range_days: rangeDays,
    kpis: {
      threats_blocked: threatsBlocked,
      pii_prevented: 0,
      policy_violations: 0,
      compliance_score: 90,
      latency_p95_ms: percentile95(latencies),
      error_rate: total ? Number(((errCount / total) * 100).toFixed(2)) : 0,
    },
    sample_size: total,
  };
}

function zeroedKpis(rangeDays) {
  return {
    ok: true,
    source: "fallback",
    range_days: rangeDays,
    kpis: {
      threats_blocked: 0,
      pii_prevented: 0,
      policy_violations: 0,
      compliance_score: 90,
      latency_p95_ms: 0,
      error_rate: 0,
    },
    sample_size: 0,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    },
  });
}

function percentile95(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.floor(0.95 * (sorted.length - 1));
  return sorted[idx];
}
