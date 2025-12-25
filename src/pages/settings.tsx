import React from 'react';
import { CreditCard, CheckCircle2, Activity, TrendingUp, Zap, DollarSign } from 'lucide-react';

export default function BillingTab() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
        <p className="text-slate-400 mb-6">Manage your plan, usage, and billing details</p>

        {/* Pilot Program Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pilot Program Status</h3>
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border-2 border-purple-500/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-1">DefendML Pilot Program</h4>
                <p className="text-purple-200/80 text-sm">
                  You're currently running DefendML on our pilot infrastructure. No subscription required yet.
                </p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30 flex-shrink-0">
                ACTIVE
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                <div className="text-sm text-purple-300 mb-1">Program Type</div>
                <div className="font-semibold text-white">Free Pilot Access</div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                <div className="text-sm text-purple-300 mb-1">Your Cost</div>
                <div className="font-semibold text-white">$0/month</div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                <div className="text-sm text-purple-300 mb-1">Full Access To</div>
                <div className="font-semibold text-white">255-prompt library</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-200/90">
                💡 <strong>Future Pricing:</strong> When DefendML launches paid pilots, pricing will be $2,500 per pilot customer (not monthly subscriptions). This gives you audit-grade evidence and comprehensive attack coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Infrastructure Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Infrastructure Cost (Internal)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Infrastructure */}
            <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h4 className="font-bold text-white">Current Infrastructure</h4>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold border border-green-500/30">
                  ACTIVE
                </span>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">$0<span className="text-lg text-slate-400">/month</span></div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Cloudflare Workers (Free Tier)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  40 prompts per scan
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  50 subrequest limit
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Full library access (255 prompts)
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs text-green-200/80">
                  ✅ Perfect for pilot testing and demos
                </p>
              </div>
            </div>

            {/* Optional Upgrade */}
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                  <h4 className="font-bold text-white">Infrastructure Upgrade</h4>
                </div>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold border border-orange-500/30">
                  OPTIONAL
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-400 mb-2">$5<span className="text-lg text-slate-400">/month</span></div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  Cloudflare Workers (Paid)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <strong>255 prompts per scan</strong>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  1000 subrequest limit
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  Run entire library per scan
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all mb-3">
                Upgrade Infrastructure
              </button>
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <p className="text-xs text-orange-200/80">
                  💡 Only upgrade if you need all 255 prompts per scan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage This Month */}
        <div className="mb-6">
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

        {/* What Customers Actually Pay */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Pricing (Future)</h3>
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Paid Pilot Program</h4>
                <p className="text-purple-200/80 text-sm mb-3">
                  When DefendML launches paid pilots, customers will pay a <strong>one-time $2,500 fee</strong> for comprehensive red team testing and audit-grade evidence reports.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-purple-500/20">
                    <div className="text-xs text-purple-300 mb-1">Pilot Fee</div>
                    <div className="font-bold text-white">$2,500</div>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-purple-500/20">
                    <div className="text-xs text-purple-300 mb-1">Target</div>
                    <div className="font-bold text-white">3-5 customers</div>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-lg border border-purple-500/20">
                    <div className="text-xs text-purple-300 mb-1">Deliverable</div>
                    <div className="font-bold text-white">Audit Reports</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Comparison vs Competitors */}
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
        <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm text-green-200/90">
            ⚡ <strong>DefendML's infrastructure cost advantage:</strong> We run on $0-$5/month while competitors charge $10K-$40K/month for similar capabilities. This lets us offer pilot pricing at $2,500 one-time fee vs their ongoing subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
}
