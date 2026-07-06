# Managed AI Services — Bổ sung (Nhóm A)

> Các AWS managed AI services có trong exam guide (AIF-C01) nhưng thiếu trong course. Exam-focused cards: what / features / use cases / trigger keywords / đừng nhầm với.

---

## 1. Amazon Transcribe — Speech → Text (ASR)

**What it is:** Fully managed automatic speech recognition (ASR) service that converts **audio/speech into text** (transcription).

**Key features:**
- Batch transcription (audio in S3) + **real-time streaming** transcription.
- Automatic language identification; **multi-language** support.
- **Speaker diarization** (phân biệt người nói / "speaker labels").
- **Custom vocabulary** + **custom language models** (tăng độ chính xác cho thuật ngữ ngành).
- **Automatic PII redaction / masking** (che thông tin nhạy cảm trong transcript).
- **Transcribe Medical** (HIPAA-eligible) và **Transcribe Call Analytics** (contact center: sentiment, categories).
- Output kèm timestamps + confidence scores; hỗ trợ **subtitle** (WebVTT/SRT).

**Typical use cases:**
- Subtitle/caption cho video, meeting notes.
- Contact center / call analytics, ghi âm cuộc gọi → text.
- Voice-of-customer, indexing audio để search.

**Chọn service này khi...** đề nói "**convert audio/speech to text**", "transcribe recordings", "generate subtitles/captions", "speaker identification", "call center recordings → text".

**Đừng nhầm với:** **Polly** = ngược lại (text → speech). **Transcribe** = speech→text, còn nếu cần *hiểu ý nghĩa* text (sentiment, entities) thì dùng **Comprehend**, dịch ngôn ngữ thì **Translate**.

---

## 2. Amazon Translate — Neural Machine Translation

**What it is:** Neural machine translation (NMT) service dịch **text từ ngôn ngữ này sang ngôn ngữ khác**, chất lượng tự nhiên.

**Key features:**
- Neural network–based translation (không phải rule-based); real-time + batch.
- **Automatic source language detection**.
- **Custom terminology** (ép dịch đúng brand names, thuật ngữ) và **Active Custom Translation / parallel data** (tuỳ biến style domain).
- Hỗ trợ nhiều cặp ngôn ngữ; **PII/profanity masking**.
- Tích hợp dễ với Transcribe (dịch audio đã transcribe) và Comprehend.

**Typical use cases:**
- Localize website/app/content sang nhiều ngôn ngữ.
- Dịch real-time chat, customer support tickets.
- Multilingual pipeline: audio → Transcribe → Translate → (Polly).

**Chọn service này khi...** đề nói "**translate between languages**", "localize content", "multilingual", "convert English → Spanish/…", "real-time language translation".

**Đừng nhầm với:** **Transcribe** = speech→text (cùng ngôn ngữ). **Translate** = text ngôn ngữ A → text ngôn ngữ B. **Comprehend** = phân tích/hiểu text (không đổi ngôn ngữ).

---

## 3. Amazon Personalize — Recommendation Engine

**What it is:** Fully managed service tạo **real-time personalized recommendations** (same ML tech như Amazon.com) mà không cần build ML từ đầu.

**Key features:**
- Dựa trên **user–item interaction data** (clicks, purchases, views) + optional user/item metadata.
- **Recipes** (thuật toán dựng sẵn) cho các use case: user personalization, "similar items", personalized ranking, next-best-action.
- **Real-time** recommendations qua **campaign** hoặc **batch inference**.
- Xử lý **cold start** (item mới) và cập nhật real-time qua **event tracker**.
- Managed training/deploy — không tự chọn hyperparameters phức tạp.

**Typical use cases:**
- Product/content recommendations ("recommended for you", "customers also viewed").
- Personalized search ranking, targeted marketing / notifications.
- Video/music/news personalization.

**Chọn service này khi...** đề nói "**recommendation system / recommendation engine**", "personalized product suggestions", "customers who bought X also bought", "personalize content per user".

**Đừng nhầm với:** **Amazon Forecast** = dự báo time-series (demand, doanh số), không phải gợi ý cá nhân. **Personalize** = recommendations cho từng user. (Fraud Detector = phát hiện gian lận, khác hẳn.)

---

## 4. Amazon Textract — Document Extraction (OCR+)

**What it is:** ML service **extract text, handwriting, forms, và tables** từ scanned documents/images — hơn OCR thuần vì hiểu cấu trúc.

