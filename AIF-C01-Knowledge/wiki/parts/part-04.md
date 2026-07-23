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
  - **Stable Diffusion XL (SDXL)** — Stability AI's image-generation FM; strong at text-to-image + image-to-image editing; use when you need artistic/detailed images from free-form prompts.
  - **Titan Image Generator** — Amazon's image-generation FM; supports image generation/editing + automatically embeds an **invisible watermark** (detectable via Watermark Detection); choose when you need Responsible AI / an AWS-native option.
  - **Titan Multimodal Embeddings** — maps images + text into the same vector space; used for **image search / multimodal RAG** (find images by text and vice versa), not for generating images.
- **Stable Diffusion** works on the principle of **diffusion** (gradually denoising random noise conditioned on the prompt to create an image), composed of multiple models each with a purpose:
  1. **CLIP text encoder** — encodes the prompt text into embeddings that guide the image content.
  2. **VAE decoder** — decodes the latent tensor into the final pixel image.
  3. **UNet** — the iterative denoising core in latent space (where most of the compute is spent).
  4. **VAE_post_quant_conv** — a conv layer that normalizes the latent before decoding.
- These blocks represent the bulk of the compute in the pipeline.
- Architecture pipeline: Input text (77 tokens) → Text Encoder (CLIPText) → Token embeddings (77 x 768) → Image Information Creator (UNet + Scheduler) → Image tensor (4x64x64) → Image Decoder (Auto encoder-decoder / VAE) → Generated Image.
- SDXL supports **text-to-image** generation and **image-to-image** editing (image prompting).

> 📸 Source: Screenshot 2026-07-04 at 23.23.00.png, Screenshot 2026-07-04 at 23.23.04.png, Screenshot 2026-07-04 at 23.25.11.png

## Amazon Bedrock — Guardrails
_Domain: D4 — Guidelines for Responsible AI_

- **Amazon Bedrock Guardrails** filter the inputs and outputs of LLMs.
  - **Guardrails for Amazon Bedrock** — a filter layer that blocks harmful content / PII / denied topics on both input & output; applicable to many FMs and reusable across apps; part of Responsible AI.
  > 🎯 Exam: Guardrails filter BOTH the input prompt and the output response; they do not retrain the model — they're just an external policy layer.
- Example: prompt "Tell me about Azure cloud offerings and bananas" → model starts to respond → guardrail blocks with "Sorry You have been blocked by the Guardrails!" (a guardrail that blocks if Microsoft Azure or Bananas are discussed).
- **Content Filters**:
  - Harmful category filters: Hate, Insults, Sexual, Violence, Misconduct.
    - Filters by built-in harmful categories with adjustable strength (Low/Medium/High) per category.
  - Prompt attack filters.
    - Blocks **prompt injection / jailbreak** — users trying to force the model to break its system instructions.
- **Denied topics filter**: describe topics to block as input; avoid starting sentences with "don't"; can add up to topic filters with example phrases of 100 characters alongside description.
  - Blocks custom topics via a **natural-language description** + examples (e.g. forbid discussing competitors); use when the built-in categories aren't enough.
- **Profanity filter**.
  - Blocks profanity using AWS's managed list.
- **Custom words and phrases filter**: up to 10,000 words or phrases (up to 100 characters each).
  - Blocks specific words/phrases you define (e.g. brand names, internal forbidden terms).
- **PII (Personally Identifiable Information) filters**: up to 31 PII types, with behaviour of **block** or **mask**.
  - Detects personal data (email, SSN…) then **block** (reject entirely) or **mask** (hide with a tag like {EMAIL}); used for security/compliance.
- **Regex pattern filter**: create up to 30 regex patterns.
  - Catches custom formats (e.g. employee ID, account number) that the built-in PII doesn't have.
- **Contextual grounding check**: score threshold to validate that info in reference source is grounded and factually correct.
  - Scores whether the response stays grounded in the reference source → reduces **hallucination** in RAG.
- **Relevance filter**: validate that the model's response is relevant to the user's query.
- **Amazon Bedrock Watermark Detection** detects if an image was generated with the **Titan Image Generator** model.
  - Checks the invisible watermark to confirm an image was generated by Titan; used to counter deepfakes / verify AI provenance.
