// components/RequireAuth.tsx
import { useEffect, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
  role?: string;
}

/** Read token from a safe place we control */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (window as any)._defendmlToken || localStorage.getItem("token");
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/login?next=${next}`);
}

export default function RequireAuth({ children, role }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token = getToken();
      if (!token) return redirectToLogin();

      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || "https://defendml-api.dsovan2004-beep.workers.dev";
        
        const res = await fetch(`${base}/auth/verify`, {
          headers: { authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data?.ok) return redirectToLogin();

        if (role) {
          const roles: string[] = data?.user?.roles || [];
          if (!roles.includes(role)) return redirectToLogin();
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
  }, [role]);

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

  return <>{children}</>;
}