**Key features:**
- OCR text + **handwriting**; **Forms** (key–value pairs) và **Tables** extraction giữ nguyên structure.
- **Queries** feature: hỏi bằng ngôn ngữ tự nhiên ("what is the invoice number?").
- Specialized APIs: **AnalyzeExpense** (invoices/receipts), **AnalyzeID** (passports, driver's license), **AnalyzeLending** (mortgage).
- Sync (single-page) + async (multi-page PDF trong S3); trả về **bounding boxes + confidence scores**.
- Tích hợp **A2I** để human review khi confidence thấp.

**Typical use cases:**
- Automate xử lý invoices, receipts, forms, ID, contracts.
- Intelligent document processing (IDP) pipelines.
- Feed extracted text vào Comprehend để phân tích.

**Chọn service này khi...** đề nói "**extract text/data from documents/forms/tables**", "scanned PDFs / invoices / receipts", "OCR with structure", "digitize paperwork".

**Đừng nhầm với:** **Rekognition** = phân tích **hình ảnh/video** (objects, faces, labels) — chỉ detect text ngắn trên ảnh; còn **Textract** chuyên **document/form/table** structure. Textract lấy chữ ra, **Comprehend** hiểu ý nghĩa chữ đó.

---

## 5. Amazon Augmented AI (Amazon A2I) — Human Review Loops

**What it is:** Service để **thêm bước con người review (human-in-the-loop)** vào các dự đoán ML, đặc biệt khi confidence thấp hoặc cần validate.

**Key features:**
- Định nghĩa **human review workflow (flow definition)** với **confidence thresholds** — chỉ route những prediction "khó" cho người xem.
- Reviewers: **Amazon Mechanical Turk**, **private workforce** (nhân viên nội bộ), hoặc **vendor workforce**.
- Built-in integration với **Textract** (form review) và **Rekognition** (content moderation); + **custom** workflows cho model bất kỳ (kể cả SageMaker).
- Kết quả human review → dùng để audit, correct, hoặc cải thiện model.
- Được nhắc trong Domain 4 (Responsible AI) như tool để **detect/monitor bias & quality**.

**Typical use cases:**
- Review predictions low-confidence từ Textract/Rekognition.
- Content moderation cần người xác nhận.
- Quality assurance / compliance cho ML output.

**Chọn service này khi...** đề nói "**human review / human-in-the-loop**", "review low-confidence predictions", "human oversight of ML output", "human validation workflow".

**Đừng nhầm với:** **SageMaker Ground Truth** = **label dữ liệu training** (tạo dataset *trước* khi train). **A2I** = review **predictions/inference** của model *đã chạy* (sau train). Cả hai đều dùng human workforce nhưng khác giai đoạn.

---

## 6. Amazon SageMaker JumpStart — Model Hub & Solution Templates

**What it is:** ML **hub trong SageMaker** cung cấp **pre-trained models, foundation models, và solution templates** để deploy/fine-tune nhanh với vài click.

**Key features:**
- Hàng trăm **pre-trained open-source models** + **foundation models (FMs)** cho generative AI (text, image, embeddings).
- **One-click deploy** và **fine-tune** trên dữ liệu riêng — không cần code từ đầu.
- **Solution templates** end-to-end (fraud detection, demand forecasting, churn…).
- Models chạy **trong VPC/account của bạn** (deploy tới SageMaker endpoints) → kiểm soát hơn.
- Điểm khởi đầu cho generative AI (được nêu ở Domain 2.3 cùng Bedrock/PartyRock/Amazon Q).

**Typical use cases:**
- Nhanh chóng thử/deploy pre-trained model, transfer learning.
- Fine-tune FM trên data domain riêng.
- Học/prototype với solution templates dựng sẵn.

**Chọn service này khi...** đề nói "**pre-trained models hub**", "quickly deploy / fine-tune models", "solution templates", "get started fast in SageMaker", "open-source models + foundation models to customize".

**Đừng nhầm với:** **Amazon Bedrock** = **serverless API** truy cập FMs (không quản lý infra, không thấy endpoint) — nhanh nhất để gọi FM. **JumpStart** = trong SageMaker, bạn **deploy/host & fine-tune** model trên infra của mình → nhiều kiểm soát hơn nhưng cần quản lý endpoint.

---

## Bảng phân biệt nhanh (dễ nhầm trong đề)

| Nếu đề nói...                                   | Chọn                     |
|-------------------------------------------------|--------------------------|
| Speech → text, subtitles, call recordings       | **Transcribe**           |
| Text → speech (giọng nói)                        | **Polly**                |
| Dịch giữa các ngôn ngữ                           | **Translate**            |
| Hiểu/analyze text (sentiment, entities, PII)     | **Comprehend**           |
| Recommendations cá nhân hoá                      | **Personalize**          |
| Forecast time-series (demand/doanh số)           | **Forecast**             |
| Extract text/forms/tables từ documents           | **Textract**             |
| Phân tích ảnh/video (objects, faces)             | **Rekognition**          |
| Human review predictions (low confidence)        | **A2I**                  |
| Label dữ liệu training                           | **Ground Truth**         |
| Pre-trained/FM hub, deploy & fine-tune           | **JumpStart**            |
| Serverless API gọi FMs (không quản infra)        | **Bedrock**              |