- Console: **Bedrock > Guardrails > Create guardrail**. Steps: 1) Provide guardrail details (Name e.g. `MyCoolFilter`, description, "Messaging for blocked prompts" e.g. "Sorry, the model cannot answer this question."), 2) Configure content filters, 3) Add denied topics, 4) Add word filters, 5) Add sensitive information filters, 6) Add contextual grounding check, 7) Review and create.

> 📸 Source: Screenshot 2026-07-04 at 23.25.55.png, Screenshot 2026-07-04 at 23.26.11.png, Screenshot 2026-07-04 at 23.30.12.png

## Amazon Bedrock — Invocation Logging (Follow Along)
_Domain: D5 — Security, Compliance, and Governance for AI Solutions_

- Bedrock invocation logging sends model invocation logs to **CloudWatch** (log group `aws/bedrock/modelinvocations`) and/or S3.
  - **Invocation logging** — records every model call (input prompt + output response) for audit/governance; OFF by default, must be enabled manually.
  > 🎯 Exam: CloudWatch = logs/metrics/operational monitoring; CloudTrail = records API management-events (who called which API). The prompt/response content lives in invocation logging (CloudWatch/S3), not CloudTrail.
- Log entry is a JSON **ModelInvocationLog** (schemaVersion 1.0) capturing: timestamp, accountId, identity (ARN / role), region, requestId, operation (`InvokeModel`), modelId (e.g. `mistral.mistral-7b-instruct-v0:2`), input (inputContentType, inputBodyJson with the prompt), and output.
- Useful for auditing/governance of what prompts and models were invoked.

> 📸 Source: Screenshot 2026-07-04 at 23.30.41.png, Screenshot 2026-07-04 at 23.31.40.png

## Amazon Bedrock — Model Evaluation
_Domain: D3 — Applications of Foundation Models_

- **Amazon Bedrock Model Evaluation** lets you evaluate your model. Three evaluation types:
  1. **Automatic** — task types: General Text generation, Text summarization, Question and answer, Text classification. Scores calculated automatically using statistical methods such as **BERTScore, F1**, etc.
     - Fast, cheap, no humans needed; use when there's a measurable quantitative metric (accuracy/toxicity…).
  2. **Human: Bring your own work team** — evaluate up to 2 models using your own work team for subjective/complex feedback.
     - Use your own experts to score subjective quality (tone, helpfulness) that automatic metrics can't capture.
  3. **Human: AWS Managed work team** — AWS-designated work team; you provide the prompt dataset, task types, and metrics.
     - AWS provides the reviewers; choose when you need human evaluation but don't have/don't want to use your own team.
- **Metrics**: Accuracy, Toxicity, Robustness.
  - **BERTScore/F1** = semantic similarity/accuracy against the reference answer; **Toxicity** = level of harmfulness; **Robustness** = stability under noisy input.
  > 🎯 Exam: Model Evaluation = compare/choose the FM that fits the task; different from Guardrails (block content at runtime) and fine-tuning (retraining).
- Requires an **S3 Bucket configured with CORS** for the output data. You must grant Bedrock permissions to invoke the model. AWS provides datasets but they can be large.
- Console: **Bedrock > Model evaluation** (Create and view model evaluation jobs); "How it works" describes the three options above.
- **IAM permissions**: creating a model evaluation job requires access to Amazon S3 and Amazon Bedrock. Human-based jobs need additional permissions from **Amazon Cognito** and **Amazon SageMaker**. Automatic job policy includes actions like `bedrock:CreateEvaluationJob`, `bedrock:GetEvaluationJob`, `bedrock:ListEvaluationJobs`, `bedrock:StopEvaluationJob`. Correct **CORS** permission on the S3 bucket is required.

> 📸 Source: Screenshot 2026-07-04 at 23.32.11.png, Screenshot 2026-07-04 at 23.32.36.png, Screenshot 2026-07-04 at 23.33.13.png, Screenshot 2026-07-04 at 23.34.00.png

## Third-Party Vector Stores for GenAI
_Domain: D3 — Applications of Foundation Models_

