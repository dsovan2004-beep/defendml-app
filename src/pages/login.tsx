import { useState, useEffect } from "react";
import { Shield, Lock, Mail } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const params = new URLSearchParams(window.location.search);
        window.location.replace(params.get("next") || "/overview");
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      // === PRIMARY PATH: Supabase Authentication ===
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      // Optional: fallback redirect
      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/overview");
    } catch (err: any) {
      // === FALLBACK PATH: Local demo credentials (admin/analyst/viewer) ===
      const validCredentials = [
        { email: "admin@defendml.com", password: "demo123", role: "admin" },
        { email: "analyst@defendml.com", password: "demo123", role: "analyst" },
        { email: "viewer@defendml.com", password: "demo123", role: "viewer" },
      ];
      const user = validCredentials.find(
        (cred) => cred.email === email && cred.password === password
      );
      if (!user) {
        setError(err?.message || "Invalid login credentials");
        setBusy(false);
        return;
      }

      const mockToken = btoa(JSON.stringify({
        email: user.email,
        role: user.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }));
      localStorage.setItem("defendml_token", mockToken);
      (globalThis as any)._defendmlToken = mockToken;

      await new Promise((r) => setTimeout(r, 500));
      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/overview");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-purple-950 p-4">
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to DefendML</h1>
          <p className="text-slate-400">Secure your AI infrastructure</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@company.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
