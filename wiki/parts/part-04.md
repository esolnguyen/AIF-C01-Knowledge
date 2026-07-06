# Part 04 — AWS Certified AI Practitioner (AIF-C01) Study Notes

## Amazon Bedrock — Fine-tuning Job (Follow Along)
_Domain: D3 — Applications of Foundation Models_

- Bedrock console flow: **Custom models > Create Fine-tuning job**.
- **Model details**: pick a Source model (e.g. Titan Text G1 - Lite v1), set a Fine-tuned model name (e.g. `AnimalClassification`), optional Model encryption + Tags.
- **Job configuration**: give the training job a Job name (e.g. `FineTuneClassificationAnimal`), optional Tags.
- **VPC settings** (optional): access S3 data source located in your VPC.
- **Input data**: choose a file in S3 that matches the required dataset format. You can use **SageMaker Ground Truth** to create/label training datasets.
- Left nav groups: Foundation models (Base/Custom/Imported), Playgrounds (Chat/Text/Image), Builder tools (Prompt management, Knowledge bases, Agents, Prompt flows), Safeguards (Guardrails, Watermark detection), Inference (Provisioned Throughput, Batch inference, Cross-region inference), Assessment (Model Evaluation).

> 📸 Source: Screenshot 2026-07-04 at 23.22.38.png

## Amazon Bedrock Image Generation
_Domain: D2 — Fundamentals of Generative AI_

- Section title slide: Amazon Bedrock Image Generation (Follow Along).
- Bedrock supports for image generation: **Stable Diffusion XL** (from Stability AI) and **Titan Image Generator** (from Amazon); **Titan Multimodal Embeddings** for multimodal image indexing and searching.
  - **Stable Diffusion XL (SDXL)** — FM tạo ảnh của Stability AI; mạnh về text-to-image + image-to-image editing; dùng khi cần ảnh nghệ thuật/chi tiết từ prompt tự do.
  - **Titan Image Generator** — FM tạo ảnh của Amazon; hỗ trợ tạo/chỉnh sửa ảnh + tự động chèn **invisible watermark** (phát hiện được qua Watermark Detection); chọn khi cần Responsible AI / gốc AWS.
  - **Titan Multimodal Embeddings** — biến ảnh + text về cùng không gian vector; dùng cho **image search / multimodal RAG** (tìm ảnh bằng text và ngược lại), không dùng để sinh ảnh.
- **Stable Diffusion** works on the principle of **diffusion** (khử nhiễu dần từ noise ngẫu nhiên có điều kiện theo prompt để tạo ảnh), composed of multiple models each with a purpose:
  1. **CLIP text encoder** — mã hóa prompt text thành embeddings dẫn hướng nội dung ảnh.
  2. **VAE decoder** — giải mã latent tensor thành ảnh pixel cuối cùng.
  3. **UNet** — lõi khử nhiễu lặp lại trong không gian latent (nơi tốn compute nhất).
  4. **VAE_post_quant_conv** — lớp conv chuẩn hóa latent trước khi decode.
- These blocks represent the bulk of the compute in the pipeline.
- Architecture pipeline: Input text (77 tokens) → Text Encoder (CLIPText) → Token embeddings (77 x 768) → Image Information Creator (UNet + Scheduler) → Image tensor (4x64x64) → Image Decoder (Auto encoder-decoder / VAE) → Generated Image.
- SDXL supports **text-to-image** generation and **image-to-image** editing (image prompting).

> 📸 Source: Screenshot 2026-07-04 at 23.23.00.png, Screenshot 2026-07-04 at 23.23.04.png, Screenshot 2026-07-04 at 23.25.11.png

## Amazon Bedrock — Guardrails
_Domain: D4 — Guidelines for Responsible AI_

- **Amazon Bedrock Guardrails** filter the inputs and outputs of LLMs.
  - **Guardrails for Amazon Bedrock** — lớp lọc chặn nội dung có hại / PII / chủ đề cấm cho cả input & output; áp được cho nhiều FM và reusable across apps; thuộc Responsible AI.
  > 🎯 Exam: Guardrails lọc CẢ prompt đầu vào lẫn response đầu ra; không huấn luyện lại model — chỉ là lớp policy bên ngoài.
