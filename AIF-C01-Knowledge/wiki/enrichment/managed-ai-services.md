# Managed AI Services — Supplement (Group A)

> The AWS managed AI services that appear in the exam guide (AIF-C01) but are missing from the course. Exam-focused cards: what / features / use cases / trigger keywords / don't confuse with.

---

## 1. Amazon Transcribe — Speech → Text (ASR)

**What it is:** Fully managed automatic speech recognition (ASR) service that converts **audio/speech into text** (transcription).

**Key features:**
- Batch transcription (audio in S3) + **real-time streaming** transcription.
- Automatic language identification; **multi-language** support.
- **Speaker diarization** (distinguishing speakers / "speaker labels").
- **Custom vocabulary** + **custom language models** (improve accuracy for industry terminology).
- **Automatic PII redaction / masking** (hide sensitive information in the transcript).
- **Transcribe Medical** (HIPAA-eligible) and **Transcribe Call Analytics** (contact center: sentiment, categories).
- Output includes timestamps + confidence scores; supports **subtitles** (WebVTT/SRT).

**Typical use cases:**
- Subtitles/captions for video, meeting notes.
- Contact center / call analytics, call recordings → text.
- Voice-of-customer, indexing audio for search.

**Choose this service when...** the question says "**convert audio/speech to text**", "transcribe recordings", "generate subtitles/captions", "speaker identification", "call center recordings → text".

**Don't confuse with:** **Polly** = the reverse (text → speech). **Transcribe** = speech→text; if you need to *understand the meaning* of the text (sentiment, entities) use **Comprehend**, and for language translation use **Translate**.

---

## 2. Amazon Translate — Neural Machine Translation

**What it is:** Neural machine translation (NMT) service that translates **text from one language to another** with natural quality.

**Key features:**
- Neural network–based translation (not rule-based); real-time + batch.
- **Automatic source language detection**.
- **Custom terminology** (force correct translation of brand names, terms) and **Active Custom Translation / parallel data** (customize domain style).
- Supports many language pairs; **PII/profanity masking**.
- Integrates easily with Transcribe (translate transcribed audio) and Comprehend.

**Typical use cases:**
- Localize website/app/content into multiple languages.
- Translate real-time chat, customer support tickets.
- Multilingual pipeline: audio → Transcribe → Translate → (Polly).

**Choose this service when...** the question says "**translate between languages**", "localize content", "multilingual", "convert English → Spanish/…", "real-time language translation".

**Don't confuse with:** **Transcribe** = speech→text (same language). **Translate** = text in language A → text in language B. **Comprehend** = analyze/understand text (does not change the language).

---

## 3. Amazon Personalize — Recommendation Engine

**What it is:** Fully managed service that produces **real-time personalized recommendations** (same ML tech as Amazon.com) without building ML from scratch.

**Key features:**
- Based on **user–item interaction data** (clicks, purchases, views) + optional user/item metadata.
- **Recipes** (prebuilt algorithms) for use cases: user personalization, "similar items", personalized ranking, next-best-action.
- **Real-time** recommendations via a **campaign** or **batch inference**.
- Handles **cold start** (new items) and updates in real time via an **event tracker**.
- Managed training/deploy — you don't have to choose complex hyperparameters yourself.

**Typical use cases:**
- Product/content recommendations ("recommended for you", "customers also viewed").
- Personalized search ranking, targeted marketing / notifications.
- Video/music/news personalization.

**Choose this service when...** the question says "**recommendation system / recommendation engine**", "personalized product suggestions", "customers who bought X also bought", "personalize content per user".

**Don't confuse with:** **Amazon Forecast** = time-series forecasting (demand, sales), not personalized recommendations. **Personalize** = recommendations per user. (Fraud Detector = fraud detection, entirely different.)

---

## 4. Amazon Textract — Document Extraction (OCR+)

**What it is:** ML service that **extracts text, handwriting, forms, and tables** from scanned documents/images — more than plain OCR because it understands structure.

