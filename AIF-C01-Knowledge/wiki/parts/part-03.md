# Part 03 — Amazon Bedrock: RAG, Agents, Prompt Flow, Custom Models

## Knowledge Bases & RAG — Hands-on Demo (Retrieve / RetrieveAndGenerate)
*Domain: D3 — Applications of Foundation Models*

- Walkthrough of the `aws-samples/amazon-bedrock-workshop` repo, folder `02_KnowledgeBases_and_RAG`.
- **RAG (Retrieval Augmented Generation)** securely connects Foundation Models (FMs) in Amazon Bedrock to your company data.
  - Access to external data helps the model generate more relevant, context-specific, accurate responses **without continuously retraining the FM**.
  - Retrieved results come with **source attribution** → improves transparency and **minimizes hallucinations**.
  - RAG is **non-parametric** — it retrieves data from outside the model and augments the prompt with the relevant retrieved context.
- Two key Knowledge Base APIs demonstrated:
  - **`RetrieveAndGenerate` API** — queries the KB for the desired number of document chunks (similarity search) and integrates with an LLM to answer questions in one call.
    - Managed end-to-end RAG: retrieval + prompt augmentation + generation handled by Bedrock; returns a natural-language answer + citations. Use when you want the simplest one-call RAG.
  - **`Retrieve` API** — returns only the retrieved text chunks (plus `location type`, `URI`, and relevance `scores`); you then manually augment the prompt and call the model.
    - Retrieval-only: gives you raw chunks so YOU control prompt construction and which model to call. Use when you need custom orchestration (e.g. LangChain, re-ranking, own prompt template).
    > 🎯 Exam: `RetrieveAndGenerate` = fully-managed answer in one call; `Retrieve` = chunks only, you generate. Both draw on the same KB.