- Example: prompt "Tell me about Azure cloud offerings and bananas" → model starts to respond → guardrail blocks with "Sorry You have been blocked by the Guardrails!" (a guardrail that blocks if Microsoft Azure or Bananas are discussed).
- **Content Filters**:
  - Harmful category filters: Hate, Insults, Sexual, Violence, Misconduct.
    - Lọc theo danh mục độc hại có sẵn với mức độ (Low/Medium/High) chỉnh được cho từng loại.
  - Prompt attack filters.
    - Chặn **prompt injection / jailbreak** — user cố ép model phá vỡ hướng dẫn hệ thống.
- **Denied topics filter**: describe topics to block as input; avoid starting sentences with "don't"; can add up to topic filters with example phrases of 100 characters alongside description.
  - Chặn chủ đề tùy biến bằng **mô tả ngôn ngữ tự nhiên** + ví dụ (vd cấm bàn về đối thủ); dùng khi danh mục có sẵn không đủ.
- **Profanity filter**.
  - Chặn ngôn từ tục tĩu theo danh sách quản lý sẵn của AWS.
- **Custom words and phrases filter**: up to 10,000 words or phrases (up to 100 characters each).
  - Chặn từ/cụm cụ thể do bạn định nghĩa (vd tên thương hiệu, từ cấm nội bộ).
- **PII (Personally Identifiable Information) filters**: up to 31 PII types, with behaviour of **block** or **mask**.
  - Phát hiện dữ liệu cá nhân (email, SSN…) rồi **block** (chặn hẳn) hoặc **mask** (che bằng thẻ như {EMAIL}); dùng cho bảo mật/tuân thủ.
- **Regex pattern filter**: create up to 30 regex patterns.
  - Bắt định dạng tùy chỉnh (vd mã nhân viên, account number) mà PII dựng sẵn không có.
- **Contextual grounding check**: score threshold to validate that info in reference source is grounded and factually correct.
  - Chấm điểm response có bám vào nguồn tham chiếu không → giảm **hallucination** trong RAG.
- **Relevance filter**: validate that the model's response is relevant to the user's query.
- **Amazon Bedrock Watermark Detection** detects if an image was generated with the **Titan Image Generator** model.
  - Kiểm tra invisible watermark để xác nhận ảnh do Titan sinh ra; dùng chống deepfake / xác thực nguồn gốc AI.
- Console: **Bedrock > Guardrails > Create guardrail**. Steps: 1) Provide guardrail details (Name e.g. `MyCoolFilter`, description, "Messaging for blocked prompts" e.g. "Sorry, the model cannot answer this question."), 2) Configure content filters, 3) Add denied topics, 4) Add word filters, 5) Add sensitive information filters, 6) Add contextual grounding check, 7) Review and create.

> 📸 Source: Screenshot 2026-07-04 at 23.25.55.png, Screenshot 2026-07-04 at 23.26.11.png, Screenshot 2026-07-04 at 23.30.12.png

## Amazon Bedrock — Invocation Logging (Follow Along)
_Domain: D5 — Security, Compliance, and Governance for AI Solutions_

- Bedrock invocation logging sends model invocation logs to **CloudWatch** (log group `aws/bedrock/modelinvocations`) and/or S3.
  - **Invocation logging** — ghi lại mọi lời gọi model (prompt vào + response ra) phục vụ audit/governance; mặc định TẮT, phải bật thủ công.
  > 🎯 Exam: CloudWatch = logs/metrics/giám sát vận hành; CloudTrail = ghi API management-events (ai gọi API nào). Nội dung prompt/response nằm ở invocation logging (CloudWatch/S3), không phải CloudTrail.
- Log entry is a JSON **ModelInvocationLog** (schemaVersion 1.0) capturing: timestamp, accountId, identity (ARN / role), region, requestId, operation (`InvokeModel`), modelId (e.g. `mistral.mistral-7b-instruct-v0:2`), input (inputContentType, inputBodyJson with the prompt), and output.
- Useful for auditing/governance of what prompts and models were invoked.

> 📸 Source: Screenshot 2026-07-04 at 23.30.41.png, Screenshot 2026-07-04 at 23.31.40.png

## Amazon Bedrock — Model Evaluation
_Domain: D3 — Applications of Foundation Models_

