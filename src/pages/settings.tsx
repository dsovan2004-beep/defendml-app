// src/pages/settings.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { createClient } from '@supabase/supabase-js';
import {
  Settings as SettingsIcon, Users, Shield, Plug, Bell, Building2,
  ChevronRight, Key, Plus, Search, Download, Upload,
  Code, Database, CreditCard, CheckCircle2, ExternalLink,
  Loader2, Copy, Check, Filter, Globe, Zap,
  Terminal, Lock, RefreshCw, Info, Mail, Webhook,
  Activity, TrendingUp, AlertTriangle,
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SettingsTab = 'users' | 'rbac' | 'api' | 'prompts' | 'billing' | 'integrations' | 'notifications' | 'organization';

type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  last_sign_in_at: string | null;
  created_at: string;
  provider: string;
};

type OrgData = {
  id: string;
  name: string;
  created_at: string;
  memberCount: number;
};

type ApiKey = {
  id: string;
  name: string;
  key_hash: string;
  created_at: string;
};

type PromptTest = {
  id: string;
  category: string;
  prompt_text: string;
  framework: string;
  severity: string;
};

function prettyRole(role: string) {
  if (!role) return 'Viewer';
  const map: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    analyst: 'Security Analyst',
    viewer: 'Viewer',
    free: 'Free',
    pilot: 'Pilot',
    standard: 'Standard',
    growth: 'Growth',
    enterprise: 'Enterprise',
  };
  return map[role.toLowerCase()] ?? role;
}

function rolePill(role: string) {
  const r = role.toLowerCase();
  if (r === 'superadmin') return 'bg-red-500/20 text-red-300 border border-red-500/30';
  if (r === 'admin') return 'bg-red-500/20 text-orange-300 border border-red-500/30';
  if (r === 'analyst') return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
  return 'bg-[#222222] text-[#F5F5F5] border border-zinc-700';
}

