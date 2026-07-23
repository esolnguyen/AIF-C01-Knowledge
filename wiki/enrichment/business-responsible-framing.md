# Business & Responsible AI Framing — Supplement (Group B)

> A page supplementing the "business & responsible-AI framing" (business mindset + responsible AI) — content that is heavy in **Domain 2 (24%)** and **Domain 4 (14%)** and is often missing from technically focused courses.

---

## A. GenAI capabilities & limitations for business (Task 2.2)

### A.1 Advantages of GenAI
- **Adaptability:** a single foundation model handles many tasks (summarize, translate, code, chat) without retraining — just change the prompt.
- **Responsiveness:** generates content/answers in near real time, supporting instant conversational experiences.
- **Simplicity:** lowers the technical barrier — use natural language instead of writing code/ML pipelines; shortens time-to-market.

🎯 **Exam tip:** If the question emphasizes "one model used for many different use cases" → choose **adaptability**; "easy to use, no ML expert needed" → **simplicity**.

### A.2 Disadvantages / limitations
- **Hallucinations:** produces information that sounds plausible but is **wrong/fabricated**. This is the go-to distractor for any reliability risk.
- **Interpretability:** the model is a "black box", hard to explain **why** it produced that result.
- **Inaccuracy:** the output can be factually wrong, outdated, or out of context.
- **Nondeterminism:** the same prompt can produce **multiple different answers** (due to sampling/temperature) → hard to reproduce, hard to test.

🎯 **Exam tip:** "Need the same input → same output every time" is the **nondeterminism** weakness; if this requirement is mandatory then GenAI is **not** appropriate (see section B).

### A.3 Factors to select a GenAI model
- **Model type:** text LLM, multimodal, image/diffusion, embedding… — must match the modality of the problem.
- **Performance requirements:** latency, throughput, output quality.
- **Capabilities:** multilingual, context length, reasoning, code, function calling.
- **Constraints:** cost, token limits, infrastructure, model size.
- **Compliance:** data residency, industry regulations, licensing, privacy.

### A.4 Business value & metrics
| Metric | Meaning (one line) |
|---|---|
| **Cross-domain performance** | The model performs well across **many different domains/tasks**, not just one narrow domain. |
| **Efficiency** | Saves time/cost/effort compared to doing it manually. |
| **Conversion rate** | % of users who take the desired action (buy, sign up) — measures commercial impact. |
| **Average revenue per user (ARPU)** | Average revenue per user. |
| **Accuracy** | How correct/reliable the output is — the quality of GenAI responses. |
| **Customer lifetime value (CLV/CLTV)** | The total value a customer brings over the lifetime of the relationship. |

🎯 **Exam tip:** Distinguish **model metrics** (accuracy, AUC, F1 — section C) from **business metrics** (ARPU, CLV, conversion rate, ROI). A question like "measure the **business** impact of a GenAI solution" → choose ARPU/CLV/conversion, **not** F1/AUC.

---

## B. When AI/ML is (not) appropriate (Task 1.2)

### B.1 Where AI/ML creates value
- **Assist human decision-making:** suggest/rank so a human makes the final decision (e.g. assisted diagnosis, risk scoring).
- **Scalability:** handle large volumes beyond human capacity (millions of transactions/images/documents).
- **Automation:** replace repetitive, labor-intensive tasks (classification, extraction, front-line responses).

### B.2 When you should NOT use AI/ML
- **Cost-benefit doesn't add up:** the cost to build/operate/gather data exceeds the benefit gained.
- **A deterministic/exact result is required** instead of a **probabilistic prediction:** payroll, tax, accounting calculations → use **rule-based/formula**, not ML.
- **Interpretability / legal certainty is mandatory:** when the law requires a clear explanation of each decision that the model cannot provide.
- **Insufficient / poor-quality data:** too little data, noisy/biased data → the model is not trustworthy.

🎯 **Exam tip:** The keyword **"a specific/exact outcome is needed instead of a prediction"** → the answer is **do NOT use AI/ML**, use deterministic logic. This is the classic trap of Task 1.2.

---

## C. Business metrics vs model metrics (Task 1.3)

### C.1 Model (technical) metrics — quick recap
- **Accuracy:** the fraction of correct predictions out of the total. Misleading when the data is **imbalanced**.
- **AUC (Area Under ROC Curve):** the model's ability to **distinguish** the positive/negative class; 1.0 = perfect, 0.5 = random guessing.
- **F1 score:** the harmonic mean of **precision & recall** — good for rare/imbalanced classes.

