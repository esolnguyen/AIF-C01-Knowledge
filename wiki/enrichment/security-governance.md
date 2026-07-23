# Security, Compliance & Governance — Supplement (Group C)

> Domain 5 (14%). The standards (ISO/OWASP/GenAI Security Scoping Matrix) are covered elsewhere — this section supplements the **AWS services** for Security (Task 5.1) and Governance/Compliance (Task 5.2). Remember: the exam asks "WHICH service for WHAT task", so nail the trigger keyword of each service.

---

## PART A — SECURITY (Task 5.1)

### AWS IAM (Identity and Access Management)
**What it is:** The service that manages *who can access what* on AWS — authentication and authorization for users, groups, and roles across every AWS resource. Free, global.

**Exam-relevant points:**
- **Roles** = temporary identities, granting permissions via *assume role* (no password/long-term key). The RIGHT way for one service (e.g. SageMaker, Lambda, Bedrock) to access another (e.g. S3) — without embedding credentials.
- **Policies** = JSON documents that define permissions (Allow/Deny + Action + Resource + Condition). Identity-based (attached to a user/role) or resource-based (attached to a resource like an S3 bucket).
- **Least privilege** = grant only the minimum permissions needed. A core security principle on the exam.
- IAM handles *access control*, NOT data encryption (that's KMS).
- AI/ML application: assign an IAM role to a SageMaker notebook to read training data in S3; restrict who can call a Bedrock model.

**Choose when...:** "control access to AWS resources", "grant a service permission to access another", "least privilege", "who can do what", "temporary credentials for a workload".

---

### AWS KMS (Key Management Service) + Encryption in transit (TLS)
**What it is:** KMS creates and manages encryption keys to **encrypt data at rest**. TLS/SSL encrypts data **in transit** (traveling over the network).

**Exam-relevant points:**
- **Encryption at rest** (stored data, e.g. in S3, EBS, SageMaker, Bedrock) → use **KMS** keys. Integrated with most AWS services.
- **Encryption in transit** (data moving between client ↔ service) → use **TLS (HTTPS)**.
- KMS: customer-managed keys (CMK) let you control the key and audit key usage via CloudTrail.
- Protect training data, model artifacts, prompts/completions by enabling encryption.
- **Don't confuse:** KMS ≠ Secrets Manager. KMS = manages encryption **keys**; Secrets Manager = stores & automatically rotates **secrets** (DB passwords, API keys).

**Choose when...:** "encrypt data at rest" → KMS; "protect data as it travels / in transit" → TLS; "manage encryption keys".

---

### Amazon Macie
**What it is:** A service that uses ML to **automatically discover, classify, and protect sensitive data (PII) in Amazon S3**.

**Exam-relevant points:**
- Specialized for **S3** — scans buckets to find PII (national ID numbers, credit cards, health information...).
- Alerts on misconfigured buckets (public, unencrypted).
- Important for AI/ML: verify a training dataset in S3 does not contain leaked PII before fine-tuning.
- **Don't confuse:**
  - **Macie** = find **sensitive data/PII in S3** (data-centric).
  - **Inspector** = scan for **software vulnerabilities** (EC2, container, Lambda).
  - **GuardDuty** = detect **threatening behavior/threats** (a threat in progress) — *out of exam scope but a common distractor*.

**Choose when...:** "discover / classify / protect sensitive data or PII", "find PII in S3".

---

### AWS PrivateLink
**What it is:** Provides **private connectivity** between a VPC and AWS services (or SaaS) so that **traffic does not traverse the public internet**.

**Exam-relevant points:**
- Traffic stays within the AWS network, not exposed to the internet → reduces the attack surface (infrastructure protection).
- Used to call Bedrock, a SageMaker endpoint, S3... privately from within a VPC.
- An interface VPC endpoint = how PrivateLink is implemented.
- **Don't confuse:** PrivateLink = keeps traffic *private/off the public internet*. Different from IAM (access control) and KMS (encryption).

**Choose when...:** "keep traffic off the public internet", "private connectivity to a service", "access Bedrock/SageMaker privately from a VPC".

---

### AWS Shared Responsibility Model
**What it is:** A model that divides security responsibility: **AWS handles security *of* the cloud**, **the customer handles security *in* the cloud**.

**Exam-relevant points:**
- **AWS is responsible ("of the cloud"):** hardware, physical infrastructure, network, managed services — e.g. securing the infrastructure that runs Bedrock/SageMaker.
- **The customer is responsible ("in the cloud"):** their own data, IAM permission configuration, encryption, network configuration, managing who accesses the model & data.
- AI/ML application: AWS secures the Bedrock platform; **you** are responsible for IAM permissions, encrypting training data, managing prompts/output, and data quality & privacy.
- With a managed AI service (Bedrock), the customer handles less, but **still always retains responsibility for DATA and ACCESS**.

**Choose when...:** "who is responsible for X — AWS or customer", "security *of* vs *in* the cloud". Remember: **data + access are always the customer's**.

---

### Data security concepts (concepts to know)
| Concept | Meaning & exam cue |
|---|---|
| **Data lineage** | The origin & transformation history of data — where the data came from, what processing it went through. For *source citation / documenting data origins*. |
| **Data cataloging** | Inventorying & organizing the metadata of data assets (e.g. **AWS Glue Data Catalog**) so you know what data you have and where. |
| **Prompt injection** | An attack that injects malicious instructions into the prompt to "hijack" the model into doing something unintended/bypassing guardrails. Prevent with input validation + **Guardrails for Amazon Bedrock**. |
| **Threat detection** | Detecting suspicious/malicious activity (GuardDuty is the classic example). |
| **Vulnerability management** | Finding & patching software/configuration vulnerabilities → **Amazon Inspector**. |
| **Infrastructure protection** | Protecting the network & compute boundary: VPC, security groups, PrivateLink, WAF. |
| **Encryption at rest / in transit** | at rest = KMS; in transit = TLS. |

**Source citation / data origin (5.1):** use **data lineage + data cataloging + SageMaker Model Cards** to document the origin of the data and model.

---

## PART B — GOVERNANCE & COMPLIANCE (Task 5.2)

### AWS Config
**What it is:** **Assess, record, and audit the configuration** of AWS resources over time, and check whether they comply with rules/compliance.

**Exam-relevant points:**
- Answers the question: "**HOW is my resource configured, and is it compliant?**"
- Records configuration history & configuration changes over time.
- Config Rules automatically evaluate compliance (e.g. "every S3 bucket must be encrypted").
- **Don't confuse (asked very often):**
  - **Config** = the state/configuration of a *resource* & its compliance.
  - **CloudTrail** = logs *who called which API, when* (actions).
  - Remember: Config = "**what is configured**", CloudTrail = "**who did what**".

**Choose when...:** "assess/record/audit resource configuration", "is my resource compliant with config rules", "configuration change history".

---

### Amazon Inspector
**What it is:** A service for **automated vulnerability scanning** of workloads — EC2, container images (ECR), Lambda.

**Exam-relevant points:**
- Automatically, continuously detects CVEs/software vulnerabilities & network exposure.
- For **vulnerability management** in the infrastructure running AI/ML.
- **Don't confuse:** Inspector = **software vulnerabilities/CVEs**; Macie = **PII in S3**; Config = **configuration drift/compliance**.

**Choose when...:** "automated vulnerability scanning", "find CVEs / software vulnerabilities in EC2/containers/Lambda".

---

### AWS Audit Manager
**What it is:** **Automatically collects evidence** about AWS usage and **maps it to compliance frameworks** (SOC, PCI, GDPR, ISO...) to prepare for an audit.

**Exam-relevant points:**
- Continuously collects evidence, helping you get *audit-ready* for your own organization.
- Has prebuilt + custom frameworks; reduces manual evidence-collection effort.
- **Don't confuse (asked often):**
  - **Audit Manager** = collect **evidence about YOUR workload** to audit against a framework.
  - **AWS Artifact** = download **AWS's OWN compliance reports** (AWS's certifications).
  - Mnemonic: Audit Manager = *your evidence*; Artifact = *AWS's reports*.

