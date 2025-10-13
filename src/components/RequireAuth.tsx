// src/components/RequireAuth.tsx
// Role-Based Access Control + Auth guard

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/router";
// FIX: use relative path (no "@/")
import { UserRole, hasPermission } from "../types/roles";

interface Props {
  children: ReactNode;
  role?: UserRole | UserRole[];
  resource?: string;
  action?: "create" | "read" | "update" | "delete" | "export";
}

/** Read token from a safe place we control */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any)._defendmlToken || localStorage.getItem("token");
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = encodeURIComponent(
    window.location.pathname + window.location.search
  );
  window.location.replace(`/login?next=${next}`);
}

export default function RequireAuth({
  children,
  role,
  resource,
  action = "read",
}: Props) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token = getToken();
      if (!token) return redirectToLogin();

      try {
        const base =
          process.env.NEXT_PUBLIC_API_BASE ||
          "https://defendml-api.dsovan2004.workers.dev"; // safer fallback

        const res = await fetch(`${base}/auth/verify`, {
          headers: { authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok) return redirectToLogin();

        // Normalize role (supports "role" or "roles" array from API)
        const apiRole: UserRole | undefined =
          (data?.user?.role as UserRole | undefined) ??
          (Array.isArray(data?.user?.roles) && data.user.roles[0]);

        if (!apiRole) return redirectToLogin();
        setUserRole(apiRole);

        // Role allowlist check
        if (role) {
          const allowed = Array.isArray(role) ? role : [role];
          if (!allowed.includes(apiRole)) {
            if (!cancelled) {
              setAccessDenied(`role-mismatch:${allowed.join(",")}`);
              setOk(false);
            }
            return;
          }
        }

        // Resource/action permission check
        if (resource && !hasPermission(apiRole, resource, action)) {
          if (!cancelled) {
            setAccessDenied(`permission-denied:${resource}:${action}`);
            setOk(false);
          }
          return;
        }

        if (!cancelled) setOk(true);
      } catch {
        if (!cancelled) redirectToLogin();
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [role, resource, action]);

  // Loading state
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
