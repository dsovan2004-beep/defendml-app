// src/pages/reset-password.tsx
// Password reset page — handles recovery tokens from Supabase email links only.
// IMPORTANT: PKCE code handler only accepts ?type=recovery codes to prevent
// Google OAuth codes from being accidentally intercepted here.
import { useState, useEffect, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";

// --- Initialize Supabase client (browser) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  type: "success" | "error" | "";
  text: string;
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });
  const [isValidToken, setIsValidToken] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);

  // --- Session bootstrap from password-reset link ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    (async () => {
      try {
        // Case A: Hash fragment (from {{ .ConfirmationURL }})
        // Example: #access_token=...&refresh_token=...&type=recovery
        if (window.location.hash) {
          const params = new URLSearchParams(window.location.hash.slice(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");
          const type = params.get("type");

          // Only accept recovery tokens — never OAuth tokens
          if (access_token && refresh_token && type === "recovery") {
            const { error: setErr } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (setErr) throw setErr;

            // Clean the URL (remove hash)
            const cleanUrl = new URL(window.location.href);
            cleanUrl.hash = "";
            window.history.replaceState({}, "", cleanUrl.toString());

            if (!cancelled) {
              setIsValidToken(true);
              setMessage({ type: "", text: "" });
            }
            return;
          }
        }

        // Case B: PKCE flow with code in query (?code=...&type=recovery)
        // GUARD: only process if type=recovery — prevents Google OAuth codes
        // from being caught here (OAuth uses ?code= without type=recovery)
        if (window.location.search) {
          const sp = new URLSearchParams(window.location.search);
          const code = sp.get("code");
          const type = sp.get("type");

          if (code && type === "recovery") {
            const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
            if (exErr) throw exErr;

            // Clean the URL (remove query)
            const cleanUrl = new URL(window.location.href);
            cleanUrl.search = "";
            window.history.replaceState({}, "", cleanUrl.toString());

            if (!cancelled) {
              setIsValidToken(true);
              setMessage({ type: "", text: "" });
            }
            return;
          }
        }

        // Case C: Legacy query format (?token=&type=recovery&email=)
        if (window.location.search) {
          const sp = new URLSearchParams(window.location.search);
          const token = sp.get("token");
          const type = sp.get("type");
          const email = sp.get("email");
          if (token && type === "recovery" && email) {
            const { error: otpErr } = await supabase.auth.verifyOtp({
              email,
              token,
              type: "recovery",
            });
            if (otpErr) throw otpErr;

            if (!cancelled) {
              setIsValidToken(true);
              setMessage({ type: "", text: "" });
            }
            return;
          }
        }

        // If none matched — invalid link
        if (!cancelled) {
          setIsValidToken(false);
          setMessage({
            type: "error",
            text: "Invalid or expired reset link. Please request a new password reset.",
          });
        }
      } catch (e: any) {
        if (!cancelled) {
          setIsValidToken(false);
          setMessage({
            type: "error",
            text: e?.message || "Failed to initialize reset session.",
          });
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // --- Handle password update ---
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!isValidToken) {
      setMessage({
        type: "error",
        text: "Reset link is not valid. Request a new one.",
      });
      return;
    }

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage({
        type: "success",
        text: "Password updated successfully! Redirecting to login…",
      });

      // Clear session and go to login
      await supabase.auth.signOut();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  // Loading screen during bootstrap
  if (bootstrapping) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] grid place-items-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-red-500 mx-auto mb-4" />
          <p className="text-[#A0A0A0] text-sm">Verifying reset link…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-red-600/10 border border-red-500/30 rounded-xl flex items-center justify-center mb-5">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-1">
            Reset Password
          </h1>
          <p className="text-[#A0A0A0] text-sm">Enter your new password below</p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-8">

          {/* Message Display */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form — only when token is valid */}
          {isValidToken && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#F5F5F5] mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
                  placeholder="Enter new password"
                  required
                  disabled={loading}
                />
                <p className="mt-1.5 text-xs text-[#A0A0A0]">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#F5F5F5] mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
                  placeholder="Confirm new password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Updating Password…
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {/* Invalid link — show request new reset CTA */}
          {!isValidToken && !bootstrapping && (
            <div className="text-center py-4">
              <p className="text-[#A0A0A0] text-sm mb-4">
                This link may have expired. Request a new password reset from the login page.
              </p>
              <a
                href="/login"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all"
              >
                Go to Login
              </a>
            </div>
          )}

        </div>

        {/* Back to Login */}
        <div className="mt-5 text-center">
          <a
            href="/login"
            className="text-sm text-[#A0A0A0] hover:text-red-400 transition-colors"
          >
            ← Back to Login
          </a>
        </div>

      </div>
    </div>
  );
}
