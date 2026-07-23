# Part 02 — Fine Tuning, Amazon Bedrock, Prompt Engineering & Knowledge Bases

## Fine Tuning LLMs

- **Neural network structure**: training builds up **layers of nodes** (neurons).
  - Nodes have **connections**; connections can be across layers, within the same layer (self-attention), or computed as multiple parallel sets of hidden-layer connections (**multi-head attention**).
  - **Parameters** are the **weights of connections**. A connection may have one param or multiple params (e.g. a weight value like 0.241415).
- **Model sizes / layer counts (exam facts)**:
  - **GPT-3**: 96 layers in its largest configuration (175 billion parameters).
  - **BERT**: base = 12 layers, large = 24 layers.
  - **GPT-2**: 12 to 48 layers depending on size.
  - **T5**: base = 12 encoder + 12 decoder layers; larger versions up to 24 layers each.
- **What is Fine Tuning?** Retraining a pretrained model's weights (parameters) on a **smaller dataset**. A model's weights are the outputted state of a trained model.
  - We are capturing the model's weights from the output — we are **not creating "new models."**
- **Supervised Fine Tuning (SFT)**: fine-tuning when the dataset has been **labeled**, so we explicitly tell the model what the data is.
  - Learns from input→expected-output pairs (labeled); opposite of unsupervised/self-supervised pretraining. Use when you have quality labeled data for a specific task.
- **Pipeline**: Data (Text, Images, Videos, Structured Data) → Training → Base ("pretrained") Model → SFT (retraining) with a smaller dataset → Fine Tuned Model.
- **Fine-tuning by changing the dataset**:
  - **Instruction Fine-tuning**: dataset of good and bad prompt examples ("I say this, you do that").
    - Teaches the model to *follow instructions/format*, not new facts; how base models become chat/assistant models. Improves how it responds across many tasks.
  - **Domain-Specific Fine-tuning**: dataset with specific knowledge (e.g. Microsoft blogs, Microsoft Learn docs).
    - Injects *knowledge/vocabulary* of a niche domain (medical, legal, a product) into the weights. Use when the model lacks specialized domain knowledge.
    > 🎯 Exam: to add fresh/proprietary knowledge without retraining, prefer **RAG**; fine-tuning is for style/behavior or deeply-embedded domain expertise, and is costlier to update.
- **Removing params / reducing weights — Pruning**: you remove parameters.
  - Removes low-importance weights/neurons to shrink the model → faster inference, less memory, at some accuracy cost. A **model compression** technique (like quantization/distillation).
  - **Train-Time Pruning**: trained in a way that encourages the model to remove connections/neurons.
  - **Post-Training Pruning**: manually change the model weights file.
- **Fine-tuning by changing the training method**:
  - **Full fine-tuning**: all model weights updated; expensive.
    - Most compute/memory-heavy and highest storage (a full new copy of the model); can give best quality but risks catastrophic forgetting.
  - **Parameter Efficient Fine-Tuning (PEFT)**: updates only a small set of parameters and **freezes the rest**; greatly reduces cost. **LoRA** is a type of PEFT.
    - **LoRA (Low-Rank Adaptation)** — injects small trainable low-rank adapter matrices while the base weights stay frozen; tiny artifact, cheap to train, swap adapters per task. This is the most common fine-tuning method when resources are limited.
    > 🎯 Exam: PEFT/LoRA = "efficient/low-cost fine-tuning updating few parameters" — pick it over full fine-tuning when the question stresses limited compute/budget.
  - **Last-Layer Fine Tuning**: in-between full fine-tuning and PEFT; freeze all layers except the last and train only the last layer.

> 📸 Source: Screenshot 2026-07-04 at 22.13.07.png, Screenshot 2026-07-04 at 22.13.23.png, Screenshot 2026-07-04 at 22.13.40.png · Domain: D3

## Amazon Bedrock

- **Amazon Bedrock** is a **Model-as-a-Service (LLMaaS)** offering that makes it easy to **deploy, customize, evaluate, secure and maintain** various LLM models to integrate into your apps.
  - **Fully managed, serverless** access to foundation models from many providers via one API; no infrastructure to run. Data stays private (not used to train base models).
  - > 🎯 Exam: **Bedrock** = quick access to third-party/Amazon FMs via API; **SageMaker** = build/train/host your own ML models end-to-end.
