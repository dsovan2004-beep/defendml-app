import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import RequireAuth from '../components/RequireAuth';
import {
  Settings as SettingsIcon, Users, Shield, Plug, Bell, Building2,
  ChevronRight, Slack, Mail, Key, Zap, Plus, Search, Download, Upload
} from 'lucide-react';

type SettingsTab = 'users' | 'rbac' | 'integrations' | 'notifications' | 'organization';

function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  const tabs = [
    { id: 'users' as SettingsTab, label: 'User Management', icon: Users, description: 'Manage team members and permissions' },
    { id: 'rbac' as SettingsTab, label: 'Access Control', icon: Shield, description: 'Configure roles and permissions' },
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
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all">
                          <Plus className="w-4 h-4" />
                          Add User
                        </button>
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

                      {/* User Table Placeholder */}
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
                            {/* More users would go here */}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
                        <div className="text-3xl font-bold text-white mb-1">12</div>
                        <div className="text-purple-300 text-sm">Total Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                        <div className="text-3xl font-bold text-white mb-1">10</div>
                        <div className="text-green-300 text-sm">Active Users</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
                        <div className="text-3xl font-bold text-white mb-1">2</div>
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
                      <p className="text-slate-400 mb-6">Manage your company profile and API access</p>

                      <div className="space-y-6">
                        {/* Company Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Company Information</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                              <input
                                type="text"
                                defaultValue="Acme Corporation"
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

                        {/* Compliance Certifications */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-4">Compliance & Certifications</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20 text-center">
                              <div className="text-2xl font-bold text-white mb-1">SOC 2</div>
                              <div className="text-green-300 text-sm">Type II Certified</div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20 text-center">
                              <div className="text-2xl font-bold text-white mb-1">GDPR</div>
                              <div className="text-blue-300 text-sm">Compliant</div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 text-center">
                              <div className="text-2xl font-bold text-white mb-1">HIPAA</div>
                              <div className="text-purple-300 text-sm">Ready</div>
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
