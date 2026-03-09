# DefendML Playbook v1

**Operational Guide for the Offensive AI Red Team Platform**

Version: 1.0 | Status: Active | Owner: DefendML Engineering

---

## 1. Product Overview

DefendML is an Offensive AI Red Team Testing Service designed to evaluate the security of AI applications.

The platform simulates adversarial behavior against AI systems and produces audit-ready security evidence.

Core capabilities:

- Offensive AI red team testing
- AI security control validation
- Security framework mapping
- Audit-ready evidence reports

Primary output:

Evidence reports used by:

- Security teams
- Compliance teams
- Auditors

---

## 2. Offensive AI Red Team Workflow

The DefendML platform executes a structured offensive testing process.

Workflow:

1. Customer registers an AI target
2. Target configuration is validated
3. Scan engine selects attack scenarios
4. Attack prompts are executed
5. Responses are captured
6. Results are classified
7. Framework mappings are applied
8. Evidence reports are generated

This workflow must remain deterministic and reproducible.

---

## 3. Customer Onboarding Flow

Customer onboarding is designed to minimize friction while maintaining security.

Customer onboarding process:

1. Customer creates account
2. Customer registers target endpoint
3. Customer provides authentication details
4. Customer validates connection
5. Initial scan configuration is created
6. First red team scan is executed

Minimum required inputs:

- endpoint URL
- HTTP method
- authentication configuration
- payload template

Example target configuration:

```
endpoint: https://api.customer.com/chat
method: POST

headers:
  Authorization: Bearer API_KEY

payload_template:
{
  "messages":[
    {"role":"user","content":"{{prompt}}"}
  ]
}
```

---

## 4. Target Configuration Process

Targets are defined using the Target Configuration Model.

Required configuration fields:

- endpoint_url
- http_method
- authentication
- headers
- payload_template
- prompt_injection_path
- response_path

DefendML does not assume a fixed endpoint such as `/api/chat`. Targets are fully configurable.

---

## 5. Target Discovery Process

Targets can be discovered using several techniques.

Discovery methods include:

- API documentation inspection
- OpenAPI / Swagger analysis
- JavaScript bundle analysis
- endpoint scanning
- manual configuration

The discovery process identifies AI interaction endpoints, authentication methods, and payload structures.

---

## 6. Scan Execution Process

The scan engine orchestrates attack execution.

Execution steps:

1. Load attack scenarios from attack library
2. Select scan scenario set
3. Generate attack prompts
4. Inject prompts into payload template
5. Send requests to target endpoint
6. Capture model responses
7. Analyze responses
8. Record results

Standard scan configuration:

```
Attack library: 295 scenarios
Production scan size: 100 prompts
```

Each scan produces structured attack results.

---

## 7. Attack Classification Process

Responses are evaluated using the classification system.

Possible classifications:

- Policy bypass
- Prompt injection success
- Data leakage
- Model manipulation
- Safe response

Each result must include:

- attack ID
- response classification
- risk severity
- detection signal

---

## 8. Framework Mapping

Each attack scenario maps to security frameworks.

Supported frameworks:

- MITRE ATLAS
- OWASP LLM Top 10
- NIST AI RMF
- ASL-3 Security Requirements

Example mapping:

```
Prompt Injection → MITRE ATLAS AML.TA0003 → OWASP LLM LLM01
```

---

## 9. Evidence Report Generation

Evidence reports transform scan results into audit-ready documentation.

Evidence report contents:

- target metadata
- scan configuration
- executed attack scenarios
- detected vulnerabilities
- framework mappings
- ASL-3 coverage score
- remediation guidance

Supported export formats:

- PDF
- JSON
- CSV

---

## 10. Attack Library Maintenance

The attack library currently contains 295 attack scenarios.

Scenarios are organized by:

- Attack Category
- Attack Technique
- Attack Scenario

Attack categories include:

- Prompt Injection
- Data Exfiltration
- Model Manipulation
- Tool Exploitation
- Multi-Turn Manipulation
- Supply Chain Attacks

The attack library must remain governed and version controlled.

---

## 11. Adding New Attack Scenarios

New attack scenarios must follow this process:

1. Identify emerging attack technique
2. Validate real-world feasibility
3. Map to relevant framework
4. Define attack prompt
5. Define expected risk behavior
6. Add scenario definition
7. Test scenario execution

Prompt variations are not new scenarios. Only new attack techniques qualify as scenarios.

---

## 12. Platform Release Process

Platform releases follow a controlled workflow.

Release steps:

1. Feature development
2. Internal testing
3. Scan engine validation
4. Evidence pipeline verification
5. Deployment
6. Post-release monitoring

---

## 13. Engineering Contribution Rules

Engineering changes must respect architectural boundaries.

Do NOT modify:

- scan engine logic
- attack library definitions
- evidence generation pipeline

without following governance procedures.

UI and landing work must remain isolated from core security systems.

---

## 14. Marketing Positioning Rules

DefendML is positioned as:

**Offensive AI Red Team Testing with Audit-Ready Evidence.**

Avoid exaggerated claims such as:

- "The Only"
- "Zero Direct Competitors"

Messaging must remain credible for enterprise security teams.

---

## 15. Security Scoring Policy

DefendML uses the **DefendML Security Score** as the primary customer-facing metric.

Internal safety evaluation may reference ASL-3 safety levels for engineering analysis.

ASL-3 is not exposed in customer reports or marketing materials.

---

*End of Playbook*
