<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DefendML - Dashboard Overview (ASL-3 Enhanced)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background: #000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>
</head>
<body class="bg-black text-white min-h-screen">
    <!-- Navigation (Simplified) -->
    <nav class="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        DefendML
                    </span>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header with ASL-3 Badge -->
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold">Dashboard Overview</h1>
                <span class="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-semibold rounded-full">
                    ASL-3 CERTIFIED
                </span>
            </div>
            <p class="text-slate-400">Real-time AI security monitoring with Anthropic ASL-3 standards</p>
        </div>

        <!-- ASL-3 Compliance Status Widget -->
        <div class="mb-8 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/30">
            <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">ASL-3 Compliance Status</h2>
                        <p class="text-sm text-slate-400">Anthropic Safety Level 3 Framework</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 rounded-full border text-green-400 bg-green-500/20 border-green-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span class="font-semibold text-sm">COMPLIANT</span>
                </div>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <div class="text-2xl font-bold text-purple-400 mb-1">99.6%</div>
                    <div class="text-xs text-slate-400">Classifier Accuracy</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <div class="text-2xl font-bold text-purple-400 mb-1">4/4</div>
                    <div class="text-xs text-slate-400">Defense Layers Active</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <div class="text-2xl font-bold text-purple-400 mb-1">2.8s</div>
                    <div class="text-xs text-slate-400">Incident Response</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <div class="text-2xl font-bold text-purple-400 mb-1">0.3%</div>
                    <div class="text-xs text-slate-400">False Positive Rate</div>
                </div>
                <div class="bg-black/40 rounded-lg p-4 border border-purple-500/20">
                    <div class="text-2xl font-bold text-green-400 mb-1">96.5%</div>
                    <div class="text-xs text-slate-400">Overall ASL-3 Score</div>
                </div>
            </div>

            <!-- Info Footer -->
            <div class="mt-4 pt-4 border-t border-purple-500/20">
                <p class="text-sm text-slate-400">
                    ASL-3 certification ensures constitutional AI alignment, multi-layer defense architecture, and transparent threat detection.
                    <a href="#" class="text-purple-400 hover:text-purple-300 ml-2 font-semibold">View Details →</a>
                </p>
            </div>
        </div>

        <!-- Top KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Security</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">1,247</div>
                <div class="text-slate-300 text-sm font-medium mb-1">Threats Blocked</div>
                <div class="text-slate-400 text-xs">Prompt injections + jailbreaks</div>
            </div>

            <div class="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Privacy</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">3,891</div>
                <div class="text-slate-300 text-sm font-medium mb-1">PII Instances Redacted</div>
                <div class="text-slate-400 text-xs">SSN, credit cards, emails</div>
            </div>

            <div class="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">Compliance</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">98.5%</div>
                <div class="text-slate-300 text-sm font-medium mb-1">Compliance Score</div>
                <div class="text-slate-400 text-xs">SOC 2, ISO 27001, GDPR</div>
            </div>
        </div>

        <!-- Bottom Competitive Advantage Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-black rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">ROI</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">$48,750</div>
                <div class="text-slate-300 text-sm font-medium mb-1">Annual Savings</div>
                <div class="text-slate-400 text-xs">vs. Lakera/CalypsoAI ($50K-60K/yr)</div>
            </div>

            <div class="bg-black rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">Interop</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">4+</div>
                <div class="text-slate-300 text-sm font-medium mb-1">LLM Providers</div>
                <div class="text-slate-400 text-xs">OpenAI, Anthropic, AWS, Azure</div>
            </div>

            <div class="bg-black rounded-2xl p-6 border border-gray-800 hover:border-green-500/50 transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <span class="text-xs font-semibold text-green-300 bg-green-500/20 px-3 py-1 rounded-full">Speed</span>
                </div>
                <div class="text-4xl font-bold text-white mb-2">45ms</div>
                <div class="text-slate-300 text-sm font-medium mb-1">Avg Latency (P95)</div>
                <div class="text-slate-400 text-xs">5x faster than CalypsoAI</div>
            </div>
        </div>

        <!-- Live Threat Feed -->
        <div class="mt-8 bg-slate-900 rounded-2xl p-6 border border-gray-800">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Live Threat Feed
                    <span class="text-xs text-slate-500 font-normal">(real-time)</span>
                </h2>
                <a href="#" class="text-purple-400 hover:text-purple-300 text-sm font-semibold">
                    View All Threats →
                </a>
            </div>
            <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div>
                            <div class="font-medium text-white">Prompt Injection</div>
                            <div class="text-xs text-slate-500">Detected 2m ago • Confidence: 98.0%</div>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">HIGH</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <div>
                            <div class="font-medium text-white">PII Leak Attempt</div>
                            <div class="text-xs text-slate-500">Detected 5m ago • Confidence: 95.0%</div>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">CRITICAL</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div>
                            <div class="font-medium text-white">Jailbreak Attempt</div>
                            <div class="text-xs text-slate-500">Detected 12m ago • Confidence: 99.0%</div>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">HIGH</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-black rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div>
                            <div class="font-medium text-white">Data Exfiltration</div>
                            <div class="text-xs text-slate-500">Detected 18m ago • Confidence: 87.0%</div>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400">MEDIUM</span>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-800 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center text-slate-500 text-sm">
                © 2024 DefendML. ASL-3 Certified AI Security Platform.
            </div>
        </div>
    </footer>
</body>
</html>
