import { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("admin@defendml.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already logged in, bounce to next target quickly
  useEffect(() => {
    const token =
      (globalThis as any)._defendmlToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (token) {
      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/dashboard");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data?.token) {
        setError(data?.error || "Login failed");
        setBusy(false);
        return;
      }

      // TEMP storage while we restore full app state handling
      localStorage.setItem("token", data.token);
      (globalThis as any)._defendmlToken = data.token;

      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login error");
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Use your DefendML credentials to continue.
      </p>

      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, border: "1px solid #D0D5DD", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Password</div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, border: "1px solid #D0D5DD", borderRadius: 8 }}
          />
        </label>

        {error && (
          <div style={{ background: "#FEF3F2", color: "#B42318", padding: 10, borderRadius: 8, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%", padding: 12, borderRadius: 10,
            background: busy ? "#9ca3af" : "#111827", color: "white", fontWeight: 600, border: "none"
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
