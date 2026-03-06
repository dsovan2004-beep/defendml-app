// src/pages/settings.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import { createClient } from '@supabase/supabase-js';
import {
  Settings as SettingsIcon, Users, Shield, Plug, Bell, Building2,
  ChevronRight, Slack, Mail, Key, Zap, Plus, Search, Download, Upload,
  Code, Database, CreditCard, CheckCircle2, Activity, TrendingUp, ExternalLink,
  Loader2,
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

function prettyRole(role: string) {
  if (!role) return 'Viewer';
  const map: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    analyst: 'Security Analyst',
    viewer: 'Viewer',
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

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setUsersLoading(true);
      try {
        // Get current auth user for last_sign_in_at and provider
        const { data: authData } = await supabase.auth.getUser();
        const authUser = authData?.user;

        // Fetch all rows from public.users
        const { data: publicUsers, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch users:', error);
          // Fall back to just showing the current auth user
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

        // Merge public.users rows with auth metadata for current user
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

        // If no rows in public.users but we have an auth user, show them
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

  const activeUsers = users.filter(u =>
    u.last_sign_in_at && Date.now() - new Date(u.last_sign_in_at).getTime() < 30 * 24 * 60 * 60 * 1000
  );

  const tabs = [
    { id: 'users' as SettingsTab, label: 'User Management', icon: Users, description: 'Manage team members and permissions' },
    { id: 'rbac' as SettingsTab, label: 'Access Control', icon: Shield, description: 'Configure roles and permissions' },
    { id: 'api' as SettingsTab, label: 'API Configuration', icon: Code, description: 'API endpoints and rate limits' },
    { id: 'prompts' as SettingsTab, label: 'Prompt Library', icon: Database, description: '255 attack scenarios & coverage' },
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
                          <div className="text-3xl font-bold text-red-400 mb-4">$0<span className="text-lg text-[#A0A0A0]">/month</span></div>
                          <ul className="space-y-2 mb-6">
                            {[
                              '40 prompts per scan',
                              '255-prompt library access',
                              'Evidence reports & PDF export',
                              'ASL-3 & EU AI Act compliance',
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

                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Scans Executed', value: '12' },
                            { label: 'Total Prompts', value: '480', sub: '40 per scan' },
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
                          { label: 'DefendML', value: '$0-$5', highlight: true },
                          { label: 'F5 AI Red Team', value: '$15K-$30K' },
                          { label: 'Lakera', value: '$10K-$20K' },
                          { label: 'Microsoft PyRIT', value: '$20K-$40K' },
                        ].map(({ label, value, highlight }) => (
                          <div key={label} className={`text-center ${!highlight ? 'opacity-60' : ''}`}>
                            <div className={`text-sm mb-1 ${highlight ? 'text-green-300' : 'text-[#A0A0A0]'}`}>{label}</div>
                            <div className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-[#F5F5F5]'}`}>{value}</div>
                            <div className="text-xs text-zinc-500">per month</div>
                          </div>
                        ))}
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