function formatLastActive(isoString: string | null) {
  if (!isoString) return 'Never';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function initials(name: string, email: string) {
  if (name && name.trim()) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function severityBadge(s: string) {
  const v = (s || '').toLowerCase();
  if (v === 'critical') return 'bg-red-500/20 text-red-300 border border-red-500/30';
  if (v === 'high')     return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
  if (v === 'medium')   return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
  return 'bg-zinc-700/50 text-zinc-300 border border-zinc-700';
}

function frameworkBadge(f: string) {
  const v = (f || '').toLowerCase();
  if (v.includes('owasp'))  return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  if (v.includes('nist'))   return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
  if (v.includes('mitre'))  return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
  if (v.includes('asl'))    return 'bg-red-500/20 text-red-300 border border-red-500/30';
  if (v.includes('eu'))     return 'bg-green-500/20 text-green-300 border border-green-500/30';
  if (v.includes('soc'))    return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
  return 'bg-zinc-700/50 text-zinc-300 border border-zinc-700';
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={copy} className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#A0A0A0] hover:text-white transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  // Users state
  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Organization state
  const [orgData, setOrgData] = useState<OrgData | null>(null);
  const [orgLoading, setOrgLoading] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);

  // Prompt Library state
  const [prompts, setPrompts] = useState<PromptTest[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(false);
  const [promptSearch, setPromptSearch] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [promptsTotal, setPromptsTotal] = useState(0);
  const [promptPage, setPromptPage] = useState(0);
  const PAGE_SIZE = 25;

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    scanComplete: true,
    newVulnerability: true,
    weeklyDigest: false,
    criticalOnly: false,
    emailChannel: true,
    slackChannel: false,
  });

  // ── Fetch users ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setUsersLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        const authUser = authData?.user;
        const { data: publicUsers, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          if (authUser) {
            setUsers([{
              id: authUser.id,
              email: authUser.email ?? '',
              full_name: (authUser.user_metadata?.full_name as string) ?? authUser.email ?? '',
              role: (authUser.user_metadata?.role as string) ?? 'viewer',
              last_sign_in_at: authUser.last_sign_in_at ?? null,
              created_at: authUser.created_at,
              provider: authUser.app_metadata?.provider ?? 'email',
            }]);
          }
          return;
        }

        const merged: AppUser[] = (publicUsers ?? []).map((u: any) => ({
          id: u.auth_user_id ?? u.id,
          email: u.email ?? '',
          full_name: u.full_name ?? u.email ?? '',
          role: u.role ?? 'viewer',
          last_sign_in_at:
            authUser?.id === (u.auth_user_id ?? u.id)
              ? (authUser?.last_sign_in_at ?? null)
              : null,
          created_at: u.created_at,
          provider: authUser?.id === (u.auth_user_id ?? u.id)
            ? (authUser?.app_metadata?.provider ?? 'email')
            : 'email',
        }));

        if (merged.length === 0 && authUser) {
          merged.push({
            id: authUser.id,
            email: authUser.email ?? '',
            full_name: (authUser.user_metadata?.full_name as string) ?? authUser.email ?? '',
            role: (authUser.user_metadata?.role as string) ?? 'viewer',
            last_sign_in_at: authUser.last_sign_in_at ?? null,
            created_at: authUser.created_at,
            provider: authUser.app_metadata?.provider ?? 'email',
          });
        }
        setUsers(merged);
      } finally {
        setUsersLoading(false);
      }
    })();
  }, []);

  // ── Fetch organization ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'organization') return;
    setOrgLoading(true);
    setOrgError(null);
    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId) { setOrgError('Not authenticated'); return; }

        const { data: membership, error: memErr } = await supabase
          .from('organization_members')
          .select('organization_id, role')
          .eq('user_id', userId)
          .limit(1)
          .single();

        if (memErr || !membership) {
          setOrgError('No organization found. Contact your admin to be added to an org.');
          return;
        }

        const { data: org, error: orgErr } = await supabase
          .from('organizations')
          .select('id, name, created_at')
          .eq('id', membership.organization_id)
          .single();

        if (orgErr || !org) { setOrgError('Could not load organization details.'); return; }

        const { count } = await supabase
          .from('organization_members')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', membership.organization_id);

        setOrgData({
          id: org.id,
          name: org.name,
          created_at: org.created_at,
          memberCount: count ?? 0,
        });

        // Also load API keys for this org
        setApiKeysLoading(true);
        const { data: keys } = await supabase
          .from('api_keys')
          .select('id, name, key_hash, created_at')
          .eq('organization_id', org.id)
          .order('created_at', { ascending: false });
        setApiKeys(keys ?? []);
        setApiKeysLoading(false);
      } catch (e) {
        setOrgError('Unexpected error loading organization.');
      } finally {
        setOrgLoading(false);
      }
    })();
  }, [activeTab]);

  // ── Fetch API keys (for API tab) ──────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'api') return;
    setApiKeysLoading(true);
    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId) return;

        const { data: membership } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId)
          .limit(1)
          .single();

        if (!membership) return;

        const { data: keys } = await supabase
          .from('api_keys')
          .select('id, name, key_hash, created_at')
          .eq('organization_id', membership.organization_id)
          .order('created_at', { ascending: false });
        setApiKeys(keys ?? []);
      } finally {
        setApiKeysLoading(false);
      }
    })();
  }, [activeTab]);

  // ── Fetch prompt library ──────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'prompts') return;
    setPromptsLoading(true);
    (async () => {
      try {
        let query = supabase
          .from('red_team_tests')
          .select('id, category, prompt_text, framework, severity', { count: 'exact' })
          .order('category', { ascending: true })
          .range(promptPage * PAGE_SIZE, (promptPage + 1) * PAGE_SIZE - 1);

        if (frameworkFilter !== 'all') query = query.ilike('framework', `%${frameworkFilter}%`);
        if (severityFilter !== 'all') query = query.eq('severity', severityFilter);

        const { data, count, error } = await query;
        if (!error) {
          setPrompts(data ?? []);
          setPromptsTotal(count ?? 0);
        }
      } finally {
        setPromptsLoading(false);
      }
    })();
  }, [activeTab, frameworkFilter, severityFilter, promptPage]);

  const activeUsers = users.filter(u =>
    u.last_sign_in_at && Date.now() - new Date(u.last_sign_in_at).getTime() < 30 * 24 * 60 * 60 * 1000
  );

  const filteredPrompts = promptSearch.trim()
    ? prompts.filter(p =>
        p.prompt_text?.toLowerCase().includes(promptSearch.toLowerCase()) ||
        p.category?.toLowerCase().includes(promptSearch.toLowerCase())
      )
    : prompts;

  const tabs = [
    { id: 'users' as SettingsTab, label: 'User Management', icon: Users, description: 'Manage team members and permissions' },
    { id: 'rbac' as SettingsTab, label: 'Access Control', icon: Shield, description: 'Configure roles and permissions' },
    { id: 'api' as SettingsTab, label: 'API Configuration', icon: Code, description: 'API endpoints and rate limits' },
    { id: 'prompts' as SettingsTab, label: 'Prompt Library', icon: Database, description: '295 attack scenarios & coverage' },
    { id: 'billing' as SettingsTab, label: 'Billing & Subscription', icon: CreditCard, description: 'Plan details and usage' },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Plug, description: 'Connect external services' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell, description: 'Alert rules and channels' },
    { id: 'organization' as SettingsTab, label: 'Organization', icon: Building2, description: 'Company settings and API keys' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 bg-[#0A0A0A]">
        {/* Header */}
        <div className="border-b border-[#1A1A1A] bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-red-400" />
              <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>
            <p className="text-[#A0A0A0]">Manage your DefendML workspace, integrations, and security policies</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] overflow-hidden sticky top-4">
                <div className="p-4 border-b border-[#1A1A1A]">
                  <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider">Settings Menu</h3>
                </div>
                <nav className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all mb-1 ${
                          isActive
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'text-[#A0A0A0] hover:bg-[#1A1A1A] hover:text-[#F5F5F5]'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{tab.label}</div>
                          <div className="text-xs opacity-70 truncate">{tab.description}</div>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="space-y-6">

                {/* ── User Management Tab ───────────────────────────────── */}
                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
                          <p className="text-[#A0A0A0]">Add, remove, and manage team member access</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all">
                            <Upload className="w-4 h-4" />
                            Bulk Upload
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all">
                            <Plus className="w-4 h-4" />
                            Add User
                          </button>
                        </div>
                      </div>

                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F5F5] rounded-lg border border-zinc-800 transition-all">
                          <Upload className="w-4 h-4" />
                          CSV Upload
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F5F5] rounded-lg border border-zinc-800 transition-all">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>

                      {/* User Table */}
                      <div className="border border-[#1A1A1A] rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#1A1A1A] border-b border-zinc-800">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase">Role</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[#F5F5F5] uppercase">Last Active</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-[#F5F5F5] uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1A1A1A]">
                            {usersLoading ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center">
                                  <Loader2 className="w-6 h-6 animate-spin text-red-400 mx-auto" />
                                </td>
                              </tr>
                            ) : users.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                                  No users found
                                </td>
                              </tr>
                            ) : (
                              users.map((u) => (
                                <tr key={u.id} className="hover:bg-[#1A1A1A]/50">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-300 font-semibold text-sm">
                                          {initials(u.full_name, u.email)}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="text-white font-medium">{u.full_name || u.email}</div>
                                        <div className="text-[#A0A0A0] text-sm">{u.email}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rolePill(u.role)}`}>
                                      {prettyRole(u.role)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-[#F5F5F5] text-sm">
                                    {formatLastActive(u.last_sign_in_at)}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button className="text-[#A0A0A0] hover:text-white transition-colors">⋯</button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-4 border border-red-500/20">
                        <div className="text-3xl font-bold text-white mb-1">
                          {usersLoading ? '—' : users.length}
                        </div>
                        <div className="text-red-300 text-sm">Total Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                        <div className="text-3xl font-bold text-white mb-1">
                          {usersLoading ? '—' : activeUsers.length}
                        </div>
                        <div className="text-green-300 text-sm">Active Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                        <div className="text-3xl font-bold text-white mb-1">0</div>
                        <div className="text-orange-300 text-sm">Pending Invites</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── RBAC Tab ─────────────────────────────────────────── */}
                {activeTab === 'rbac' && (
                  <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Access Control (RBAC)</h2>
                    <p className="text-[#A0A0A0] mb-6">Configure role-based access control and permissions</p>
                    <div className="space-y-4">
                      <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-red-300 mb-1">Super Admin</h3>
                            <p className="text-[#A0A0A0] text-sm">Full system access and management capabilities</p>
                          </div>
                          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold">
                            {usersLoading ? '—' : users.filter(u => u.role.toLowerCase() === 'superadmin').length} users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['All Resources', 'Create/Edit/Delete', 'Export Data', 'Manage Users'].map(p => (
                            <div key={p} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />{p}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-orange-300 mb-1">Security Analyst</h3>
                            <p className="text-[#A0A0A0] text-sm">View security data and export reports</p>
                          </div>
                          <span className="px-3 py-1 bg-red-500/20 text-orange-300 rounded-full text-xs font-semibold">
                            {usersLoading ? '—' : users.filter(u => u.role.toLowerCase() === 'analyst').length} users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[['View All Data', true], ['Export Reports', true], ['No Edit Access', false], ['No User Management', false]].map(([label, ok]) => (
                            <div key={label as string} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                              <div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />{label}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-zinc-800 bg-[#1A1A1A]/50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#F5F5F5] mb-1">Viewer</h3>
                            <p className="text-[#A0A0A0] text-sm">Read-only access to dashboards and reports</p>
                          </div>
                          <span className="px-3 py-1 bg-[#222222] text-[#F5F5F5] rounded-full text-xs font-semibold">
                            {usersLoading ? '—' : users.filter(u => u.role.toLowerCase() === 'viewer').length} users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[['View Dashboards', true], ['No Export', false], ['No Edit Access', false], ['No User Management', false]].map(([label, ok]) => (
                            <div key={label as string} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                              <div className={`w-2 h-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />{label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── API Configuration Tab ─────────────────────────────── */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    {/* Endpoint Reference */}
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Terminal className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">API Configuration</h2>
                      </div>
                      <p className="text-[#A0A0A0] mb-6">API endpoints, authentication, and rate limits for your DefendML integration</p>

                      {/* Base URL */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Base URL</h3>
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg font-mono text-sm">
                          <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-green-300 flex-1">https://defendml-api.dsovan2004.workers.dev</span>
                          <CopyButton text="https://defendml-api.dsovan2004.workers.dev" />
                        </div>
                      </div>

                      {/* Endpoints */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Available Endpoints</h3>
                        <div className="space-y-3">
                          {[
                            { method: 'POST', path: '/api/red-team/execute', desc: 'Launch a red team scan against a target', body: '{ "targetId": "<uuid>" }' },
                            { method: 'GET',  path: '/api/reports/[id]',     desc: 'Retrieve a completed scan report by ID', body: null },
                            { method: 'POST', path: '/api/chat',             desc: 'DefendML dogfood — 3-layer defense endpoint', body: '{ "message": "..." }' },
                          ].map(ep => (
                            <div key={ep.path} className="border border-[#1A1A1A] rounded-lg overflow-hidden">
                              <div className="flex items-center gap-3 px-4 py-3 bg-[#1A1A1A]">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${ep.method === 'GET' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'}`}>
                                  {ep.method}
                                </span>
                                <span className="font-mono text-sm text-[#F5F5F5] flex-1">{ep.path}</span>
                                <CopyButton text={`https://defendml-api.dsovan2004.workers.dev${ep.path}`} />
                              </div>
                              <div className="px-4 py-3">
                                <p className="text-sm text-[#A0A0A0] mb-2">{ep.desc}</p>
                                {ep.body && (
                                  <div className="px-3 py-2 bg-[#0A0A0A] rounded border border-zinc-800 font-mono text-xs text-green-300">
                                    {ep.body}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Authentication */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Authentication</h3>
                        <div className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 space-y-3">
                          <div className="flex items-start gap-3">
                            <Lock className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-[#F5F5F5] font-medium mb-1">Bearer Token</p>
                              <p className="text-xs text-[#A0A0A0]">Include your API key in the Authorization header on every request.</p>
                            </div>
                          </div>
                          <div className="px-3 py-2 bg-[#0A0A0A] rounded border border-zinc-800 font-mono text-xs text-green-300">
                            {`Authorization: Bearer <your-api-key>`}
                          </div>
                          <div className="flex items-start gap-3 pt-1">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-[#A0A0A0]">API keys are scoped to your organization. Each key grants full scan execution permissions. Rotate keys in the API Keys section below.</p>
                          </div>
                        </div>
                      </div>

                      {/* Rate Limits */}
                      <div>
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Rate Limits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { label: 'Scan Executions', value: 'Per target config', detail: 'Set per target in Targets page' },
                            { label: 'Report Fetches', value: '1,000 / hour', detail: 'GET /api/reports/* endpoints' },
                            { label: 'Chat Endpoint', value: '60 / minute', detail: 'POST /api/chat (dogfood)' },
                          ].map(r => (
                            <div key={r.label} className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-medium text-[#F5F5F5]">{r.label}</span>
                              </div>
                              <div className="text-lg font-bold text-white mb-1">{r.value}</div>
                              <div className="text-xs text-[#A0A0A0]">{r.detail}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* API Keys Management */}
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">API Keys</h3>
                          <p className="text-sm text-[#A0A0A0]">Keys are stored as hashes — copy your key on creation, it won't be shown again.</p>
                        </div>
                      </div>

                      {/* Create new key */}
                      <div className="flex gap-3 mb-6">
                        <input
                          type="text"
                          value={newKeyName}
                          onChange={e => setNewKeyName(e.target.value)}
                          placeholder="Key name (e.g. CI/CD Pipeline, Staging)"
                          className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        />
                        <button
                          disabled={!newKeyName.trim() || creatingKey}
                          onClick={() => {
                            // API key creation requires backend support — surface as coming soon
                            setCreatingKey(false);
                            setNewKeyName('');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all text-sm"
                        >
                          {creatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                          Create Key
                        </button>
                      </div>

                      {/* Key list */}
                      {apiKeysLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                        </div>
                      ) : apiKeys.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                          <Key className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-500">No API keys yet. Create one above to start integrating.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {apiKeys.map(key => (
                            <div key={key.id} className="flex items-center gap-4 px-4 py-3 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                              <Key className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[#F5F5F5]">{key.name}</div>
                                <div className="font-mono text-xs text-[#A0A0A0] truncate">{key.key_hash?.slice(0, 24)}••••••••</div>
                              </div>
                              <div className="text-xs text-zinc-500 flex-shrink-0">
                                {new Date(key.created_at).toLocaleDateString()}
                              </div>
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/30">Active</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Prompt Library Tab ────────────────────────────────── */}
                {activeTab === 'prompts' && (
                  <div className="space-y-6">
                    {/* Header + stats */}
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Prompt Library</h2>
                      </div>
                      <p className="text-[#A0A0A0] mb-6">
                        295 offensive attack scenarios mapped to 6 frameworks. Read-only — updated with each DefendML release.
                      </p>

                      {/* Framework coverage stats */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {[
                          { label: 'OWASP LLM Top 10', color: 'blue', count: '~50' },
                          { label: 'NIST AI RMF',       color: 'purple', count: '~45' },
                          { label: 'MITRE ATLAS',        color: 'cyan', count: '~60' },
                          { label: 'ASL-3',              color: 'red', count: '~40' },
                          { label: 'EU AI Act',          color: 'green', count: '~50' },
                          { label: 'SOC 2 / ISO 27001',  color: 'indigo', count: '~50' },
                        ].map(fw => (
                          <div key={fw.label} className={`px-3 py-2 rounded-lg border text-xs font-medium bg-${fw.color}-500/10 border-${fw.color}-500/20 text-${fw.color}-300`}>
                            <div className="font-semibold mb-0.5">{fw.label}</div>
                            <div className="opacity-70">{fw.count} scenarios</div>
                          </div>
                        ))}
                      </div>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            value={promptSearch}
                            onChange={e => setPromptSearch(e.target.value)}
                            placeholder="Search prompts or categories..."
                            className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                          />
                        </div>
                        <select
                          value={frameworkFilter}
                          onChange={e => { setFrameworkFilter(e.target.value); setPromptPage(0); }}
                          className="px-3 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        >
                          <option value="all">All Frameworks</option>
                          <option value="OWASP">OWASP</option>
                          <option value="NIST">NIST</option>
                          <option value="MITRE">MITRE</option>
                          <option value="ASL">ASL-3</option>
                          <option value="EU">EU AI Act</option>
                          <option value="SOC">SOC 2</option>
                        </select>
                        <select
                          value={severityFilter}
                          onChange={e => { setSeverityFilter(e.target.value); setPromptPage(0); }}
                          className="px-3 py-2 bg-[#1A1A1A] border border-zinc-800 rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        >
                          <option value="all">All Severities</option>
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>

                      {/* Total count */}
                      <div className="flex items-center justify-between text-sm text-[#A0A0A0] mb-4">
                        <span>
                          {promptsLoading ? 'Loading…' : `Showing ${filteredPrompts.length} of ${promptsTotal} scenarios`}
                        </span>
                        <span className="text-xs px-2 py-1 bg-red-500/10 text-red-300 rounded border border-red-500/20">
                          295 total in library
                        </span>
                      </div>

                      {/* Prompt table */}
                      {promptsLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
                        </div>
                      ) : filteredPrompts.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                          <Database className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <p className="text-sm text-zinc-500">No scenarios match your filters.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredPrompts.map((p, idx) => (
                            <div key={p.id} className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 hover:border-red-500/20 transition-colors">
                              <div className="flex items-start gap-3">
                                <span className="text-xs text-zinc-600 font-mono mt-0.5 w-8 flex-shrink-0">
                                  {String(promptPage * PAGE_SIZE + idx + 1).padStart(3, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <span className="text-xs font-semibold text-[#F5F5F5] uppercase tracking-wider">
                                      {p.category?.replace(/_/g, ' ')}
                                    </span>
                                    {p.framework && (
                                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${frameworkBadge(p.framework)}`}>
                                        {p.framework}
                                      </span>
                                    )}
                                    {p.severity && (
                                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${severityBadge(p.severity)}`}>
                                        {p.severity}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-[#A0A0A0] leading-relaxed line-clamp-2">
                                    {p.prompt_text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pagination */}
                      {!promptsLoading && promptsTotal > PAGE_SIZE && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1A1A1A]">
                          <button
                            disabled={promptPage === 0}
                            onClick={() => setPromptPage(p => Math.max(0, p - 1))}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5F5F5] rounded-lg border border-zinc-800 text-sm transition-all"
                          >
                            ← Previous
                          </button>
                          <span className="text-sm text-[#A0A0A0]">
                            Page {promptPage + 1} of {Math.ceil(promptsTotal / PAGE_SIZE)}
                          </span>
                          <button
                            disabled={(promptPage + 1) * PAGE_SIZE >= promptsTotal}
                            onClick={() => setPromptPage(p => p + 1)}
                            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5F5F5] rounded-lg border border-zinc-800 text-sm transition-all"
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Billing Tab ───────────────────────────────────────── */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                      <p className="text-[#A0A0A0] mb-6">Manage your plan, usage, and billing details</p>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
                        <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-zinc-800">
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                              CURRENT
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">Free Tier</h4>
                          <div className="text-3xl font-bold text-red-400 mb-1">$0</div>
                          <div className="text-sm text-[#A0A0A0] mb-4">Limited access</div>
                          <ul className="space-y-2 mb-6">
                            {[
                              '100 prompts per scan',
                              '295-prompt library access',
                              'Evidence reports & PDF export',
                              'ASL-3 & EU AI Act coverage',
                            ].map(f => (
                              <li key={f} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />{f}
                              </li>
                            ))}
                          </ul>
                          <button disabled className="w-full px-4 py-2 bg-[#222222] text-zinc-500 rounded-lg font-medium cursor-not-allowed">
                            Current Plan
                          </button>
                        </div>
                      </div>

                      {/* Pricing Tiers */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Available Plans</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Pilot */}
                          <div className="relative p-6 bg-[#1A1A1A] rounded-xl border border-red-500/30 hover:border-red-500/60 transition-all">
                            <h4 className="text-xl font-bold text-white mb-1">Pilot</h4>
                            <div className="text-3xl font-bold text-red-400 mb-1">$2,500<span className="text-base text-[#A0A0A0] font-normal"> one-time</span></div>
                            <p className="text-xs text-zinc-500 mb-4">24hr delivery · 1 target</p>
                            <ul className="space-y-2 mb-6">
                              {[
                                '100 prompts per scan',
                                '1 target',
                                '24hr PDF report delivery',
                                '8/10 OWASP 2025 LLM coverage',
                                'Evidence reports & PDF export',
                                'ASL-3 & EU AI Act coverage',
                              ].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                                </li>
                              ))}
                            </ul>
                            <a href="mailto:dsovan2004@gmail.com?subject=DefendML Pilot" className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
                              Get Started
                            </a>
                          </div>

                          {/* Standard */}
                          <div className="relative p-6 bg-[#1A1A1A] rounded-xl border border-orange-500/30 hover:border-orange-500/60 transition-all">
                            <div className="absolute top-4 right-4">
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold border border-orange-500/30">POPULAR</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">Standard</h4>
                            <div className="text-3xl font-bold text-orange-400 mb-1">$4,999<span className="text-base text-[#A0A0A0] font-normal"> one-time</span></div>
                            <p className="text-xs text-zinc-500 mb-4">24hr delivery · 1 target · full library</p>
                            <ul className="space-y-2 mb-6">
                              {[
                                '295 prompts per scan',
                                '1 target',
                                '24hr full report delivery',
                                '10/10 OWASP 2025 LLM coverage',
                                'Evidence reports & PDF export',
                                'ASL-3 & EU AI Act coverage',
                                'Vector & embedding attack coverage',
                                'Unbounded consumption testing',
                              ].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                                </li>
                              ))}
                            </ul>
                            <a href="mailto:dsovan2004@gmail.com?subject=DefendML Standard" className="block w-full text-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all">
                              Get Started
                            </a>
                          </div>

                          {/* Growth */}
                          <div className="relative p-6 bg-[#1A1A1A] rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all">
                            <h4 className="text-xl font-bold text-white mb-1">Growth</h4>
                            <div className="text-3xl font-bold text-white mb-1">$9,999<span className="text-base text-[#A0A0A0] font-normal">/month</span></div>
                            <p className="text-xs text-zinc-500 mb-4">Continuous testing · 3 targets</p>
                            <ul className="space-y-2 mb-6">
                              {[
                                '295 prompts × 3 targets',
                                'Monthly continuous testing',
                                '10/10 OWASP 2025 LLM coverage',
                                'CI/CD integration ready',
                                'Dedicated report per target',
                                'Priority delivery',
                              ].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                                </li>
                              ))}
                            </ul>
                            <a href="mailto:dsovan2004@gmail.com?subject=DefendML Growth" className="block w-full text-center px-4 py-2 bg-[#222222] hover:bg-[#2A2A2A] text-white rounded-lg font-medium border border-zinc-700 transition-all">
                              Contact Sales
                            </a>
                          </div>

                          {/* Enterprise */}
                          <div className="relative p-6 bg-[#111111] rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all">
                            <div className="absolute top-4 right-4">
                              <span className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full text-xs font-semibold">ENTERPRISE</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">Enterprise</h4>
                            <div className="text-3xl font-bold text-white mb-1">Custom<span className="text-base text-[#A0A0A0] font-normal"> pricing</span></div>
                            <p className="text-xs text-zinc-500 mb-4">Unlimited · CI/CD · SLA-backed</p>
                            <ul className="space-y-2 mb-6">
                              {[
                                'Unlimited prompts & targets',
                                'CI/CD pipeline integration',
                                'Custom attack categories',
                                'SLA-backed delivery',
                                'Dedicated red team support',
                              ].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-[#F5F5F5]">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />{f}
                                </li>
                              ))}
                            </ul>
                            <a href="mailto:dsovan2004@gmail.com?subject=DefendML Enterprise" className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
                              Contact Us
                            </a>
                          </div>

                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Scans Executed', value: '12' },
                            { label: 'Total Prompts', value: '1200', sub: '100 per scan (Pilot limit)' },
                            { label: 'Evidence Reports', value: '12' },
                            { label: 'Infrastructure Cost', value: '$0', green: true },
                          ].map(({ label, value, sub, green }) => (
                            <div key={label} className="p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                              <div className="text-sm text-[#A0A0A0] mb-1">{label}</div>
                              <div className={`text-2xl font-bold ${green ? 'text-green-400' : 'text-white'}`}>{value}</div>
                              {sub && <div className="text-xs text-zinc-500">{sub}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">💰 Cost Comparison vs Competitors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                          { label: 'DefendML', value: 'from $2,500', sub: 'pilot', highlight: true },
                          { label: 'F5 AI Red Team', value: '$15K-$30K', sub: 'per month' },
                          { label: 'Lakera', value: '$10K-$20K', sub: 'per month' },
                          { label: 'Microsoft PyRIT', value: '$20K-$40K', sub: 'per month' },
                        ].map(({ label, value, sub, highlight }) => (
                          <div key={label} className={`text-center ${!highlight ? 'opacity-60' : ''}`}>
                            <div className={`text-sm mb-1 ${highlight ? 'text-green-300' : 'text-[#A0A0A0]'}`}>{label}</div>
                            <div className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-[#F5F5F5]'}`}>{value}</div>
                            <div className="text-xs text-zinc-500">{sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Integrations Tab ─────────────────────────────────── */}
                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Plug className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Integrations</h2>
                      </div>
                      <p className="text-[#A0A0A0] mb-6">Connect DefendML to your existing security and engineering workflow.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            name: 'Slack',
                            desc: 'Post scan results and critical vulnerability alerts to Slack channels.',
                            icon: '💬',
                            status: 'coming_soon',
                          },
                          {
                            name: 'GitHub Actions',
                            desc: 'Trigger red team scans automatically on pull requests and releases.',
                            icon: '⚙️',
                            status: 'coming_soon',
                          },
                          {
                            name: 'Jira',
                            desc: 'Auto-create security issues for every critical vulnerability found.',
                            icon: '🎯',
                            status: 'coming_soon',
                          },
                          {
                            name: 'PagerDuty',
                            desc: 'Page on-call engineers when scans detect critical exploits.',
                            icon: '🚨',
                            status: 'coming_soon',
                          },
                          {
                            name: 'Webhook',
                            desc: 'Send scan events to any HTTP endpoint in real time.',
                            icon: '🔗',
                            status: 'coming_soon',
                          },
                          {
                            name: 'Datadog',
                            desc: 'Export scan metrics and security posture scores to Datadog.',
                            icon: '📊',
                            status: 'coming_soon',
                          },
                        ].map(int => (
                          <div key={int.name} className="flex items-start gap-4 p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 opacity-70">
                            <div className="text-2xl flex-shrink-0">{int.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[#F5F5F5]">{int.name}</span>
                                <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded text-xs">Coming Soon</span>
                              </div>
                              <p className="text-xs text-[#A0A0A0]">{int.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-[#F5F5F5] mb-1">Need a specific integration?</p>
                          <p className="text-xs text-[#A0A0A0]">
                            Enterprise customers get custom integrations built within 2 weeks.{' '}
                            <a href="mailto:dsovan2004@gmail.com?subject=DefendML Integration Request" className="text-red-400 hover:text-red-300 underline">
                              Contact us →
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Notifications Tab ─────────────────────────────────── */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Notifications</h2>
                      </div>
                      <p className="text-[#A0A0A0] mb-6">Configure when and how you receive security alerts.</p>

                      {/* Alert Rules */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Alert Rules</h3>
                        <div className="space-y-3">
                          {[
                            { key: 'scanComplete', label: 'Scan Complete', desc: 'Notify when any scan finishes successfully' },
                            { key: 'newVulnerability', label: 'New Vulnerability Detected', desc: 'Alert when a scan finds an exploitable attack vector' },
                            { key: 'weeklyDigest', label: 'Weekly Security Digest', desc: 'Summary of all scan activity and risk trends, every Monday' },
                            { key: 'criticalOnly', label: 'Critical Severity Only', desc: 'Only alert when critical-severity attacks succeed' },
                          ].map(item => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                              <div>
                                <div className="text-sm font-medium text-[#F5F5F5]">{item.label}</div>
                                <div className="text-xs text-[#A0A0A0] mt-0.5">{item.desc}</div>
                              </div>
                              <button
                                onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                  notifSettings[item.key as keyof typeof notifSettings]
                                    ? 'bg-red-600'
                                    : 'bg-zinc-700'
                                }`}
                              >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notifSettings[item.key as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Channels */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Delivery Channels</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-blue-400" />
                              <div>
                                <div className="text-sm font-medium text-[#F5F5F5]">Email</div>
                                <div className="text-xs text-[#A0A0A0]">Delivered to your account email address</div>
                              </div>
                            </div>
                            <button
                              onClick={() => setNotifSettings(prev => ({ ...prev, emailChannel: !prev.emailChannel }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                notifSettings.emailChannel ? 'bg-red-600' : 'bg-zinc-700'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifSettings.emailChannel ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 opacity-60">
                            <div className="flex items-center gap-3">
                              <div className="text-lg">💬</div>
                              <div>
                                <div className="text-sm font-medium text-[#F5F5F5]">Slack</div>
                                <div className="text-xs text-[#A0A0A0]">Connect Slack in Integrations to enable</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded text-xs">Not Connected</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg border border-zinc-800 opacity-60">
                            <div className="flex items-center gap-3">
                              <Webhook className="w-5 h-5 text-purple-400" />
                              <div>
                                <div className="text-sm font-medium text-[#F5F5F5]">Webhook</div>
                                <div className="text-xs text-[#A0A0A0]">Configure a webhook URL in Integrations</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 rounded text-xs">Not Configured</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-all">
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Organization Tab ──────────────────────────────────── */}
                {activeTab === 'organization' && (
                  <div className="space-y-6">
                    <div className="bg-[#111111] rounded-xl border border-[#1A1A1A] p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Organization</h2>
                      </div>
                      <p className="text-[#A0A0A0] mb-6">Your workspace identity, organization ID, and admin settings.</p>

                      {orgLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
                        </div>
                      ) : orgError ? (
                        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{orgError}</p>
                        </div>
                      ) : orgData ? (
                        <>
                          {/* Org identity card */}
                          <div className="p-5 bg-[#1A1A1A] rounded-lg border border-zinc-800 mb-6">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl font-bold text-red-300">
                                {orgData.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{orgData.name}</h3>
                                <p className="text-sm text-[#A0A0A0]">
                                  Created {new Date(orgData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Organization ID</div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] rounded border border-zinc-800">
                                  <span className="font-mono text-xs text-[#F5F5F5] flex-1 truncate">{orgData.id}</span>
                                  <CopyButton text={orgData.id} />
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Members</div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-[#0A0A0A] rounded border border-zinc-800">
                                  <Users className="w-4 h-4 text-[#A0A0A0]" />
                                  <span className="text-sm text-[#F5F5F5]">{orgData.memberCount} member{orgData.memberCount !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* API Keys for org */}
                          <div>
                            <h3 className="text-sm font-semibold text-[#F5F5F5] uppercase tracking-wider mb-3">Organization API Keys</h3>
                            {apiKeysLoading ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-5 h-5 animate-spin text-red-400" />
                              </div>
                            ) : apiKeys.length === 0 ? (
                              <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                                <Key className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
                                <p className="text-sm text-zinc-500 mb-3">No API keys configured for this organization.</p>
                                <button
                                  onClick={() => setActiveTab('api')}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
                                >
                                  Go to API Configuration →
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {apiKeys.map(key => (
                                  <div key={key.id} className="flex items-center gap-4 px-4 py-3 bg-[#1A1A1A] rounded-lg border border-zinc-800">
                                    <Key className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-[#F5F5F5]">{key.name}</div>
                                      <div className="font-mono text-xs text-[#A0A0A0] truncate">{key.key_hash?.slice(0, 20)}••••</div>
                                    </div>
                                    <div className="text-xs text-zinc-500">{new Date(key.created_at).toLocaleDateString()}</div>
                                    <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/30">Active</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-[#111111] rounded-xl border border-red-500/20 p-6">
                      <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">Danger Zone</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                          <div>
                            <div className="text-sm font-medium text-[#F5F5F5]">Export All Data</div>
                            <div className="text-xs text-[#A0A0A0]">Download all scan reports, targets, and results as JSON.</div>
                          </div>
                          <button className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#222222] text-[#F5F5F5] rounded-lg border border-zinc-700 text-sm font-medium transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/30">
                          <div>
                            <div className="text-sm font-medium text-red-400">Delete Organization</div>
                            <div className="text-xs text-[#A0A0A0]">Permanently delete this org and all associated data. This cannot be undone.</div>
                          </div>
                          <button
                            onClick={() => alert('Contact dsovan2004@gmail.com to delete your organization.')}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 text-sm font-medium transition-all"
                          >
                            Delete Org
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsPageContent />
    </RequireAuth>
  );
}
