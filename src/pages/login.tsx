import { useState, useEffect } from "react";
import { Shield, Lock, Mail, User } from "lucide-react";
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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ✅ Check if we should auto-switch to signup mode based on URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const trial = params.get("trial");
    
    // If coming from "Start Free Trial" or "Get Started", switch to signup mode
    if (trial === "true" || plan === "starter" || plan === "growth") {
      setMode("signup");
    }
  }, []);

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

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);

    try {
      // Validate inputs
      if (!fullName.trim()) {
        throw new Error("Please enter your full name");
      }
      if (!email.trim()) {
        throw new Error("Please enter your email");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // ✅ Step 1: Create new user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "viewer",
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Failed to create user");

      // ✅ Step 2: Insert into public.users table (if not auto-created by trigger)
      // This ensures your app has the user data it needs
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          auth_user_id: data.user.id,
          email: email,
          full_name: fullName,
          role: "viewer",
        });

      // Ignore duplicate key errors (in case trigger already created it)
      if (insertError && !insertError.message.includes("duplicate")) {
        console.error("Failed to insert user into public.users:", insertError);
        // Don't throw - the auth user was created, so proceed
      }

      // ✅ Step 3: Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess("Account created! Please check your email to verify your account.");
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        // Auto sign-in if email confirmation is disabled
        const params = new URLSearchParams(window.location.search);
        window.location.replace(params.get("next") || "/overview");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
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
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "signin" ? "Welcome Back" : "Start Your Free Trial"}
          </h1>
          <p className="text-slate-400">
            {mode === "signin" 
              ? "Secure your AI infrastructure" 
              : "Create your account in seconds"}
          </p>
        </div>

        {/* Toggle between Sign In and Sign Up */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === "signin"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === "signup"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {mode === "signin" && (
          <form onSubmit={onSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
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
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
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
        )}

        {/* Sign Up Form */}
        {mode === "signup" && (
          <form onSubmit={onSignUp} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="At least 6 characters"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">Must be at least 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {busy ? "Creating account..." : "Start Free Trial"}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}

        {mode === "signin" && isDemoEnabled() && (
          <div className="mt-6 text-center text-xs text-purple-300/80">
            <p>Demo mode enabled — try <b>superadmin@test.com / DefendML@2025</b></p>
          </div>
        )}
      </div>
    </div>
  );
}
