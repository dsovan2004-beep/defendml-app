// ============================================================================
// src/pages/admin/targets.tsx — QA Pass v2 (Mar 9, 2026)
// FIXED: Delete styling, inline confirmation, toast, PASS/FAIL badges,
//        scan progress bar, payload template field, collapsible guide,
//        removed all alert()/confirm() OS dialogs
// ============================================================================
"use client";

import React, { useState, useEffect, useRef } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import RequireAuth from "../../components/RequireAuth";
import { createClient } from "@supabase/supabase-js";
import { useUserTier, isFree } from "../../lib/tierCheck";
import {
  Plus, Target, Globe, MessageSquare, Shield, Play, Trash2, X,
  CheckCircle, XCircle, AlertCircle, Activity, Clock, Lock,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ────────────────────────────────────────────────────────────────────

interface TargetRecord {
  id: string;
  name: string;
  description: string | null;
  target_type: "api" | "chatbot" | "website";
  url: string;
  endpoint_path: string | null;
  auth_method: "none" | "bearer" | "api_key" | "basic" | null;
  auth_header_name: string | null;
  auth_token: string | null;
  environment: "production" | "staging" | "development";
  rate_limit_per_hour: number | null;
  timeout_seconds: number | null;
  custom_headers: Record<string, string> | null;
  metadata: Record<string, any> | null;
  created_at: string;
  created_by: string;
  last_scan_at: string | null;
  last_scan_status: "pass" | "fail" | "error" | null;
  total_scans: number;
  last_report_id: string | null;
}

interface ToastMsg {
  message: string;
  type: "success" | "error";
}

// ── Payload templates ─────────────────────────────────────────────────────────

const PAYLOAD_TEMPLATES: Record<string, string> = {
  openai: `{\n  "model": "gpt-4",\n  "messages": [\n    {"role": "user", "content": "{{prompt}}"}\n  ]\n}`,
  anthropic: `{\n  "model": "claude-3-opus-20240229",\n  "max_tokens": 1024,\n  "messages": [\n    {"role": "user", "content": "{{prompt}}"}\n  ]\n}`,
  generic: `{\n  "query": "{{prompt}}"\n}`,
};

// ── Component ────────────────────────────────────────────────────────────────

function AttackTargets() {
  const { tier } = useUserTier();
  const gated = isFree(tier);

  // Core state
  const [targets, setTargets] = useState<TargetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Scan execution
  const [executing, setExecuting] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState<{ targetId: string; current: number } | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Form
  const [customHeaders, setCustomHeaders] = useState("{}");
  const [headersError, setHeadersError] = useState("");
  const [payloadTemplate, setPayloadTemplate] = useState(PAYLOAD_TEMPLATES.openai);
  const [payloadError, setPayloadError] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_type: "api" as "api" | "chatbot" | "website",
    url: "",
    endpoint_path: "",
    auth_method: "none" as "none" | "bearer" | "api_key" | "basic",
    auth_header_name: "",
    auth_token: "",
    environment: "staging" as "production" | "staging" | "development",
    rate_limit_per_hour: 100,
    timeout_seconds: 30,
  });

  // Guide visibility
  const [showProcessGuide, setShowProcessGuide] = useState(false);

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => { loadTargets(); }, []);

  // Auto-expand guide when no targets exist
  useEffect(() => {
    if (!loading && targets.length === 0) setShowProcessGuide(true);
  }, [loading, targets.length]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const showToast = (message: string, type: "success" | "error") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 4500);
  };

  const validateJSON = (str: string, setErr: (e: string) => void): boolean => {
    try { JSON.parse(str); setErr(""); return true; }
    catch (e: any) { setErr(`Invalid JSON: ${e.message}`); return false; }
  };

  // ── Data loading ──────────────────────────────────────────────────────────

  const loadTargets = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) { setLoading(false); return; }

      const res = await fetch("/api/targets", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const json = await res.json();
      setTargets(json.targets || []);
    } catch (error) {
      console.error("Error loading targets:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Form submit ───────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateJSON(customHeaders, setHeadersError)) {
      setFormError("Fix the JSON format in Custom Headers before saving.");
      return;
    }
    if (!validateJSON(payloadTemplate, setPayloadError)) {
      setFormError("Fix the JSON format in Payload Template before saving.");
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) throw new Error("No active session");

      const response = await fetch("/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          custom_headers: JSON.parse(customHeaders),
          metadata: { payload_template: payloadTemplate },
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add target");
      }

      await loadTargets();
      setShowAddModal(false);
      resetForm();
      showToast("Attack target added successfully.", "success");
    } catch (error: any) {
      console.error("Error adding target:", error);
      setFormError(error.message || "Failed to add target. Please try again.");
    }
  };

  // ── Scan execution ────────────────────────────────────────────────────────

  const startProgress = (targetId: string) => {
    setScanProgress({ targetId, current: 0 });
    let count = 0;
    progressRef.current = setInterval(() => {
      count = Math.min(99, count + Math.floor(Math.random() * 3) + 1);
      setScanProgress({ targetId, current: count });
    }, 700);
  };

  const stopProgress = () => {
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null; }
    setScanProgress(null);
  };

  const handleRunScan = async (targetId: string) => {
    setExecuting(targetId);
    startProgress(targetId);

    try {
      const target = targets.find(t => t.id === targetId);
      if (!target) throw new Error("Target not found");

      const targetUrl = target.endpoint_path
        ? `${target.url}${target.endpoint_path}`
        : target.url;

      const sessionData = await supabase.auth.getSession();
      const accessToken = sessionData.data.session?.access_token;
      if (!accessToken) throw new Error("No active session");

      const response = await fetch(
        "https://defendml-api.dsovan2004.workers.dev/api/red-team/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            targetId: target.id,
            target: targetUrl,
            auth_method: target.auth_method || "none",
            auth_token: target.auth_token || null,
            auth_header_name: target.auth_header_name || null,
            custom_headers: target.custom_headers || {},
          }),
        }
      );

      if (!response.ok) {
        let workerMsg = `HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          workerMsg = JSON.stringify(errBody);
        } catch {
          try { workerMsg = await response.text(); } catch {}
        }
        throw new Error(`Worker error: ${workerMsg}`);
      }

      const data = await response.json();

      // Determine PASS/FAIL from the completed report
      let scanStatus: "pass" | "fail" | "error" = "fail";
      try {
        const { data: reportRow } = await supabase
          .from("red_team_reports")
          .select("allowed_count")
          .eq("report_id", data.report_id)
          .maybeSingle();
        if (reportRow) {
          scanStatus = (reportRow.allowed_count === 0) ? "pass" : "fail";
        }
      } catch {}

      stopProgress();

      // PATCH target status
      const patchToken = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch("/api/targets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${patchToken}`,
        },
        body: JSON.stringify({
          id: targetId,
          last_scan_at: new Date().toISOString(),
          last_report_id: data.report_id,
          last_scan_status: scanStatus,
          total_scans: (target.total_scans || 0) + 1,
        }),
      });

      await loadTargets();
      showToast("Scan complete. Opening evidence report...", "success");
      window.location.href = `/reports/${data.report_id}`;
    } catch (error: any) {
      console.error("Error executing attack:", error);
      stopProgress();
      showToast(`Scan failed: ${error.message}`, "error");
    } finally {
      setExecuting(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDeleteConfirm = async (targetId: string) => {
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from("targets").delete().eq("id", targetId);
      if (error) throw error;
      setConfirmDelete(null);
      await loadTargets();
      showToast("Target deleted.", "success");
    } catch {
      showToast("Failed to delete target. Please try again.", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Form reset ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData({
      name: "", description: "", target_type: "api", url: "", endpoint_path: "",
      auth_method: "none", auth_header_name: "", auth_token: "",
      environment: "staging", rate_limit_per_hour: 100, timeout_seconds: 30,
    });
    setCustomHeaders("{}"); setHeadersError("");
    setPayloadTemplate(PAYLOAD_TEMPLATES.openai); setPayloadError("");
    setFormError(null);
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api": return <Globe className="w-4 h-4" />;
      case "chatbot": return <MessageSquare className="w-4 h-4" />;
      case "website": return <Shield className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getRelativeTime = (ds: string | null): string => {
    if (!ds) return "Never";
    const diffMs = Date.now() - new Date(ds).getTime();
    const m = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMs / 3600000);
    const d = Math.floor(diffMs / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d === 1) return "Yesterday";
    if (d < 7) return `${d}d ago`;
    if (d < 30) return `${Math.floor(d / 7)}w ago`;
    return new Date(ds).toLocaleDateString();
  };

  const getStatusBadge = (target: TargetRecord) => {
    if (!target.last_scan_at) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-zinc-700/50 text-zinc-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />Never tested
        </span>
      );
    }
    const ago = getRelativeTime(target.last_scan_at);
    const href = target.last_report_id ? `/reports/${target.last_report_id}` : "#";
    const s = target.last_scan_status;

    if (s === "pass") return (
      <a href={href} className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1 hover:bg-green-500/20 transition-colors">
        <CheckCircle className="w-3 h-3" />PASS · {ago}
      </a>
    );
    if (s === "fail") return (
      <a href={href} className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1 hover:bg-red-500/20 transition-colors">
        <XCircle className="w-3 h-3" />FAIL · {ago}
      </a>
    );
    if (s === "error") return (
      <a href={href} className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1 hover:bg-yellow-500/20 transition-colors">
        <AlertCircle className="w-3 h-3" />ERROR · {ago}
      </a>
    );
    // Legacy — no status set yet
    return (
      <a href={href} className="px-2 py-1 text-xs rounded-full bg-zinc-700/50 text-zinc-300 flex items-center gap-1 hover:bg-zinc-700 transition-colors">
        <CheckCircle className="w-3 h-3" />Tested · {ago}
      </a>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      {/* ── Toast notification ─────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium max-w-sm ${
          toast.type === "success"
            ? "bg-[#111111] border-green-500/30 text-green-300"
            : "bg-[#111111] border-red-500/30 text-red-300"
        }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          }
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Attack Targets</h1>
              <p className="text-[#A0A0A0]">Customer AI systems targeted for red team testing</p>
            </div>
            <button
              onClick={() => { if (!gated) setShowAddModal(true); }}
              disabled={gated}
              title={gated ? "Upgrade to Pilot to add targets" : undefined}
              className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                gated
                  ? "bg-[#1A1A1A] text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {gated ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              Add Target
            </button>
          </div>

          {gated && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-300">
                Upgrade to Pilot ($2,500) to unlock real red team scans.{" "}
                <a href="mailto:dsovan2004@gmail.com" className="underline text-red-400 hover:text-red-300 transition-colors">
                  Contact us to upgrade →
                </a>
              </span>
            </div>
          )}
        </div>

        {/* ── Target list ─────────────────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            <p className="mt-4 text-[#A0A0A0]">Loading attack targets...</p>
          </div>
        ) : targets.length === 0 ? (
          <div className="bg-[#111111] rounded-lg p-12 text-center border border-[#1A1A1A]">
            <Target className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No attack targets configured</h3>
            <p className="text-[#A0A0A0] mb-6">
              Add your first AI system to begin red team testing. Each scan fires 100 adversarial prompts covering 6 security frameworks.
            </p>
            <button
              onClick={() => { if (!gated) setShowAddModal(true); }}
              disabled={gated}
              className={`px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 ${
                gated
                  ? "bg-[#1A1A1A] text-zinc-500 cursor-not-allowed border border-zinc-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {gated ? <Lock className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              Add Target
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {targets.map((target) => {
              const isExecuting = executing === target.id;
              const progress = scanProgress?.targetId === target.id ? scanProgress.current : null;
              const pendingDelete = confirmDelete === target.id;

              return (
                <div
                  key={target.id}
                  className="bg-[#111111] rounded-lg border border-[#1A1A1A] overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">

                      {/* Left: target info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-[#1A1A1A] rounded-lg flex-shrink-0">
                            {getTypeIcon(target.target_type)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-white">{target.name}</h3>
                            <p className="text-sm text-[#A0A0A0] truncate">{target.url}</p>
                          </div>
                        </div>

                        {target.description && (
                          <p className="text-[#A0A0A0] text-sm mb-4 ml-0 sm:ml-14">{target.description}</p>
                        )}

                        <div className="flex flex-wrap gap-3 ml-0 sm:ml-14">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Type:</span>
                            <span className="text-[#F5F5F5] capitalize">{target.target_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Env:</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              target.environment === "production"
                                ? "bg-red-900/30 text-red-400"
                                : target.environment === "staging"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-orange-900/30 text-orange-400"
                            }`}>{target.environment}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Auth:</span>
                            <span className="text-[#F5F5F5] capitalize">{target.auth_method || "none"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Scans:</span>
                            <span className="text-[#F5F5F5]">{target.total_scans || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-zinc-500">Last result:</span>
                            {getStatusBadge(target)}
                          </div>
                        </div>
                      </div>

                      {/* Right: actions — Run Scan (primary) + Delete (secondary destructive) */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Run Scan — primary red CTA */}
                        <button
                          onClick={() => { if (!gated && !isExecuting) handleRunScan(target.id); }}
                          disabled={isExecuting || gated}
                          title={gated ? "Upgrade to Pilot to run scans" : "Execute red team attack"}
                          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                            gated
                              ? "bg-[#1A1A1A] text-zinc-500 cursor-not-allowed border border-zinc-700"
                              : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          {isExecuting
                            ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            : gated ? <Lock className="w-4 h-4" />
                            : <Play className="w-4 h-4" />
                          }
                          {isExecuting ? "Scanning..." : gated ? "Locked" : "Run Scan"}
                        </button>

                        {/* Delete — secondary destructive, visually distinct from Run Scan */}
                        <button
                          onClick={() => setConfirmDelete(pendingDelete ? null : target.id)}
                          disabled={isExecuting}
                          className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete target"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Scan progress — shown while this target is executing */}
                    {isExecuting && progress !== null && (
                      <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-red-300 flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                            Running Red Team Scan
                          </span>
                          <span className="text-xs text-[#A0A0A0] font-mono tabular-nums">
                            Attack {progress} / 100
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                          <div
                            className="h-1.5 bg-red-600 rounded-full transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                          Sending adversarial prompts across 6 frameworks — typically 30–90 seconds
                        </p>
                      </div>
                    )}

                    {/* Inline delete confirmation — replaces OS confirm() dialog */}
                    {pendingDelete && !isExecuting && (
                      <div className="mt-4 -mx-6 -mb-6 px-6 py-4 bg-red-500/5 border-t border-red-500/20 rounded-b-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-300">
                              Permanently delete <strong className="text-red-200">{target.name}</strong>?
                              This removes the target and cannot be undone.
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1.5 text-xs rounded-lg bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-zinc-700 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(target.id)}
                              disabled={deleteLoading}
                              className="px-3 py-1.5 text-xs rounded-lg bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30 transition-colors disabled:opacity-50"
                            >
                              {deleteLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Add Target modal ──────────────────────────────────────────────── */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#1A1A1A]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Attack Target</h2>
                  <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-[#A0A0A0] hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Inline form error */}
                {formError && (
                  <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-300">{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Target Name</label>
                    <input
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Production AI Chat API"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={2} placeholder="Customer-facing chatbot for support inquiries"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Type</label>
                      <select
                        value={formData.target_type}
                        onChange={(e) => setFormData({ ...formData, target_type: e.target.value as any })}
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="api">API</option>
                        <option value="chatbot">Chatbot</option>
                        <option value="website">Website</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Environment</label>
                      <select
                        value={formData.environment}
                        onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Base URL</label>
                    <input
                      type="url" required value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Endpoint Path (Optional)</label>
                    <input
                      type="text" value={formData.endpoint_path}
                      onChange={(e) => setFormData({ ...formData, endpoint_path: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="/v1/chat/completions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Authentication Method</label>
                    <select
                      value={formData.auth_method}
                      onChange={(e) => setFormData({ ...formData, auth_method: e.target.value as any })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="none">None</option>
                      <option value="bearer">Bearer Token</option>
                      <option value="api_key">API Key</option>
                      <option value="basic">Basic Auth</option>
                    </select>
                  </div>

                  {formData.auth_method !== "none" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Auth Header Name</label>
                        <input
                          type="text" value={formData.auth_header_name}
                          onChange={(e) => setFormData({ ...formData, auth_header_name: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Authorization"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">Auth Token</label>
                        <input
                          type="password" value={formData.auth_token}
                          onChange={(e) => setFormData({ ...formData, auth_token: e.target.value })}
                          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="sk-..."
                        />
                      </div>
                    </>
                  )}

                  {/* ── Payload Template ─────────────────────────────────── */}
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-[#F5F5F5]">
                        Request Payload Template
                        <span className="text-zinc-500 text-xs ml-2">
                          Where <code className="text-green-400">{"{{prompt}}"}</code> is injected
                        </span>
                      </label>
                      <div className="flex gap-1">
                        {[["OpenAI", "openai"], ["Anthropic", "anthropic"], ["Generic", "generic"]].map(([label, key]) => (
                          <button
                            key={key} type="button"
                            onClick={() => { setPayloadTemplate(PAYLOAD_TEMPLATES[key]); setPayloadError(""); }}
                            className="px-2 py-1 text-xs rounded bg-[#1A1A1A] text-[#A0A0A0] hover:text-white border border-zinc-800 transition-colors"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={payloadTemplate}
                      onChange={(e) => { setPayloadTemplate(e.target.value); validateJSON(e.target.value, setPayloadError); }}
                      rows={5}
                      className={`w-full px-4 py-2 bg-[#0A0A0A] border ${payloadError ? "border-red-500" : "border-zinc-800"} rounded-lg text-green-400 focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm`}
                    />
                    {payloadError && <p className="mt-1 text-sm text-red-500">{payloadError}</p>}
                    {!payloadError && (
                      <p className="mt-1 text-xs text-zinc-500">
                        The scan engine replaces <code className="text-green-400">{"{{prompt}}"}</code> with each attack prompt.
                      </p>
                    )}
                  </div>

                  {/* ── Custom Headers ─────────────────────────────────────── */}
                  <div className="pt-4 border-t border-zinc-800">
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Custom Headers (Optional)
                      <span className="text-zinc-500 text-xs ml-2">JSON format</span>
                    </label>
                    <textarea
                      value={customHeaders}
                      onChange={(e) => { setCustomHeaders(e.target.value); validateJSON(e.target.value, setHeadersError); }}
                      placeholder='{"anthropic-version": "2023-06-01"}'
                      rows={3}
                      className={`w-full px-4 py-2 bg-[#0A0A0A] border ${headersError ? "border-red-500" : "border-zinc-800"} rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm`}
                    />
                    {headersError && <p className="mt-1 text-sm text-red-500">{headersError}</p>}
                    {!headersError && customHeaders !== "{}" && (
                      <p className="mt-1 text-sm text-green-500">✓ Valid JSON</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                      Add Target
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(false); resetForm(); }}
                      className="px-6 py-3 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222222] transition-colors font-medium border border-zinc-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Red Team Process Guide (collapsible) ──────────────────────────── */}
        <div className="mt-8 bg-[#111111] rounded-lg border border-[#1A1A1A] overflow-hidden">
          <button
            onClick={() => setShowProcessGuide(!showProcessGuide)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors text-left"
          >
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              Red Team Attack Process
            </h3>
            {showProcessGuide
              ? <ChevronUp className="w-4 h-4 text-zinc-500" />
              : <ChevronDown className="w-4 h-4 text-zinc-500" />
            }
          </button>

          {showProcessGuide && (
            <div className="px-6 pb-6 space-y-4 border-t border-[#1A1A1A]">
              <div className="pt-4" />
              {[
                {
                  n: 1, title: "Configure Attack Target",
                  desc: "Add your AI system's URL, authentication, and payload template. Use the template to define exactly how attack prompts are injected into your request body.",
                },
                {
                  n: 2, title: "Execute Red Team Attack",
                  desc: "Click Run Scan to fire 100 adversarial prompts at your target — covering OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, ASL-3, SOC 2, and EU AI Act.",
                },
                {
                  n: 3, title: "Review Evidence Report",
                  desc: "Each scan produces an audit-ready evidence report with blocked/exploited results, MITRE mapping, and AI-powered remediation playbooks for every finding.",
                },
              ].map(s => (
                <div key={s.n} className="flex gap-3 text-sm">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-medium text-white">{s.title}</p>
                    <p className="text-[#A0A0A0] mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default function AttackTargetsPage() {
  return (
    <RequireAuth>
      <AttackTargets />
    </RequireAuth>
  );
}
