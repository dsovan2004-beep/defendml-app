# DefendML Attack Scenario Selection Engine

## Overview

DefendML maintains a library of approximately 295 AI attack scenarios.

During a customer scan, the platform executes 100 prompts selected from this library.

The Attack Scenario Selection Engine determines which scenarios are executed.

The engine ensures scans are:

- architecture-aware
- risk-weighted
- reproducible
- balanced across attack categories

---

## Selection Flow

The selection process follows these stages:

1. Target Configuration Ingestion
2. Architecture Detection
3. Risk Profile Generation
4. Attack Category Weighting
5. Scenario Candidate Scoring
6. Scenario Selection
7. Scan Plan Generation

---

## Target Configuration

Customer scans begin with a target configuration.

Example:

```
endpoint_url: https://api.customer.com/chat
http_method: POST
payload_template:
{
  "messages":[
    {"role":"user","content":"{{prompt}}"}
  ]
}
```

The configuration provides signals used for architecture detection.

---

## Architecture Detection

The system attempts to infer the AI architecture based on the target configuration.

Supported architecture classes:

- Chat Assistant API
- Retrieval-Augmented Generation (RAG) System
- AI Agent System
- Automation / Workflow AI
- Developer AI API

Architecture detection may analyze:

- payload template structure
- message format
- presence of retrieval parameters
- tool invocation fields
- session identifiers

---

## Attack Categories

The attack library is organized into categories.

Primary categories include:

- Prompt Injection
- Jailbreak
- Sensitive Data Exposure
- System Prompt Leakage
- RAG Context Attacks
- Tool / Agent Abuse
- Model Behavior Manipulation

Each attack scenario in the library includes metadata describing its category and applicable architectures.

---

## Architecture-Based Weighting

Each architecture class applies a different weighting across attack categories.

### Example: Chat Assistant

| Category | Weight |
|---|---|
| Prompt Injection | 25 |
| Jailbreak | 20 |
| System Prompt Leakage | 15 |
| Sensitive Data Exposure | 15 |
| Model Behavior Manipulation | 15 |
| RAG Context Attacks | 5 |
| Tool / Agent Abuse | 5 |

### Example: RAG System

| Category | Weight |
|---|---|
| RAG Context Attacks | 25 |
| Sensitive Data Exposure | 20 |
| Prompt Injection | 15 |
| System Prompt Leakage | 15 |
| Jailbreak | 10 |
| Model Behavior Manipulation | 10 |
| Tool / Agent Abuse | 5 |

### Example: Agent System

| Category | Weight |
|---|---|
| Tool / Agent Abuse | 25 |
| Prompt Injection | 20 |
| Model Behavior Manipulation | 15 |
| Sensitive Data Exposure | 15 |
| System Prompt Leakage | 10 |
| Jailbreak | 10 |
| RAG Context Attacks | 5 |

---

## Scenario Metadata

Each attack scenario should contain structured metadata.

Example schema:

```yaml
attack_id: DML-PI-001
category: Prompt Injection
technique: Instruction Override
severity: High
architectures:
  - Chat
  - Agent
  - RAG
frameworks:
  - MITRE ATLAS
  - OWASP LLM Top 10
single_turn: true
multi_turn: false
```

---

## Scenario Selection Rules

The selection engine must enforce the following rules:

**Coverage Floor**
Every scan must include a minimum number of scenarios from critical categories.

**No Duplicate Scenarios**
Similar prompts should not appear multiple times in a single scan.

**Severity Balance**
Each scan must include a mix of high, medium, and baseline attacks.

**Architecture Relevance**
Scenarios must match the detected architecture.

**Reproducibility**
Selected scenario IDs must be stored so scans can be replayed.

---

## Scan Plan Generation

The engine produces a scan plan consisting of 100 attack scenarios.

Example output:

```yaml
scan_id: SCAN-2026-001
architecture: RAG
scenario_ids:
  - DML-RAG-004
  - DML-PI-012
  - DML-DEX-002
  - DML-AGENT-021
```

The scan plan is stored with the evidence report to allow deterministic replay.

---

## Future Improvements

Future versions of the engine may include:

- adaptive selection based on previous scan results
- threat intelligence weighting
- industry-specific risk profiles
- continuous attack library expansion

---

*End of Document*
