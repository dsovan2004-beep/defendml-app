// ============================================================================
// src/pages/admin/targets.tsx - PART 1 OF 2 - FIXED
// FIXED: Removed auth field overrides in handleRunScan
// January 9, 2026, 2:35 PM PST
// ============================================================================
"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import RequireAuth from "../../components/RequireAuth";
import { createClient } from "@supabase/supabase-js";
import { useUserTier, isFree } from "../../lib/tierCheck";
import {
  Plus,
  Target,
  Globe,
  MessageSquare,
  Shield,
  Play,
  Trash2,
  Edit,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Activity,
  Clock,
  Lock,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Target {
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
  created_at: string;
  created_by: string;
  last_scan_at: string | null;
  total_scans: number;
  last_scan_result: "pass" | "fail" | "error" | null;
  last_report_id: string | null;
}

function AttackTargets() {
  const { tier } = useUserTier();
  const gated = isFree(tier);

  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);

  const [customHeaders, setCustomHeaders] = useState("{}");
  const [headersError, setHeadersError] = useState("");

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

  useEffect(() => {
    loadTargets();
  }, []);

  const validateJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setHeadersError("");
      return true;
    } catch (e: any) {
      setHeadersError(`Invalid JSON: ${e.message}`);
      return false;
    }
  };

  const loadTargets = async () => {
    try {
      // Use server-side Pages Function (service_role) to bypass RLS —
      // ensures superadmin sees ALL targets regardless of org membership.
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) {
        console.error("No active session");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/targets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateJSON(customHeaders)) {
      alert("Please fix the JSON format in Custom Headers field");
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      const parsedHeaders = JSON.parse(customHeaders);

      const response = await fetch("/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          custom_headers: parsedHeaders,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add target");
      }

      await loadTargets();
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      console.error("Error adding target:", error);
      alert(`Failed to add target: ${error.message}`);
    }
  };

  // ============================================================================
  // FIXED: handleRunScan - Removed auth field overrides
  // Worker will fetch ALL config from database using targetId
  // ============================================================================
  const handleRunScan = async (targetId: string) => {
    setExecuting(targetId);

    try {
      const target = targets.find(t => t.id === targetId);
      if (!target) {
        throw new Error("Target not found");
      }

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
        // Surface the real worker error so we can debug it
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

      // Use server-side PATCH (service_role) to bypass RLS for status update
      const statusRes = await fetch("/api/targets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          id: targetId,
          last_scan_at: new Date().toISOString(),
          last_report_id: data.report_id,
          total_scans: (target.total_scans || 0) + 1,
        }),
      });
      if (!statusRes.ok) {
        console.error("Failed to update target status:", await statusRes.text());
      }

      await loadTargets();
      window.location.href = `/reports/${data.report_id}`;
    } catch (error: any) {
      console.error("Error executing attack:", error);
      alert(`Failed to execute attack: ${error.message}`);
    } finally {
      setExecuting(null);
    }
  };

  const handleDelete = async (targetId: string) => {
    if (!confirm("Are you sure you want to delete this attack target?")) return;

    try {
      const { error } = await supabase
        .from("targets")
        .delete()
        .eq("id", targetId);

      if (error) throw error;
      await loadTargets();
    } catch (error) {
      console.error("Error deleting target:", error);
      alert("Failed to delete target");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      target_type: "api",
      url: "",
      endpoint_path: "",
      auth_method: "none",
      auth_header_name: "",
      auth_token: "",
      environment: "staging",
      rate_limit_per_hour: 100,
      timeout_seconds: 30,
    });
    setCustomHeaders("{}");
    setHeadersError("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Globe className="w-4 h-4" />;
      case "chatbot":
        return <MessageSquare className="w-4 h-4" />;
      case "website":
        return <Shield className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getRelativeTime = (dateString: string | null): string => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (lastScanAt: string | null, lastReportId: string | null) => {
    if (!lastScanAt) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-zinc-700 text-zinc-300 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Never tested
        </span>
      );
    }

    return (
      <a
        href={lastReportId ? `/reports/${lastReportId}` : '#'}
        className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400 flex items-center gap-1 hover:bg-green-900/50 transition-colors"
        title="Click to view last report"
      >
        <CheckCircle className="w-3 h-3" />
        Tested {getRelativeTime(lastScanAt)}
      </a>
    );
  };

