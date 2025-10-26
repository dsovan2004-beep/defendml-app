// src/components/RequireAuth.tsx
// Unified Auth Guard: Demo (superadmin) → Supabase → Legacy Mock Token
// Keeps role allow-list + resource/action permission checks

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { getDemoSession } from "../lib/authClient";

interface Props {
  children: ReactNode;
  role?: string | string[];
  resource?: string;
  action?: "create" | "read" | "update" | "delete" | "export";
}

/** Supabase client */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Legacy mock token support (back-compat only) */
function getLegacyToken(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any)._defendmlToken || localStorage.getItem("defendml_token");
}
function decodeLegacyMockToken(
  token: string
): { email: string; role: string; exp?: number } | null {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp && decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;

  // Public routes accessible without auth
  const PUBLIC_PATHS = ["/login", "/reset-password", "/auth/callback"];
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return;

  const next = encodeURIComponent(pathname + search);
  window.location.replace(`/login?next=${next}`);
}

/** Basic RBAC with superadmin/admin overrides */
function hasPermission(userRole: string, _resource: string, action: string): boolean {
  const r = userRole.toLowerCase();
  if (r === "superadmin" || r === "admin") return true; // full access
  if (r === "analyst") return action === "read" || action === "export";
  if (r === "viewer") return action === "read";
  return false;
}

export default function RequireAuth({
  children,
  role,
  resource,
  action = "read",
}: Props) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        // ─────────────────────────────────────────────────────────────────────
        // 1) DEMO SESSION (from authClient.ts) → preferred for sales demos
        // ─────────────────────────────────────────────────────────────────────
        const demo = getDemoSession();
        if (demo) {
          const roleFound = (demo.role || "superadmin").toLowerCase();
          setUserRole(roleFound);

          // role allow-list (page-level)
          if (role) {
            const allowed = new Set(
              (Array.isArray(role) ? role : [role]).map((r) => r.toLowerCase())
            );
            // always allow privileged roles
            allowed.add("admin");
            allowed.add("superadmin");
            if (!allowed.has(roleFound)) {
              if (!cancelled) {
                setAccessDenied(`role-mismatch:${Array.from(allowed).join(",")}`);
                setOk(false);
              }
              return;
            }
          }

          // resource/action permission (optional)
          if (resource && !hasPermission(roleFound, resource, action)) {
            if (!cancelled) {
              setAccessDenied(`permission-denied:${resource}:${action}`);
              setOk(false);
            }
            return;
          }

          if (!cancelled) setOk(true);
          return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // 2) SUPABASE SESSION (primary real auth)
        // ─────────────────────────────────────────────────────────────────────
        const { data: sessionData } = await supabase.auth.getSession();
        const supaSession = sessionData?.session;

        if (supaSession?.access_token) {
          // If you store role in user_metadata, read it; default to viewer
          const userRes = await supabase.auth.getUser();
          const supabaseRole =
            ((userRes.data.user?.user_metadata as any)?.role as string) || "viewer";
          const roleFound = supabaseRole.toLowerCase();
          setUserRole(roleFound);

          if (role) {
            const allowed = new Set(
              (Array.isArray(role) ? role : [role]).map((r) => r.toLowerCase())
            );
            allowed.add("admin");
            allowed.add("superadmin");
            if (!allowed.has(roleFound)) {
              if (!cancelled) {
                setAccessDenied(`role-mismatch:${Array.from(allowed).join(",")}`);
                setOk(false);
              }
              return;
            }
          }

          if (resource && !hasPermission(roleFound, resource, action)) {
            if (!cancelled) {
              setAccessDenied(`permission-denied:${resource}:${action}`);
              setOk(false);
            }
            return;
          }

          if (!cancelled) setOk(true);
          return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // 3) LEGACY MOCK TOKEN (back-compat for older demo path)
        // ─────────────────────────────────────────────────────────────────────
        const legacy = getLegacyToken();
        const legacyUser = legacy ? decodeLegacyMockToken(legacy) : null;

        if (legacyUser?.role) {
          const roleFound = legacyUser.role.toLowerCase();
          setUserRole(roleFound);

          if (role) {
            const allowed = new Set(
              (Array.isArray(role) ? role : [role]).map((r) => r.toLowerCase())
            );
            allowed.add("admin");
            allowed.add("superadmin");
            if (!allowed.has(roleFound)) {
              if (!cancelled) {
                setAccessDenied(`role-mismatch:${Array.from(allowed).join(",")}`);
                setOk(false);
              }
              return;
            }
          }

          if (resource && !hasPermission(roleFound, resource, action)) {
            if (!cancelled) {
              setAccessDenied(`permission-denied:${resource}:${action}`);
              setOk(false);
            }
            return;
          }

          if (!cancelled) setOk(true);
          return;
        }

        // ─────────────────────────────────────────────────────────────────────
        // 4) Nothing matched → send to /login
        // ─────────────────────────────────────────────────────────────────────
        if (!cancelled) redirectToLogin();
      } catch {
        if (!cancelled) redirectToLogin();
      }
    }

    check();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, resource, action, router.pathname]);

  // Loading
  if (ok === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // Access denied - Role mismatch
  if (ok === false && accessDenied?.startsWith("role-mismatch")) {
    const requiredRoles = accessDenied.split(":")[1];
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Your role:{" "}
            <span className="text-purple-400 font-semibold">{userRole}</span>
            <br />
            Required role:{" "}
            <span className="text-red-400 font-semibold">
              {requiredRoles.replace(/,/g, " or ")}
            </span>
          </p>
          <button
            onClick={() => router.push("/overview")}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Access denied - Permission denied
  if (ok === false && accessDenied?.startsWith("permission-denied")) {
    const [, deniedResource, deniedAction] = accessDenied.split(":");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-orange-950 to-slate-950">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Insufficient Permissions
          </h1>
          <p className="text-slate-400 mb-6">
            You don&apos;t have permission to {deniedAction} {deniedResource}.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Your role:{" "}
            <span className="text-purple-400 font-semibold">{userRole}</span>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Contact your administrator to request access.
          </p>
          <button
            onClick={() => router.push("/overview")}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User has access
  return <>{children}</>;
}
