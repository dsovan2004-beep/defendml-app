// src/pages/onboarding.tsx
// Self-serve onboarding wizard — 3 steps:
//   1. Welcome / intro
//   2. Add first attack target (saves to Supabase `targets` table)
//   3. Run first red-team scan (live progress, redirect to report)

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Loader2,
  Globe,
  Key,
  Code2,
  Lock,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ── Inline Supabase client (same pattern as login.tsx) ────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API = "https://defendml-api.dsovan2004.workers.dev";

const SCAN_PHASES = [
  "Connecting to your AI endpoint...",
  "Generating attack vectors...",
  "Executing red-team tests...",
  "Analyzing model responses...",
  "Building compliance report...",
];

type Step = 1 | 2 | 3;

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS: { num: number; label: string }[] = [
  { num: 1, label: "Welcome" },
  { num: 2, label: "Add Target" },
  { num: 3, label: "First Scan" },
];

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                current > s.num
                  ? "bg-red-600 text-white"
                  : current === s.num
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/50"
                  : "bg-[#1A1A1A] text-zinc-500 border border-zinc-800"
              }`}
            >
              {current > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                current === s.num ? "text-white" : "text-zinc-500"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px max-w-[60px] transition-all ${
                current > s.num ? "bg-red-500" : "bg-zinc-700"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState<Step>(1);
  const [user, setUser] = useState<any>(null);

  // Step 2 – target form
  const [targetName, setTargetName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [customHeaders, setCustomHeaders] = useState("{}");
  const [headersError, setHeadersError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Step 3 – scan
  const [savedTargetId, setSavedTargetId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const phaseTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auth gate: redirect to /login if no session ──────────────────────────────
  // Also upserts a public.users row (role: 'free') for Google OAuth signups
  // that land here without login.tsx having run the email/password insert path.
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        window.location.replace("/login");
        return;
      }
      setUser(data.session.user);

      // Ensure public.users row exists — covers Google OAuth first-time signups
      try {
        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("auth_user_id", data.session.user.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("users").insert({
            auth_user_id: data.session.user.id,
            email: data.session.user.email || "",
            full_name:
              data.session.user.user_metadata?.full_name ||
              data.session.user.user_metadata?.name ||
              "",
            role: "free",
          });
        }
      } catch {
        // Non-fatal — user can still proceed through onboarding
      }
    })();
  }, []);

  // ── Cleanup phase timer on unmount ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
    };
  }, []);

  // ── JSON validation helper ───────────────────────────────────────────────────
  function validateHeaders(json: string): boolean {
    try {
      JSON.parse(json);
      setHeadersError("");
      return true;
    } catch (e: any) {
      setHeadersError(`Invalid JSON: ${e.message}`);
      return false;
    }
  }

  // ── Step 2: save target to Supabase ─────────────────────────────────────────
  async function handleSaveTarget(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);

    if (!validateHeaders(customHeaders)) return;

    setSaving(true);
    try {
      const parsedHeaders = JSON.parse(customHeaders);

      // Build insert payload — mirrors schema from admin/targets.tsx
      const insert: Record<string, any> = {
        name: targetName.trim(),
        url: targetUrl.trim(),
        target_type: "api",
        auth_method: apiKey.trim() ? "bearer" : "none",
        auth_token: apiKey.trim() || null,
        custom_headers:
          Object.keys(parsedHeaders).length > 0 ? parsedHeaders : null,
        environment: "staging",
        created_by: user.id,
        rate_limit_per_hour: 100,
        timeout_seconds: 30,
      };

      // Look up org via organization_members (user_id = auth.users.id)
      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership?.organization_id) {
        insert.organization_id = membership.organization_id;
      }

      const { data, error } = await supabase
        .from("targets")
        .insert(insert)
        .select("id")
        .single();

      if (error) throw error;

      setSavedTargetId(data.id);
      setStep(3);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save target. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ── Step 3: run first scan ───────────────────────────────────────────────────
  async function handleRunScan() {
    setScanError(null);
    setScanResult(null);
    setScanning(true);
    setScanPhase(0);

    // Advance phase indicator visually every 1.8 s
    let phase = 0;
    phaseTimer.current = setInterval(() => {
      phase = Math.min(phase + 1, SCAN_PHASES.length - 1);
      setScanPhase(phase);
    }, 1800);

    try {
      const response = await fetch(`${API}/api/red-team/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://app.defendml.com",
        },
        body: JSON.stringify({
          targetId: savedTargetId, // worker fetches full config from DB
          target: targetUrl,       // fallback URL
        }),
      });

      if (phaseTimer.current) clearInterval(phaseTimer.current);
      setScanPhase(SCAN_PHASES.length - 1);

      const data = await response.json();
      setScanResult(data);

      // Stamp last_scan_at on the saved target (best-effort)
      if (savedTargetId) {
        await supabase
          .from("targets")
          .update({
            last_scan_at: new Date().toISOString(),
            last_report_id: data.report_id || null,
            total_scans: 1,
          })
          .eq("id", savedTargetId);
      }

      // Auto-redirect to report after a short celebration delay
      if (data.report_id) {
        setTimeout(() => {
          window.location.replace(`/reports/${data.report_id}`);
        }, 2500);
      }
    } catch (err: any) {
      if (phaseTimer.current) clearInterval(phaseTimer.current);
      setScanError(err?.message || "Failed to reach the API. Please try again.");
    } finally {
      setScanning(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <div className="w-full max-w-lg">
        <StepIndicator current={step} />

        <div className="bg-[#111111] backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 shadow-2xl">

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 1 — Welcome
          ═══════════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="text-center">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-6 shadow-lg shadow-red-600/50">
                <Shield className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to DefendML
              </h1>
              <p className="text-lg font-semibold text-red-300 mb-4">
                Attack Before They Do.
              </p>
              <p className="text-[#A0A0A0] mb-8 leading-relaxed text-sm">
                DefendML automatically runs red-team attacks against your AI
                systems to find vulnerabilities before adversaries do — and
                generates compliance evidence to prove it.
              </p>

              {/* Steps preview */}
              <div className="space-y-3 text-left mb-8">
                {[
                  {
                    Icon: Target,
                    label: "Step 1",
                    text: "Add your AI endpoint as an attack target",
                  },
                  {
                    Icon: Zap,
                    label: "Step 2",
                    text: "We run automated red-team attacks against it",
                  },
                  {
                    Icon: CheckCircle2,
                    label: "Step 3",
                    text: "Get a full compliance evidence report",
                  },
                ].map(({ Icon, label, text }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 bg-[#1A1A1A]/50 rounded-lg px-4 py-3 border border-red-500/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <span className="text-xs text-red-400 font-medium block">
                        {label}
                      </span>
                      <span className="text-[#F5F5F5] text-sm">{text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.location.replace("/overview")}
                className="mt-3 w-full py-2 px-4 text-zinc-500 hover:text-[#F5F5F5] text-sm transition-colors"
              >
                Skip for now — go to dashboard
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 2 — Add Your First Target
          ═══════════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-xl mb-4 shadow-lg shadow-red-600/30">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Add Your First Target
                </h2>
                <p className="text-[#A0A0A0] text-sm">
                  Tell us about the AI system you want to test.
                </p>
              </div>

              <form onSubmit={handleSaveTarget} className="space-y-5">
                {/* Target Name */}
                <div>
                  <label
                    htmlFor="target-name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Target Name
                  </label>
                  <input
                    id="target-name"
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    required
                    placeholder="e.g. Production Chatbot"
                    className="w-full px-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* AI Endpoint URL */}
                <div>
                  <label
                    htmlFor="target-url"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    AI Endpoint URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3.5 text-[#A0A0A0] w-4 h-4 pointer-events-none" />
                    <input
                      id="target-url"
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      required
                      placeholder="https://api.openai.com/v1/chat/completions"
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* API Key */}
                <div>
                  <label
                    htmlFor="api-key"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    API Key{" "}
                    <span className="text-zinc-500 font-normal text-xs">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 text-[#A0A0A0] w-4 h-4 pointer-events-none" />
                    <input
                      id="api-key"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border border-red-500/30 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Stored encrypted — used only for attack execution
                  </p>
                </div>

                {/* Custom Headers */}
                <div>
                  <label
                    htmlFor="custom-headers"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Custom Headers{" "}
                    <span className="text-zinc-500 font-normal text-xs">
                      (optional JSON)
                    </span>
                  </label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-3 text-[#A0A0A0] w-4 h-4 pointer-events-none" />
                    <textarea
                      id="custom-headers"
                      value={customHeaders}
                      onChange={(e) => {
                        setCustomHeaders(e.target.value);
                        validateHeaders(e.target.value);
                      }}
                      rows={3}
                      placeholder={'{"X-Custom-Header": "value"}'}
                      className={`w-full pl-10 pr-4 py-3 bg-[#1A1A1A]/50 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-xs resize-none ${
                        headersError
                          ? "border-red-500/50 focus:ring-red-500"
                          : "border-red-500/30"
                      }`}
                    />
                  </div>
                  {headersError && (
                    <p className="mt-1 text-xs text-red-400">{headersError}</p>
                  )}
                </div>

                {/* Error banner */}
                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {saveError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F5F5] font-medium rounded-lg transition-all border border-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !!headersError}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Save &amp; Continue
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              STEP 3 — Run Your First Scan
          ═══════════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 rounded-xl mb-4 shadow-lg shadow-red-600/30">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Run Your First Scan
                </h2>
                <p className="text-[#A0A0A0] text-sm">
                  Ready to attack{" "}
                  <span className="text-red-300 font-medium">
                    {targetName}
                  </span>
                  . This will run a full red-team suite and generate a
                  compliance evidence report.
                </p>
              </div>

              {/* Pre-scan summary card */}
              {!scanning && !scanResult && !scanError && (
                <div className="space-y-3 mb-6">
                  <div className="bg-[#1A1A1A]/50 rounded-lg px-4 py-3 border border-red-500/10 flex items-center gap-3">
                    <Globe className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-[#F5F5F5] text-sm font-mono truncate">
                      {targetUrl}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Attack types", value: "6 frameworks" },
                      { label: "Test cases", value: "~50 probes" },
                      { label: "Est. time", value: "~60 sec" },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-[#1A1A1A]/50 rounded-lg p-3 border border-red-500/10 text-center"
                      >
                        <div className="text-white font-semibold text-sm">
                          {value}
                        </div>
                        <div className="text-zinc-500 text-xs mt-0.5">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live scan progress */}
              {scanning && (
                <div className="mb-6">
                  {/* Spinner */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 w-20 h-20 border-4 border-red-500/30 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                  </div>

                  {/* Phase list */}
                  <div className="space-y-2">
                    {SCAN_PHASES.map((phase, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                          i < scanPhase
                            ? "bg-green-500/10 border border-green-500/20"
                            : i === scanPhase
                            ? "bg-red-500/20 border border-red-500/40"
                            : "bg-[#1A1A1A]/30 border border-zinc-800/50 opacity-40"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {i < scanPhase ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : i === scanPhase ? (
                            <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-zinc-700" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            i < scanPhase
                              ? "text-green-300"
                              : i === scanPhase
                              ? "text-red-200"
                              : "text-zinc-500"
                          }`}
                        >
                          {phase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scan success */}
              {scanResult && !scanError && (
                <div className="mb-6">
                  {scanResult.report_id ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                      <div className="font-semibold text-green-400 text-lg mb-1">
                        Scan Complete!
                      </div>
                      <div className="text-green-300 text-sm mb-3">
                        Report ID:{" "}
                        <span className="font-mono">{scanResult.report_id}</span>
                      </div>
                      <div className="text-green-400/70 text-xs animate-pulse">
                        Redirecting to your evidence report…
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
                      <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                      <div className="font-semibold text-yellow-400 mb-1">
                        Scan ran — no report generated
                      </div>
                      <div className="text-yellow-300 text-sm">
                        The scan executed but didn&apos;t return a report ID.
                        Check the API status or try again.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scan error */}
              {scanError && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-400">
                        Scan failed
                      </div>
                      <div className="text-red-300 text-sm mt-0.5">
                        {scanError}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA — initial state */}
              {!scanning && !scanResult && !scanError && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRunScan}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Launch First Attack
                  </button>
                  <button
                    onClick={() => window.location.replace("/overview")}
                    className="w-full py-2 px-4 text-zinc-500 hover:text-[#F5F5F5] text-sm transition-colors"
                  >
                    Skip — go to dashboard
                  </button>
                </div>
              )}

              {/* CTA — after error */}
              {scanError && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setScanError(null);
                      setScanResult(null);
                    }}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.replace("/overview")}
                    className="w-full py-2 px-4 text-zinc-500 hover:text-[#F5F5F5] text-sm transition-colors"
                  >
                    Skip — go to dashboard
                  </button>
                </div>
              )}

              {/* CTA — after success with no report_id */}
              {scanResult && !scanResult.report_id && !scanError && (
                <div className="flex flex-col gap-3 mt-2">
                  <button
                    onClick={() => window.location.replace("/overview")}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-700 mt-6">
          DefendML · Automated AI Red Teaming &amp; Compliance Evidence
        </p>
      </div>
    </div>
  );
}