- Programmatic access to LLMs via: **AWS SDK (Bedrock API)**, **LlamaIndex**, **LangChain**.
- **Features include**:
  - **Model Catalog**
  - **Custom Models** — Fine-tuning, Continued Pre-Training
    - **Continued Pre-Training** — further pretrain a base model on large *unlabeled* domain text (self-supervised) to build domain fluency; vs fine-tuning which uses smaller *labeled* task data.
  - **Playgrounds** — Chat, Completion (text), Image
  - **Prompt Management** — store prompt templates
  - **Knowledge Base** — RAG (with OpenSearch)
  - **Prompt Flows** — orchestration of events
    - Visual drag-and-drop builder chaining prompts, KBs, agents and Lambda into a workflow; for multi-step GenAI pipelines without code.
  - **Agents** — agentic workflows
    - LLM that can *plan and call tools/APIs* (via action groups + Lambda) to complete multi-step tasks, optionally consulting Knowledge Bases.
  - **Guardrails** — pre and post filters
    - Configurable safety layer: block denied topics, filter harmful content, redact PII, and reduce hallucinations; applied on both input and output.
  - **Watermark detection**
    - Detects whether an image was generated by Amazon **Titan Image Generator** (invisible watermark) — supports content authenticity.
  - **Inference** — Batch, Provisioned, Serverless, Cross-Region
  - **Eval Assessments**
    - **Model Evaluation** — compare/score models on accuracy, robustness, toxicity etc.; automatic metrics or human evaluation, to pick the right FM.
  - **Bedrock Studio** — developers sign in with company SSO to build GenAI apps without direct AWS Management Console access

> 📸 Source: Screenshot 2026-07-04 at 22.13.56.png · Domain: D3

## Amazon Bedrock — Model Catalog

- **Model Catalog** is a **collection of LLM models ready to deploy** with an LLMaaS.
- **Providers available on AWS**:
  - **Amazon** — e.g. Titan Premier
  - **Anthropic** — e.g. Claude Sonnet
  - **Cohere** — e.g. Command R
  - **AI21** — e.g. Jamba Instruct
  - **Meta** — e.g. Llama 3 70B
  - **Mistral AI** — e.g. Mistral Large
  - **Stability AI** — e.g. SDXL 1.0
- Catalog columns: Model name, Version, Provider, Modality (Text / Text & vision), Max tokens.
- **Before using a model you must request model access.**

> 📸 Source: Screenshot 2026-07-04 at 22.14.05.png · Domain: D3

## Amazon Bedrock — Deployment Models

- Two deployment models when deploying a model from the Bedrock Catalog:
  - **On Demand (Serverless)**
  - **Provisioned Throughput (Servers)**
- **On-Demand**: pay based on **input and output tokens** (e.g. Cohere Command R+ — $0.0030 per 1,000 input tokens; $0.0150 per 1,000 output tokens). Track token usage in the Bedrock Playground, code callbacks, or **Amazon CloudWatch** logging/metrics.
- **Provisioned Throughput**: pay based on **Model Units (MUs)**, providing a dedicated level of throughput for specific models. Requires a commitment term + number of model units (estimated hourly/daily/monthly cost).
  - > 🎯 Exam: On-Demand = pay-per-token, no commitment, great for variable/low traffic and testing. Provisioned Throughput = reserved capacity for **steady high-volume production** and is **required to serve custom/fine-tuned models**.
