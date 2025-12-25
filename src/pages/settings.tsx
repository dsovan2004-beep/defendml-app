import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Settings as SettingsIcon, Users, Shield, Plug, Bell, Building2,
  ChevronRight, Slack, Mail, Key, Zap, Plus, Search, Download, Upload,
  Code, Database, CreditCard, CheckCircle2, Activity, TrendingUp, ExternalLink
} from 'lucide-react';

type SettingsTab = 'users' | 'rbac' | 'api' | 'prompts' | 'billing' | 'integrations' | 'notifications' | 'organization';

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

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
      
      <div className="flex-1 bg-slate-950">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>
            <p className="text-slate-400">Manage your DefendML workspace, integrations, and security policies</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden sticky top-4">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Settings Menu</h3>
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
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
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
                {/* User Management Tab */}
                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
                          <p className="text-slate-400">Add, remove, and manage team member access</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href="/admin/users"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            Bulk Upload
                          </a>
                          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
                            <Plus className="w-4 h-4" />
                            Add User
                          </button>
                        </div>
                      </div>

                      {/* Search and Filters */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all">
                          <Upload className="w-4 h-4" />
                          CSV Upload
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>

                      {/* User Table */}
                      <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-slate-800 border-b border-slate-700">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Role</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Last Active</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            <tr className="hover:bg-slate-800/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-purple-300 font-semibold text-sm">JD</span>
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">John Doe</div>
                                    <div className="text-slate-400 text-sm">john@company.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                                  Super Admin
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                                  Active
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-300 text-sm">2 hours ago</td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-white transition-colors">⋯</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                        <div className="text-3xl font-bold text-white mb-1">1</div>
                        <div className="text-purple-300 text-sm">Total Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                        <div className="text-3xl font-bold text-white mb-1">1</div>
                        <div className="text-green-300 text-sm">Active Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                        <div className="text-3xl font-bold text-white mb-1">0</div>
                        <div className="text-orange-300 text-sm">Pending Invites</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* RBAC Tab - CONTINUES IN PART 2 */}
                {/* RBAC Tab */}
                {activeTab === 'rbac' && (
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Access Control (RBAC)</h2>
                    <p className="text-slate-400 mb-6">Configure role-based access control and permissions</p>
                    <div className="space-y-4">
                      <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-purple-300 mb-1">Super Admin</h3>
                            <p className="text-slate-400 text-sm">Full system access and management capabilities</p>
                          </div>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">3 users</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>All Resources
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>Create/Edit/Delete
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>Export Data
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>Manage Users
                          </div>
                        </div>
                      </div>
                      <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-blue-300 mb-1">Security Analyst</h3>
                            <p className="text-slate-400 text-sm">View security data and export reports</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">7 users</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>View All Data
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>Export Reports
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>No Edit Access
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>No User Management
                          </div>
                        </div>
                      </div>
                      <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-1">Viewer</h3>
                            <p className="text-slate-400 text-sm">Read-only access to dashboards and reports</p>
                          </div>
                          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-semibold">2 users</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>View Dashboards
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>No Export
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>No Edit Access
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>No User Management
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API, PROMPTS TABS - COPY FROM ORIGINAL FILE, NO CHANGES */}

                {/* BILLING TAB - FIXED: PRO TIER REMOVED */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                      <p className="text-slate-400 mb-6">Manage your plan, usage, and billing details</p>

                      {/* Current Plan - ONLY FREE TIER NOW */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {/* Free Tier Card ONLY */}
                          <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700">
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                                CURRENT
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Free Tier</h4>
                            <div className="text-3xl font-bold text-purple-400 mb-4">$0<span className="text-lg text-slate-400">/month</span></div>
                            <ul className="space-y-2 mb-6">
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                40 prompts per scan
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                255-prompt library access
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Evidence reports & PDF export
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ASL-3 & EU AI Act compliance
                              </li>
                            </ul>
                            <button disabled className="w-full px-4 py-2 bg-slate-700 text-slate-500 rounded-lg font-medium cursor-not-allowed">
                              Current Plan
                            </button>
                          </div>
                          {/* PRO TIER CARD REMOVED */}
                        </div>
                      </div>

                      {/* Usage This Month */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400 mb-1">Scans Executed</div>
                            <div className="text-2xl font-bold text-white">12</div>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400 mb-1">Total Prompts</div>
                            <div className="text-2xl font-bold text-white">480</div>
                            <div className="text-xs text-slate-500">40 per scan</div>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400 mb-1">Evidence Reports</div>
                            <div className="text-2xl font-bold text-white">12</div>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="text-sm text-slate-400 mb-1">Infrastructure Cost</div>
                            <div className="text-2xl font-bold text-green-400">$0</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Comparison */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">💰 Cost Comparison vs Competitors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-green-300 mb-1">DefendML</div>
                          <div className="text-2xl font-bold text-white">$0-$5</div>
                          <div className="text-xs text-slate-400">per month</div>
                        </div>
                        <div className="text-center opacity-60">
                          <div className="text-sm text-slate-400 mb-1">F5 AI Red Team</div>
                          <div className="text-2xl font-bold text-slate-300">$15K-$30K</div>
                          <div className="text-xs text-slate-500">per month</div>
                        </div>
                        <div className="text-center opacity-60">
                          <div className="text-sm text-slate-400 mb-1">Lakera</div>
                          <div className="text-2xl font-bold text-slate-300">$10K-$20K</div>
                          <div className="text-xs text-slate-500">per month</div>
                        </div>
                        <div className="text-center opacity-60">
                          <div className="text-sm text-slate-400 mb-1">Microsoft PyRIT</div>
                          <div className="text-2xl font-bold text-slate-300">$20K-$40K</div>
                          <div className="text-xs text-slate-500">per month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* INTEGRATIONS, NOTIFICATIONS, ORGANIZATION TABS - COPY FROM ORIGINAL FILE, NO CHANGES */}
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
