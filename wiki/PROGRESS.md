# ✅ PROGRESS TRACKER — AIF-C01

Tracks study progress **grouped by the 5 exam domains** (unlike [INDEX.md](INDEX.md) which is grouped by lecture order).
Studying by domain helps you stay aligned with the exam weights. Tick `[ ]` → `[x]` when you finish a topic.
The number in parentheses `(00-01)` is the topic code — look up the details in [INDEX.md](INDEX.md) and the corresponding notes file.

## 📊 Progress overview

| Domain | Topic area | Weight | # topics | Studied |
|--------|--------|:---:|:---:|:---:|
| **D1** | Fundamentals of AI and ML | 20% | 80 | ` __ / 80 ` |
| **D2** | Fundamentals of Generative AI | 24% | 12 | ` __ / 12 ` |
| **D3** | Applications of Foundation Models | 28% | 72 | ` __ / 72 ` |
| **D4** | Guidelines for Responsible AI | 14% | 7 | ` __ / 7 ` |
| **D5** | Security, Compliance & Governance | 14% | 8 | ` __ / 8 ` |
| | **Total** | 100% | **179** | ` __ / 179 ` |

> 💡 Prioritize studying **D3 (28%) + D2 (24%) = 52% of the exam**. D1 has the most topics but most of it is easy foundational knowledge.

---

## D1 — Fundamentals of AI and ML (80 topics) → notes: part-00, 01, 04, 05, 09

### Core ML concepts
- [ ] Regression (00-01) · Classification (00-02) · Clustering (00-03)
- [ ] Types of ML (00-04) · Division of ML (00-05) · Classical ML (00-06)
- [ ] Supervised vs Unsupervised (00-07) · SL/UL/RL (00-08)
- [ ] Supervised Learning Models (00-09) · Unsupervised Learning Models (00-10)
- [ ] Algorithm vs Function / K-NN (00-26) · ML Model (00-27) · Feature (00-28)

### Neural Networks & Deep Learning
- [ ] Neural Networks & Deep Learning (00-11)
- [ ] Perceptrons intro (00-12) · Basic Perceptron Network (00-13)

### Activation Functions
- [ ] Activation Functions concept (00-14) · Types (00-15)
- [ ] Linear (00-16) · Binary Step (00-17) · Sigmoid (00-18) · Tanh (00-19)
- [ ] ReLU (00-20) · Leaky ReLU (00-21) · ELU (00-22)
- [ ] Swish (00-23) · Maxout (00-24) · Softmax (00-25)

### Data & Inference concepts
- [ ] Inference (01-01) · Parameters vs Hyperparameters (01-02)
- [ ] Labeling (01-04) · Data Mining (01-05) · Data Mining Methods (01-06) · Knowledge Mining (01-07)
- [ ] Data Wrangling (01-08) · Data Modeling (01-09) · Data Analytics (01-10)
- [ ] Data Scientist (01-11) · Data Role Comparisons (01-12)
- [ ] Train/Test/Validation (01-13) · Corpus (01-14) · Data Types (01-15)

### ML Workflow & SageMaker platform
- [ ] General ML Workflow (04-08) · SageMaker ML Pipeline (04-09 / 05-01)
- [ ] Data Readiness (05-02) · AWS Data Wrangler Library (05-03) · SageMaker Data Wrangler (05-04)
- [ ] SageMaker Canvas (05-05) · Canvas Datasets (05-06)
- [ ] AutoML (05-07) · Canvas Autopilot (05-08) · Autopilot Problem Types (05-09) · Ready-to-Use Models (05-10)

### SageMaker Feature Store
- [ ] Feature Store (05-11) · Components (05-12) · Data Ingestion (05-13)
- [ ] Streaming Ingestion (05-14) · Batch Ingestion (05-15) · API (05-16)
- [ ] Data Wrangler→Feature Store (05-17) · Feature Store→Athena (05-18)

### SageMaker Endpoints & SDK
- [ ] Endpoints (05-19) · Python SDK (05-20) · Training Script env (05-21) · Local Mode (05-22)

### Data services (Athena / Glue / Data Lakes)
- [ ] Athena (09-07) · SQL Components (09-08) · Data Types (09-09) · Tables (09-10)
- [ ] AWS Glue (09-11) · Glue Studio (09-12) · Glue Jobs (09-13)
- [ ] Glue Data Catalog (09-14) · Crawlers (09-15) · Data Quality (09-16) · DataBrew (09-17)
- [ ] Data Lakes intro (09-18) · Lake Formation (09-19)
- [ ] Regression Metrics recap (08-01)

## D2 — Fundamentals of Generative AI (12 topics) → notes: part-01, 04, 07

