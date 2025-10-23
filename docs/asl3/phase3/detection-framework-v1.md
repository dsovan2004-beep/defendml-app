# 🛡️ DefendML – Detection Framework V1
**Date:** October 2025  
**Objective:** Define the operational logic for advanced AI threat detection under ASL-3 Phase 3.

---

## 🧠 Detection Components

### 1. Multi-Turn Attack Detection
**Purpose:** Detect complex jailbreaks or unsafe prompts that evolve across multiple queries within the same session.  
**Logic:**
- Track `session_id` across consecutive prompts and responses.
- Correlate patterns (e.g., fragments that form restricted content when combined).
- Trigger a “multi-turn alert” when ≥ 3 linked queries cross policy thresholds.  
**Example:** A user splits a forbidden instruction across multiple messages.

---

### 2. Behavioral Anomaly Detection
**Purpose:** Identify unusual user behavior that may indicate abuse or automated attacks.  
**Monitored Signals:**
- Spike in prompt/response volume vs. user baseline.  
- Latency spikes > 2× standard deviation.  
- Abnormal blocked/allowed ratio > 30%.  
**Action:** Flag session as “Elevated Risk.”

---

### 3. Pattern Clustering
**Purpose:** Group repeated threat signatures to identify coordinated attack campaigns.  
**Inputs:** threat type, rule triggered, user ID, timestamp.  
**Method:** Cluster similar events (e.g., CBRN or policy-violation families) to form pattern groups.  
**Output:** Pattern ID with linked sessions and frequency count.

---

### 4. Session Risk Score (0 – 100)
**Purpose:** Quantify per-session risk level.  
**Formula Example:**
