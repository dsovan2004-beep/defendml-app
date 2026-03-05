// functions/api/admin/fix-disclosures.js
// ONE-TIME migration: scrub "Claude Sonnet 4.5" → "AI-powered analysis"
// from all targets.description rows.
// No auth required — remove this file after running once.

const FIND    = /Claude Sonnet 4\.5/gi;
const REPLACE = 'AI-powered analysis';

export const onRequest = async ({ env }) => {
  const supaUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey  = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supaUrl || !svcKey) {
    return jsonRes({ error: 'Server misconfiguration — env vars missing' }, 500);
  }

  // ── Fetch all targets with the violation ──────────────────────────────────
  const fetchRes = await fetch(
    `${supaUrl}/rest/v1/targets?select=id,name,description&description=ilike.*Claude+Sonnet*`,
    {
      headers: {
        apikey: svcKey,
        Authorization: `Bearer ${svcKey}`,
      },
    }
  );

  if (!fetchRes.ok) {
    return jsonRes({ error: 'Failed to fetch targets', status: fetchRes.status }, 502);
  }

  const rows = await fetchRes.json();
  if (!rows || rows.length === 0) {
    return jsonRes({ ok: true, message: 'No violations found — all clean.', updated: 0 });
  }

  // ── Patch each row ────────────────────────────────────────────────────────
  const results = [];
  for (const row of rows) {
    const newDesc = (row.description || '').replace(FIND, REPLACE);
    const patchRes = await fetch(
      `${supaUrl}/rest/v1/targets?id=eq.${row.id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: svcKey,
          Authorization: `Bearer ${svcKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ description: newDesc }),
      }
    );
    results.push({
      id:     row.id,
      name:   row.name,
      before: row.description,
      after:  newDesc,
      ok:     patchRes.ok,
    });
  }

  const succeeded = results.filter(r => r.ok).length;
  return jsonRes({
    ok:      true,
    message: `Patched ${succeeded}/${rows.length} targets.`,
    updated: succeeded,
    results,
  });
};

function jsonRes(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
