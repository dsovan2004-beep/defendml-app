import { useState, useEffect } from "react";
import { Shield, Lock, Mail } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { setDemoSession, isDemoEnabled, getDemoSession } from "../lib/authClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo accounts (used only when NEXT_PUBLIC_ENABLE_DEMO = true)
const demoCredentials = [
  { email: "superadmin@test.com",  password: "DefendML@2025", role: "superadmin" },
  { email: "admin@defendml.com",   password: "demo123",       role: "admin" },
  { email: "analyst@defendml.com", password: "demo123",       role: "analyst" },
  { email: "viewer@defendml.com",  password: "demo123",       role: "viewer" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ✅ Auto-redirect if user already has a Supabase or demo session
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const params = new URLSearchParams(window.location.search);
        window.location.replace(params.get("next") || "/overview");
        return;
      }
      if (getDemoSession()) {
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
      // ✅ DEMO AUTH: only runs if env flag is true
      if (isDemoEnabled()) {
        const match = demoCredentials.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (match) {
          setDemoSession({ email: match.email, role: match.role, ts: Date.now() });
          const params = new URLSearchParams(window.location.search);
          window.location.replace(params.get("next") || "/overview");
          return;
        }
      }

      // ✅ PRIMARY PATH: Supabase Authentication
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/overview");
    } catch (err: any) {
      setError(err?.message || "Invalid login credentials");
    } finally {
      setBusy(false);
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

        {isDemoEnabled() && (
          <div className="mt-6 text-center text-xs text-purple-300/80">
            <p>Demo mode enabled — try <b>superadmin@test.com / DefendML@2025</b></p>
          </div>
        )}
      </div>
    </div>
  );
}
