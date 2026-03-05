// functions/api/admin/fix-disclosures.js
// One-time admin utility: scrubs model name disclosures from targets.description
// Protected: requires valid Supabase JWT (superadmin or admin session)
// Usage (browser console while logged into app.defendml.com):
//
//   const { data: { session } } = await (window._supabase || supabase).auth.getSession();
//   const r = await fetch('/api/admin/fix-disclosures', {
//     headers: { Authorization: `Bearer ${session.access_token}` }
//   });
//   console.log(await r.json());

const FIND    = /Claude Sonnet 4\.5/gi;
const REPLACE = 'AI-powered analysis';

export const onRequest = async ({ env, request }) => {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return jsonRes({ error: 'Unauthorized' }, 401);

  const supaUrl  = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey  = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svcKey   = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supaUrl || !anonKey || !svcKey) {
    return jsonRes({ error: 'Server misconfiguration — env vars missing' }, 500);
  }

  // Verify JWT using Supabase auth endpoint
  const token = authHeader.replace('Bearer ', '');
  const userRes = await fetch(`${supaUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });

  if (!userRes.ok) return jsonRes({ error: 'Invalid or expired token' }, 401);

  // ── Fetch all targets with disclosure violation ───────────────────────────────
  const fetchRes = await fetch(
    `${supaUrl}/rest/v1/targets?select=id,name,description&description=ilike.*Claude Sonnet*`,
    {
      headers: {
        apikey: svcKey,
        Authorization: `Bearer ${svcKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!fetchRes.ok) {
    const detail = await fetchRes.text();
    return jsonRes({ error: 'Failed to fetch targets', detail }, 502);
  }

  const rows = await fetchRes.json();
  if (!rows || rows.length === 0) {
    return jsonRes({ ok: true, message: 'No violations found — all descriptions are clean.', updated: 0 });
  }

  // ── Patch each row ────────────────────────────────────────────────────────────
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
      id: row.id,
      name: row.name,
      before: row.description,
      after: newDesc,
      ok: patchRes.ok,
      status: patchRes.status,
    });
  }

  const succeeded = results.filter(r => r.ok).length;

  return jsonRes({
    ok: true,
    message: `Patched ${succeeded}/${rows.length} targets — model disclosure violations removed.`,
    updated: succeeded,
    results,
  });
};

function jsonRes(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
