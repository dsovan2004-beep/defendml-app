import { useEffect, useState, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** require this role; omit to allow any logged-in user */
  role?: string;
};

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
  const [ok, setOk] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token = getToken();
      if (!token) return redirectToLogin();

      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || "";
        const res = await fetch(`${base}/auth/verify`, {
          headers: { authorization: `Bearer ${token}` },
          credentials: "omit",
        });
        const data = await res.json().catch(() => ({}));

        // Expected shape: { ok: true, user: { roles?: string[] } }
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

  // very small inline “loader” while we check
  if (ok === null) {
    return (
      <div style={{
        minHeight: "40vh",
        display: "grid",
        placeItems: "center",
        color: "#6b7280",
        fontFamily: "Inter, system-ui, sans-serif"
      }}>
        Checking access…
      </div>
    );
  }

  // If ok is true, render the protected content
  return <>{children}</>;
}