**Key features:**
- OCR text + **handwriting**; **Forms** (key–value pairs) and **Tables** extraction that preserves structure.
- **Queries** feature: ask in natural language ("what is the invoice number?").
- Specialized APIs: **AnalyzeExpense** (invoices/receipts), **AnalyzeID** (passports, driver's licenses), **AnalyzeLending** (mortgage).
- Sync (single-page) + async (multi-page PDF in S3); returns **bounding boxes + confidence scores**.
- Integrates with **A2I** for human review when confidence is low.

**Typical use cases:**
- Automate processing of invoices, receipts, forms, IDs, contracts.
- Intelligent document processing (IDP) pipelines.
- Feed extracted text into Comprehend for analysis.

**Choose this service when...** the question says "**extract text/data from documents/forms/tables**", "scanned PDFs / invoices / receipts", "OCR with structure", "digitize paperwork".

**Don't confuse with:** **Rekognition** = analyzing **images/video** (objects, faces, labels) — it only detects short text on images; whereas **Textract** specializes in **document/form/table** structure. Textract pulls the text out, **Comprehend** understands the meaning of that text.

---

## 5. Amazon Augmented AI (Amazon A2I) — Human Review Loops

**What it is:** Service to **add a human review step (human-in-the-loop)** to ML predictions, especially when confidence is low or validation is needed.

**Key features:**
- Define a **human review workflow (flow definition)** with **confidence thresholds** — route only the "hard" predictions to a human.
- Reviewers: **Amazon Mechanical Turk**, a **private workforce** (internal employees), or a **vendor workforce**.
- Built-in integration with **Textract** (form review) and **Rekognition** (content moderation); + **custom** workflows for any model (including SageMaker).
- Human review results → used to audit, correct, or improve the model.
- Mentioned in Domain 4 (Responsible AI) as a tool to **detect/monitor bias & quality**.

**Typical use cases:**
- Review low-confidence predictions from Textract/Rekognition.
- Content moderation that needs human confirmation.
- Quality assurance / compliance for ML output.

**Choose this service when...** the question says "**human review / human-in-the-loop**", "review low-confidence predictions", "human oversight of ML output", "human validation workflow".

**Don't confuse with:** **SageMaker Ground Truth** = **label training data** (create the dataset *before* training). **A2I** = review the **predictions/inference** of a model *already running* (after training). Both use a human workforce but at different stages.

---

## 6. Amazon SageMaker JumpStart — Model Hub & Solution Templates

**What it is:** An ML **hub inside SageMaker** that provides **pre-trained models, foundation models, and solution templates** to deploy/fine-tune quickly with a few clicks.

**Key features:**
- Hundreds of **pre-trained open-source models** + **foundation models (FMs)** for generative AI (text, image, embeddings).
- **One-click deploy** and **fine-tune** on your own data — no coding from scratch.
- End-to-end **solution templates** (fraud detection, demand forecasting, churn…).
- Models run **in your own VPC/account** (deployed to SageMaker endpoints) → more control.
- A starting point for generative AI (mentioned in Domain 2.3 alongside Bedrock/PartyRock/Amazon Q).

**Typical use cases:**
- Quickly try/deploy a pre-trained model, transfer learning.
- Fine-tune an FM on your own domain data.
- Learn/prototype with ready-made solution templates.

**Choose this service when...** the question says "**pre-trained models hub**", "quickly deploy / fine-tune models", "solution templates", "get started fast in SageMaker", "open-source models + foundation models to customize".

**Don't confuse with:** **Amazon Bedrock** = a **serverless API** to access FMs (no infrastructure to manage, no endpoint to see) — the fastest way to call an FM. **JumpStart** = inside SageMaker, you **deploy/host & fine-tune** the model on your own infrastructure → more control but you must manage the endpoint.

---

## Quick disambiguation table (easily confused on the exam)

| If the question says...                          | Choose                   |
|-------------------------------------------------|--------------------------|
| Speech → text, subtitles, call recordings       | **Transcribe**           |
| Text → speech (voice)                           | **Polly**                |
| Translate between languages                     | **Translate**            |
| Understand/analyze text (sentiment, entities, PII) | **Comprehend**        |
| Personalized recommendations                    | **Personalize**          |
| Forecast time-series (demand/sales)             | **Forecast**             |
| Extract text/forms/tables from documents        | **Textract**             |
| Analyze images/video (objects, faces)           | **Rekognition**          |
| Human review of predictions (low confidence)    | **A2I**                  |
| Label training data                             | **Ground Truth**         |
| Pre-trained/FM hub, deploy & fine-tune          | **JumpStart**            |
| Serverless API to call FMs (no infra to manage) | **Bedrock**              |