- **Amazon Bedrock Model Evaluation** lets you evaluate your model. Three evaluation types:
  1. **Automatic** — task types: General Text generation, Text summarization, Question and answer, Text classification. Scores calculated automatically using statistical methods such as **BERTScore, F1**, etc.
     - Nhanh, rẻ, không cần người; dùng khi có metric định lượng đo được (accuracy/toxicity…).
  2. **Human: Bring your own work team** — evaluate up to 2 models using your own work team for subjective/complex feedback.
     - Dùng chuyên gia của bạn để chấm chất lượng chủ quan (giọng văn, hữu ích) mà số liệu tự động không bắt được.
  3. **Human: AWS Managed work team** — AWS-designated work team; you provide the prompt dataset, task types, and metrics.
     - AWS lo nhân lực chấm; chọn khi cần đánh giá người nhưng không có/không muốn dùng team riêng.
- **Metrics**: Accuracy, Toxicity, Robustness.
  - **BERTScore/F1** = độ tương đồng ngữ nghĩa/chính xác so với đáp án; **Toxicity** = mức độc hại; **Robustness** = ổn định khi input nhiễu.
  > 🎯 Exam: Model Evaluation = so sánh/chọn FM phù hợp task; khác Guardrails (chặn nội dung runtime) và fine-tuning (huấn luyện lại).
- Requires an **S3 Bucket configured with CORS** for the output data. You must grant Bedrock permissions to invoke the model. AWS provides datasets but they can be large.
- Console: **Bedrock > Model evaluation** (Create and view model evaluation jobs); "How it works" describes the three options above.
- **IAM permissions**: creating a model evaluation job requires access to Amazon S3 and Amazon Bedrock. Human-based jobs need additional permissions from **Amazon Cognito** and **Amazon SageMaker**. Automatic job policy includes actions like `bedrock:CreateEvaluationJob`, `bedrock:GetEvaluationJob`, `bedrock:ListEvaluationJobs`, `bedrock:StopEvaluationJob`. Correct **CORS** permission on the S3 bucket is required.

> 📸 Source: Screenshot 2026-07-04 at 23.32.11.png, Screenshot 2026-07-04 at 23.32.36.png, Screenshot 2026-07-04 at 23.33.13.png, Screenshot 2026-07-04 at 23.34.00.png

## Third-Party Vector Stores for GenAI
_Domain: D3 — Applications of Foundation Models_

- **Vector store** — CSDL lưu **embeddings** và tìm theo độ tương đồng (semantic search); là backbone của **RAG / Knowledge Bases**. AWS-native: OpenSearch, Aurora/RDS (pgvector), Neptune; dưới đây là bên thứ ba.
- **Pinecone** — easy-to-use vector store; choose from multiple embedding models; many integrations to other cloud services. **One of the easiest vector stores to use.** (Console shows creating a serverless index with `cosine` distance metric, dimensions, and `ServerlessSpec` on AWS.)
  - Vector DB **serverless được quản lý hoàn toàn**; chọn khi muốn dựng nhanh, tối thiểu vận hành.
- **MongoDB Atlas for Vector Search** — supports multiple search methods (e.g. ANN, ENN); works with frameworks like LangChain and LlamaIndex. Great when your primary store is MongoDB (vector store lives near your data).
  - Thêm vector search vào ngay CSDL MongoDB sẵn có; chọn khi dữ liệu operational đã ở MongoDB.
- **Redis Enterprise for Vector Database** — turns Redis in-memory datastore into a vector search database; fast; use if you already rely on Redis.
  - Vector search **in-memory, độ trễ cực thấp**; chọn khi cần tốc độ real-time hoặc đã dùng Redis.
- Related: **SBERT / Sentence Transformers** (Python module for text & image embeddings; compute embeddings or similarity scores; 5,000+ pretrained models on Hugging Face / MTEB leaderboard; e.g. `all-MiniLM-L6-v2`).
  - Thư viện **tạo ra embeddings** (không phải nơi lưu); dùng để sinh vector rồi nạp vào vector store ở trên.
  > 🎯 Exam: SBERT = model sinh embeddings; Pinecone/Redis/Mongo = nơi lưu & truy vấn embeddings. Đừng nhầm hai vai trò.

