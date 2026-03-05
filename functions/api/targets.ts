// functions/api/targets.ts
// Cloudflare Pages Function: GET /api/targets (list) + POST /api/targets (create)
// Uses service_role key → bypasses RLS → superadmin sees all targets
import { createClient } from '@supabase/supabase-js';

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export async function onRequest(context: any) {
  const { request, env } = context;

  // ── Auth: verify JWT for ALL methods ─────────────────────────────────────────
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return jsonRes({ error: 'Unauthorized' }, 401);
  }

  const supabaseAuth = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return jsonRes({ error: 'Invalid token' }, 401);
  }

  // Service-role client — bypasses RLS so superadmin can see all targets
  const supabaseService = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  // ── GET /api/targets ──────────────────────────────────────────────────────────
  if (request.method === 'GET') {
    try {
      const { data, error } = await supabaseService
        .from('targets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching targets:', error);
        return jsonRes({ error: 'Failed to fetch targets' }, 500);
      }

      return jsonRes({ targets: data || [] }, 200);
    } catch (err: any) {
      console.error('Server error on GET /api/targets:', err);
      return jsonRes({ error: 'Internal server error' }, 500);
    }
  }

  // ── POST /api/targets ─────────────────────────────────────────────────────────
  if (request.method === 'POST') {
    let targetData;
    try {
      targetData = await request.json();
    } catch (err) {
      return jsonRes({ error: 'Invalid JSON' }, 400);
    }

    try {
      // Get user's organization_id from organization_members table
      const { data: memberships, error: membershipError } = await supabaseService
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1);

      if (membershipError || !memberships || memberships.length === 0) {
        console.error('Membership error:', membershipError);
        return jsonRes({
          error: 'No organization found. Please contact support.'
        }, 400);
      }

      const organizationId = memberships[0].organization_id;

      const dataToInsert = {
        ...targetData,
        created_by: user.id,
        organization_id: organizationId,
      };

      const { data: target, error } = await supabaseService
        .from('targets')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating target:', error);
        return jsonRes({ error: 'Failed to create target' }, 500);
      }

      return jsonRes(target, 201);
    } catch (err: any) {
      console.error('Server error on POST /api/targets:', err);
      return jsonRes({ error: 'Internal server error' }, 500);
    }
  }

  // ── PATCH /api/targets — update post-scan status fields ──────────────────────
  // Body: { id, last_scan_at, last_report_id, total_scans }
  if (request.method === 'PATCH') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonRes({ error: 'Invalid JSON' }, 400);
    }

    const { id, ...fields } = body;
    if (!id) return jsonRes({ error: 'Missing target id' }, 400);

    // Only allow safe status fields — never let client overwrite sensitive columns
    const allowed = ['last_scan_at', 'last_report_id', 'total_scans'];
    const update: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in fields) update[key] = fields[key];
    }

    if (Object.keys(update).length === 0) {
      return jsonRes({ error: 'No valid fields to update' }, 400);
    }

    try {
      const { error } = await supabaseService
        .from('targets')
        .update(update)
        .eq('id', id);

      if (error) {
        console.error('Error updating target status:', error);
        return jsonRes({ error: 'Failed to update target' }, 500);
      }

      return jsonRes({ ok: true }, 200);
    } catch (err: any) {
      console.error('Server error on PATCH /api/targets:', err);
      return jsonRes({ error: 'Internal server error' }, 500);
    }
  }

  return jsonRes({ error: 'Method not allowed' }, 405);
}

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