- **Vector store** — a database that stores **embeddings** and searches by similarity (semantic search); the backbone of **RAG / Knowledge Bases**. AWS-native: OpenSearch, Aurora/RDS (pgvector), Neptune; the ones below are third-party.
- **Pinecone** — easy-to-use vector store; choose from multiple embedding models; many integrations to other cloud services. **One of the easiest vector stores to use.** (Console shows creating a serverless index with `cosine` distance metric, dimensions, and `ServerlessSpec` on AWS.)
  - A **fully managed serverless** vector DB; choose when you want to set up fast with minimal operations.
- **MongoDB Atlas for Vector Search** — supports multiple search methods (e.g. ANN, ENN); works with frameworks like LangChain and LlamaIndex. Great when your primary store is MongoDB (vector store lives near your data).
  - Adds vector search right into your existing MongoDB database; choose when your operational data is already in MongoDB.
- **Redis Enterprise for Vector Database** — turns Redis in-memory datastore into a vector search database; fast; use if you already rely on Redis.
  - **In-memory vector search with extremely low latency**; choose when you need real-time speed or already use Redis.
- Related: **SBERT / Sentence Transformers** (Python module for text & image embeddings; compute embeddings or similarity scores; 5,000+ pretrained models on Hugging Face / MTEB leaderboard; e.g. `all-MiniLM-L6-v2`).
  - A library that **creates embeddings** (not a place to store them); used to generate vectors then load them into a vector store above.
  > 🎯 Exam: SBERT = a model that generates embeddings; Pinecone/Redis/Mongo = where embeddings are stored & queried. Don't confuse the two roles.

> 📸 Source: Screenshot 2026-07-04 at 23.36.35.png, Screenshot 2026-07-04 at 23.37.14.png, Screenshot 2026-07-04 at 23.43.44.png

## PartyRock
_Domain: D2 — Fundamentals of Generative AI_

- **PartyRock** — an Amazon Bedrock playground to "Boost your productivity with generative AI." Build AI-powered apps in seconds (more than just chat); free to get started.
  - A **no-code** playground to build GenAI apps for learning/experimentation; **NO AWS account required**, separate from the production Bedrock environment.
  > 🎯 Exam: PartyRock = no-code learning/prototyping; to build a real app with control/IAM, use Amazon Bedrock.

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
  - **Ground truth** = the real correct labels/answers to compare against the model's predictions.
  - **Drift** = the real-world data distribution gradually diverging from the training data → accuracy degrades over time; fixed by retraining.
  > 🎯 Exam: Detecting drift in production is the job of **SageMaker Model Monitor**.

> 📸 Source: Screenshot 2026-07-05 at 15.06.41.png, Screenshot 2026-07-05 at 15.06.47.png, Screenshot 2026-07-05 at 15.06.51.png, Screenshot 2026-07-05 at 15.07.01.png, Screenshot 2026-07-05 at 15.07.05.png, Screenshot 2026-07-05 at 15.07.16.png, Screenshot 2026-07-05 at 15.07.20.png, Screenshot 2026-07-05 at 15.07.33.png, Screenshot 2026-07-05 at 15.07.40.png, Screenshot 2026-07-05 at 15.07.48.png, Screenshot 2026-07-05 at 15.07.52.png

## SageMaker ML Pipeline
_Domain: D1 — Fundamentals of AI and ML_

- **Amazon SageMaker** is a **unified ML platform** for building ML solutions end-to-end.
- End-to-end stages (left→right): **Data Readiness → Feature Engineering → Training / HP-Tuning → Model Serving → Understanding / Tuning → Edge → Model Monitoring → Model Management**.
- **AutoML** spans the early stages.
- Capabilities under each stage: Data Labeling, Datasets, Feature Store, Training, Optimization, Experiments, AI Accelerators, Prediction, Explainable AI, Hybrid AI (Edge), Continuous Monitoring, Metadata.
- Cross-cutting layers: **Pipelines (Orchestration)**, **Deep Learning Environment (DL VM, DL Containers)**, **Notebooks**.

> 📸 Source: Screenshot 2026-07-05 at 15.08.05.png
