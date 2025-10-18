<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DefendML - ASL-3 Compliance Status</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: #020617;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .animate-pulse {
            animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="bg-slate-950 text-white min-h-screen">
    <!-- Full Navigation -->
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center gap-6">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <span class="text-xl font-bold text-white">DefendML</span>
                    </div>
                    <span class="px-2 py-1 bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-semibold rounded">ASL-3 Powered</span>
                </div>
                
                <div class="flex items-center gap-4 text-sm">
                    <a href="#" class="text-slate-400 hover:text-white">Overview</a>
                    <a href="#" class="text-slate-400 hover:text-white">Threats</a>
                    <a href="#" class="text-slate-400 hover:text-white">PII Protection</a>
                    <a href="#" class="text-slate-400 hover:text-white">Compliance</a>
                    <a href="#" class="text-slate-400 hover:text-white">Health</a>
                    <a href="#" class="text-slate-400 hover:text-white">Usage</a>
                    <a href="#" class="text-slate-400 hover:text-white">Audit</a>
                    <a href="#" class="text-slate-400 hover:text-white">Settings</a>
                    <button class="px-4 py-2 bg-purple-600 rounded-lg font-medium ml-4">Admin</button>
                    <button class="px-4 py-2 bg-purple-600 rounded-lg font-medium">Logout</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header Section -->
    <div class="border-b border-slate-800 bg-slate-900">
        <div class="max-w-7xl mx-auto px-8 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold text-white mb-2">ASL-3 Compliance Status</h1>
                    <p class="text-slate-400">Anthropic Safety Level 3 Framework - Real-time monitoring</p>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 rounded-full border text-green-400 bg-green-500/20 border-green-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span class="font-semibold text-sm">COMPLIANT</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-8 py-8 space-y-8">
        <!-- Overall Compliance Scorecard -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
                <div class="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <div>
                        <h2 class="text-xl font-bold text-white">Deployment Standard</h2>
                        <p class="text-sm text-slate-400">Prevent misuse & harm</p>
                    </div>
                </div>
                <div class="text-5xl font-bold text-purple-400 mb-2">98.0%</div>
                <div class="text-slate-300 text-sm">Constitutional classifiers, 4-layer defense, rapid response</div>
            </div>

            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
                <div class="flex items-center gap-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <div>
                        <h2 class="text-xl font-bold text-white">Security Standard</h2>
                        <p class="text-sm text-slate-400">Protect model weights</p>
                    </div>
                </div>
                <div class="text-5xl font-bold text-blue-400 mb-2">94.0%</div>
                <div class="text-slate-300 text-sm">Multi-party auth, encryption, egress monitoring, insider threat detection</div>
            </div>
        </div>

        <!-- Constitutional Classifiers Section -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">Constitutional Classifiers</h2>
                        <p class="text-sm text-slate-400">Real-time input/output monitoring</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border-green-500/50">
                    <div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                    ACTIVE
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="text-2xl font-bold text-purple-400 mb-1">99.6%</div>
                    <div class="text-xs text-slate-400">Accuracy</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="text-2xl font-bold text-purple-400 mb-1">42ms</div>
                    <div class="text-xs text-slate-400">Latency (P95)</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="text-2xl font-bold text-purple-400 mb-1">0.3%</div>
                    <div class="text-xs text-slate-400">False Positive Rate</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="text-2xl font-bold text-purple-400 mb-1">847</div>
                    <div class="text-xs text-slate-400">Blocked (24h)</div>
                </div>
            </div>

            <div class="border-t border-slate-800 pt-4">
                <h3 class="text-sm font-semibold text-slate-300 mb-3">Top Triggered Rules:</h3>
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-400">• CBRN-related queries</span>
                        <span class="text-sm font-semibold text-purple-400">45%</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-400">• Jailbreak attempts</span>
                        <span class="text-sm font-semibold text-purple-400">32%</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-400">• Policy violations</span>
                        <span class="text-sm font-semibold text-purple-400">23%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4-Layer Defense Visualization -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-white">4-Layer Defense Architecture</h2>
                    <p class="text-sm text-slate-400">Defense-in-depth security model</p>
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-black/40 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <span class="text-lg font-bold text-purple-400">L1</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Access Controls</h3>
                                <p class="text-xs text-slate-400">Tier-based permissions, MFA, API restrictions</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border-green-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            ACTIVE
                        </div>
                    </div>
                </div>

                <div class="bg-black/40 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <span class="text-lg font-bold text-purple-400">L2</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Real-Time Classifiers</h3>
                                <p class="text-xs text-slate-400">Input/output classification, constitutional AI rules</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border-green-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            ACTIVE
                        </div>
                    </div>
                </div>

                <div class="bg-black/40 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <span class="text-lg font-bold text-purple-400">L3</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Async Monitoring</h3>
                                <p class="text-xs text-slate-400">Pattern detection, multi-turn attacks, anomalies</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border-green-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            ACTIVE
                        </div>
                    </div>
                </div>

                <div class="bg-black/40 rounded-lg p-5 border border-slate-700 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <span class="text-lg font-bold text-purple-400">L4</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">Rapid Response</h3>
                                <p class="text-xs text-slate-400">Automated incidents, &lt;5min response, remediation</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/20 border-green-500/50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            ACTIVE
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Security Standard Compliance -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-white">Security Standard Compliance</h2>
                    <p class="text-sm text-slate-400">Model weight protection & access controls</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="text-sm text-slate-300">Multi-party Authorization</span>
                    </div>
                    <span class="text-xs font-semibold text-green-400">ENABLED</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="text-sm text-slate-300">Model Weight Encryption</span>
                    </div>
                    <span class="text-xs font-semibold text-green-400">AES-256</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="text-sm text-slate-300">Egress Monitoring</span>
                    </div>
                    <span class="text-xs font-semibold text-green-400">ACTIVE</span>
                </div>

                <div class="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-700">
                    <div class="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span class="text-sm text-slate-300">Insider Threat Detection</span>
                    </div>
                    <span class="text-xs font-semibold text-green-400">ACTIVE</span>
                </div>
            </div>
        </div>

        <!-- Red Team & Bug Bounty -->
        <div class="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                </div>
                <div>
                    <h2 class="text-xl font-bold text-white">Red Team & Bug Bounty Program</h2>
                    <p class="text-sm text-slate-400">External security validation</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold text-white mb-1">3</div>
                    <div class="text-xs text-slate-400">Active Programs</div>
                </div>

                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold text-white mb-1">2</div>
                    <div class="text-xs text-slate-400">Vulnerabilities (30d)</div>
                </div>

                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold text-white mb-1">4.5</div>
                    <div class="text-xs text-slate-400">Avg Remediation (days)</div>
                </div>

                <div class="bg-black/40 rounded-lg p-4 border border-slate-700">
                    <div class="flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="text-2xl font-bold text-white mb-1">$87K</div>
                    <div class="text-xs text-slate-400">Total Bounties Paid</div>
                </div>
            </div>
        </div>

        <!-- Info Banner -->
        <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
                <div class="text-blue-300 font-semibold text-sm mb-1">ASL-3 Certification</div>
                <div class="text-blue-200/80 text-sm">
                    DefendML is the first LLM security platform to achieve full ASL-3 compliance, meeting Anthropic's industry-leading safety standards for advanced AI systems.
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 mt-16">
        <div class="max-w-7xl mx-auto px-8 py-8">
            <div class="flex items-center justify-between">
                <div class="text-slate-500 text-sm">© 2025 DefendML</div>
                <div class="flex items-center gap-6 text-sm text-slate-400">
                    <a href="#" class="hover:text-white">Privacy Policy</a>
                    <a href="#" class="hover:text-white">Terms of Service</a>
                    <a href="#" class="hover:text-white">API Docs</a>
                    <a href="#" class="hover:text-white">Status</a>
                </div>
                <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-2 text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        SOC 2 Certified
                    </div>
                    <div class="flex items-center gap-2 text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Powered by Anthropic ASL-3
                    </div>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
