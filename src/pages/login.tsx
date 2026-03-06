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

// ── Google "G" SVG logo ────────────────────────────────────────────────────────
function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-zinc-700/60" />
      <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
        or continue with email
      </span>
      <div className="flex-1 h-px bg-zinc-700/60" />
    </div>
  );
}

export default function Login() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

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

  // ✅ Auto-redirect if user already has a Supabase or demo session.
  //    Also handles the Google OAuth callback — Supabase processes the token
  //    from the URL hash automatically before getSession() resolves.
  //    First-time users (account created within the last 60 s) go to /onboarding;
  //    returning users go to /overview (or ?next=).
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        if (next) {
          window.location.replace(next);
          return;
        }

        // Detect brand-new account (OAuth signup lands back here within seconds)
        const createdAt = new Date(data.session.user.created_at).getTime();
        const isNewUser = Date.now() - createdAt < 60_000;
        window.location.replace(isNewUser ? "/onboarding" : "/overview");
        return;
      }

      if (getDemoSession()) {
        const params = new URLSearchParams(window.location.search);
        window.location.replace(params.get("next") || "/overview");
      }
    })();
  }, []);

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  async function onGoogleSignIn() {
    setError(null);
    setGoogleBusy(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Supabase redirects back here after Google auth; the session check
          // useEffect above handles the first-time vs returning routing.
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (oauthError) throw oauthError;
      // Browser navigates away to Google — no further code runs in this function.
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed. Please try again.");
      setGoogleBusy(false);
    }
  }

  // ── Email / password sign-in ─────────────────────────────────────────────────
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

  // ── Email / password sign-up ─────────────────────────────────────────────────
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
            role: "free",
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
          role: "free",
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
        // Auto sign-in if email confirmation is disabled → send to onboarding
        window.location.replace("/onboarding");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create account");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-md bg-[#111111] backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 shadow-2xl">

        {/* ── Logo + heading ─────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-600/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {mode === "signin" ? "Welcome Back" : "Start Your Free Trial"}
          </h1>
          <p className="text-[#A0A0A0]">
            {mode === "signin"
              ? "Attack Before They Do"
              : "Create your account in seconds"}
          </p>
        </div>

        {/* ── Sign In / Sign Up toggle ───────────────────────────────────────── */}
        <div className="flex gap-2 mb-6 bg-[#1A1A1A]/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              mode === "signin"
                ? "bg-red-600 text-white"
                : "text-[#A0A0A0] hover:text-white"
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
                ? "bg-red-600 text-white"
                : "text-[#A0A0A0] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ── Continue with Google ───────────────────────────────────────────── */}
        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={googleBusy || busy}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#1A1A1A]/80 hover:bg-[#222222]/80 disabled:opacity-50 border border-zinc-700/50 hover:border-zinc-600/70 text-white font-medium rounded-lg transition-all duration-200"
        >
          {googleBusy ? (
            <svg
              className="w-5 h-5 animate-spin text-[#A0A0A0]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <GoogleLogo />
          )}
          {googleBusy ? "Redirecting to Google…" : "Continue with Google"}
        </button>

        {/* ── "or continue with email" divider ──────────────────────────────── */}
        <OrDivider />

        {/* ── Sign In Form ──────────────────────────────────────────────────── */}
        {mode === "signin" && (
          <form onSubmit={onSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#A0A0A0] w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#A0A0A0] w-5 h-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              disabled={busy || googleBusy}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {/* ── Sign Up Form ──────────────────────────────────────────────────── */}
        {mode === "signup" && (
          <form onSubmit={onSignUp} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-[#A0A0A0] w-5 h-5" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-[#A0A0A0] w-5 h-5" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#A0A0A0] w-5 h-5" />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="At least 6 characters"
                />
              </div>
              <p className="mt-1 text-xs text-[#A0A0A0]">Must be at least 6 characters</p>
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
              disabled={busy || googleBusy}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {busy ? "Creating account..." : "Start Free Trial"}
            </button>

            <p className="text-xs text-[#A0A0A0] text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        )}

        {/* ── Demo mode hint ─────────────────────────────────────────────────── */}
        {mode === "signin" && isDemoEnabled() && (
          <div className="mt-6 text-center text-xs text-red-300/80">
            <p>Demo mode enabled — try <b>superadmin@test.com / DefendML@2025</b></p>
          </div>
        )}
      </div>
    </div>
  );
}