### C.2 Business metrics
- **Cost per user:** the cost to serve each user (including inference/tokens).
- **Development cost:** the cost to build, train, and deploy the solution.
- **Customer feedback:** customer responses/ratings/satisfaction.
- **ROI (Return on Investment):** the profit gained versus the cost spent — the overall measure of project value.

🎯 **Exam tip:** Model metric = "how **good** the model is technically"; Business metric = "what **value** the solution delivers to the business". Don't confuse the two groups.

---

## D. Responsible AI — framing (Domain 4)

### D.1 Features of responsible AI (Task 4.1)
- **Bias:** systematic error that causes some groups/outcomes to be treated unfairly.
- **Fairness:** fair treatment across individuals/demographic groups.
- **Inclusivity:** serving diverse user groups, leaving no one out.
- **Robustness:** operating stably against noisy, anomalous data, or attacks.
- **Safety:** preventing harmful/toxic/dangerous output.
- **Veracity:** output that is truthful and trustworthy (counters hallucination).

🎯 **Exam tip:** **Guardrails for Amazon Bedrock** is the main tool to filter toxic content/blocked topics; **SageMaker Clarify** to detect **bias** and provide explainability; **Amazon A2I** to add **human review** into the loop.

### D.2 Legal risks of GenAI
- **IP infringement claims:** output may copy/infringe copyright or trademarks from the training data.
- **Biased outputs:** biased results → risk of discrimination, litigation.
- **Loss of customer trust:** wrong/biased output erodes customer trust.
- **End-user risk:** users act on wrong information → real-world harm.
- **Hallucinations:** fabricated information can lead to legal liability.

### D.3 Dataset characteristics for responsible AI
- **Inclusivity:** data represents all relevant groups.
- **Diversity:** diverse sources, contexts, demographics.
- **Curated data sources:** sources that are selected, quality-checked, with clear provenance.
- **Balanced datasets:** balance across classes/groups to avoid the model skewing toward the majority group.

### D.4 Bias vs variance (Task 4.1)
- **Underfitting (high bias):** the model is too simple → underlearns, wrong on both train and test.
- **Overfitting (high variance):** memorizes the training data (including noise) → poor on new data.
- **Effect on demographic groups:** bias in the data → the model is **less accurate** for under-represented groups → **unfair** outcomes.

🎯 **Exam tip:** "Good on train, bad on new data" = **overfitting/variance**; "bad everywhere, too simple" = **underfitting/bias**.

### D.5 Transparency & explainability (Task 4.2)
- **Transparent/explainable models** (linear/logistic regression, decision tree): easy to understand why a decision was made.
- **Opaque/"black-box" models** (deep neural nets, large LLMs): more powerful but hard to interpret.
- **Interpretability ↔ performance tradeoff:** typically the more powerful/complex the model, the harder it is to explain; weigh this by context (healthcare, finance, legal → prioritize interpretability).
- **Human-centered design for explainable AI:** human-centered design — provide understandable explanations, allow humans to oversee/intervene (human-in-the-loop), be transparent about the model's limitations.
- **Tools:** **SageMaker Model Cards** (document purpose/limitations/performance), **SageMaker Clarify** (feature importance/explainability), open-source models + data + licensing (increase transparency).

### D.6 Sustainability / environmental considerations
- Training & inference of large models consume a lot of **energy/resources** → consider this when choosing a model.
- Responsible practices: choose a **model just small enough** for the task, reuse **pre-trained/foundation models** instead of training from scratch, use fine-tuning/RAG instead of pre-training, choose energy-efficient hardware/infrastructure.

🎯 **Exam tip:** When the question asks for the "responsible practice to **select** a model" and there is an option about **environmental/sustainability** → that is usually the correct answer for this aspect; prioritize reusing an existing model and choosing an appropriate size.

---

### Quick recall (wrap-up)
- **Adaptability / responsiveness / simplicity** = GenAI advantages; **hallucination / interpretability / inaccuracy / nondeterminism** = disadvantages.
- **Exact outcome needed** → don't use ML.
- **F1/AUC/accuracy** = model metrics; **ROI/ARPU/CLV/conversion** = business metrics.
- Responsible AI = **bias, fairness, inclusivity, robustness, safety, veracity** + transparency + sustainability.
- Tools: **Bedrock Guardrails, SageMaker Clarify, Model Monitor, Model Cards, Amazon A2I**.
