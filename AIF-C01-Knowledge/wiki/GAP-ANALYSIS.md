# 🔍 GAP ANALYSIS — Screenshots vs Official Exam Guide (AIF-C01 v1.4)

Compares the **179 captured topics** against the **official AWS exam guide** (task statements + in-scope services).
Source: [AWS Certified AI Practitioner Exam Guide PDF](https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf).

---

## 🎯 TL;DR — Is it enough?

**Nearly enough, but not quite.** The screenshots you captured cover ~**80%** of the exam and even go **DEEPER than needed** on the technical ML parts (activation functions, perceptron, Ground Truth labeling, inference pipelines — this exam is *foundational*, and "code/build a model" is out of scope).

But there's **~20% of real gaps**, concentrated in 3 groups:
1. **Some AWS services named in the exam guide that the slides never mention** → the exam often asks "which service does X".
2. **"Business framing" questions** (GenAI pros/cons, when NOT to use AI, business metrics, legal risks) — the slides are technically oriented, so this part is thin.
3. **Domain 5 (Security & Governance) — the weakest** — the slides cover ISO/OWASP/Scoping Matrix but completely miss the AWS security/governance services.

➡️ **Conclusion: YES, some web searching is needed to fill in — but it's just "patching" a narrow list, not relearning.**

---

## 📊 Scorecard by domain

| Domain | Weight | Coverage | Comment |
|--------|:---:|:---:|----------|
| D1 — AI/ML Fundamentals | 20% | ✅ Strong (excess) | Missing a few managed services (Transcribe, Translate); business metrics thin |
| D2 — Generative AI | 24% | ⚠️ Decent | Concepts covered; **business framing (2.2) thin**; missing SageMaker JumpStart |
| D3 — Applications of FM | 28% | ✅ Strong | Very complete; only missing AWS's vector-DB list + some risk vocab |
| D4 — Responsible AI | 14% | ⚠️ Decent | Missing Amazon A2I, legal risks, sustainability |
| D5 — Security & Governance | 14% | ❌ Weak | **Completely missing the AWS security/governance services** |

---

## 🕳️ Group A — AWS services in the exam guide but NOT covered by slides

> The exam very often asks "which service is used for...". You need to remember the name + a one-line purpose.

| Service | Remember (one line) | Domain |
|---------|------------------|:---:|
| **Amazon Transcribe** | Speech-to-text (audio → text) | D1 |
| **Amazon Translate** | Language translation using neural MT | D1 |
| **Amazon Personalize** | Recommendation engine (real-time suggestions) | D1/D3 |
| **Amazon Textract** | Extract text/table/form from scanned documents (only briefly mentioned in Canvas) | D1 |
| **Amazon A2I (Augmented AI)** | Human review/loop for low-confidence ML predictions | D4 |
| **SageMaker JumpStart** | Hub of pre-trained models + solution templates (fast deployment) | D2 |
| **AWS security/governance stack** | See Group C below | D5 |

## 🧠 Group B — "Business framing" questions (concepts, no service)

The slides are technically oriented so the following points are thin — but the exam asks a lot about them (especially D2 24%, D4):

- **GenAI advantages:** adaptability, responsiveness, simplicity.
- **GenAI disadvantages:** hallucinations, poor interpretability, inaccuracy, **nondeterminism**.
- **When NOT to use AI/ML:** cost-benefit not favorable, when you need a *deterministic* result rather than a *prediction*.
- **Business value metrics:** conversion rate, average revenue per user (ARPU), customer lifetime value (CLV), cross-domain performance, ROI, cost per user.
- **GenAI legal risks (D4):** IP infringement, biased outputs, loss of customer trust, end-user risk, hallucinations.
- **Sustainability:** consider the environmental impact when choosing a model.
- **Human-centered design** for explainable AI; tradeoff **interpretability ↔ performance**.

## 🔒 Group C — Domain 5 Security & Governance (the biggest gap)

The slides **completely miss** these services (the exam guide names them explicitly):

**Secure AI systems (5.1):**
- **IAM** (roles/policies/permissions), **AWS KMS** (encryption at rest), encryption in transit
- **Amazon Macie** (detect PII/sensitive data in S3), **AWS PrivateLink** (private access without going over the internet)
- **AWS Shared Responsibility Model**, prompt injection, threat detection, vulnerability management
- Data lineage / data cataloging / SageMaker Model Cards (data provenance)

**Governance & compliance (5.2):**
- Standards: **ISO** (already have ISO 42001), **SOC**, algorithm accountability laws (already have)
- **AWS Config** (configuration assessment), **Amazon Inspector** (vulnerability scanning), **AWS Audit Manager** (collect audit evidence)
- **AWS Artifact** (download compliance reports), **AWS CloudTrail** (API logging), **AWS Trusted Advisor** (best practices)
- **AWS Well-Architected Tool**, **AWS Budgets / Cost Explorer** (cost management)
- Data governance: lifecycle, logging, residency, retention, monitoring

## ✅ Group D — Areas where you're OVER-STUDYING (can go easy)

The exam is foundational and "build/code a model" is **out of scope**, so you don't need to dig as deep as the slides on the following:
- Activation functions in detail (ReLU/ELU/Swish/Maxout…) → just know the concept.
- Perceptron/backprop internals.
- SageMaker Ground Truth per labeling type, inference pipelines, multi-container endpoints, SDK env vars → knowing *what* SageMaker does is enough, no need for API level.
- Tokenization details (BPE/WordPiece/SentencePiece) → knowing "what a token is" is enough.

> 💡 Shifting time from Group D to Groups A/B/C is more effective for your exam score.

---

## 🛠️ Recommended actions

1. **Add notes for Groups A + C** (one card per service: purpose, when to use, exam keywords) — pulled from AWS docs.
2. **Write a "Business & Responsible AI framing" page** for Group B.
3. **Generate practice questions** aligned to the 5 domains (especially D2/D3/D5) to build reflexes.

*Gap analysis 2026-07-06 — based on exam guide v1.4.*