// ============================================================================
// PART 2: JSX RETURN
// ============================================================================

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Attack Targets</h1>
              <p className="text-[#A0A0A0]">
                Customer AI systems targeted for red team testing
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { if (!gated) setShowAddModal(true); }}
                disabled={gated}
                title={gated ? "Upgrade to Pilot to add targets" : undefined}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  gated
                    ? "bg-[#1A1A1A] text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {gated ? <Lock className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                Add Target
              </button>
            </div>
          </div>

          {/* Upgrade banner — shown only for free tier */}
          {gated && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center gap-3">
              <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-300">
                Upgrade to Pilot ($2,500) to unlock real red team scans.{" "}
                <a
                  href="mailto:dsovan2004@gmail.com"
                  className="underline text-red-400 hover:text-red-300 transition-colors"
                >
                  Contact us to upgrade →
                </a>
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-[#A0A0A0]">Loading attack targets...</p>
          </div>
        ) : targets.length === 0 ? (
          <div className="bg-[#111111] rounded-lg p-12 text-center border border-[#1A1A1A]">
            <Target className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No attack targets configured
            </h3>
            <p className="text-[#A0A0A0] mb-6">
              Add your first customer AI system to begin red team testing
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
            {targets.map((target) => (
              <div
                key={target.id}
                className="bg-[#111111] rounded-lg p-6 hover:bg-[#1A1A1A] transition-colors border border-[#1A1A1A]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#1A1A1A] rounded-lg">
                        {getTypeIcon(target.target_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {target.name}
                        </h3>
                        <p className="text-sm text-[#A0A0A0]">{target.url}</p>
                      </div>
                    </div>

                    {target.description && (
                      <p className="text-[#A0A0A0] text-sm mb-4 ml-14">
                        {target.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 ml-14">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Type:</span>
                        <span className="text-[#F5F5F5] capitalize">
                          {target.target_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Environment:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            target.environment === "production"
                              ? "bg-red-900/30 text-red-400"
                              : target.environment === "staging"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-orange-900/30 text-orange-400"
                          }`}
                        >
                          {target.environment}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Auth:</span>
                        <span className="text-[#F5F5F5] capitalize">
                          {target.auth_method}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Attacks:</span>
                        <span className="text-[#F5F5F5]">{target.total_scans}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500">Status:</span>
                        {getStatusBadge(target.last_scan_at, target.last_report_id)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { if (!gated) handleRunScan(target.id); }}
                      disabled={executing === target.id || gated}
                      title={gated ? "Upgrade to Pilot to run scans" : "Execute attack"}
                      className={`p-2 rounded-lg transition-colors ${
                        gated
                          ? "bg-[#1A1A1A] text-zinc-500 cursor-not-allowed border border-zinc-700"
                          : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      }`}
                    >
                      {executing === target.id ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : gated ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(target.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete target"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#1A1A1A]">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Attack Target</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-[#A0A0A0] hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Target Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Production AI Chat API"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Customer-facing chatbot for support inquiries"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                        Type
                      </label>
                      <select
                        value={formData.target_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            target_type: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="api">API</option>
                        <option value="chatbot">Chatbot</option>
                        <option value="website">Website</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                        Environment
                      </label>
                      <select
                        value={formData.environment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            environment: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Base URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Endpoint Path (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.endpoint_path}
                      onChange={(e) =>
                        setFormData({ ...formData, endpoint_path: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="/v1/chat/completions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Authentication Method
                    </label>
                    <select
                      value={formData.auth_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          auth_method: e.target.value as any,
                        })
                      }
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
                        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                          Auth Header Name
                        </label>
                        <input
                          type="text"
                          value={formData.auth_header_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              auth_header_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Authorization"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                          Auth Token
                        </label>
                        <input
                          type="password"
                          value={formData.auth_token}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              auth_token: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#1A1A1A] rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="sk-..."
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-4 border-t border-zinc-800">
                    <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
                      Custom Headers (Optional)
                      <span className="text-zinc-500 text-xs ml-2">JSON format</span>
                    </label>
                    <textarea
                      value={customHeaders}
                      onChange={(e) => {
                        setCustomHeaders(e.target.value);
                        validateJSON(e.target.value);
                      }}
                      onBlur={() => validateJSON(customHeaders)}
                      placeholder='{"anthropic-version": "2023-06-01"}'
                      rows={4}
                      className={`w-full px-4 py-2 bg-[#1A1A1A] border ${
                        headersError ? 'border-red-500' : 'border-[#1A1A1A]'
                      } rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm`}
                    />
                    {headersError && (
                      <p className="mt-1 text-sm text-red-500">{headersError}</p>
                    )}
                    {!headersError && customHeaders !== '{}' && (
                      <p className="mt-1 text-sm text-green-500">✓ Valid JSON</p>
                    )}

                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-[#A0A0A0]">
                        <strong>Common Examples:</strong>
                      </p>
                      <div className="bg-[#0A0A0A] p-3 rounded border border-zinc-800 space-y-2">
                        <div>
                          <p className="text-xs text-[#F5F5F5] font-semibold">Anthropic Claude:</p>
                          <code className="text-xs text-green-400">{`{"anthropic-version": "2023-06-01"}`}</code>
                        </div>
                        <div>
                          <p className="text-xs text-[#F5F5F5] font-semibold">Azure OpenAI:</p>
                          <code className="text-xs text-green-400">{`{"api-version": "2024-02-15-preview"}`}</code>
                        </div>
                        <div>
                          <p className="text-xs text-[#F5F5F5] font-semibold">Hugging Face:</p>
                          <code className="text-xs text-green-400">{`{"x-use-cache": "false"}`}</code>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        💡 <strong>Note:</strong> These headers are merged with Content-Type.
                        If you specify an Authorization header here, it will override the Auth Token field above.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Add Target
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
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


        <div className="mt-12 bg-[#111111] rounded-lg p-6 border border-[#1A1A1A]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Red Team Attack Process
          </h3>
          <div className="space-y-4 text-sm text-[#F5F5F5]">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-white">Configure Attack Target</p>
                <p className="text-[#A0A0A0]">
                  Add customer AI system URL, authentication, and environment details
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-white">Execute Attack</p>
                <p className="text-[#A0A0A0]">
                  Click Play to send 100 attack prompts to the target system
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-white">Review Evidence Report</p>
                <p className="text-[#A0A0A0]">
                  Analyze which attacks succeeded, failed, and get AI-powered remediation playbooks
                </p>
              </div>
            </div>
          </div>
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
