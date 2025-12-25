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

                    {/* Quick Stats - UPDATED */}
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
                {/* RBAC Tab */}
                {activeTab === 'rbac' && (
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Access Control (RBAC)</h2>
                    <p className="text-slate-400 mb-6">Configure role-based access control and permissions</p>

                    <div className="space-y-4">
                      {/* Super Admin Role */}
                      <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-purple-300 mb-1">Super Admin</h3>
                            <p className="text-slate-400 text-sm">Full system access and management capabilities</p>
                          </div>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                            3 users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            All Resources
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Create/Edit/Delete
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Export Data
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Manage Users
                          </div>
                        </div>
                      </div>

                      {/* Security Analyst Role */}
                      <div className="border border-blue-500/30 bg-blue-500/5 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-blue-300 mb-1">Security Analyst</h3>
                            <p className="text-slate-400 text-sm">View security data and export reports</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                            7 users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            View All Data
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Export Reports
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            No Edit Access
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            No User Management
                          </div>
                        </div>
                      </div>

                      {/* Viewer Role */}
                      <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-300 mb-1">Viewer</h3>
                            <p className="text-slate-400 text-sm">Read-only access to dashboards and reports</p>
                          </div>
                          <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-semibold">
                            2 users
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            View Dashboards
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            No Export
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            No Edit Access
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            No User Management
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Configuration Tab - NEW */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">API Configuration</h2>
                      <p className="text-slate-400 mb-6">Manage API endpoints, rate limits, and infrastructure</p>

                      {/* API Endpoints */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Production Endpoints</h3>
                          <div className="space-y-3">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-300">Red Team API</span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">Live</span>
                              </div>
                              <code className="text-sm text-purple-400 font-mono">https://defendml-api.dsovan2004.workers.dev</code>
                              <div className="mt-2 flex gap-2">
                                <button className="text-xs text-purple-400 hover:text-purple-300">Copy</button>
                                <a href="https://defendml-api.dsovan2004.workers.dev" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                  Test <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>

                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-300">Main Endpoint</span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">Live</span>
                              </div>
                              <code className="text-sm text-purple-400 font-mono">/api/red-team/execute</code>
                              <p className="text-xs text-slate-400 mt-2">Executes red team attack scenarios against target AI systems</p>
                            </div>
                          </div>
                        </div>

                        {/* Rate Limits */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Rate Limits & Performance</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-purple-400" />
                                <span className="font-semibold text-white">Current Plan</span>
                              </div>
                              <div className="text-2xl font-bold text-white mb-1">Free Tier</div>
                              <div className="text-sm text-purple-300">40 prompts per scan</div>
                              <div className="text-xs text-slate-400 mt-2">Cloudflare Workers subrequest limit</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-orange-400" />
                                <span className="font-semibold text-white">Upgrade Available</span>
                              </div>
                              <div className="text-2xl font-bold text-white mb-1">$5/month</div>
                              <div className="text-sm text-orange-300">255 prompts per scan</div>
                              <button className="mt-3 w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all">
                                Upgrade Now
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Infrastructure Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Infrastructure</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="text-sm text-slate-400 mb-1">Backend</div>
                              <div className="font-semibold text-white">Cloudflare Workers</div>
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="text-sm text-slate-400 mb-1">Database</div>
                              <div className="font-semibold text-white">Supabase PostgreSQL</div>
                            </div>
                            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div className="text-sm text-slate-400 mb-1">Frontend</div>
                              <div className="font-semibold text-white">Cloudflare Pages</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Comparison */}
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-green-300 mb-1">
                            💰 Industry-Leading Cost Efficiency
                          </h4>
                          <p className="text-sm text-green-200/80">
                            DefendML: $0-$5/month vs F5 ($15K-$30K/month), Lakera ($10K-$20K/month), Microsoft PyRIT ($20K-$40K/month)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Prompt Library Tab - NEW */}
                {activeTab === 'prompts' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2">Prompt Library</h2>
                          <p className="text-slate-400">255 market-aligned attack scenarios with full compliance coverage</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-purple-400">255</div>
                          <div className="text-sm text-slate-400">Total Prompts</div>
                        </div>
                      </div>

                      {/* Framework Coverage */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Compliance Coverage</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 text-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">OWASP</div>
                            <div className="text-xs text-green-300">100% (10/10)</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 text-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">NIST AI RMF</div>
                            <div className="text-xs text-green-300">100% (7/7)</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 text-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">MITRE ATLAS</div>
                            <div className="text-xs text-green-300">95% (38/40)</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 text-center">
                            <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">ASL-3</div>
                            <div className="text-xs text-green-300">100%</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 text-center">
                            <CheckCircle2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <div className="text-sm font-semibold text-white">EU AI Act</div>
                            <div className="text-xs text-purple-300">100%</div>
                          </div>
                        </div>
                      </div>

                      {/* Prompt Breakdown */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Attack Categories</h3>
                        <div className="space-y-3">
                          {[
                            { category: 'Constitutional Violations (Jailbreaks)', count: 40, color: 'red' },
                            { category: 'Deployment Standard (CBRN/WMD)', count: 35, color: 'orange' },
                            { category: 'Security Standard (Cybersecurity)', count: 30, color: 'yellow' },
                            { category: 'PII & Data Extraction', count: 35, color: 'blue' },
                            { category: 'Bias & Fairness (incl. Biometric)', count: 30, color: 'purple', badge: 'EU AI Act Art. 5' },
                            { category: 'Model Manipulation', count: 20, color: 'green' },
                            { category: 'Multi-turn Sequences', count: 20, color: 'cyan' },
                            { category: 'Misinformation', count: 15, color: 'pink' },
                            { category: 'Adversarial Robustness', count: 15, color: 'indigo' },
                            { category: 'System Prompt Extraction', count: 15, color: 'teal' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white">{item.category}</span>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold border border-purple-500/30">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
                                  <div 
                                    className={`bg-${item.color}-500 h-2 rounded-full`} 
                                    style={{ width: `${(item.count / 40) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="ml-6 text-right">
                                <div className="text-2xl font-bold text-white">{item.count}</div>
                                <div className="text-xs text-slate-400">prompts</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-slate-400">Library Version</div>
                            <div className="font-semibold text-white">v1.0</div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-400">Last Updated</div>
                            <div className="font-semibold text-white">2025-12-24</div>
                          </div>
                          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
                            Export Library
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Competitive Advantage */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-purple-300 mb-1">
                            🎯 Industry-Leading Prompt Library
                          </h4>
                          <p className="text-sm text-purple-200/80">
                            DefendML: 255 prompts | F5: ~120 | Lakera: ~100 | Microsoft PyRIT: ~150
                          </p>
                          <p className="text-sm text-purple-200/80 mt-1">
                            <strong>ONLY service with public EU AI Act Article 5 compliance testing</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing & Subscription Tab - NEW */}
                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                      <p className="text-slate-400 mb-6">Manage your plan, usage, and billing details</p>

                      {/* Current Plan */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Plan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Free Tier Card */}
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

                          {/* Paid Tier Card */}
                          <div className="relative p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border-2 border-purple-500/50">
                            <div className="absolute top-4 right-4">
                              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">
                                RECOMMENDED
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Pro Tier</h4>
                            <div className="text-3xl font-bold text-purple-400 mb-4">$5<span className="text-lg text-slate-400">/month</span></div>
                            <ul className="space-y-2 mb-6">
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                <strong>255 prompts per scan</strong> (6x more coverage)
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                Full library execution
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                Priority support
                              </li>
                              <li className="flex items-center gap-2 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                                Advanced analytics
                              </li>
                            </ul>
                            <button className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
                              Upgrade to Pro
                            </button>
                          </div>
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
                {/* Integrations Tab */}
                {activeTab === 'integrations' && (
                  <div className="space-y-4">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
                      <p className="text-slate-400 mb-6">Connect DefendML with your existing tools and workflows</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Slack Integration */}
                        <div className="border border-slate-700 rounded-lg p-6 hover:border-purple-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <Slack className="w-6 h-6 text-purple-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white">Slack</h3>
                                <p className="text-slate-400 text-sm">Real-time alerts</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                              Connected
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">Send threat alerts to #security-alerts channel</p>
                          <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all font-medium">
                            Configure
                          </button>
                        </div>

                        {/* Google Workspace */}
                        <div className="border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white">Google Workspace</h3>
                                <p className="text-slate-400 text-sm">SSO & Identity</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-semibold border border-slate-600">
                              Not Connected
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">Enable single sign-on with Google Workspace</p>
                          <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium">
                            Connect
                          </button>
                        </div>

                        {/* Jira */}
                        <div className="border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-blue-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white">Jira</h3>
                                <p className="text-slate-400 text-sm">Ticket creation</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-semibold border border-slate-600">
                              Not Connected
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">Auto-create tickets for critical threats</p>
                          <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all font-medium">
                            Setup
                          </button>
                        </div>

                        {/* PagerDuty */}
                        <div className="border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition-all">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <Bell className="w-6 h-6 text-orange-400" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white">PagerDuty</h3>
                                <p className="text-slate-400 text-sm">Incident management</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-semibold border border-slate-600">
                              Not Connected
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-4">Trigger incidents for critical security events</p>
                          <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all font-medium">
                            Setup
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Integration Stats */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Plug className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-purple-300 mb-1">
                            🔥 DefendML's Killer Feature: Multi-Integration Support
                          </h4>
                          <p className="text-sm text-purple-200/80">
                            Unlike CalypsoAI (no Slack), Lakera (limited integrations), DefendML connects to your entire security stack out of the box.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Notification Settings</h2>
                    <p className="text-slate-400 mb-6">Configure alert rules and notification channels</p>

                    <div className="space-y-6">
                      {/* Alert Rules */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Alert Rules</h3>
                        <div className="space-y-3">
                          {[
                            { name: 'Critical Threats', description: 'Notify immediately for critical security threats', enabled: true },
                            { name: 'PII Leaks', description: 'Alert when PII data is detected in prompts', enabled: true },
                            { name: 'Policy Violations', description: 'Notify on policy violation attempts', enabled: true },
                            { name: 'Daily Summary', description: 'Receive daily security summary report', enabled: false },
                          ].map((rule, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                              <div>
                                <div className="font-medium text-white">{rule.name}</div>
                                <div className="text-sm text-slate-400">{rule.description}</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked={rule.enabled} />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notification Channels */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Notification Channels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                              <Mail className="w-5 h-5 text-blue-400" />
                              <span className="font-medium text-white">Email</span>
                            </div>
                            <p className="text-sm text-slate-400">security@company.com</p>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                              <Slack className="w-5 h-5 text-purple-400" />
                              <span className="font-medium text-white">Slack</span>
                            </div>
                            <p className="text-sm text-slate-400">#security-alerts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Organization Tab */}
                {activeTab === 'organization' && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Organization Settings</h2>
                      <p className="text-slate-400 mb-6">Manage your company profile and compliance certifications</p>

                      <div className="space-y-6">
                        {/* Company Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Workspace Name</label>
                              <input
                                type="text"
                                defaultValue="DefendML Production"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Industry</label>
                              <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option>Technology</option>
                                <option>Finance</option>
                                <option>Healthcare</option>
                                <option>Other</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Compliance Standards - UPDATED */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Compliance Standards</h3>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                              <div className="text-xs font-semibold text-green-300">OWASP</div>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                              <div className="text-xs font-semibold text-green-300">NIST</div>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 text-center">
                              <CheckCircle2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                              <div className="text-xs font-semibold text-purple-300">EU AI Act</div>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                              <div className="text-xs font-semibold text-green-300">ASL-3</div>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
                              <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-1" />
                              <div className="text-xs font-semibold text-green-300">MITRE</div>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-slate-400">Prompt Library Version</div>
                                <div className="font-semibold text-white">255 prompts (v1.0)</div>
                              </div>
                              <div>
                                <div className="text-sm text-slate-400">Last Updated</div>
                                <div className="font-semibold text-white">2025-12-24</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* API Keys */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">API Keys</h3>
                          <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-purple-400" />
                                <span className="font-medium text-white">Production API Key</span>
                              </div>
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-semibold">Active</span>
                            </div>
                            <code className="block text-sm text-slate-400 font-mono">sk_prod_••••••••••••••••••••1234</code>
                            <div className="flex gap-2 mt-3">
                              <button className="text-sm text-purple-400 hover:text-purple-300">Regenerate</button>
                              <button className="text-sm text-slate-400 hover:text-slate-300">Copy</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-500/5 rounded-xl border border-red-500/30 p-6">
                      <h3 className="text-lg font-semibold text-red-300 mb-2">Danger Zone</h3>
                      <p className="text-slate-400 text-sm mb-4">Irreversible and destructive actions</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-red-500/30">
                          <div>
                            <div className="font-medium text-white">Reset All Data</div>
                            <div className="text-sm text-slate-400">Clear all logs, threats, and analytics data</div>
                          </div>
                          <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 transition-all font-medium">
                            Reset
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-red-500/30">
                          <div>
                            <div className="font-medium text-white">Delete Organization</div>
                            <div className="text-sm text-slate-400">Permanently delete your organization and all data</div>
                          </div>
                          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-medium">
                            Delete
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
