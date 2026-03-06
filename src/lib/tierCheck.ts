// src/lib/tierCheck.ts
// useUserTier() — reads the current user's role from public.users
// and returns a normalized tier string.
//
// Tier hierarchy:
//   free        → signed-up, not yet a paying customer
//   pilot       → $2,500 pilot tier
//   standard    → $4,999 standard tier
//   growth      → $9,999/mo growth tier
//   enterprise  → custom / unlimited
//   superadmin  → always dsovan2004@gmail.com, never gated
//
// Usage:
//   const { tier, loading } = useUserTier();
//   if (isFree(tier)) { /* show upgrade gate */ }

import { useState, useEffect } from 'react';
// FIX #5: use the shared singleton instead of allocating a new client on every mount
import { supabase } from './supabaseClient';

export type UserTier =
  | 'free'
  | 'pilot'
  | 'standard'
  | 'growth'
  | 'enterprise'
  | 'superadmin';

// 🔒 This account is always superadmin and is never feature-gated.
const SUPERADMIN_EMAIL = 'dsovan2004@gmail.com';

export function useUserTier(): { tier: UserTier; loading: boolean } {
  const [tier, setTier] = useState<UserTier>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setTier('free');
          return;
        }

        // ── Superadmin hardcode — never gated regardless of DB value ────────
        if (session.user.email?.toLowerCase() === SUPERADMIN_EMAIL) {
          setTier('superadmin');
          return;
        }

        // ── Look up role in public.users ─────────────────────────────────────
        const { data: userRow } = await supabase
          .from('users')
          .select('role')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

        const role = (userRow?.role || 'free') as UserTier;
        setTier(role);
      } catch {
        // On any error, fall back to free (safest — never unlock by accident)
        setTier('free');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { tier, loading };
}

/** Returns true only for unauthenticated / free-tier users. */
export function isFree(tier: UserTier): boolean {
  return tier === 'free';
}
