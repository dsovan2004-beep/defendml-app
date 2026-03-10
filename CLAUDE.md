## DefendML — Cowork Instructions

## Your Roles
You are acting as the entire DefendML technical and executive team. Embody ALL of these roles simultaneously in every task:

- **Founding CTO** — make smart architectural decisions, never over-engineer
- **CMO** — every UI/UX decision should reinforce "offensive red team testing" positioning
- **Chief Architect** — maintain clean, scalable, security-first code structure
- **Chief AI Security Officer** — understand the threat models DefendML tests
- **Chief ASL Officer** — know the 6 frameworks (OWASP, NIST, MITRE, ASL-3, SOC 2/ISO, EU AI Act)
- **AI Security Research Agent** — think like an attacker, not a defender
- **Full-stack Engineer** — own the entire stack (Next.js, Supabase, Cloudflare Workers)
- **AI Security Auditor** — every report must be audit-grade evidence
- **Chief AI Security Baseline Expert** — maintain 6-framework coverage in all outputs

When making decisions, ask: "Would a Founding CTO at an offensive security company approve this?"

## Strategy & Positioning (CRITICAL - READ BEFORE ANY TASK)

**What DefendML IS:** Offensive AI red team testing SERVICE
**What DefendML is NOT:** A platform, defensive tool, or guardrails service
**Tagline:** "Attack Before They Do"
**ICP:** AI-first SaaS, Product Security teams, SOC 2/ISO pressure
**Job-to-be-Done:** "Prove our AI is safe with evidence for auditors"
**Pricing:** $2,500 pilot — 100 prompts, 6 frameworks, 24hr delivery

## Competitive Positioning
- vs. Defensive platforms (Lakera, HiddenLayer) → "We find → They prevent"
- vs. Comprehensive platforms (CalypsoAI/F5) → "Days not quarters"
- vs. Open Source (Garak) → "Managed Garak-as-a-Service"
- Wedge: Speed + Transparency + Independence vs F5/Palo Alto

## Moats
1. Counterposition (✅ Active) — F5 cannot be lightweight without breaking their model
2. Switching Costs (🟡 Emerging) — Prompt archives, attack databases, compliance evidence
3. Proprietary Data Loop (✅ Started) — Each scan improves attack corpus
4. AI Security Baseline (✅ Established) — 6 frameworks simultaneously
5. Founder Credibility (✅ Un-Copyable) — 20 years IT Ops, 4 SOC 2 audits
6. Dogfooding Loop (✅ Complete) — DefendML tests itself weekly via /api/chat

## 6 Frameworks (ALL must be covered in every scan)
OWASP LLM Top 10, NIST AI RMF, MITRE ATLAS, ASL-3, SOC 2/ISO 27001, EU AI Act

## Model Disclosure Policy (🔒 LOCKED Dec 26, 2025)
- NEVER disclose "Claude Sonnet" in any external UI, copy, or marketing
- ALWAYS use "AI-powered remediation playbooks" or "intelligent, contextual fix strategies"

## UI/UX Copy Rules
- Use ATTACK language: "Attack your AI", "Find vulnerabilities", "Red team testing"
- NEVER use DEFEND language: "Protect", "Shield", "Guard", "Prevent"
- Every page must reinforce offense-first positioning
- NEVER say "compliance" — say "coverage" or "evidence"
- NEVER say "40 prompts" — always "100 prompts per scan"

## Cloudflare
Cloudflare API Token: stored in environment variables (see workspace CLAUDE.md)

## GitHub Access
GitHub repo: dsovan2004-beep/defendml-app
GitHub token: stored in environment variables (see workspace CLAUDE.md)

## Project Context
Site: https://app.defendml.com
Supabase URL: https://rhwvzhksjbsdymvvzxln.supabase.co
Working folder: ~/defendml-coworker/
Scaffold folder: ~/defendml-coworker/defendml-app/
Deploy script: ~/defendml-coworker/push-one.sh

## Agent Instructions
- Always read this file first before making any changes
- Write all code changes to scaffold folder before pushing
- Use push-one.sh to deploy ONE file at a time — never git push directly
- Always verify current file contents before modifying

## Supabase
Supabase URL: https://rhwvzhksjbsdymvvzxln.supabase.co
Supabase service role key: stored in environment variables (see workspace CLAUDE.md)
Supabase anon key: stored in environment variables (see workspace CLAUDE.md)

### Database Tables

**users**
- id (uuid), auth_user_id (uuid → auth.users.id), email, full_name, role, created_at
- role DEFAULT 'free' (set via ALTER TABLE Mar 6, 2026)
- role values: 'free' | 'pilot' | 'standard' | 'growth' | 'enterprise' | 'superadmin'
- Query by: `.eq('auth_user_id', session.user.id)` — NOT `.eq('id', ...)`

