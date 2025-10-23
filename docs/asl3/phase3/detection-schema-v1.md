DefendML — Detection Schema V1

Date: October 2025
Objective: Database schema + JSON event envelope for Phase 3 (multi-turn detection, anomalies, clusters, session risk scoring).
Tenant model: All tables are scoped by org_id and protected by Row-Level Security (RLS).

1) Event Envelope (single source of truth)
{
  "event_id": "snowflake-or-ulid",
  "ts": "2025-10-23T09:12:34.567Z",
  "source": "worker|api|edge",
  "org_id": "ORG_123",
  "user_id": "u_123",
  "session_id": "s_abc",
  "type": "prompt|completion|classifier.allow|classifier.block",
  "severity": "INFO|WARN|CRITICAL",
  "defense_layer": 2,
  "threat_family": "cbrn|jailbreak|policy_violation|null",
  "classifier_conf": 0.992,
  "classifier_lat_ms": 41,
  "rule_ids": ["CBRN-01","POL-07"],
  "prompt_sha256": "sha256:...",
  "completion_len": 0,
  "meta": { "ip": "1.2.3.4", "ua": "…" }
}

2) SQL DDL — Tables
-- 2.1 session_events — raw telemetry
create table if not exists public.session_events (
  id                bigserial primary key,
  ts                timestamptz default now(),
  source            text not null,
  org_id            text not null,
  user_id           text,
  session_id        text not null,
  type              text not null,   -- prompt|completion|classifier.allow|classifier.block
  severity          text,            -- INFO|WARN|CRITICAL
  defense_layer     smallint,        -- 1..4
  threat_family     text,            -- cbrn|jailbreak|policy_violation|null
  classifier_conf   numeric(5,3),    -- 0.000..1.000
  classifier_lat_ms integer,
  rule_ids          text[],          -- array of rule codes
  prompt_sha256     text,
  completion_len    integer,
  meta              jsonb
);

-- 2.2 multi_turn_alerts — correlated detections
create table if not exists public.multi_turn_alerts (
  id               bigserial primary key,
  org_id           text not null,
  session_id       text not null,
  window_start     timestamptz not null,
  window_end       timestamptz not null,
  rule_code        text not null,      -- e.g., MT-CBRN-3HOP
  trigger_count    integer not null,
  severity         text not null,      -- CRITICAL|HIGH|MEDIUM|LOW
  status           text default 'OPEN',-- OPEN|INVESTIGATING|RESOLVED
  evidence         jsonb               -- {event_ids:[…], fragments:[…]}
);

-- 2.3 behavioral_anomalies — baselines vs observed
create table if not exists public.behavioral_anomalies (
  id               bigserial primary key,
  org_id           text not null,
  user_id          text,
  session_id       text,
  metric           text not null,      -- volume|latency_spike|block_ratio
  observed         numeric,
  baseline         numeric,
  zscore           numeric,
  window_minutes   integer not null,
  ts               timestamptz default now(),
  details          jsonb
);

-- 2.4 pattern_clusters — clustered signatures
create table if not exists public.pattern_clusters (
  id               bigserial primary key,
  org_id           text not null,
  cluster_id       text not null,      -- stable hash of features
  threat_family    text not null,
  first_seen       timestamptz not null,
  last_seen        timestamptz not null,
  sample_count     integer not null,
  features         jsonb
);

-- 2.5 cluster_members — event membership
create table if not exists public.cluster_members (
  cluster_id       text not null,
  event_id         bigint not null references public.session_events(id) on delete cascade,
  org_id           text not null,
  primary key (cluster_id, event_id)
);

-- 2.6 session_risk — per-session rolling score (0–100)
create table if not exists public.session_risk (
  session_id       text primary key,
  org_id           text not null,
  user_id          text,
  last_event_ts    timestamptz not null default now(),
  risk_attack      smallint not null default 0,
  risk_anomaly     smallint not null default 0,
  risk_pattern     smallint not null default 0,
  risk_total       smallint not null default 0,  -- 0..100
  label            text not null default 'NORMAL', -- NORMAL|ELEVATED|CRITICAL
  breakdown        jsonb
);

3) Indexes
create index if not exists idx_session_events_org_ts
  on public.session_events (org_id, ts desc);

create index if not exists idx_session_events_session
  on public.session_events (session_id, ts desc);

create index if not exists idx_session_events_threat
  on public.session_events (org_id, threat_family);

create index if not exists idx_session_events_meta_gin
  on public.session_events using gin (meta);