- [ ] AI vs Generative AI (01-16) · Foundational Model (01-17) · LLM (01-18)
- [ ] Transformer Architecture (01-19) · Tokenization (01-20) · Tokens & Capacity (01-21)
- [ ] Embeddings (01-22) · Positional Encoding (01-23) · Attention (01-24)
- [ ] Bedrock Image Generation (04-02) · PartyRock (04-07)
- [ ] Deep Learning Metrics — Inception Score / FID (07-26)

## D3 — Applications of Foundation Models (72 topics) → notes: part-02, 03, 04, 06, 07, 08, 09

### Fine-tuning & Amazon Bedrock core
- [ ] Fine Tuning LLMs (02-01) · Amazon Bedrock (02-02) · Model Catalog (02-03) · Deployment Models (02-04)
- [ ] Playgrounds (02-05) · Prompt Engineering demo (02-06) · Text Generation demo (02-07) · Knowledge Bases/RAG (02-08)

### Bedrock RAG / Agents / Flows / Custom Models
- [ ] Knowledge Bases & RAG demo (03-01) · Agents (03-02) · Agents demo (03-03)
- [ ] Prompt Flow (03-04) · Prompt Manager (03-05)
- [ ] Custom Models (03-06) · Pricing (03-07) · Import Models (03-08) · Fine-tuning demo (03-09)
- [ ] FM Evaluations fmeval (03-10 / 08-02) · Training Datasets JSONL (03-11)
- [ ] Bedrock Fine-tuning Job (04-01) · Model Evaluation (04-05) · Third-Party Vector Stores (04-06)

### SageMaker SDK & Ground Truth (labeling)
- [ ] SDK Session (06-01) · Training Source (06-02) · Training Channels (06-03)
- [ ] Ground Truth overview (06-04) · Input Manifest (06-05) · Task Templates (06-07)
- [ ] Labeling Images (06-08) · Text (06-09) · Video (06-10) · Point Cloud (06-11)
- [ ] Custom Labeling (06-12) · Crowd HTML (06-13) · Managing Workforces (06-14)

### Automatic Model Tuning & Inference
- [ ] Automatic Model Tuning (06-16) · Use Case (06-17) · How It Works (06-18)
- [ ] Deploy for Inference (06-19) · Inference Pipelines (06-20) · Feature Processing (06-21)
- [ ] Create Model (07-01) · Pre/Post Variants (07-02) · Hosting Services (07-03) · Batch Transform (07-04)
- [ ] Multi-Model Endpoints (07-05) · Multi-Container Endpoints (07-06) · Model Monitor (07-07)
- [ ] Processing (07-09) · SciKit-Learn (07-10) · Apache Spark (07-11)
- [ ] SageMaker Pipelines (07-12) · Pipeline Definition (07-13)

### Evaluation Metrics
- [ ] What are Metrics? (07-19) · Confusion Matrix (07-20) · Accuracy & F1 (07-21) · ROC & AUC (07-22)
- [ ] Ranking Metrics (07-23) · Computer Vision Metrics (07-24) · NLP Metrics (07-25)

### AWS AI Services (managed)
- [ ] Amazon Q (08-03) · CodeWhisperer (08-04) · CodeGuru (08-05) · Comprehend (08-06)
- [ ] Forecast (08-07) · Fraud Detector (08-08) · Kendra (08-09) · Lex (08-10) · Polly (08-11)
- [ ] Polly SSML (09-01) · Rekognition (09-02)

## D4 — Guidelines for Responsible AI (7 topics) → notes: part-01, 04, 07, 09

- [ ] AWS AI Service Cards (01-03) · Bedrock Guardrails (04-03)
- [ ] SageMaker Clarify (07-14) · Clarify Terminologies (07-15) · SHAP (07-16) · Measuring Bias (07-17)
- [ ] Algorithmic Accountability Act (09-04)

## D5 — Security, Compliance & Governance for AI (8 topics) → notes: part-04, 06, 07, 09

- [ ] Bedrock Invocation Logging (04-04)
- [ ] Ground Truth CORS (06-06) · Private Workforce Cognito/OIDC (06-15)
- [ ] Model Registry (07-08) · SageMaker Model Cards (07-18)
- [ ] ISO/IEC 42001 AI Standards (09-03) · GenAI Security Scoping Matrix (09-05) · OWASP Top 10 LLM (09-06)

---

## 🔁 Suggested study schedule
1. **Round 1 — build the foundation:** read part-00 → part-09 in order per [INDEX.md](INDEX.md).
2. **Round 2 — by domain:** study using this page, prioritizing D3 → D2 → D1 → D4 → D5.
3. **Round 3 — practice exams:** take the practice exam at www.exampro.co/aif-c01, and go back to the notes for questions you got wrong.