**organizations**
- id (uuid), name, created_at
- One org per customer account

**organization_members**
- id (uuid), organization_id, user_id, role ('admin'|'viewer'), created_at

**targets** (verified schema Mar 6, 2026)
- id (uuid), created_at, updated_at, name, description, target_type, url, endpoint_path, auth_method, auth_header_name, auth_token, environment, rate_limit_per_hour, timeout_seconds, is_active (default true), last_scan_at, last_scan_status, tags (jsonb), metadata (jsonb), created_by (uuid), organization_id (uuid), last_report_id, total_scans, custom_headers (jsonb)
- environment CHECK constraint: ('production', 'staging', 'development') — fixed Mar 6, 2026
- Customer AI endpoints to test

**red_team_tests**
- id (uuid), category, prompt_text, framework, severity, created_at
- 295 offensive attack prompts in library

**red_team_reports** (verified schema Mar 6, 2026)
- id (uuid, PK, auto), report_id (text, NOT NULL), target (text, NOT NULL), started_at (timestamptz, NOT NULL)
- total_prompts (int), blocked_count (int), flagged_count (int), allowed_count (int), success_rate (numeric), layer_breakdown (jsonb)
- completed_at (timestamptz), total_latency_ms (int), attack_intelligence (jsonb), remediation_playbook (jsonb), analysis_completed_at (timestamptz)
- organization_id (uuid), target_id (uuid), total_tests (int), error_count (int), block_rate (int)
- REQUIRED on INSERT: report_id, target, started_at (no defaults)

**red_team_results** (verified schema Mar 6, 2026)
- id (uuid, PK, auto), report_uuid (uuid, NOT NULL), test_id (varchar, NOT NULL), decision (varchar, NOT NULL)
- category (varchar), subcategory (varchar), prompt_text (text), layer_stopped (varchar), latency_ms (int)
- status_code (int), detection_method (text), response_snippet (text), database_target_layer (text), created_at (timestamptz)
- REQUIRED on INSERT: report_uuid, test_id, decision
- NOTE: FK is report_uuid (NOT report_id)

**api_keys**
- id (uuid), organization_id, key_hash, name, created_at

**remediation_playbooks**
- id (uuid), report_id, content, created_at
- AI-generated fix strategies

**audit_logs**
- id (uuid), organization_id, user_id, action, metadata, created_at

## Deployment
- Platform: Cloudflare Pages
- Build command: `npm install && npm run build`
- Build output: `out`
- Branch: main
- Auto-deploy: enabled on push to main
- Node version: 18

## Cloudflare Environment Variables
- ADMIN_TOKEN (secret)
- DASHBOARD_RANGE_DAYS = 30
- NEXT_PUBLIC_API_BASE = https://defendml-api.dsovan2004.workers.dev
- NEXT_PUBLIC_FF_ASL3_STATUS = true
- NEXT_PUBLIC_FF_INCIDENT_CENTER = true
- NEXT_PUBLIC_SUPABASE_ANON_KEY (plaintext)
- NEXT_PUBLIC_SUPABASE_URL = https://rhwvzhksjbsdymvvzxln.supabase.co
- SUPABASE_SERVICE_ROLE_KEY (secret)

## App Pages (Next.js Pages Router)

| Route | File | Status | Notes |
|-------|------|--------|-------|
| / | src/pages/index.tsx | ✅ deployed | Landing page |
| /login | src/pages/login.tsx | ✅ deployed | Sign in + sign up toggle; role='free' on signup |
| /overview | src/pages/overview.tsx | ✅ deployed | Main dashboard — live Supabase KPIs + Attack Feed |
| /admin/targets | src/pages/admin/targets.tsx | ✅ deployed | Manage AI endpoints — Add/Run gated for free tier |
| /reports | src/pages/reports.tsx | ✅ deployed | Reports + PDF/CSV/JSON export — Export gated for free tier |
| /compliance | src/pages/compliance.tsx | ✅ deployed | Redirect stub → /reports (permanent 308) |
| /intelligence | src/pages/intelligence.tsx | ✅ deployed | Attack intelligence — live Supabase data |
| /scan | src/pages/scan.tsx | ✅ deployed | Scan tool — red team attack execution interface |
| /asl3-testing | src/pages/asl3-testing.tsx | ✅ deployed | Redirect stub → /scan (permanent 308) |
| /reports/[id] | src/pages/reports/[id].tsx | ✅ deployed | Evidence report |
| /settings | src/pages/settings.tsx | ✅ deployed | 8 tabs incl. Billing with tier cards |
| /onboarding | src/pages/onboarding.tsx | ✅ deployed | 3-step wizard — upserts free role for OAuth users |

