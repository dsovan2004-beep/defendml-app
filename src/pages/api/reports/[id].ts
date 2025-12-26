import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Get auth token from request
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify user session with anon key
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Use service role to fetch data (bypasses RLS)
  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data: report, error } = await supabaseService
      .from('red_team_reports')
      .select('*')
      .eq('report_id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (err: any) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