create index if not exists idx_anomalies_org_ts
  on public.behavioral_anomalies (org_id, ts desc);

create index if not exists idx_clusters_org_lastseen
  on public.pattern_clusters (org_id, last_seen desc);

create index if not exists idx_session_risk_org_label
  on public.session_risk (org_id, label);

4) Analytics Views
create or replace view public.v_session_risk_badge as
select org_id, session_id, user_id, risk_total, label, last_event_ts
from public.session_risk;

create or replace view public.v_classifier_daily as
select
  org_id,
  date_trunc('day', ts) as day,
  count(*) filter (where type like 'classifier.%')                  as decisions,
  count(*) filter (where type = 'classifier.block')                 as blocks,
  avg(classifier_conf)                                              as avg_conf,
  percentile_cont(0.95) within group (order by classifier_lat_ms)   as p95_latency_ms
from public.session_events
group by 1,2;

5) Row-Level Security (RLS)

Run as a superuser (e.g., postgres role) after tables exist.

-- enable RLS
alter table public.session_events     enable row level security;
alter table public.multi_turn_alerts  enable row level security;
alter table public.behavioral_anomalies enable row level security;
alter table public.pattern_clusters   enable row level security;
alter table public.cluster_members    enable row level security;
alter table public.session_risk       enable row level security;

-- single tenant-isolation policy for each table
do $$
declare
  t text;
  tables text[] := array[
    'session_events',
    'multi_turn_alerts',
    'behavioral_anomalies',
    'pattern_clusters',
    'cluster_members',
    'session_risk'
  ];
begin
  foreach t in array tables loop
    execute format($fmt$
      drop policy if exists tenant_isolation_%1$I on public.%1$I;
      create policy tenant_isolation_%1$I
      on public.%1$I
      for all
      using (
        (auth.role() = 'service_role')
        or (auth.jwt() ->> 'org_id') = org_id
      )
      with check (
        (auth.role() = 'service_role')
        or (auth.jwt() ->> 'org_id') = org_id
      );
    $fmt$, t);
  end loop;
end $$;

6) Sample Inserts (smoke test)
-- Classifier block
insert into public.session_events
  (source, org_id, user_id, session_id, type, severity, defense_layer, threat_family,
   classifier_conf, classifier_lat_ms, rule_ids, prompt_sha256, completion_len, meta)
values
  ('worker','ORG_DEMO','u_123','s_abc','classifier.block','CRITICAL',2,'cbrn',
   0.992, 41, array['CBRN-01','POL-07'],'sha256:...', 0, '{"ip":"1.2.3.4"}');

-- Anomaly spike
insert into public.behavioral_anomalies
  (org_id, user_id, session_id, metric, observed, baseline, zscore, window_minutes, details)
values
  ('ORG_DEMO','u_123','s_abc','block_ratio',0.42,0.07,4.9,15,'{"window":"last_15m"}'::jsonb);

-- Risk upsert
insert into public.session_risk
  (session_id, org_id, user_id, last_event_ts, risk_attack, risk_anomaly, risk_pattern,
   risk_total, label, breakdown)
values
  ('s_abc','ORG_DEMO','u_123', now(), 40, 25, 10, 75, 'CRITICAL',
   '{"weights":{"attack":0.5,"anomaly":0.3,"pattern":0.2}}'::jsonb)
on conflict (session_id) do update
set last_event_ts = excluded.last_event_ts,
    risk_attack   = excluded.risk_attack,
    risk_anomaly  = excluded.risk_anomaly,
    risk_pattern  = excluded.risk_pattern,
    risk_total    = excluded.risk_total,
    label         = excluded.label,
    breakdown     = excluded.breakdown;

7) Risk Formula & Badge
RiskTotal =
  (Weight_attack  * AttackEventsScore) +
  (Weight_anomaly * BehavioralFlagsScore) +
  (Weight_pattern * ClusterLinksScore)


Interpretation

🟢 0–39 = Normal

🟡 40–69 = Elevated

🔴 70–100 = Critical

Shown as a badge on /threats and /incidents pages.

8) Success Checks
Metric	Target	How we measure
Multi-Turn Detection Precision	≥ 95%	multi_turn_alerts backtests
Anomaly Precision	≥ 90%	behavioral_anomalies vs hand-labels
Avg Response (Critical)	< 5 min	Incident timestamps
Risk Badge Accuracy	±5%	Validation runs
9) Next Steps (quick)

Run DDL → Indexes → Views → RLS (in that order).

Insert the sample rows.

Wire the worker to emit the Event Envelope into session_events and upsert session_risk.