> 📸 Source: Screenshot 2026-07-04 at 23.36.35.png, Screenshot 2026-07-04 at 23.37.14.png, Screenshot 2026-07-04 at 23.43.44.png

## PartyRock
_Domain: D2 — Fundamentals of Generative AI_

- **PartyRock** — an Amazon Bedrock playground to "Boost your productivity with generative AI." Build AI-powered apps in seconds (more than just chat); free to get started.
  - Sân chơi **no-code** dựng app GenAI để học/thử nghiệm; **KHÔNG cần tài khoản AWS**, tách khỏi môi trường production Bedrock.
  > 🎯 Exam: PartyRock = học/prototyping no-code; muốn build app thật, có kiểm soát/IAM thì dùng Amazon Bedrock.

> 📸 Source: Screenshot 2026-07-05 at 15.02.54.png

## General Machine Learning Workflow
_Domain: D1 — Fundamentals of AI and ML_

- An ML workflow is **a collection of phases which in turn have a collection of steps** to achieve an ML solution. The following is a generally accepted standard, but steps/phases can differ by use-case.
- **Cycle (continuous):** Fetch → Clean → Prepare → Train Model → Evaluate Model → Deploy → Evaluate → (back to Fetch).
- **Fetch** — gather the data.
- **Clean** — inspect and clean data to improve training (e.g. normalize "United States" vs "US" to be consistent).
- **Prepare / transform** — additional transformations to improve performance (e.g. combine attributes; combine temperature & humidity into a new de-icing attribute for a better model).
- **Train Model** — needs an algorithm (choice depends on factors); for a quick out-of-the-box solution use a **SageMaker built-in algorithm**.
- **Evaluate Model** — after training, evaluate to determine if inference accuracy is acceptable. In SageMaker use the **AWS SDK for Python (Boto)** or the high-level SageMaker Python library to send inference requests; use a Jupyter notebook in a SageMaker notebook instance to train and evaluate.
- **Deploy** — traditionally re-engineer before integrating; with **SageMaker hosting services** you can deploy the model independently, decoupled from application code.
- **Evaluate (post-deploy)** — ML is a continuous cycle: monitor inferences, collect **"ground truth,"** and evaluate to identify **drift**. Increase accuracy by updating training data with newly collected ground truth and **retraining** the model. As more example data becomes available, keep retraining to increase accuracy.
  - **Ground truth** = nhãn/đáp án đúng thực tế để so với dự đoán của model.
  - **Drift** = phân phối dữ liệu thực tế lệch dần khỏi dữ liệu huấn luyện → độ chính xác giảm theo thời gian; khắc phục bằng retraining.
  > 🎯 Exam: Phát hiện drift trong production là việc của **SageMaker Model Monitor**.

> 📸 Source: Screenshot 2026-07-05 at 15.06.41.png, Screenshot 2026-07-05 at 15.06.47.png, Screenshot 2026-07-05 at 15.06.51.png, Screenshot 2026-07-05 at 15.07.01.png, Screenshot 2026-07-05 at 15.07.05.png, Screenshot 2026-07-05 at 15.07.16.png, Screenshot 2026-07-05 at 15.07.20.png, Screenshot 2026-07-05 at 15.07.33.png, Screenshot 2026-07-05 at 15.07.40.png, Screenshot 2026-07-05 at 15.07.48.png, Screenshot 2026-07-05 at 15.07.52.png

## SageMaker ML Pipeline
_Domain: D1 — Fundamentals of AI and ML_

- **Amazon SageMaker** is a **unified ML platform** for building ML solutions end-to-end.
- End-to-end stages (left→right): **Data Readiness → Feature Engineering → Training / HP-Tuning → Model Serving → Understanding / Tuning → Edge → Model Monitoring → Model Management**.
- **AutoML** spans the early stages.
- Capabilities under each stage: Data Labeling, Datasets, Feature Store, Training, Optimization, Experiments, AI Accelerators, Prediction, Explainable AI, Hybrid AI (Edge), Continuous Monitoring, Metadata.
- Cross-cutting layers: **Pipelines (Orchestration)**, **Deep Learning Environment (DL VM, DL Containers)**, **Notebooks**.

> 📸 Source: Screenshot 2026-07-05 at 15.08.05.png
