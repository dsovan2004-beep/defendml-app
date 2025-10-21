// src/lib/auth-bridge.ts
import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Write the legacy token your header already understands */
export function writeLegacyToken(email: string, role = "viewer") {
  try {
    const token = btoa(
      JSON.stringify({
        email,
        role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      })
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("defendml_token", token);
      (window as any)._defendmlToken = token;
    }
  } catch (e) {
    console.error("writeLegacyToken failed", e);
  }
}

/** Remove legacy token on sign-out */
export function clearLegacyToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("defendml_token");
  delete (window as any)._defendmlToken;
}

/** True if the legacy token exists and is valid */
export function hasLegacyToken(): boolean {
  if (typeof window === "undefined") return false;
  const t = (window as any)._defendmlToken || localStorage.getItem("defendml_token");
  if (!t) return false;
  try {
    const dec = JSON.parse(atob(t));
    return !dec.exp || dec.exp > Date.now();
  } catch {
    return false;
  }
}

/** Mirror Supabase session -> legacy token */
export function mirrorSessionToLegacy(session: Session | null) {
  if (!session) {
    clearLegacyToken();
    return;
  }
  const email = session.user?.email || "user@defendml.com";
  // Pull a role if you store it in user metadata; default to "viewer"
  const role =
    (session.user?.user_metadata?.role as string) ||
    (session.user?.app_metadata?.role as string) ||
    "viewer";
  writeLegacyToken(email, role);
}