**Choose when...:** "collect evidence for an audit", "map controls to a compliance framework", "continuously audit my own usage".

---

### AWS Artifact
**What it is:** A **self-service portal to download AWS's compliance reports** (SOC 1/2/3, ISO, PCI DSS...) and manage agreements.

**Exam-relevant points:**
- The place to get proof that **AWS** complies with standards — to give to your auditor/customer.
- Does NOT assess your resources — it's just a repository of AWS's documents.
- **Don't confuse:** need **AWS's SOC/ISO reports to download** → Artifact. Need to **collect your own evidence** → Audit Manager.

**Choose when...:** "download AWS SOC / ISO / PCI compliance reports", "get AWS's audit reports/certifications".

---

### AWS CloudTrail
**What it is:** Logs **every API call / activity** in an AWS account — a complete audit trail of *who, what, when, from where*.

**Exam-relevant points:**
- Core for **audit / accountability / forensics**. Records API calls (console, CLI, SDK).
- Used to trace who called Bedrock, who edited an IAM policy, who accessed S3...
- Logs are stored in S3 (can be KMS-encrypted) → for retention & compliance.
- **Don't confuse:**
  - **CloudTrail** = logs *API activity* (who did what) — audit trail.
  - **CloudWatch** = *metrics/logs & monitoring* of performance, alarms (operational, not an audit trail).
  - **Config** = the configuration state of a resource.