- Notebooks use models: `mistral.mistral-7b`, `anthropic.claude-3-sonnet`, Anthropic Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`), Claude V2.
- `Retrieve` call config example (boto3, `bedrock-runtime`):
  - `retrievalConfiguration.vectorSearchConfiguration` → `numberOfResults` and `overrideSearchType` (optional): `"HYBRID"` or `"SEMANTIC"`.
    - **SEMANTIC** — pure vector/embedding similarity (meaning-based). **HYBRID** — combines semantic vectors + keyword (lexical) matching; better when exact terms/IDs/acronyms matter.
- **LangChain integration (Part 2):** use `AmazonKnowledgeBasesRetriever` from `langchain.retrievers.bedrock` with `ChatBedrock` — converts user queries into embeddings, searches the KB, and returns relevant results for custom workflows on top of semantic search.

> 📸 Source: Screenshot 2026-07-04 at 22.56.45.png, Screenshot 2026-07-04 at 22.57.04.png, Screenshot 2026-07-04 at 22.58.18.png, Screenshot 2026-07-04 at 22.58.30.png, Screenshot 2026-07-04 at 22.59.08.png, Screenshot 2026-07-04 at 22.59.55.png, Screenshot 2026-07-04 at 23.00.07.png

## Amazon Bedrock — Agents
*Domain: D3 — Applications of Foundation Models*

- **Amazon Bedrock Agent Builder** provides a **low-code / no-code** experience to create **agentic workflows**.
- Features:
  - Choose from multiple **Foundational Models**.
  - Add **Guardrails**.
  - Add **Knowledge Base**.
  - **Add Tool Use via Action Groups** — Action Groups use **Lambda Functions** (exam-relevant).
    - **Action Group** — defines a set of tasks/tools the agent can perform; maps agent decisions to a **Lambda** (business logic) or API schema. This is HOW an agent takes real-world actions (e.g. create a booking).
  - Add **Sessions Management** — limited based on the LLM.
    - Maintains conversation state/context across turns within a `session_id` so the agent remembers prior messages (bounded by the model's context window).
  - Add a **code execution environment via Code Interpreter**.
    - Lets the agent write and run code in a sandbox (math, data parsing, charts) instead of hallucinating computed answers.
- **Agentic Workflows** = the Agent has **its own agency** to call out to additional functionality (Knowledge Base, Tool Use) **without you explicitly routing or orchestrating with code**.
  > 🎯 Exam: **Agents** = model DECIDES which tools/steps to run dynamically (autonomous, non-deterministic). **Prompt Flow** = YOU predefine a fixed, deterministic pipeline of nodes. Choose Agents for open-ended reasoning, Prompt Flow for known steps.
- Action Group functions are defined with a Name, Description, and typed **Parameters** (e.g., `date` = "YYYY-MM-DD", each with type `string` and Required true/false).

> 📸 Source: Screenshot 2026-07-04 at 23.00.44.png

## Amazon Bedrock — Agents Hands-on Demo (create / associate KB / invoke / cleanup)
*Domain: D3 — Applications of Foundation Models*

- Workshop folder `05_Agents` builds a **restaurant assistant** (customers create, delete, or get reservation info).
- Notebook flow:
  - `01_create_agent.ipynb` — choose FM, create a **DynamoDB** table for reservations, create a **Lambda function** to handle bookings, create the agent with an **Action Group** attached.
  - `02_associate_knowledge_base_to_agent.ipynb` — attach a **Menus Knowledge Base** so customers can ask about menus. Architecture uses **Amazon OpenSearch Serverless index** + **Documents S3 bucket**.
  - `03_invoke_agent.ipynb` — test agent invocation via boto3.
  - `04_clean_up_agent_resources.ipynb` — delete resources (avoids OSS index + DynamoDB charges).
- **boto3 has two agent clients:**
  - **`bedrock-agent`** — create, update, delete, prepare an agent or knowledge base (control plane).
    - Control plane = manage/configure resources (build-time). Does NOT run inference.
  - **`bedrock-agent-runtime`** — invoke an agent (`invoke_agent` API) and retrieve from a KB (`retrieve`, `retrieve_and_generate` APIs).
    - Data/runtime plane = actually run the agent and query the KB (request-time).
- Console Action Group setup:
  - **Action group type:** "Define with function details" (JSON objects) OR "Define with API schemas" (Lambda/API Gateway schema).
    - **Function details** = you describe functions/params in JSON (Bedrock builds the tool spec). **API schemas** = supply an OpenAPI schema for a Lambda/API Gateway backend.
  - **Action group invocation** — options: Quick-create new Lambda (recommended), select existing Lambda, or **Return control**.
    - **Return control** — instead of Bedrock calling Lambda, the agent hands the function call back to YOUR application to execute; use when logic lives outside AWS/Lambda.
  - Per action group you can define up to **3 functions**; each function has typed Parameters (e.g., `get_booking_details` with `booking_id` string required; `create_booking` with `date`, `hour`, `name`, `num_guests`).
  - **Enable confirmation of action group function** (optional) — safeguards against malicious prompt injection before invoking.
    - Human-in-the-loop gate: agent asks the user to confirm before running a sensitive action (e.g. delete/create), reducing risk of prompt-injection-triggered actions.
- Runtime invocation uses `invoke_agent_helper(query, session_id, agent_id, alias_id)`; a unique `session_id` is generated with `uuid.uuid1()`.

> 📸 Source: Screenshot 2026-07-04 at 23.00.54.png, Screenshot 2026-07-04 at 23.01.03.png, Screenshot 2026-07-04 at 23.01.11.png, Screenshot 2026-07-04 at 23.01.14.png, Screenshot 2026-07-04 at 23.02.22.png, Screenshot 2026-07-04 at 23.02.26.png, Screenshot 2026-07-04 at 23.02.31.png, Screenshot 2026-07-04 at 23.10.01.png

## Amazon Bedrock — Prompt Flow
*Domain: D3 — Applications of Foundation Models*

- **Amazon Bedrock Prompt Flow** enables **orchestration** of complex GenAI workflows.
  - A **visually-built, deterministic pipeline**: you wire nodes into a fixed graph (input → steps → output). Use when steps are known in advance; contrasts with an Agent's autonomous routing.
- Supported **nodes**:
  - **Collector**, **Condition**, **Iterator** (flow-control nodes)
    - **Condition** — branch the flow based on logic (if/else routing). **Iterator** — loop over each item in a list. **Collector** — gather iterated outputs back into a single list.
  - **Agents**, **Prompts**, **Lambda Function**, **Knowledge base**, **S3 Retrieval**, **S3 Storage**, **Lex**, **Flow Output**.
    - Each node type plugs a capability into the flow (call an Agent, run a Prompt template, invoke Lambda, query a KB, read/write S3, hand off to Amazon Lex chatbot, emit final output).
- Prompt Flow has a **Visual Editor** (similar to Application Composer).
- You can use **CloudFormation (CFN)** to programmatically define a Prompt Flow.
- Console builder: drag/connect **Flow input → nodes (e.g., Agents node with agentInputText, promptAttributes, sessionAttributes) → Flow output**; each port is typed (String/Object).

> 📸 Source: Screenshot 2026-07-04 at 23.10.28.png, Screenshot 2026-07-04 at 23.10.38.png

## Amazon Bedrock — Prompt Manager
*Domain: D3 — Applications of Foundation Models*

- **Prompt Manager** lets you create **reusable prompt templates** with **variable injection**.
- Create multiple **variants** of a prompt to quickly test and fine-tune prompt engineering.
  - **Variant** = an alternative version of the same prompt (different wording/model/params) you can A/B compare to find the best-performing one before deploying. Note: "fine-tune prompt engineering" ≠ model fine-tuning.
- Uses `{{variable}}` placeholders (e.g., `{{role}}`, `{{instruct}}`, `{{format}}`) filled by **Test variables** (variable name + value).
- **Integrates with Amazon Bedrock Prompt Flow.**

> 📸 Source: Screenshot 2026-07-04 at 23.18.55.png

## Amazon Bedrock — Custom Models (Fine-tuning vs Continued Pre-Training)
*Domain: D3 — Applications of Foundation Models*

- **Custom Models** let you customize a model **by training** a Foundational Model. Two methods:
  - **Continued Pre-Training** — uses **unlabeled data** to improve the model's **general knowledge**. Data format: `{"input": "<input text>"}` per line.
    - Feeds raw domain text (no labels) to absorb industry vocabulary/knowledge; teaches the model a DOMAIN, not a task.
  - **Fine-tuning** — uses **labeled data** to improve the model to **perform specific tasks**. Data format: `{"prompt": "<prompt>", "completion": "<expected generated text>"}` per line.
    - Trains on prompt→completion pairs (labeled) to teach a SPECIFIC task/behavior/style (e.g. summarize, classify).
  > 🎯 Exam: unlabeled → Continued Pre-Training (domain knowledge); labeled prompt/completion → Fine-tuning (specific task). Both change model weights, unlike RAG (adds external data, no retraining).
- Training data must be in **JSONL format** (one JSON object per line), stored and referenced from an **Amazon S3 bucket**.
- You can use **SageMaker Ground Truth** to create and label training datasets.

> 📸 Source: Screenshot 2026-07-04 at 23.19.03.png

## Amazon Bedrock — Custom Models Pricing
*Domain: D3 — Applications of Foundation Models*

- Additional costs when creating a custom model (example: Cohere Command):
  - **Training Time** — ~$0.004 to train 1,000 tokens.
  - **Storage of Custom Model** — ~$1.95 to store each custom model per month.
  - **Provisioned Throughput for Custom Model** — ~$49.50 to infer per **Model Unit (MU) per hour**.
- **Key exam point:** When deploying a custom model, **you must use Provisioned Throughput.**
  - **Provisioned Throughput** — reserve dedicated capacity (Model Units) billed per hour, regardless of usage. Contrast **On-Demand** (pay per token, only base models). Custom/imported models can't run On-Demand.
  - Factor continuous cost vs. using an On-Demand more intelligent (base) model.

> 📸 Source: Screenshot 2026-07-04 at 23.19.10.png

## Amazon Bedrock — Import Models
*Domain: D3 — Applications of Foundation Models*

- **Import Model** lets you import **model weights** to bring specific models in as custom models that Amazon Bedrock can deploy and manage.
  - **Custom Model Import** — bring your OWN already-trained weights (trained elsewhere) into Bedrock to serve via the unified Bedrock API/infrastructure. Differs from Custom Models (fine-tune/CPT), which train INSIDE Bedrock.
- **Supported architectures:** Mistral, Flan, Llama 2 and Llama 3.
  > 🎯 Exam: Import = weights trained OUTSIDE Bedrock (own compute/SageMaker), only supported open architectures. Not for arbitrary proprietary models.
- When importing, you provide files that the **Hugging Face Transformers** library creates:
  - `.safetensor`
  - `config.json` (Llama or Mistral)
  - `tokenizer_config.json` (Llama)
  - `tokenizer.json`
  - `tokenizer.model`
- Useful when you've trained specific LLMs **outside of Bedrock** on your own compute or within SageMaker.

> 📸 Source: Screenshot 2026-07-04 at 23.19.15.png

## Custom Models / Fine-tuning — Hands-on Demo
*Domain: D3 — Applications of Foundation Models*

- Workshop folder `03_Model_customization`:
  - `01_fine-tuning-titan-lite.ipynb` — fine-tune **Amazon Titan Text Lite / Express** for a summarization use case (kernel: Data Science 3.0, `ml.c5.2xlarge`).
  - `02_fine-tuning_llama2.ipynb` — end-to-end fine-tune + evaluate **Meta Llama 2 13B**; note: cannot run in Workshop Studio accounts (use your own account).
- **Warning:** these notebooks create **Provisioned Throughput** to test the fine-tuned model — delete it afterward to avoid ongoing charges.
- Evaluation uses **`fmeval`** with summarization accuracy metrics: **METEOR, ROUGE, and BERT** scores.
  - **ROUGE** — n-gram/word overlap between generated summary and reference (recall-oriented). **METEOR** — overlap that also credits synonyms/stemming. **BERTScore** — semantic similarity via embeddings (meaning, not just exact words).

> 📸 Source: Screenshot 2026-07-04 at 23.18.38.png, Screenshot 2026-07-04 at 23.19.37.png, Screenshot 2026-07-04 at 23.20.11.png

## Foundation Model Evaluations Library (fmeval)
*Domain: D3 — Applications of Foundation Models*

- **`fmeval`** (github.com/aws/fmeval) is a library to **evaluate Large Language Models (LLMs)** to help select the best LLM for your use case.
- Evaluates LLMs for tasks: **Open-ended generation**, **Text summarization**, **Question Answering**, **Classification**.
- Provides algorithms to evaluate LLMs for **Accuracy, Toxicity, Semantic Robustness, and Prompt Stereotyping**.
  - **Accuracy** — how correct/close outputs are to references (uses metrics like ROUGE/METEOR/BERTScore/F1).
  - **Toxicity** — measures harmful, offensive, or hateful content in generations (lower = safer).
  - **Semantic Robustness** — how much output QUALITY degrades under small input perturbations (typos, casing, whitespace); stable output = robust.
  - **Prompt Stereotyping** — measures bias, i.e. whether the model prefers stereotyped completions across demographic groups (lower = fairer).
- Includes a **`ModelRunner`** interface (with a `predict` method) — built-in support for **Amazon SageMaker Endpoints and JumpStart** models; extensible to custom model classes.
  - `ModelRunner` = the adapter fmeval calls to get predictions from any model; implement `predict` to plug in models beyond the built-in SageMaker ones.

> 📸 Source: Screenshot 2026-07-04 at 23.20.16.png

## Creating Training Datasets (JSONL format) — Demo
*Domain: D3 — Applications of Foundation Models*

- Using **Claude (claude.ai / Claude 3.5 Sonnet)** to generate a training dataset (100 unique animals) as a **JSONL** artifact.
  - Format: `{"prompt": "Classify this using a single word if this animal as a bird, reptile, mammal, amphibian or fish: Dog: ", "completion": "mammal"}` — one JSON object per line.
- Bedrock docs — **Prepare training and validation datasets** for a custom model:
  - Data must be **JSONL** (each line = one complete data sample; remove all `\n` within a sample; one sample per line).
  - **Fine-tuning single-turn messaging** format fields:
    - `system` (optional) — string setting conversation context.
    - `messages` — array of message objects, each with `role` (`user` or `assistant`) and `content` (text).
  - Rules: `messages` array must contain **2 messages**; first message `role` = user; last message `role` = assistant.
  - Example: `{"system": "...","messages":[{"role":"user","content":"..."},{"role":"assistant","content":"..."}]}`

> 📸 Source: Screenshot 2026-07-04 at 23.21.06.png, Screenshot 2026-07-04 at 23.21.22.png, Screenshot 2026-07-04 at 23.21.44.png
