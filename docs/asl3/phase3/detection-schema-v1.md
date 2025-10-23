# 🧩 DefendML — Detection Schema V1
**Date:** October 2025  
**Objective:** Define database schema + JSON event envelope for Phase 3 (multi-turn detection, behavior anomalies, pattern clustering, session risk scoring).

---

## 1) Entities & Responsibilities

- **session_events** — Atomic telemetry per prompt/completion/classifier decision.
- **multi_turn_alerts** — Correlated events that trip a multi-turn rule within a session.
- **behavioral_anomalies** — Outlier metrics vs. baselines (volume, latency spikes, block ratio).
- **pattern_clusters** — Repeated threat signatures grouped over time; membership in **cluster_members**.
- **session_risk** — Rolling 0–100 risk score per session; fast lookup for badges.

All tables are **tenant-scoped by `org_id`** to satisfy RLS.

---

## 2) Event Envelope (single source of truth)

```json
{
  "event_id": "snowflake or ULID",
  "ts": "2025-10-23T00:12:34.567Z",
  "source": "worker|gateway|ui",
  "org_id": "uuid-or-text",
  "user_id": "string",
  "session_id": "string",
  "type": "prompt|completion|classifier.allow|classifier.block",
  "severity": "INFO|WARN|CRITICAL",
  "defense_layer": 1,
  "threat_family": "cbrn|jailbreak|policy_violation|null",
  "classifier": {
    "confidence": 0.983,
    "latency_ms": 42,
    "rule_ids": ["CBRN-01","POL-07"]
  },
  "content_fingerprints": {
    "prompt_sha256": "…",
    "completion_len": 312
  },
  "meta": { "ip": "…", "model": "…" }
}
