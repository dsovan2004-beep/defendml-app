import { useState, useEffect } from "react";
import { Shield, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("admin@defendml.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already logged in, bounce to next target quickly
  useEffect(() => {
    const token =
      (globalThis as any)._defendmlToken ||
      (typeof window !== "undefined" ? localStorage.getItem("defendml_token") : null);
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
      // Demo credentials validation (mock mode)
      const validCredentials = [
        { email: "admin@defendml.com", password: "demo123", role: "admin" },
        { email: "analyst@defendml.com", password: "demo123", role: "analyst" },
        { email: "viewer@defendml.com", password: "demo123", role: "viewer" },
      ];

      const user = validCredentials.find(
        (cred) => cred.email === email && cred.password === password
      );

      if (!user) {
        setError("Invalid email or password. Try: admin@defendml.com / demo123");
        setBusy(false);
        return;
      }

      // Create a mock JWT token
      const mockToken = btoa(JSON.stringify({
        email: user.email,
        role: user.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }));

      // Store token (use defendml_token to match RequireAuth)
      localStorage.setItem("defendml_token", mockToken);
      (globalThis as any)._defendmlToken = mockToken;

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const params = new URLSearchParams(window.location.search);
      window.location.replace(params.get("next") || "/overview");
    } catch (err: any) {
      setError(err?.message || "Login error");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-purple-950 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to DefendML</h1>
            <p className="text-slate-400">Secure your AI infrastructure</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="admin@defendml.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-purple-500/30 bg-slate-800/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 disabled:shadow-none"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-3">🔑 Demo Credentials (Click to Auto-Fill)</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@defendml.com");
                  setPassword("demo123");
                }}
                className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm transition-colors text-left"
              >
                <span className="font-semibold text-purple-400">Admin:</span> admin@defendml.com / demo123
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("analyst@defendml.com");
                  setPassword("demo123");
                }}
                className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm transition-colors text-left"
              >
                <span className="font-semibold text-blue-400">Analyst:</span> analyst@defendml.com / demo123
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("viewer@defendml.com");
                  setPassword("demo123");
                }}
                className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm transition-colors text-left"
              >
                <span className="font-semibold text-green-400">Viewer:</span> viewer@defendml.com / demo123
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Contact admin
              </button>
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>ASL 3 Certified Security</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Powered by Cloudflare</span>
          </div>
        </div>
      </div>
    </div>
  );
}
