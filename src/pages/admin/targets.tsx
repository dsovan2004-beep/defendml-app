// src/pages/admin/targets.tsx
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
  Cpu,
  Edit2,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type TargetType = "api_endpoint" | "chat_ui" | "internal_agent" | "integration";
type AuthMethod =
  | "api_key"
  | "oauth_token"
  | "session_cookie"
  | "bearer_token"
  | "none";
type Environment = "prod" | "staging" | "dev" | "test";
type ScanStatus = "pending" | "running" | "completed" | "failed";

interface Target {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  target_type: TargetType;
  url?: string;
  endpoint_path?: string;
  auth_method?: AuthMethod;
  auth_header_name?: string;
  auth_token?: string;
  environment?: Environment;
  rate_limit_per_hour: number;
  timeout_seconds: number;
  is_active: boolean;
  last_scan_at?: string;
  last_scan_status?: ScanStatus;
  tags?: string[];
}

// Base64URL-safe JWT payload decode
function decodeJwtPayload(token: string): any | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    // base64url -> base64
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    // pad
    const padded = base64 + "===".slice((base64.length + 3) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function TargetsPage() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_type: "api_endpoint" as TargetType,
    url: "",
    endpoint_path: "",
    auth_method: "api_key" as AuthMethod,
    auth_header_name: "Authorization",
    auth_token: "",
    environment: "dev" as Environment,
    rate_limit_per_hour: 100,
    timeout_seconds: 30,
  });

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user found");
        setTargets([]);
        return;
      }

      const { data, error } = await supabase
        .from("targets")
        .select("*")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading targets:", error);
        setTargets([]);
      } else {
        setTargets((data as Target[]) || []);
      }
    } catch (error) {
      console.error("Failed to load targets:", error);
      setTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // TEMP DEBUG: confirm JWT role (15 seconds)
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (token) {
        const payload = decodeJwtPayload(token);
        console.log(
          "JWT role:",
          payload?.role,
          "sub:",
          payload?.sub,
          "email:",
          payload?.email
        );
      } else {
        console.log("No access token found in session");
      }

      if (!user) {
        alert("Please log in to add targets");
        return;
      }

      const { error } = await supabase.from("targets").insert([
        {
          ...formData,
          created_by: user.id,
        },
      ]);

      if (error) {
        console.error("Error adding target:", error);
        alert("Failed to add target: " + error.message);
      } else {
        await loadTargets();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to add target:", error);
      alert("Failed to add target");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("targets")
        .update(formData)
        .eq("id", editingTarget.id);

      if (error) {
        console.error("Error updating target:", error);
        alert("Failed to update target: " + error.message);
      } else {
        await loadTargets();
        setEditingTarget(null);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to update target:", error);
      alert("Failed to update target");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTarget = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attack target?")) return;

    try {
      const { error } = await supabase.from("targets").delete().eq("id", id);

      if (error) {
        console.error("Error deleting target:", error);
        alert("Failed to delete target: " + error.message);
      } else {
        await loadTargets();
      }
    } catch (error) {
      console.error("Failed to delete target:", error);
      alert("Failed to delete target");
    }
  };

  const handleRunScan = async (targetId: string) => {
    alert("Red team attack execution coming soon! Target ID: " + targetId);
    // TODO: Implement scan execution
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      target_type: "api_endpoint",
      url: "",
      endpoint_path: "",
      auth_method: "api_key",
      auth_header_name: "Authorization",
      auth_token: "",
      environment: "dev",
      rate_limit_per_hour: 100,
      timeout_seconds: 30,
    });
  };

  const openEditModal = (target: Target) => {
    setFormData({
      name: target.name,
      description: target.description || "",
      target_type: target.target_type,
      url: target.url || "",
      endpoint_path: target.endpoint_path || "",
      auth_method: target.auth_method || "api_key",
      auth_header_name: target.auth_header_name || "Authorization",
      auth_token: target.auth_token || "",
      environment: target.environment || "dev",
      rate_limit_per_hour: target.rate_limit_per_hour,
      timeout_seconds: target.timeout_seconds,
    });
    setEditingTarget(target);
  };

  const getTargetIcon = (type: TargetType) => {
    switch (type) {
      case "api_endpoint":
        return <Globe className="w-5 h-5" />;
      case "chat_ui":
        return <MessageSquare className="w-5 h-5" />;
      case "internal_agent":
        return <Cpu className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status?: ScanStatus) => {
    if (!status) {
      return <span className="text-xs text-slate-500">Never tested</span>;
    }

    const styles: Record<ScanStatus, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      running: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
      failed: "bg-red-500/20 text-red-300 border-red-500/30",
    };

    const icons: Record<ScanStatus, React.ReactNode> = {
      pending: <Clock className="w-3 h-3" />,
      running: <Play className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navigation />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Attack Targets</h1>
            <p className="mt-2 text-slate-300 max-w-2xl">
              Customer AI systems targeted for red team testing. Execute attacks to generate compliance evidence.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Targets
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium border border-purple-500/50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Target
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Target List */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Attack Target List</h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Loading targets...</p>
              </div>
            ) : targets.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-300 mb-4">
                  No attack targets yet. Add a target to execute red team tests.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Target
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mt-0.5">
                          {getTargetIcon(target.target_type)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{target.name}</h3>
                          {target.description && (
                            <p className="text-slate-400 text-sm mb-2">{target.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="px-2 py-0.5 bg-slate-700 rounded">
                              {target.target_type}
                            </span>
                            {target.environment && (
                              <span className="px-2 py-0.5 bg-slate-700 rounded">
                                {target.environment}
                              </span>
                            )}
                            {target.url && (
                              <span className="text-slate-400">{target.url}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunScan(target.id)}
                          className="p-2 hover:bg-green-500/10 rounded text-green-400 transition-all"
                          title="Execute attack"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(target)}
                          className="p-2 hover:bg-blue-500/10 rounded text-blue-400 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTarget(target.id)}
                          className="p-2 hover:bg-red-500/10 rounded text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {target.last_scan_at && (
                          <span>
                            Last attack: {new Date(target.last_scan_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {getStatusBadge(target.last_scan_status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Red Team Attack Process */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Red Team Attack Process</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white mb-1">1) Add attack target</div>
                <div className="text-slate-400">
                  Define the customer AI system to test (API, chat UI, or agent endpoint).
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white mb-1">2) Execute red team attack</div>
                <div className="text-slate-400">
                  Launch 255+ attack scenarios against the target system.
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white mb-1">3) Export attack evidence</div>
                <div className="text-slate-400">
                  Generate compliance reports for OWASP, NIST, MITRE ATLAS, ASL-3, and EU AI Act.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-white font-semibold text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Total Targets</span>
                  <span className="text-white font-semibold">{targets.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Active</span>
                  <span className="text-green-400 font-semibold">
                    {targets.filter((t) => t.is_active).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tested</span>
                  <span className="text-purple-400 font-semibold">
                    {targets.filter((t) => t.last_scan_at).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Add/Edit Target Modal */}
      {(showAddModal || editingTarget) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-white">
                {editingTarget ? "Edit Attack Target" : "Add Attack Target"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTarget(null);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={editingTarget ? handleUpdateTarget : handleAddTarget}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Customer Production API"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Customer-facing AI chat assistant"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Target Type *
                  </label>
                  <select
                    value={formData.target_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_type: e.target.value as TargetType,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="api_endpoint">API Endpoint</option>
                    <option value="chat_ui">Chat UI</option>
                    <option value="internal_agent">Internal Agent</option>
                    <option value="integration">Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Environment *
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        environment: e.target.value as Environment,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="dev">Development</option>
                    <option value="staging">Staging</option>
                    <option value="prod">Production</option>
                    <option value="test">Test</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://api.customer.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Endpoint Path
                </label>
                <input
                  type="text"
                  value={formData.endpoint_path}
                  onChange={(e) =>
                    setFormData({ ...formData, endpoint_path: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="/v1/chat/completions"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Auth Method
                  </label>
                  <select
                    value={formData.auth_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        auth_method: e.target.value as AuthMethod,
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="api_key">API Key</option>
                    <option value="bearer_token">Bearer Token</option>
                    <option value="oauth_token">OAuth Token</option>
                    <option value="session_cookie">Session Cookie</option>
                    <option value="none">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Auth Header Name
                  </label>
                  <input
                    type="text"
                    value={formData.auth_header_name}
                    onChange={(e) =>
                      setFormData({ ...formData, auth_header_name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Authorization"
                  />
                </div>
              </div>

              {formData.auth_method !== "none" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Auth Token
                  </label>
                  <input
                    type="password"
                    value={formData.auth_token}
                    onChange={(e) =>
                      setFormData({ ...formData, auth_token: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="sk-..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rate Limit (per hour)
                  </label>
                  <input
                    type="number"
                    value={formData.rate_limit_per_hour}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate_limit_per_hour: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.timeout_seconds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeout_seconds: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTarget(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>{editingTarget ? "Update Target" : "Add Target"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Import Attack Targets</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-400 mb-4">
                Upload a CSV or JSON file to import multiple attack targets at once.
