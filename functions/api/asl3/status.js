// functions/api/asl3/status.js

export async function onRequestGet(context) {
  try {
    const SUPABASE_URL = context.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_ROLE_KEY = context.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL) {
      return json({ ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" }, 500);
    }
    if (!SERVICE_ROLE_KEY) {
      return json({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, 500);
    }

    // Use Supabase REST API (no extra deps)
    const base = `${SUPABASE_URL}/rest/v1/red_team_tests`;
    const headers = {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    // 1) last_assessed = max(created_at)
    // We do: order by created_at desc, limit 1, select created_at
    const lastUrl = `${base}?select=created_at&order=created_at.desc&limit=1`;
    const lastResp = await fetch(lastUrl, { headers });

    if (!lastResp.ok) {
      const t = await safeText(lastResp);
      return json({ ok: false, error: "Failed to fetch last_assessed", details: t }, 500);
    }

    const lastRows = await lastResp.json();
    const last_assessed = lastRows?.[0]?.created_at ?? null;

    // 2) tests_30d_count
    // Use exact count with HEAD request + Prefer: count=exact
    const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const countUrl = `${base}?select=id&created_at=gte.${encodeURIComponent(sinceIso)}`;
    const countResp = await fetch(countUrl, {
      method: "HEAD",
      headers: { ...headers, Prefer: "count=exact" },
    });

    if (!countResp.ok) {
      const t = await safeText(countResp);
      return json({ ok: false, error: "Failed to fetch tests_30d_count", details: t }, 500);
    }

    const contentRange = countResp.headers.get("content-range") || "";
    const tests_30d_count = parseContentRangeTotal(contentRange);

    return json({
      ok: true,
      range_days: 30,
      last_assessed,         // ISO timestamp (or null)
      tests_30d_count,       // number (or null if parsing failed)
      now: new Date().toISOString(),
    });
  } catch (err) {
    return json({ ok: false, error: "Unhandled error", details: String(err) }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function safeText(resp) {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}

// content-range looks like: "0-0/123" or "*/0"
function parseContentRangeTotal(contentRange) {
  const parts = contentRange.split("/");
  if (parts.length !== 2) return null;
  const total = Number(parts[1]);
  return Number.isFinite(total) ? total : null;
}