**Choose when...:** "log API activity", "audit trail", "who called which API and when", "track user actions for compliance".

---

### AWS Trusted Advisor
**What it is:** Automated checks providing **best-practice recommendations** across 5 pillars: cost optimization, performance, security, fault tolerance, service limits.

**Exam-relevant points:**
- Suggests best-practice fixes (e.g. a public S3 bucket, MFA not enabled, a quota nearly full).
- It is a *recommendation/checks* tool, not a document repository or a log.
- **Don't confuse:** Trusted Advisor = **real-time checks & recommendations** on an account; Well-Architected Tool = **architecture review via a questionnaire/workload**.

**Choose when...:** "best-practice checks / recommendations", "optimize cost, security, performance, fault tolerance, service limits".

---

### AWS Well-Architected Tool
**What it is:** A tool to **review a workload's architecture** based on the AWS Well-Architected Framework (pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability).

**Exam-relevant points:**
- You answer a set of questions → the tool points out risks & improvements for the workload's *design*.
- It is a *design-assessment/governance* tool, not an automated scan like Trusted Advisor.

**Choose when...:** "review my workload/architecture against best-practice pillars", "evaluate architecture design".

---

### AWS Budgets & AWS Cost Explorer (cost governance)
**What it is:** Two cost-governance tools. **Cost Explorer** = analyze & visualize *past* costs + forecast. **Budgets** = set cost/usage thresholds and **alert when they are exceeded**.

**Exam-relevant points:**
- **Cost Explorer** → *analyze/understand* spending trends (e.g. Bedrock token cost, SageMaker inference cost over time).
- **Budgets** → *set a limit + proactive alert* when cost/usage exceeds a threshold.
- Cost governance for AI/ML: track inference/token costs, avoid going over budget.
- **Don't confuse:** Cost Explorer = *analyze/visualize* (look back + forecast); Budgets = *set a limit + alert* (proactive alerting).

**Choose when...:** "get alerted when spending exceeds a threshold" → Budgets; "analyze/visualize/forecast past spend" → Cost Explorer.

---

