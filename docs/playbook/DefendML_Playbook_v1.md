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

## 16. DefendML Product Workflow

The DefendML user-facing product follows a three-step workflow.

**Targets → Scan → Reports**

1. **Targets** — Customers register AI endpoints, models, or APIs they want to test. Each target includes the endpoint URL, authentication configuration, and payload template.
2. **Scan** — DefendML executes red team attack scenarios against the configured target. 100 offensive prompts are run from the 295-scenario attack library across all 6 security frameworks.
3. **Reports** — Evidence reports are generated showing blocked attacks, exploit success rate, AI Security Score, framework coverage, and remediation guidance.

This three-step flow is the canonical user workflow and must be reflected consistently across the application, onboarding, and documentation.

App routes:

- Targets → `/admin/targets`
- Scan → `/scan`
- Reports → `/reports`

---

## 17. Legacy Route Redirects

The following legacy routes are maintained for backward compatibility.

| Legacy Route | Redirects To | Type |
|---|---|---|
| `/asl3-testing` | `/scan` | Client-side (useEffect) |
| `/compliance` | `/reports` | Client-side (useEffect) |

Purpose:

- preserve old bookmarks
- prevent broken links in older documentation
- maintain compatibility with external references

Do not remove these redirects unless all external references to the legacy routes are confirmed updated. These are implemented as client-side `useEffect` + `router.replace()` redirects in the Next.js pages router, compatible with Cloudflare Pages static export (`output: 'export'`).

---

## 18. System Status Page

DefendML maintains a public status page for operational transparency.

**Status URL:** `https://status.defendml.com`

The status page displays operational health for core platform services:

- Dashboard
- Scan Engine
- Reports
- API
- Authentication

This page is hosted via Cloudflare Pages and is linked from the application footer. It must remain publicly accessible without authentication.

---

## 19. Customer Security Evaluation Workflow

When onboarding new customers, the typical security evaluation process follows these steps.

1. **Target Registration** — Customer adds an AI endpoint or model to DefendML via the Targets page. Minimum required: endpoint URL, HTTP method, authentication method, and payload template.
2. **Initial Red Team Scan** — DefendML runs the 100-prompt attack suite against the configured target. Results are captured in real time across all 6 security frameworks.
3. **Vulnerability Analysis** — DefendML identifies prompt injection, jailbreak, data exfiltration, and model manipulation risks. Each finding is mapped to OWASP LLM Top 10, MITRE ATLAS, NIST AI RMF, EU AI Act, SOC 2/ISO 27001, and ASL-3.
4. **Evidence Reports** — Security reports are generated in PDF, JSON, and CSV formats for use by engineering, compliance, and audit teams. Reports include the AI Security Score, block rate, framework coverage, and remediation playbook.
5. **Remediation Review** — Customer reviews mitigation guidance and retests the system. DefendML recommends quarterly re-scans as attack techniques evolve.

Purpose: Provide a consistent, repeatable workflow for evaluating AI security posture and generating audit-ready evidence.

---

*End of Playbook*
