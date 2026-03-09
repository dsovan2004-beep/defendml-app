# DefendML Security Scoring Model

## Overview

DefendML evaluates AI system security using a structured attack library and architecture-aware scanning engine.

Customer reports present a **DefendML Security Score** derived from scan results.

The score reflects resistance to common AI attack techniques.

The scoring model is mapped to established security frameworks.

---

## Customer-Facing Metrics

Customer reports must reference the following frameworks:

- MITRE ATLAS
- OWASP LLM Top 10
- NIST AI Risk Management Framework
- SOC 2 / ISO 27001 alignment
- EU AI Act alignment (where applicable)

### Example Report Output

```
DefendML Security Score: 82 / 100

Breakdown:
  Prompt Injection Resistance:      74
  Sensitive Data Exposure Risk:     91
  Tool / Agent Abuse Risk:          83
  RAG Context Security:             79
  Model Manipulation Resistance:    85
```

### Framework Coverage Example

```
MITRE ATLAS techniques tested:       17
OWASP LLM Top 10 coverage:           9 / 10
NIST AI RMF controls evaluated:      11
```

---

## Internal Safety Evaluation

DefendML internally references the ASL-3 Safety Level model for engineering analysis.

ASL-3 is used **only** for:

- internal risk scoring
- internal attack coverage evaluation
- internal engineering metrics

ASL-3 must **NOT** appear in:

- customer reports
- marketing pages
- landing pages
- sales material
- pricing documentation

---

## Security Score Calculation (Conceptual)

The DefendML Security Score is derived from scan results.

Factors include:

- attack success rate
- attack severity
- category coverage
- framework alignment
- architecture-specific risk

**Score range: 0 – 100**

Higher scores indicate stronger resistance to adversarial AI attacks.

---

*End of Document*