### Compliance standards
| Standard | Meaning for the exam |
|---|---|
| **ISO** (International Organization for Standardization) | A set of international standards. E.g. **ISO/IEC 27001** (information security). |
| **ISO/IEC 42001** | The **first international standard for an AI Management System (AIMS)** — governing responsible development & use of AI. AWS has achieved certification. Cue: "AI management system standard". |
| **SOC** (System and Organization Controls) | SOC 1/2/3 reports about a service provider's internal controls. Download via **AWS Artifact**. |
| **Algorithm accountability laws** | Laws requiring transparency/fairness/non-bias & accountability for automated decision-making systems (e.g. EU AI Act). Cue: "regulation requiring transparency/fairness/accountability of algorithms". |

---

### Data governance strategies
| Strategy | Meaning & exam cue |
|---|---|
| **Data lifecycle** | Managing data from creation → use → storage → deletion (e.g. S3 Lifecycle moving to Glacier then expiring). |
| **Logging** | Logging activity & access (CloudTrail, CloudWatch) for audit & monitoring. |
| **Residency** | **Data residency** = data must stay in a specific region/country (choose the right AWS Region to comply with local law). |
| **Retention** | How long to keep data per legal/compliance requirements before deleting. |
| **Monitoring / observation** | Continuously monitor systems, data, and models to detect anomalies/drift. |

**Governance protocols (5.2):** policies, review cadence, governance frameworks (e.g. the **Generative AI Security Scoping Matrix**), transparency standards, team training — covered in the standards section.

---

## CHEAT — which service for which task?

| Task to do | Service |
|---|---|
| Log API calls / audit trail (who did what, when) | **AWS CloudTrail** |
| Assess & record **resource configuration** + compliance rules | **AWS Config** |
| Detect / protect **PII in S3** | **Amazon Macie** |
| **Scan for vulnerabilities** (CVEs) in EC2/container/Lambda | **Amazon Inspector** |
| Download **AWS's SOC/ISO reports** | **AWS Artifact** |
| **Collect evidence** & map to a framework to audit *your own* usage | **AWS Audit Manager** |
| **Best-practice recommendations** (cost/security/perf/limits) | **AWS Trusted Advisor** |
| **Review architecture** against the 6 pillars | **AWS Well-Architected Tool** |
| **Alert when over budget** | **AWS Budgets** |
| **Analyze/visualize past cost** + forecast | **AWS Cost Explorer** |
| Control **who accesses what** (roles, least privilege) | **AWS IAM** |
| **Encrypt at rest** / manage keys | **AWS KMS** |
| **Encrypt in transit** | **TLS / HTTPS** |
| Store & rotate **secrets** (passwords, API keys) | **AWS Secrets Manager** |
| Keep traffic **private, off the public internet** | **AWS PrivateLink** |
| Monitor metrics/logs & **operational** alerting | **Amazon CloudWatch** |

### EASILY CONFUSED pairs — quick recall
- **Config vs CloudTrail:** Config = *resource configuration* (state); CloudTrail = *API activity* (who did what).
- **CloudTrail vs CloudWatch:** CloudTrail = audit *API calls*; CloudWatch = *monitoring* operational metrics/logs.
- **Macie vs Inspector vs GuardDuty:** Macie = *PII in S3*; Inspector = *software vulnerabilities*; GuardDuty = *threat detection* (malicious behavior).
- **Artifact vs Audit Manager:** Artifact = download *AWS's reports*; Audit Manager = collect *your evidence*.
- **Trusted Advisor vs Well-Architected Tool:** Trusted Advisor = *automated checks + recommendations*; WA Tool = *architecture design review*.
- **KMS vs Secrets Manager:** KMS = *encryption keys*; Secrets Manager = *secrets (passwords/API keys) + auto-rotate*.
- **Budgets vs Cost Explorer:** Budgets = *set a threshold + alert*; Cost Explorer = *analyze/visualize/forecast*.
