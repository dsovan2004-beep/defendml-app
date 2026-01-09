// ============================================================================
// src/pages/admin/targets.tsx - PART 1 OF 2
// WITH CUSTOM HEADERS SUPPORT
// January 9, 2026, 12:50 PM PST
// ============================================================================
"use client";

import React, { useState, useEffect } from "react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { createClient } from "@supabase/supabase-js";
import {
  Plus,
  Upload,
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
  custom_headers: Record<string, string> | null; // NEW
  created_at: string;
  created_by: string;
  last_scan_at: string | null;
  total_scans: number;
  last_scan_result: "pass" | "fail" | "error" | null;
  last_report_id: string | null;
}

export default function AttackTargets() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [executing, setExecuting] = useState<string | null>(null);
  
  // NEW: Custom headers state
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

  // NEW: JSON validation function
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("targets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTargets(data || []);
    } catch (error) {
      console.error("Error loading targets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // NEW: Validate custom headers before submission
    if (!validateJSON(customHeaders)) {
      alert("Please fix the JSON format in Custom Headers field");
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error("No active session");
      }

      // NEW: Parse custom headers and include in submission
      const parsedHeaders = JSON.parse(customHeaders);

      const response = await fetch("/api/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          custom_headers: parsedHeaders, // NEW: Include custom headers
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

      const response = await fetch(
        "https://defendml-api.dsovan2004.workers.dev/api/red-team/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetId: target.id, // NEW: Send targetId to enable custom headers
            target: targetUrl,
            auth_token: target.auth_token || undefined,
            auth_method: target.auth_method !== "none" ? target.auth_method : undefined,
            auth_header_name: target.auth_header_name || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to execute attack");
      }

      const data = await response.json();

      const { error: updateError } = await supabase
        .from("targets")
        .update({
          last_scan_at: new Date().toISOString(),
          last_report_id: data.report_id,
          total_scans: (target.total_scans || 0) + 1,
        })
        .eq("id", targetId);

      if (updateError) {
        console.error("Failed to update target status:", updateError);
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
    // NEW: Reset custom headers
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
        <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 flex items-center gap-1">
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

  // ========================================
  // CONTINUED IN PART 2
  // ========================================
// ========================================
  // PART 2: JSX RETURN - CONTINUED FROM PART 1
  // ========================================

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Attack Targets</h1>
              <p className="text-gray-400">
                Customer AI systems targeted for red team testing
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Target
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-400">Loading attack targets...</p>
          </div>
        ) : targets.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No attack targets configured
            </h3>
            <p className="text-gray-400 mb-6">
              Add your first customer AI system to begin red team testing
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Target
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {targets.map((target) => (
              <div
                key={target.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        {getTypeIcon(target.target_type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {target.name}
                        </h3>
                        <p className="text-sm text-gray-400">{target.url}</p>
                      </div>
                    </div>

                    {target.description && (
                      <p className="text-gray-400 text-sm mb-4 ml-14">
                        {target.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 ml-14">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="text-gray-300 capitalize">
                          {target.target_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Environment:</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            target.environment === "production"
                              ? "bg-red-900/30 text-red-400"
                              : target.environment === "staging"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-blue-900/30 text-blue-400"
                          }`}
                        >
                          {target.environment}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Auth:</span>
                        <span className="text-gray-300 capitalize">
                          {target.auth_method}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Attacks:</span>
                        <span className="text-gray-300">{target.total_scans}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Status:</span>
                        {getStatusBadge(target.last_scan_at, target.last_report_id)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunScan(target.id)}
                      disabled={executing === target.id}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Execute attack"
                    >
                      {executing === target.id ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
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

        {/* ========================================
            ADD TARGET MODAL WITH CUSTOM HEADERS
            ======================================== */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Add Attack Target</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Production AI Chat API"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={3}
                      placeholder="Customer-facing chatbot for support inquiries"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="api">API</option>
                        <option value="chatbot">Chatbot</option>
                        <option value="website">Website</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Base URL
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Endpoint Path (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.endpoint_path}
                      onChange={(e) =>
                        setFormData({ ...formData, endpoint_path: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="/v1/chat/completions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="Authorization"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
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
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          placeholder="sk-..."
                        />
                      </div>
                    </>
                  )}

                  {/* ========================================
                      NEW: CUSTOM HEADERS FIELD
                      ======================================== */}
                  <div className="pt-4 border-t border-gray-700">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Custom Headers (Optional)
                      <span className="text-gray-500 text-xs ml-2">JSON format</span>
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
                      className={`w-full px-4 py-2 bg-gray-700 border ${
                        headersError ? 'border-red-500' : 'border-gray-600'
                      } rounded-lg text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm`}
                    />
                    {headersError && (
                      <p className="mt-1 text-sm text-red-500">{headersError}</p>
                    )}
                    {!headersError && customHeaders !== '{}' && (
                      <p className="mt-1 text-sm text-green-500">✓ Valid JSON</p>
                    )}
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-400">
                        <strong>Common Examples:</strong>
                      </p>
                      <div className="bg-gray-900 p-3 rounded border border-gray-700 space-y-2">
                        <div>
                          <p className="text-xs text-gray-300 font-semibold">Anthropic Claude:</p>
                          <code className="text-xs text-green-400">{`{"anthropic-version": "2023-06-01"}`}</code>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300 font-semibold">Azure OpenAI:</p>
                          <code className="text-xs text-green-400">{`{"api-version": "2024-02-15-preview"}`}</code>
                        </div>
                        <div>
                          <p className="text-xs text-gray-300 font-semibold">Hugging Face:</p>
                          <code className="text-xs text-green-400">{`{"x-use-cache": "false"}`}</code>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        💡 <strong>Note:</strong> These headers are merged with Content-Type. 
                        If you specify an Authorization header here, it will override the Auth Token field above.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add Target
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Import Targets</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Import attack targets from CSV or JSON format
              </p>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Drop files here or click to browse</p>
                <p className="text-gray-500 text-sm">Supports CSV and JSON formats</p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="w-full mt-6 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Red Team Attack Process
          </h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-white">Configure Attack Target</p>
                <p className="text-gray-400">
                  Add customer AI system URL, authentication, and environment details
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-white">Execute Attack</p>
                <p className="text-gray-400">
                  Click Play to send 40 attack prompts to the target system
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-white">Review Evidence Report</p>
                <p className="text-gray-400">
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
