// src/pages/admin/targets.tsx
"use client";

import React from "react";
import Navigation from "../../components/Navigation";

export default function TargetsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Targets
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl">
              Systems, models, and surfaces under test.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700"
              disabled
              title="Coming soon"
            >
              Import Targets
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium border border-purple-500/50"
              disabled
              title="Coming soon"
            >
              Add Target
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">Target List</h2>
            <p className="mt-2 text-slate-300">
              No targets yet. Add a target to start running scans.
            </p>

            <div className="mt-4 rounded-lg border border-dashed border-slate-700 p-6 text-slate-300">
              <div className="text-sm">
                Coming soon:
                <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-400">
                  <li>Target types: API endpoint, chat UI, internal agent</li>
                  <li>Auth methods: key header, OAuth token, session cookie</li>
                  <li>Environment tags: prod, staging, dev</li>
                  <li>Rate limits + scan scheduling</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-white">How Targets Work</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white">1) Add a target</div>
                <div className="mt-1 text-slate-400">
                  Define where your model or agent is reachable (URL, app, or integration).
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white">2) Run a scan</div>
                <div className="mt-1 text-slate-400">
                  Execute red team scenarios against the selected target.
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
                <div className="font-medium text-white">3) Export reports</div>
                <div className="mt-1 text-slate-400">
                  Generate evidence for audits, customers, and internal reviews.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