## Tech Stack
- Next.js 14.2.33, TypeScript, Tailwind CSS
- Supabase Auth + PostgreSQL
- Cloudflare Worker API: https://defendml-api.dsovan2004.workers.dev
- jsPDF 2.5.1 for PDF export
- lucide-react for icons
- `src/lib/tierCheck.ts` — `useUserTier()` hook for feature gating

## Styling System (Updated Mar 2026 — near-black/red theme)
- Background: `bg-[#0A0A0A]`
- Cards: `bg-[#111111]` or `bg-[#1A1A1A]`, border `border-[#1A1A1A]` or `border-red-500/20`
- Primary button: `bg-red-600 hover:bg-red-700`
- Inputs: `bg-[#1A1A1A]/50 border border-red-500/30 focus:ring-2 focus:ring-red-500`
- Error: `red-500/10` background, `red-400` text
- Success: `green-500/10` background, `green-400` text
- Muted text: `text-[#A0A0A0]`
- Body text: `text-[#F5F5F5]`
- Primary accent: red (#DC2626 / red-600)

## API Endpoints (Cloudflare Worker)
- POST /api/red-team/execute — run a scan (body: { targetId })
- GET /api/reports/[id] — get report details
- POST /api/chat — DefendML dogfooding endpoint (3-layer defense)

## Tier Access Control (Implemented Mar 6, 2026)

### How it works
- `src/lib/tierCheck.ts` exports `useUserTier()` → `{ tier, loading }`
- Tiers: `free | pilot | standard | growth | enterprise | superadmin`
- `dsovan2004@gmail.com` → always `superadmin`, hardcoded, never gated
- All other new signups → `free` by default (DB DEFAULT set)

### What's gated for free tier
| Feature | Page | Gate behaviour |
|---------|------|---------------|
| Add Target | /admin/targets | Button locked + upgrade banner |
| Run Scan | /admin/targets | Play button locked per target row |
| Export Evidence | /reports | Export button locked + upgrade banner |

### Upgrade banner copy (standard across all pages)
"Upgrade to Pilot ($2,500) to unlock real red team scans. [Contact us to upgrade →](mailto:dsovan2004@gmail.com)"

### To upgrade a user
Supabase Table Editor → `users` table → set `role` to `pilot` (or `standard` / `growth` / `enterprise`). Gates lift on next page load.

## 🔒 Locked Rules (NEVER VIOLATE)
1. NEVER disclose "Claude Sonnet" in external/marketing materials
2. NEVER use "platform" or "defensive" language in positioning
3. NEVER disable RLS in Supabase
4. NEVER guess — verify before stating facts
5. NEVER commit multiple times — use push-one.sh ONE file at a time
6. Always complete full file — never cut off mid-code
7. Always read current file before modifying
8. NEVER use "40 prompts" — correct number is 100 per scan
9. NEVER use "255 scenarios" — correct number is 295 in the library
10. NEVER say "compliance" — say "coverage" or "evidence"

## Known Gotchas
1. **GitHub API + dynamic routes**: `src/pages/reports/[id].tsx` must be URL-encoded as `src/pages/reports/%5Bid%5D.tsx` in push-one.sh — already handled by Python URL-encode step
2. **Supabase from VM**: Supabase REST API may be blocked from Cowork VM — run seed/migration scripts from Mac terminal using Supabase SQL Editor
3. **Auth pattern**: login.tsx creates Supabase client inline (not from shared util) — follow same pattern
4. **Signup in login.tsx**: signup mode already exists in login.tsx via `mode` toggle — no separate signup page needed
5. **One push = one build**: Always use push-one.sh, never `git push` directly — prevents Cloudflare build queue
6. **users table key**: Always query `public.users` by `auth_user_id` (not `id`) — `auth_user_id` = Supabase `auth.users.id`
7. **scan.tsx Total Scenarios stat**: The `Total Scenarios: 255` stat card is a hardcoded product claim — do NOT change it to 295. All other 255 references in that file are 295.
8. **Tier hook on free tier**: `useUserTier()` fails safe — on any Supabase error it returns `'free'`. Never unlocks accidentally.
9. **organization_members.user_id**: This stores `auth.users.id` directly (NOT `public.users.id`). When seeding memberships always JOIN from `auth.users`, not `public.users`.
10. **targets environment constraint**: `targets_environment_check` allows only `'production'`, `'staging'`, `'development'`. Do not insert other values.
11. **Add Target requires org membership**: `POST /api/targets` (Cloudflare Pages Function) looks up `organization_members` by auth user ID. New users must have an org + membership row or Add Target will fail with "No organization found".

## Completed Work Log (Mar 2026 Sessions)

### Session 1 — Dashboard & Copy Fixes
- Fixed all `/tester` dead routes → `/scan` (was `/asl3-testing`) across overview, reports, intelligence
- Fixed prompt counts: "40 prompts" → "100 prompts" across reports.tsx (was compliance.tsx), admin/targets.tsx
- Removed Import button from admin/targets.tsx
- Hidden unwired time-range selector in intelligence.tsx

### Session 2 — Live Data Wiring
- `overview.tsx` — replaced fake /api/kpis fallback with 7 parallel Supabase queries; Active Attack Feed wired to live red_team_results
- `scan.tsx` (was `asl3-testing.tsx`) — fixed broken query (test_prompt→prompt_text, removed .eq('status','active')); wired 4 stats cards to live DB
- `intelligence.tsx` — full rewrite with 4 parallel Supabase queries, client-side category aggregation, empty states, MITRE lookup map

### Session 3 — Copy & Positioning Fixes (overview.tsx)
- "ASL-3 Compliance" → "Attack Coverage Rate"
- "Measured across 35 CBRN attack tests" → "Across all attack categories"
- "10 Frameworks" → "6 Frameworks" (stat card)
- "ASL-3 CBRN" → "ASL-3 Safety Standard"
- "96.5% measured compliance" → "Coverage verified"

### Session 4 — Full Tier Access Control
- DB: `ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'free'`
- New `src/lib/tierCheck.ts` — `useUserTier()` hook
- `login.tsx` — role 'viewer' → 'free' in both signup paths
- `onboarding.tsx` — upserts free role for Google OAuth first-time users
- `admin/targets.tsx` — Add Target + Run Scan gated for free tier
- `compliance.tsx` — Export Evidence gated for free tier
- `dsovan2004@gmail.com` hardcoded as superadmin, never gated

### Session 5 — Billing Page Fixes (settings.tsx)
- Free Tier price: "$0/month" → "$0" with "Limited access" subtitle
- Usage This Month sub-label: "100 per scan" → "100 per scan (Pilot limit)"
- Prompt Library sidebar: "255 attack scenarios" → "295 attack scenarios"

### Session 6 — Full Codebase 255→295 Audit
- `asl3-testing.tsx`: 5 instances updated (Total Scenarios stat card at 255 deliberately preserved)
- `compliance.tsx`: 5 instances updated
- `intelligence.tsx`: 1 instance updated
- `overview.tsx`: 2 instances updated

### Session 7 — Worker Fixes (scan pipeline)
- Fixed "No intelligence data" — worker now generates `attack_intelligence` + `remediation_playbook` JSON from scan results in PATCH
- Fixed `nullms / 0.0s` latency — added `scanStart = Date.now()` before scan loop, `total_latency_ms` in PATCH
- Fixed "your AI system" target name — `getTargetDisplayName()` in `[id].tsx` now parses hostname from `report.target` URL
- Fixed `push-one.sh` auth failures — clear `/tmp/defendml-git-push` cache before retry
- GitHub token typo corrected: `Yghp_` → `ghp_` (token stored in workspace CLAUDE.md only)

### Session 8 — Dogfood Target + AI Security Score (Mar 6, 2026)
- **Supabase DB fixes:**
  - Created `DefendML` organization (id: `855165a4-1372-4184-afa5-b6896831d697`)
  - Seeded `organization_members` for `dsovan2004@gmail.com` using `auth.users.id` directly
  - Fixed `targets_environment_check` constraint — added `'production'`, normalized `'dev'` → `'development'`
- **Dogfood target configured:** `DefendML — /api/chat (Dogfood)` targeting `https://defendml-api.dsovan2004.workers.dev/api/chat`, Type: API, Environment: Production
- **First dogfood scan completed:** 100/100 blocked, 100% block rate, 0.2s duration, PASS
- **AI Security Score feature** (commit `21ee779`) added to `src/pages/reports/[id].tsx`:
  - `getScoreRisk()` helper — maps 0–100 score to Secure/Moderate/High Risk/Critical
  - Formula: `blockRate − (flagged/total × 10) − (exploitedCategories × 5)`, clamped [0,100]
  - Section 02 Executive Summary: score callout with risk badge
  - Section 06 Security Risk Dashboard: large score card with threshold label
  - No DB changes, no scan engine changes — pure computation from existing report data

### Session 9 — Evidence Report Polish for PASS Scans (Mar 6, 2026)
All changes in `src/pages/reports/[id].tsx` only. No DB, schema, or scan engine changes.
- **Commit `2488a30` — Section 08 Evidence Samples (real data):**
  - Added `blockedSamples` state + Supabase fetch: looks up report UUID via `red_team_reports.report_id`, then fetches up to 3 `red_team_results` rows where `decision = 'blocked'` and `prompt_text IS NOT NULL`
  - Section 08 now always renders 3 blocked transcript cards (Attack Prompt → Model Response → ✓ BLOCKED badge + layer)
  - Real data preferred; fallback uses 3 CATEGORY_PLAYBOOKS examples (`security_standard`, `system_prompt_extraction`, `model_manipulation`)
- **Commit `bc2ec28` — PASS report polish (4 items):**
  - **Section 08 intro:** conditional text — "Blocked attack transcripts drawn from actual test execution" (real) vs "Sanitized representative examples…" (fallback) + yellow note banner when fallback
  - **Section 09 Minor Observations:** replaces plain empty-state for PASS scans with a structured card: block rate confirmation, flagged-count note (yellow if > 0, green if 0), OWASP coverage confirmation, quarterly re-scan recommendation
  - **Section 02 Executive Summary:** green **Residual Risk: LOW** pill added below risk badge in AI Security Score callout — only renders when `posture === 'PASS'`
  - Existing exploit/failure paths (FAILED — ALLOWED cards, red CVE section) unchanged

### Session 10 — Logo + Report Polish (Mar 6, 2026)
All UI/rendering changes only. No DB, schema, or scan engine changes.
- **Commit `87388a4` — Custom DefendML logo mark (`src/components/Navigation.tsx`):**
  - Replaced generic `lucide-react` Shield with custom inline SVG mark
  - Design: angular shield body + crosshair lines extending past edges + dashed targeting ring + center dot
  - Uses `currentColor` so red-500 → red-400 hover transition works unchanged
  - Removed unused `Shield` import from lucide-react
- **Commit `75a060c` — Logo glow + pulse animation (`src/components/Navigation.tsx`):**
  - Double-layer CSS `drop-shadow` glow: tight 3px inner (90% opacity) + soft 8px outer halo (45% opacity)
  - SVG `<animate>` pulse on center dot: ring expands 2.2→5.5→2.2 radius, fades 35%→0→35% opacity, 2.4s loop
  - Solid center dot always on top of pulse ring
- **Commit `cff9187` — Timestamp precision fix (`src/pages/reports/[id].tsx`):**
  - `fmt()` helper: `timeStyle: 'short'` → `timeStyle: 'medium'`
  - Assessment Start/End now show full seconds (e.g. `4:12:03 PM` vs `4:12:04 PM`)
  - Fixes identical start/end timestamps on sub-minute scans
  - Applies everywhere `fmt()` is used: Section 03, Appendix, report footer

### Session 11 — Settings Page: 5 Empty Tabs Wired (Mar 7, 2026)
All changes in `src/pages/settings.tsx` only. No DB, schema, or scan engine changes.
- **Commit `7050543` — All 5 empty Settings tabs now fully functional:**
  - **Organization tab:** Fetches current user's org via `organization_members` (by auth user ID) → `organizations`. Shows org name, ID (copyable), creation date, member count. Lists org's API keys from `api_keys` table. Danger Zone section with Export Data + Delete Org actions.
  - **API Configuration tab:** Endpoint reference card (base URL + 3 endpoints with method badges + copy buttons). Auth instructions (Bearer token format). Rate limits grid. Full API key management UI — list existing keys with name/hash/status, create-key input form.
  - **Prompt Library tab:** Fetches `red_team_tests` (category, prompt_text, framework, severity) with server-side pagination (25/page) and framework/severity filters. Client-side search. Shows framework coverage stats (6 frameworks). Paginator with prev/next and page count. Total badge "295 total in library".
  - **Integrations tab:** 6 integration cards (Slack, GitHub Actions, Jira, PagerDuty, Webhook, Datadog) — all "Coming Soon" state. CTA card for Enterprise custom integrations.
  - **Notifications tab:** Toggle-based alert rules (4 rules: Scan Complete, New Vulnerability, Weekly Digest, Critical Only). Delivery channels (Email enabled, Slack/Webhook showing "Not Connected"). Save Preferences button.
- **New helper components added inline:**
  - `CopyButton` — clipboard copy with green ✓ checkmark confirmation (2s timeout)
  - `severityBadge()` / `frameworkBadge()` — color-coded pills per severity/framework
- **New state vars added:** `orgData`, `orgLoading`, `orgError`, `apiKeys`, `apiKeysLoading`, `prompts`, `promptsLoading`, `promptSearch`, `frameworkFilter`, `severityFilter`, `promptPage`, `promptsTotal`, `notifSettings`, `newKeyName`, `creatingKey`
- **Lazy loading:** Each tab fetches data only when it becomes active — no upfront over-fetching

### Session 12 — Platform Stabilization + Intelligence Upgrade (Mar 7, 2026)
No DB schema changes. No scan engine changes.
- **Commit `8bcd7e1` — New `src/lib/security-metrics.ts`:**
  - Central helper: `clamp()`, `calcBlockRate()`, `calcSuccessRate()`, `calcCoverageRate()`
  - `normalizeBlockRate()` — guards against block_rate stored as integer (0-100) vs legacy decimal (0.0-1.0)
  - `calcAvgBlockRate()` — normalises each rate before averaging
  - `calcAISecurityScore()` — mirrors formula in reports/[id].tsx without drift
  - `scoreToRisk()` — Secure / Moderate / High Risk / Critical label + Tailwind color class
- **Commit `25aedf3` — `src/pages/overview.tsx`:**
  - **FIXED BUG:** `compliance_score: avgBlockRate * 100` (was producing 0-10000%) → `calcAvgBlockRate()` returns 0-100
  - All KPI percentages now flow through security-metrics.ts helpers — impossible values eliminated
  - **Vulnerability Timeline (PART 2):** pure inline SVG line chart (no external lib), 3 metrics (block rate green, success rate red dashed, AI score yellow); aggregated by day client-side; time range toggle (24h / 7d / 30d)
  - **AI Systems Risk Map (PART 5):** table of all active targets sorted highest-risk first; columns: name, AI Security Score + risk label, block rate mini progress bar, vuln count (allowed + flagged), PASS/FAIL/PENDING badge, last scan time
  - **Attack Intelligence Panel (PART 3):** top 10 attack categories by frequency from `red_team_results`; severity + framework badges; frequency bar relative to max; scan count; last seen; links to /intelligence
  - Each panel lazy-loads via separate `useEffect` with its own loading state
- **Commit `763ab99` — `src/pages/compliance.tsx`:**
  - **Scan History Table (PART 6):** new section above footer; fetches `red_team_reports` newest-first (limit 50); columns: Report ID (linkable to /reports/[id]), Target hostname, Scan Date, AI Security Score, Block Rate progress bar, Status badge
  - Imports `normalizeBlockRate`, `calcAISecurityScore`, `scoreToRisk` from security-metrics.ts
  - `ScanHistoryRow` type + `scanHistory` / `historyLoading` state added inline in component

### Session 13 — Mobile Responsive Layout Fixes (Mar 8, 2026)
No DB, schema, or scan engine changes. 5 files updated, 5 builds triggered.
- **Root cause:** `flex justify-between` rows and `ml-14` fixed margins caused content to overflow or get squished on sub-430px screens. `px-8` fixed padding in overview.tsx left no room on 320px viewports.
- **Commit `e7386f2` — `src/pages/admin/targets.tsx`:**
  - Page header: `flex justify-between` → `flex flex-col sm:flex-row justify-between gap-4` (title + Add Target button stack on mobile)
  - Target card: `flex items-start justify-between` → `flex flex-col sm:flex-row` so buttons don't overlap title on narrow screens
  - Target description/metadata: `ml-14` → `ml-0 sm:ml-14` (removes 56px indent on mobile)
  - Form grid: `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` (Type + Environment fields stack on mobile)
- **Commit `2434302` — `src/pages/asl3-testing.tsx`:**
  - Demo Mode banner inner row: `flex items-center justify-between` → `flex flex-col sm:flex-row` + button becomes `w-full sm:w-auto`
  - Production CTA: same pattern — button goes full-width on mobile
  - Bottom info bar: `flex items-center justify-between` → `flex flex-col sm:flex-row`, text wraps cleanly
- **Commit `3e61be3` — `src/pages/overview.tsx`:**
  - Main wrapper: `px-8` → `px-4 sm:px-6 lg:px-8` (was clipping on 320-360px screens)
  - 6-stat grid: `grid-cols-2 md:grid-cols-6` → `grid-cols-2 sm:grid-cols-3 md:grid-cols-6` (avoids 6-col squeeze at md breakpoint)
  - Bottom CTA link row: `flex gap-3` → `flex flex-wrap gap-2` + outer flex stacks on mobile
- **Commit `1b3cf33` — `src/pages/reports/[id].tsx`:**
  - Cover page red header: `px-8 py-6` → `px-4 sm:px-8 py-4 sm:py-6`
  - Title font: `text-3xl` → `text-2xl sm:text-3xl` (prevents overflow on very narrow screens)
  - Export PDF button: `flex justify-between` → `flex flex-col sm:flex-row` + button `w-full sm:w-auto`
- **Commit `508ec2c` — `src/pages/settings.tsx`:**
  - Header + main wrapper: `px-4 sm:px-8` → `px-4 sm:px-6 lg:px-8`
  - User Management tab header: `flex items-center justify-between` → `flex flex-col sm:flex-row gap-4`

### Session 13B — Mobile Overflow Root Cause + Global CSS Fix (Mar 8, 2026)
No DB, schema, or scan engine changes. 2 files updated, 2 builds triggered.
- **Root cause identified:** `intelligence.tsx` main wrapper had hardcoded `px-8` with no responsive prefix — primary overflow culprit.
- **Commit `007c166` — `src/pages/intelligence.tsx`:**
  - Main wrapper: `px-8` → `px-4 sm:px-6 lg:px-8`
  - Header wrapper: same fix
  - Stats grid inside technique cards: `grid-cols-3` → `grid-cols-2 sm:grid-cols-3`
  - Layer breakdown grid: `grid-cols-4` → `grid-cols-2 sm:grid-cols-4`
- **Commit `03ad130` — `src/styles/globals.css`:**
  - Added `overflow-x: hidden; max-width: 100vw` to `html, body, #__next` as universal overflow safety net

### Session 14 — Landing Page Migration (Mar 8, 2026)
No DB, schema, or scan engine changes. 13 files created/updated, 13 builds triggered.
- **Context:** Static `landing/index.html` at `defendml.com` had stale numbers (255 scenarios, 40 prompts, wrong pricing), white/purple theme, and needed migration into the Next.js app.
- **New `src/components/landing/` directory** — 11 reusable components:
  - `Navbar.tsx` — Dark sticky nav with anchor links + mobile hamburger (no redirect, pure marketing)
  - `Hero.tsx` — Full dark/red hero with "Attack Before They Do" headline, pill badges, dual CTAs
  - `StatsBar.tsx` — 4-stat strip: 295 Attack Scenarios, 6 Frameworks, 10–80×, 24hr
  - `SocialProof.tsx` — "Why DefendML is Different" 3-card section
  - `ProductSection.tsx` — "Offensive Red Team Testing as a Service" 3 product cards + callout
  - `HowItWorks.tsx` — 3-step numbered section
  - `Evidence.tsx` — Evidence section with 6-framework coverage strip
  - `Pricing.tsx` — 4 correct pricing tiers (Free/$0, Pilot/$2,500, Standard/$4,999, Growth/$9,999/mo) + Enterprise callout (per CLAUDE.md)
  - `FAQ.tsx` — 8 FAQ items with accordion (ChevronDown toggle)
  - `CTA.tsx` — Red-glow CTA section
  - `Footer.tsx` — 4-column footer with anchor links + framework badges
- **`src/pages/index.tsx` rewritten** — Replaced redirect stub with full landing page assembling all 11 components. No more redirect to /login or /overview.
- **Commit `19024db` — `src/pages/asl3-testing.tsx`:**
  - Fixed 676.3% block rate bug: imported `normalizeBlockRate` from `../lib/security-metrics`
  - `avgBlockRate * 100` → `normalizeBlockRate(r.block_rate ?? 0)` per-rate before averaging
  - Prevents double-multiply when `block_rate` stored as 0-100 integer
- **Key corrections applied throughout landing page:**
  - 255 → 295 scenarios everywhere
  - "40 prompts" → "100 prompts per scan"
  - Old pricing ($149/$499/$2,500+ monthly) → CLAUDE.md correct tiers
  - "96.5% ASL-3 Coverage" → "6-Framework Coverage" / "Coverage verified" language
  - NEVER "compliance" — always "coverage" or "evidence"
- **Anchor sections preserved:** `#red-team`, `#how-it-works`, `#evidence`, `#pricing`, `#faq` (all with `scroll-mt-16`)
- **`landing/index.html` status:** Safe to retire — all content migrated into Next.js with corrections applied

## Market Intelligence (Validated March 2026)

### Market Size
- AI Red Teaming Services market: $1.3B in 2025 → $18.6B by 2035 (30.5% CAGR)
- North America holds 42.4% market share
- Adversarial attack simulation leads demand at 32.4% of all service types

### Demand Signal (Real Survey Data)
- 77% of organizations already run GenAI/LLMs in production (1,800+ security pros surveyed)
- 67% run agentic AI in production
- 46% admit they are NOT adequately prepared for AI-powered threats
- 93% of security leaders expect daily AI attacks
- Only 6% of organizations have full security deployment readiness

### Real Breach Incidents (Use in Sales)
- Financial services firm deployed LLM without adversarial testing → leaked internal FAQ content within weeks → $3M remediation + regulatory scrutiny
- Enterprise software company leaked entire salary database via LLM used for financial modeling
- UK AISI ran 1.8M attacks across 22 AI models → every single model broke
- Samsung engineers leaked proprietary source code via ChatGPT
- 77% of enterprise employees who use AI have pasted company data into a chatbot; 22% included confidential financial/personal data

### Why AI Wrappers Are Vulnerable (Our Core TAM)
- 80%+ of startups build on ChatGPT/Claude/Gemini APIs
- The model provider secures the MODEL — not the app built on top
- Vulnerabilities live in: system prompts, API integrations, RAG pipelines, multi-turn flows
- OpenAI's own CISO admitted: "Prompt injection may never be fully solved"
- Prompt injection was demonstrated in 2025 across ChatGPT, Claude, Gemini, GitHub Copilot, Salesforce Einstein, Microsoft Copilot

### What DefendML Can and Cannot Stop
✅ CAN STOP (in our 295-prompt library):
- System prompt extraction (FAQ leak scenario above)
- PII data extraction attacks
- Multi-turn jailbreak sequences
- Constitutional violations
- Model manipulation / persona injection
- Adversarial robustness failures
- Bias & fairness exploits
- Deployment standard violations

❌ CANNOT STOP (never claim):
- Nation-state level attacks (1.8M attack volume)
- Internal employee misuse / shadow AI
- Data governance failures (copy-paste into ChatGPT)
- Runtime protection (we test pre-deployment, not runtime)

### Competitive Positioning
- Dreadnode: raised $14M Series A (Feb 2025) — validates the market
- Lakera: $10K-$20K/month — runtime protection focus
- HiddenLayer: runtime defense focus
- Robust Intelligence: acquired by Cisco
- Microsoft PyRIT: $20K-$40K/month — open source tooling
- F5 AI Red Team: $15K-$30K/month
- DefendML: $2,500 Pilot (100 prompts, 24hr delivery, 6-framework evidence report) → $4,999 Standard (295 prompts)

### Primary Buyers (ICP)
1. CISO @ AI-first SaaS (50-500 employees) — signs the check
2. VP Engineering @ companies with LLM-powered products — feels the pain
3. Head of Product Security @ fintech/healthtech — runs SOC 2 prep
4. GRC / Compliance Manager — builds audit packages
5. CEO of AI-first startup — needs answer when investors ask "is your AI safe?"

### Our Killer Sales Lines
- "That $3M breach started with an untested system prompt. Our $2,500 pilot finds it in 24 hours."
- "OpenAI can't protect your system prompt. We attack it so you know before your customers do."
- "We find vulnerabilities, we don't certify compliance."
- "Attack Before They Do."

### Honest Positioning Rules
- NEVER claim we stop nation-state attacks
- NEVER claim we provide runtime protection
- NEVER say "compliance" — say "coverage" or "evidence"
- ALWAYS say "attack", "exploit", "vulnerability" — never "protect", "defend", "shield"
- Our report is EVIDENCE for auditors, not a compliance scorecard

## Pricing Model (Validated March 2026)

### Why Prompt Count is NOT the Pricing Metric
- Industry has no standard prompt count — no best practices defined (CSET 2025)
- Competitors (Lakera, Mindgard, CrowdStrike) don't publish pricing or prompt counts
- External engagements start at $16,000+ (Obsidian Security benchmark)
- Customers care about: attack categories covered, frameworks mapped, speed, report quality
- Prompt count is PROOF OF DEPTH — not the pricing unit

### Official DefendML Pricing Tiers
| Tier       | Prompts   | Targets    | Delivery       | Price       |
|------------|-----------|------------|----------------|-------------|
| Free       | —         | —          | Limited access | $0          |
| Pilot      | 100       | 1 target   | 24hr PDF       | $2,500      |
| Standard   | 295       | 1 target   | 24hr full      | $4,999      |
| Growth     | 295 x3    | 3 targets  | Monthly scans  | $9,999/mo   |
| Enterprise | Unlimited | Unlimited  | CI/CD ready    | Custom      |

### Why 100 Prompts for Pilot
- 10 attack categories x 10 prompts each = credible coverage
- MITRE ATLAS has 15 tactics, 66 techniques, 46 sub-techniques
- 100 prompts is defensible to a CISO — 50 is too thin
- Pitch: "100 targeted attacks across 10 categories — more than a $16K manual engagement, in 24hrs for $2,500"

### Pricing Rules
- NEVER price per prompt in customer conversations
- ALWAYS frame value as: attack categories + frameworks + speed + report
- Pilot ($2,500) is the entry point — Standard (295) is the upsell
- $3M breach vs $2,500 pilot = 1,200x ROI justification