- Not all models offer both deployment models:
  - Availability varies by model and Region (check the model's page for supported inference modes).
  - **Custom/fine-tuned models are Provisioned Throughput only**; base models like Amazon Titan and Cohere Command are available **On-Demand**.
- **Batch Inference**: non-real-time (offline) bulk processing; for select small models.
- **Cross Region Inference**: routes requests to multiple AWS regions during peak utilization bursts; **available for many supported models across providers (Anthropic, Meta, Amazon, Mistral, etc.), not a single provider**.

> 📸 Source: Screenshot 2026-07-04 at 22.14.24.png · Domain: D3

## Amazon Bedrock — Playgrounds

- **Bedrock Playground** lets you **interact with deployed models' APIs without writing any code**.
- Playgrounds are for **development / quick evaluation** of LLMs — **not** for daily use or production.
- Playground can **show token usage** metrics: Overall summary, Latency (e.g. 885 ms), Input token count, Output token count, Cost.
- Config options exposed: Temperature, Top P, Response length, Stop sequences, Guardrail.
- **3 playgrounds**:
  1. **Chat (Chat Completion)** — interact with LLMs that have chat completion.
  2. **Text (Completion)** — interact with LLMs to **predict next text**. Pre-chat era = simple text completion; some tools call these "legacy" playgrounds (e.g. Cohere); some only offer completion models (e.g. OpenAI / Azure AI Studio GPT-3). Useful for single-turn responses (Classification, Categorization).
  3. **Image** — work with LLMs that generate images.
- Console Overview shows: Foundation models (Titan, Claude, Command), Playgrounds (Chat/Text), and **Bedrock Studio** (Preview).

> 📸 Source: Screenshot 2026-07-04 at 22.14.29.png, Screenshot 2026-07-04 at 22.14.39.png, Screenshot 2026-07-04 at 22.17.38.png · Domain: D3

## Prompt Engineering (Hands-on Demo)

- **Structure of a prompt** (a prompt can contain up to 4 elements; not all required):
  1. **Instructions** — the task for the model to do.
  2. **Context** — external information to guide the model.
  3. **Input data** — the input you want a response for.
  4. **Output indicator** — the output type or format.
- **Zero-Shot prompting**: present a task to an LLM **without giving it further examples**; expect the task done with no prior "shot." Modern LLMs show strong zero-shot performance; positive correlation between model size and zero-shot performance.
- **Few-Shot prompting**: include a few worked **examples** (shots) in the prompt so the model imitates the pattern; boosts accuracy on format-sensitive/ambiguous tasks. **One-shot** = exactly one example.
- **Chain-of-Thought (CoT)**: breaks complex reasoning into intermediary reasoning steps; often combined with **few-shot**. Trigger phrase: **"Think Step-by-Step"**.
  - Helps on math/logic/multi-step problems by making the model reason before answering; trades more tokens/latency for accuracy.
- **Invoking Bedrock (boto3)**: `client.invoke_model(body, contentType, accept, modelId, trace, guardrailIdentifier, guardrailVersion)`; requires the `bedrock:InvokeModel` IAM action. `body` (bytes/file) is REQUIRED.
- **Messages API note**: newer Claude models (e.g. `claude-3-haiku`) raise a `ValidationException` on the old InvokeModel text format — you must use the **Messages API** format: body includes `anthropic_version`, `max_tokens`, `messages: [{role, content:[{type:text, text:...}]}]`, `temperature`, `top_p`.
- Response metadata reports token counts: `x-amzn-bedrock-input-token-count` and `x-amzn-bedrock-output-token-count`.
- **Message roles** (Claude): **System role** (defines overall AI behavior/persona), **User role** (human input driving the conversation), plus advanced/additional roles simulating multiple personas.

> 📸 Source: Screenshot 2026-07-04 at 22.19.27.png, Screenshot 2026-07-04 at 22.19.36.png, Screenshot 2026-07-04 at 22.21.36.png, Screenshot 2026-07-04 at 22.25.23.png, Screenshot 2026-07-04 at 22.28.13.png, Screenshot 2026-07-04 at 22.28.26.png, Screenshot 2026-07-04 at 22.28.33.png, Screenshot 2026-07-04 at 22.40.19.png, Screenshot 2026-07-04 at 22.40.33.png · Domain: D3

## Text Generation (Hands-on Demo)

- **Text Generation** lab: use LLMs on Amazon Bedrock for open-ended text generation and entity extraction (via boto3 API calls).
- Titan FMs are built for **responsible use**: detect/remove harmful content, reject inappropriate user input, filter outputs (hate speech, profanity, violence).
- **Use cases**: email generation, short stories, essays, social media posts, web page copy, marketing product descriptions, automated article generation, report generation, code translation/explanation, entity extraction.
- **Entity Extraction with an LLM**: unlike classic extractors (limited to predefined classes), an LLM lets you specify what to extract in **natural language** — more flexibility/accuracy and **no need for data labeling**. Can help assemble a dataset for a custom solution (e.g. **Amazon Comprehend** custom entity recognition).
- Flow: **Prompt Input Request → Amazon Bedrock Foundation Model → Generated Output**.
- **5 text-generation sub-patterns**: Zero-shot generation (Bedrock API/Boto3 and LangChain), Code generation, Summarization (uses **Titan**; depends on document size/context length), Simplified Question Answering (QA against a knowledge base), Entity Extraction (NLP technique).
- Titan invocation: `body = json.dumps({"inputText": prompt, "textGenerationConfig": {"maxTokenCount":512, "stopSequences":[], "temperature":0, "topP":0.9}})`; read output via `response_body.get('results')[0].get('outputText')`. Note: Titan TTP generates the whole summary in a single output — can be slow for large token counts.
- QA prompt example instructs the assistant to answer concisely and say "I am unsure" when uncertain (avoids hallucination).
- Entity extraction demo configured **LangChain** (`ChatBedrock`) with Anthropic Claude v3; `%pip install -U langchain-aws`.

> 📸 Source: Screenshot 2026-07-04 at 22.28.50.png, Screenshot 2026-07-04 at 22.28.55.png, Screenshot 2026-07-04 at 22.31.13.png, Screenshot 2026-07-04 at 22.31.38.png, Screenshot 2026-07-04 at 22.35.46.png, Screenshot 2026-07-04 at 22.39.57.png · Domain: D3

## Amazon Bedrock — Knowledge Bases

- **Knowledge bases** feature lets you set up a **RAG workflow to a vectorstore**.
  - **RAG (Retrieval-Augmented Generation)** — retrieves relevant chunks from your own data and injects them into the prompt as context so the FM answers from up-to-date/proprietary info. Reduces hallucination and adds knowledge **without fine-tuning/retraining**.
  - > 🎯 Exam: need current or company-specific facts, cited, cheap to update → **RAG/Knowledge Base**, not fine-tuning.
- **Pipeline**: Data Sources → Chunking → Parsing → Embedding → Vectorstore.
  - **Chunking** = split docs into smaller passages so retrieval is granular and fits context. **Embedding** = convert each chunk into a numeric **vector** capturing semantic meaning. **Vectorstore** = DB that finds nearest vectors (semantic similarity search) at query time.
- **Data sources**: Amazon S3, Web Crawler, Confluence, Salesforce, SharePoint.
- **Chunking options**: Default Chunking, Fixed Chunking, Hierarchical Chunking, Semantic Chunking, No Chunking, **Lambda Function** (custom).
  - **Fixed** = equal token size + overlap. **Semantic** = split at meaning boundaries. **Hierarchical** = parent/child chunks (retrieve small, expand to parent). **No Chunking** = one chunk per file (already-small docs).
- **Advanced Parsing options**: analyze and extract info using an LLM — **Claude 3 Sonnet** or **Claude 3 Haiku**.
  - **Supported file types**: .txt, .md, .html, .docx, .csv, .xlsx, .pdf.
  - No single file larger than **50 MB**.
  - To parse **PDF** you must turn on **advanced parsing**.
- **Embedding options**: Titan Text Embeddings, Cohere Embed English, Cohere Embed Multilingual.
- **Vector store options**: **OpenSearch Serverless**, Amazon Aurora, MongoDB Atlas, Pinecone, Redis Enterprise Cloud.
- **Creating a KB (console)**: provide details → IAM permissions (create a new service role or use existing) → choose data source (Amazon S3 or Web Crawler) → select embeddings model + configure vector store → review and create. **Cannot create a KB with a root user** — use an IAM user.
- **Programmatic create**: configure OpenSearch Serverless (collection ARN, index name, vectorField, textField, metadataField), chunking strategy config (e.g. FIXED_SIZE, maxTokens 512, overlapPercentage 20), S3 config, and Titan embeddings model ARN.
- **Syncing**: each time you add/modify/remove files you must **sync (ingest)** the data source to re-index. Syncing is **incremental** (only changed docs). After sync, vector embeddings may take a few minutes to be queryable (unless using Amazon Aurora/RDS). Use **View warnings** to see why an ingestion job failed.

> 📸 Source: Screenshot 2026-07-04 at 22.42.00.png, Screenshot 2026-07-04 at 22.42.11.png, Screenshot 2026-07-04 at 22.55.37.png, Screenshot 2026-07-04 at 22.56.25.png, Screenshot 2026-07-04 at 22.56.39.png · Domain: D3
