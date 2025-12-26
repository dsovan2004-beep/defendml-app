import { createClient } from "@supabase/supabase-js";

export function createEdgeSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // SERVER ONLY
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
