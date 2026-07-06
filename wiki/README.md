# 📚 AWS Certified AI Practitioner (AIF-C01) — Study Wiki

Wiki tự học được build từ **284 screenshot** khóa học ExamPro (freeCodeCamp) đã capture trong `../AIC/`.
Toàn bộ slide đã được đọc, transcribe thành notes chi tiết và phân loại theo **5 exam domain** của kỳ thi AIF-C01.

---

## 🗂️ Điều hướng nhanh

| Trang | Mục đích |
|-------|----------|
| **[INDEX.md](INDEX.md)** | Index đầy đủ — 179 topic theo đúng thứ tự bài giảng, có link tới notes chi tiết |
| **[PROGRESS.md](PROGRESS.md)** | Bảng checklist theo dõi tiến độ ôn tập, gom theo domain (tick ☐ → ☑) |
| **[GAP-ANALYSIS.md](GAP-ANALYSIS.md)** | Đối chiếu slide vs official exam guide — chỗ nào đã đủ, chỗ nào cần bổ sung |
| **[parts/](parts/)** | 10 file notes chi tiết (part-00 → part-09) theo thứ tự slide |
| **[enrichment/](enrichment/)** | Notes bổ sung vá lỗ hổng: managed AI services, security & governance, business framing |
| **[practice-questions/](practice-questions/)** | 60 câu trắc nghiệm kiểu đề thi theo 5 domain (có đáp án + giải thích) |

---

## 🎯 5 Exam Domains (AIF-C01)

| Domain | Tên | Trọng số thi | Notes ở đâu nhiều |
|--------|-----|:---:|-----|
| **D1** | Fundamentals of AI and ML | 20% | part-00, 01, 04, 05, 09 |
| **D2** | Fundamentals of Generative AI | 24% | part-01, 04 |
| **D3** | Applications of Foundation Models | 28% | part-02, 03, 04, 06, 07, 08, 09 |
| **D4** | Guidelines for Responsible AI | 14% | part-04, 07, 09 |
| **D5** | Security, Compliance & Governance for AI | 14% | part-04, 06, 07, 09 |

> Trọng số theo AWS exam guide chính thức (bản AIF-C01). Dùng để ưu tiên thời gian ôn: **D3 và D2 chiếm hơn nửa đề thi.**

---

## 📖 Các file notes theo thứ tự bài giảng

| File | Nội dung chính |
|------|----------------|
| [part-00.md](parts/part-00.md) | ML basics: Regression/Classification/Clustering, SL/UL/RL, Neural Networks, Activation Functions, Model/Feature |
| [part-01.md](parts/part-01.md) | Inference, hyperparameters, data concepts, **GenAI/LLM/Transformer/Tokenization/Embeddings/Attention** |
| [part-02.md](parts/part-02.md) | Fine-tuning LLMs, **Amazon Bedrock** (Model Catalog, Playgrounds, Prompt Engineering, Knowledge Bases/RAG) |
| [part-03.md](parts/part-03.md) | Bedrock Knowledge Bases (RAG demo), **Agents**, Prompt Flow/Manager, Custom Models, fmeval |
| [part-04.md](parts/part-04.md) | Bedrock Image Gen, **Guardrails**, Logging, Model Evaluation, Vector Stores, PartyRock, ML Workflow |
| [part-05.md](parts/part-05.md) | **SageMaker**: Data Wrangler, Canvas, AutoML/Autopilot, Feature Store, Endpoints, Python SDK |
| [part-06.md](parts/part-06.md) | SageMaker SDK, **Ground Truth** (labeling), Automatic Model Tuning, Inference Pipelines |
| [part-07.md](parts/part-07.md) | SageMaker Hosting/Batch/Monitor/Pipelines, **Clarify (bias)**, Model Cards, **Evaluation Metrics** |
| [part-08.md](parts/part-08.md) | **AWS AI Services**: Amazon Q, CodeWhisperer, CodeGuru, Comprehend, Forecast, Fraud Detector, Kendra, Lex, Polly |
| [part-09.md](parts/part-09.md) | Polly/Rekognition, **ISO/OWASP/Security Scoping**, Athena, **AWS Glue**, Data Lakes, Lake Formation |

---

## ➕ Enrichment — bổ sung lỗ hổng so với exam guide

Sau khi đối chiếu với official exam guide ([GAP-ANALYSIS.md](GAP-ANALYSIS.md)), 3 trang sau vá các chỗ slide chưa cover:

| File | Nội dung |
|------|----------|
| [enrichment/managed-ai-services.md](enrichment/managed-ai-services.md) | Transcribe, Translate, Personalize, Textract, Amazon A2I, SageMaker JumpStart |
| [enrichment/security-governance.md](enrichment/security-governance.md) | IAM, KMS, Macie, PrivateLink, Config, Inspector, Audit Manager, Artifact, CloudTrail, Trusted Advisor + cheat table |
| [enrichment/business-responsible-framing.md](enrichment/business-responsible-framing.md) | Ưu/nhược GenAI, khi nào không dùng AI, business metrics, rủi ro pháp lý, explainability |

## 📝 Luyện đề

**[practice-questions/](practice-questions/)** — 60 câu trắc nghiệm kiểu đề thi theo 5 domain, có đáp án + giải thích ẩn. Bắt đầu ở [practice-questions/README.md](practice-questions/README.md).

---

## 🔗 Tài liệu gốc
- Khóa học: **www.exampro.co/aif-c01** (ExamPro — Andrew Brown)
- Screenshot gốc: thư mục `../AIC/` (284 file, đặt tên theo timestamp capture)

*Wiki generated 2026-07-06.*
