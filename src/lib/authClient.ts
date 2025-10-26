// src/lib/authClient.ts
export type DemoSession = { email: string; role: string; ts: number };

export const DEMO_KEY = "defendml_demo_session";

export function isDemoEnabled(): boolean {
  return (process.env.NEXT_PUBLIC_ENABLE_DEMO || "").toLowerCase() === "true";
}

export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(DEMO_KEY) || "null"); }
  catch { return null; }
}

export function setDemoSession(s: DemoSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_KEY, JSON.stringify(s));
}

export function clearDemoSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_KEY);
}

export function getEffectiveRole(supabaseRole?: string): string {
  const demo = getDemoSession();
  if (demo?.role) return demo.role;
  return supabaseRole || "viewer";
}
