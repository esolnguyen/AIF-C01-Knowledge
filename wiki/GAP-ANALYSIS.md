# 🔍 GAP ANALYSIS — Screenshot vs Official Exam Guide (AIF-C01 v1.4)

So sánh **179 topic đã capture** với **official AWS exam guide** (task statements + in-scope services).
Nguồn: [AWS Certified AI Practitioner Exam Guide PDF](https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf).

---

## 🎯 TL;DR — Đủ chưa?

**Gần đủ, nhưng chưa hẳn.** Đống ảnh bạn chụp phủ được ~**80%** đề thi và thậm chí **sâu HƠN mức cần** ở phần kỹ thuật ML (activation functions, perceptron, Ground Truth labeling, inference pipelines — kỳ thi này là *foundational*, và "code/build model" nằm ngoài phạm vi thi).

Nhưng có **~20% là lỗ hổng thật**, tập trung ở 3 nhóm:
1. **Một số AWS service có tên trong exam guide nhưng slide chưa hề nhắc** → thi hay hỏi "service nào làm việc X".
2. **Câu hỏi mang tính "business framing"** (ưu/nhược GenAI, khi nào KHÔNG nên dùng AI, business metrics, rủi ro pháp lý) — slide thiên kỹ thuật nên phần này mỏng.
3. **Domain 5 (Security & Governance) — yếu nhất** — slide có ISO/OWASP/Scoping Matrix nhưng thiếu hẳn bộ AWS security/governance services.

➡️ **Kết luận: CÓ, cần websearch bổ sung — nhưng chỉ là "vá" một danh sách hẹp, không phải học lại.**

---

## 📊 Scorecard theo domain

| Domain | Trọng số | Mức phủ | Nhận xét |
|--------|:---:|:---:|----------|
| D1 — AI/ML Fundamentals | 20% | ✅ Mạnh (dư) | Thiếu vài managed service (Transcribe, Translate); business metrics mỏng |
| D2 — Generative AI | 24% | ⚠️ Khá | Concept đủ; **business framing (2.2) mỏng**; thiếu SageMaker JumpStart |
| D3 — Applications of FM | 28% | ✅ Mạnh | Rất đầy đủ; chỉ thiếu list vector-DB của AWS + vài risk vocab |
| D4 — Responsible AI | 14% | ⚠️ Khá | Thiếu Amazon A2I, rủi ro pháp lý, sustainability |
| D5 — Security & Governance | 14% | ❌ Yếu | **Thiếu hẳn bộ AWS security/governance services** |

---

## 🕳️ Nhóm A — AWS services có trong exam guide nhưng slide CHƯA cover

> Thi rất hay hỏi kiểu "dịch vụ nào dùng cho...". Cần nhớ tên + 1 câu công dụng.

| Service | Cần nhớ (1 dòng) | Domain |
|---------|------------------|:---:|
| **Amazon Transcribe** | Speech-to-text (audio → văn bản) | D1 |
| **Amazon Translate** | Dịch ngôn ngữ bằng neural MT | D1 |
| **Amazon Personalize** | Recommendation engine (gợi ý real-time) | D1/D3 |
| **Amazon Textract** | Trích text/table/form từ tài liệu scan (chỉ thoáng qua ở Canvas) | D1 |
| **Amazon A2I (Augmented AI)** | Human review/loop cho dự đoán ML độ tin thấp | D4 |
| **SageMaker JumpStart** | Hub model pre-trained + solution templates (deploy nhanh) | D2 |
| **AWS security/governance stack** | Xem Nhóm C bên dưới | D5 |

## 🧠 Nhóm B — Câu hỏi "business framing" (concept, không có service)

Slide thiên kỹ thuật nên các điểm sau mỏng — nhưng thi hỏi nhiều (nhất là D2 24%, D4):

- **Ưu điểm GenAI:** adaptability, responsiveness, simplicity.
- **Nhược điểm GenAI:** hallucinations, interpretability kém, inaccuracy, **nondeterminism**.
- **Khi nào KHÔNG nên dùng AI/ML:** cost-benefit không lợi, khi cần kết quả *xác định* thay vì *dự đoán*.
- **Business value metrics:** conversion rate, average revenue per user (ARPU), customer lifetime value (CLV), cross-domain performance, ROI, cost per user.
- **Rủi ro pháp lý GenAI (D4):** IP infringement, biased outputs, loss of customer trust, end-user risk, hallucinations.
- **Sustainability:** cân nhắc môi trường khi chọn model.
- **Human-centered design** cho explainable AI; tradeoff **interpretability ↔ performance**.

## 🔒 Nhóm C — Domain 5 Security & Governance (lỗ hổng lớn nhất)

Slide **thiếu hẳn** các service này (exam guide nêu đích danh):

**Secure AI systems (5.1):**
- **IAM** (roles/policies/permissions), **AWS KMS** (encryption at rest), encryption in transit
- **Amazon Macie** (phát hiện PII/nhạy cảm trong S3), **AWS PrivateLink** (truy cập private không qua internet)
- **AWS Shared Responsibility Model**, prompt injection, threat detection, vulnerability management
- Data lineage / data cataloging / SageMaker Model Cards (nguồn gốc dữ liệu)

**Governance & compliance (5.2):**
- Chuẩn: **ISO** (đã có ISO 42001), **SOC**, algorithm accountability laws (đã có)
- **AWS Config** (đánh giá cấu hình), **Amazon Inspector** (quét lỗ hổng), **AWS Audit Manager** (thu thập bằng chứng audit)
- **AWS Artifact** (tải báo cáo compliance), **AWS CloudTrail** (log API), **AWS Trusted Advisor** (best practice)
- **AWS Well-Architected Tool**, **AWS Budgets / Cost Explorer** (quản lý chi phí)
- Data governance: lifecycle, logging, residency, retention, monitoring

## ✅ Nhóm D — Chỗ đang HỌC DƯ (có thể học nhẹ tay)

Kỳ thi foundational + "build/code model" **out of scope**, nên các phần sau bạn không cần đào sâu như slide:
- Activation functions chi tiết (ReLU/ELU/Swish/Maxout…) → chỉ cần biết khái niệm.
- Perceptron/backprop nội tại.
- SageMaker Ground Truth từng loại labeling, inference pipelines, multi-container endpoints, SDK env vars → biết SageMaker *làm gì* là đủ, không cần cấp API.
- Chi tiết tokenization (BPE/WordPiece/SentencePiece) → biết "token là gì" là đủ.

> 💡 Đổi thời gian từ Nhóm D sang Nhóm A/B/C sẽ hiệu quả hơn cho điểm thi.

---

## 🛠️ Đề xuất hành động

1. **Bổ sung notes cho Nhóm A + C** (mỗi service 1 thẻ: công dụng, khi nào dùng, keyword thi) — lấy từ AWS docs.
2. **Viết 1 trang "Business & Responsible AI framing"** cho Nhóm B.
3. **Sinh practice questions** bám 5 domain (đặc biệt D2/D3/D5) để luyện phản xạ.

*Gap analysis 2026-07-06 — dựa trên exam guide v1.4.*
