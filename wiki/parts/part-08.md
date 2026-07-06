# Part 08 — AWS AI Managed Services (Regression Metrics, fmeval, Amazon Q, Developer/AI Services)

## Regression Metrics (MSE, MAE, RMSE)
*Domain: D1 — Fundamentals of AI and ML*

- An error in a regression model = the distance from the regression line to the data point; represents uncertainty.
- **Mean Squared Error (MSE):**
  - Number is multiplied by itself (squared) to remove negatives (always positive), and gives more weight to larger differences.
  - Average (mean) of all squared values.
  - Considers both negative and positive values; biased toward higher values; penalizes large errors.
- **Mean Absolute Error (MAE):**
  - Average of the absolute distances.
  - Only considers positive values; less bias toward higher values; does NOT penalize large errors.
- **Root Mean Squared Error (RMSE):**
  - Square root of the average squared errors.
  - Determines how well the model fits the dependent variables; penalizes large errors more.
  - Considers both negative and positive values; less bias overall.

> 📸 Source: Screenshot 2026-07-05 at 16.51.25.png

## Foundation Model Evaluation Library (fmeval)
*Domain: D3 — Applications of Foundation Models*

- **fmeval** is a library to evaluate LLMs, to help select the best LLM for your use case. GitHub: `https://github.com/aws/fmeval`.
- Can evaluate: Open-ended generation, Text summarization, Question Answering, Classification.
- Contains algorithms for: Accuracy, Toxicity, Semantic Robustness, Prompt Stereotyping.
- Workflow (code example): define a `DataConfig` (dataset name/URI/MIME type, input & output locations) → create a `BedrockModelRunner` (model_id, output, content_template) → run an eval algorithm (e.g. `SummarizationAccuracy().evaluate(...)`) with a prompt_template.

> 📸 Source: Screenshot 2026-07-05 at 16.51.31.png

## Amazon Q
*Domain: D3 — Applications of Foundation Models*

- **Amazon Q** is an AI chatbot using multiple LLM models via Amazon Bedrock. Ask it questions similar to ChatGPT / other generative AI chat services.
  - 🎯 Chọn khi: cần **generative AI assistant** làm sẵn (fully managed, no model to build) cho công việc/coding/BI. Đừng nhầm: **Amazon Q** = ứng dụng chatbot dựng sẵn của AWS; **Amazon Bedrock** = nền tảng để *bạn tự build* GenAI app từ FM (Q chạy *trên* Bedrock).
  - 🎯 Q Business (RAG trên dữ liệu công ty, 40+ connectors) vs Q Developer (trợ lý code + quản lý tài nguyên AWS). Đừng nhầm: Q Business ≈ enterprise assistant; **Kendra** = search engine thuần (Q Business dùng cơ chế giống Kendra bên dưới nhưng thêm khả năng sinh câu trả lời).
- **Amazon Q Business** — connect it to company data, information, and systems; made simple with more than 40 built-in connectors.
- **Amazon Q Developer** — coding, testing, upgrading, troubleshooting, and optimizing AWS resources. Integrated into AWS Management Console, VSCode (via AWS Toolkit), Cloud9, AWS Lambda Code Editor, Slack, and other places.
- **Amazon Q for Amazon QuickSight** — ask questions about your BI data; Generative BI to build visuals, summarize insights, answer data questions, and build data stories using natural language.
- **Amazon Q for Amazon Connect** — real-time conversation with the customer along with relevant company content.
- **Amazon Q for AWS Supply Chain** — get intelligent answers about what is happening in the supply chain.

> 📸 Source: Screenshot 2026-07-05 at 16.51.39.png

## Amazon CodeWhisperer
*Domain: D3 — Applications of Foundation Models*

- **Amazon CodeWhisperer** is a real-time AI coding companion; generates suggested code while you write.
  - 🎯 Chọn khi: cần **gợi ý/sinh code real-time trong IDE** (autocomplete cả hàm từ comment). Đừng nhầm: CodeWhisperer = *viết code mới*; **CodeGuru** = *review/phân tích code đã có* (bảo mật, hiệu năng). Lưu ý: CodeWhisperer nay đã được gộp vào **Amazon Q Developer**.
- Integrates with IDEs: AWS Glue Studio Notebook, JetBrains (e.g. IntelliJ IDEA), JupyterLab, Amazon SageMaker Studio, Terminal/shell/command-line, Visual Studio (VS) Code, Visual Studio.
- Two tiers: **Individual** and **Professional**.
  - **Individual** — authenticate via AWS Builder ID; security vulnerability scanning 50 scans per user/month.
  - **Professional** — authenticate via IAM Identity Center; security vulnerability scanning 500 scans per user/month; plus Customize for Organizations, Organizational license management, Organizational policy management, Amazon Q feature development, Amazon Q Code Transformation.
  - Both include: in-line code suggestions, public code filter and reference tracking, command line integration, Amazon Q chat in IDE.

> 📸 Source: Screenshot 2026-07-05 at 16.51.44.png

## Amazon CodeGuru
*Domain: D3 — Applications of Foundation Models*

- **Amazon CodeGuru** is a machine-learning code analysis service. Performs code-reviews and suggests changes to improve code quality; can show visual code profiles (internals) to pinpoint performance.
  - 🎯 Chọn khi: cần **tự động review chất lượng/bảo mật code** (Reviewer) hoặc **tìm điểm nghẽn hiệu năng lúc runtime** (Profiler). Đừng nhầm: CodeGuru = *phân tích code có sẵn*; **CodeWhisperer/Q Developer** = *sinh code mới*.
- Three services:
  - **CodeGuru Security** — detect, track, and fix code security issues (Code Security Analytics Scan, Code Quality Analytics Scan, Secrets Detection Scan).
  - **CodeGuru Profiler** — find and fix inefficiencies in code.
  - **CodeGuru Reviewer** — associate a repo for continuous code change recommendations.
- **GitHub Actions** is used to automate continuous checks for GitHub repos.
- Supported languages: Java, JavaScript, Python, C#, TypeScript, Ruby, Go, IaC (CloudFormation, Terraform, AWS SDK for TypeScript or Python).

> 📸 Source: Screenshot 2026-07-05 at 16.52.17.png

## Amazon Comprehend
*Domain: D3 — Applications of Foundation Models*

- **Amazon Comprehend** is a Natural Language Processor (NLP) service. Finds relationships between text to produce insights; analyzes data such as customer emails, support tickets, social media and makes predictions.
  - 🎯 Chọn khi: cần **phân tích/hiểu văn bản** — sentiment, entities, key phrases, language, PII, topic. Có **Comprehend Medical** cho văn bản y tế (trích PHI/entities lâm sàng). Đừng nhầm: **Comprehend** = phân tích text NLP; **Translate** = dịch ngôn ngữ; **Transcribe** = speech→text; **Textract** = trích text từ ảnh/PDF (OCR); **Kendra** = search tài liệu.
- Can analyze text and extract:
  - **Entities** — e.g. Person, Organization, Location.
  - **Key Phrases** — important text (e.g. amounts/dates).
  - **Language** — confidence of the language being spoken.
  - **PII (Personally Identifiable Information)** — e.g. names, emails.
  - **Sentiment** — attitude toward the text (e.g. 0.20 Negative).
  - **Targeted sentiment** — attitude of specific words.
  - **Syntax** — identify parts of language (e.g. Proper Noun).
  - **Custom Models** — upload training data to analyze and extract custom text.
    - **Amazon Comprehend Flywheel** — automates the training of model versions for custom models.
- Serverless; pay based on size of request in units (1 unit = 100 characters).
- Real-time analysis via an endpoint (or custom endpoint for custom models); analysis jobs allow for batch jobs.
- Primary usage is via the AWS API (code example shows Ruby SDK V3: `detect_dominant_language`, `detect_sentiment`).

> 📸 Source: Screenshot 2026-07-05 at 16.52.47.png, Screenshot 2026-07-05 at 16.52.54.png

## Amazon Forecast
*Domain: D3 — Applications of Foundation Models*

- **Amazon Forecast** is a time-series forecasting service. Forecasts business outcomes such as product demand, resource needs, or financial performance.
  - 🎯 Chọn khi: cần **dự báo dữ liệu chuỗi thời gian** (demand, inventory, doanh thu theo thời gian) mà không cần build model ML. Đừng nhầm: **Forecast** = time-series tương lai; **SageMaker** = tự build model tùy ý; **Fraud Detector** = phát hiện gian lận (classification), không phải dự báo theo thời gian.
- Upload dataset to S3 with: Historical data, Additional Metadata (optional).
- Workflow:
  - **Create Data Set Group / Create Data Import Job** — define the schema, register the task.
  - **Create Predictor / Get Accurate Metrics** — ELT job evaluates the model; choose a predefined backtest.
  - **Create Forecast** — deploy the predictor; retrained with full dataset.
- Produces a visual graph (e.g. Target value, Mean forecast, P10/P35/P75/P99 forecasts).

> 📸 Source: Screenshot 2026-07-05 at 16.53.05.png

## Amazon Fraud Detector
*Domain: D3 — Applications of Foundation Models*

- **Amazon Fraud Detector** is a fully managed fraud detection service; identifies potentially fraudulent online activities such as online payment fraud and creation of fake accounts.
  - 🎯 Chọn khi: cần **phát hiện gian lận** online (payment fraud, fake account, account takeover) mà không cần chuyên môn ML. Đừng nhầm: **Fraud Detector** = gian lận giao dịch/tài khoản; **Amazon Macie** = phát hiện dữ liệu nhạy cảm/PII trong S3; **GuardDuty** = phát hiện threat bảo mật hạ tầng.
- Predefined models to train your data against:
  - **Online Fraud Insights** — optimized to detect fraud when little historical data is available (e.g. new customer registering online).
  - **Transaction Fraud Insights** — for fraud use cases where the entity being evaluated has a history of interactions the model can analyze to improve accuracy.
  - **Account Takeover Insights** — if an account was compromised by phishing or another attack.
- Using the AWS SDK, real-time fraud detection systems can be architected with AWS Step Functions, Amazon Kinesis, AWS Lambda, and other AWS application integration services.
- Upload dataset for model training to an S3 bucket referenced by Fraud Detector.
- **Creating a model (boto3):** `create_model_version` with modelType (e.g. `ONLINE_FRAUD_INSIGHTS`), trainingDataSource (`EXTERNAL_EVENTS`), trainingDataSchema (modelVariables, labelSchema/labelMapper FRAUD/LEGIT, unlabeledEventsTreatment=AUTO), externalEventsDetail (S3 dataLocation, dataAccessRoleArn).
- **Deploy:** after reviewing performance, set it `ACTIVE` via `update_model_version_status` for real-time detection.
- **Component flow:** Models (user defined) → Scores (model generated) → Rules (user defined) → Detector → Outcomes (user defined). Thresholds (user defined) feed into Rules.
  - **Scores** = numerical values representing estimated risk level of an event being fraudulent (different models use different scoring).
  - **Rules** interpret variable values during a fraud prediction: Variable or List (data to operate on), Expression (rule language e.g. operators, regex), Outcome (outcome to return).
  - **Outcomes** define the fraud prediction result, e.g. risk levels (high_risk, medium_risk, low_risk) and actions (approve, review).
- **Event type** requires defining Labels, Entities, and Variables:
  - **Labels** classify an event as fraudulent or legitimate.
  - **Entities** represent WHO is performing the event (e.g. Customer).
  - **Variables** are data points used in your model (e.g. Location, Transaction Amount).
  - Flow: Labels + Entities + Variables → Events → Models. Events contain the data and rules analyzed by the model.

> 📸 Source: Screenshot 2026-07-05 at 16.53.11.png, Screenshot 2026-07-05 at 16.53.16.png, Screenshot 2026-07-05 at 16.53.22.png, Screenshot 2026-07-05 at 16.53.29.png, Screenshot 2026-07-05 at 21.09.42.png, Screenshot 2026-07-05 at 21.10.09.png, Screenshot 2026-07-05 at 21.10.34.png, Screenshot 2026-07-05 at 21.10.47.png

## Amazon Kendra
*Domain: D3 — Applications of Foundation Models*

- **Amazon Kendra** is an enterprise machine learning search engine service. Uses natural language to suggest answers to questions instead of just simple keyword matching.
  - 🎯 Chọn khi: cần **intelligent document search** trên tài liệu nội bộ doanh nghiệp (semantic search, hỏi bằng ngôn ngữ tự nhiên, kết nối S3/SharePoint...). Là lựa chọn kinh điển cho **RAG knowledge base**. Đừng nhầm: **Kendra** = tìm & trả lời từ tài liệu; **Comprehend** = phân tích NLP văn bản; **Lex** = chatbot hội thoại; **Q Business** = assistant sinh câu trả lời (thêm khả năng generative lên trên search).
- Uses semantic and contextual understanding capabilities on a search query (like interacting with a human) rather than keyword-based search.
- **Amazon Lex chatbot** can be used as an interface to Amazon Kendra.
- Components:
  - **Index** — a table that holds the index of your documents to make them searchable.
  - **Data Source** — where documents are stored (e.g. S3, SharePoint, Box, Postgres); you need to define a schema.
    - **Data Source Template Schemas** — AWS provides ~40 schema templates for common AWS services or third-party cloud storage.
  - **Document Addition API** — an API to add documents directly to an index.
- **Two editions** (both provide all features, different limitations):
  - **Developer Edition** — 5 indexes with up to 5 data sources each; 10,000 documents or 3 GB extracted text; 4,000 queries/day or 0.05 queries/sec; runs in 1 AZ; free tier 750 hours first 30 days.
  - **Enterprise Edition** — 5 indexes with up to 50 data sources each; 8,000 queries/day or 0.1 queries/sec; runs in 3 AZs.
- **CLI workflow:**
  - Create Index: `aws kendra create-index --name --description --role-arn`.
  - Create Data Source: `aws kendra create-data-source --index-id --name --role-arn --type S3 --configuration` (other data sources use a TEMPLATE type to define the schema).
  - Sync data source to index: `aws kendra start-data-source-sync-job --id <data_source_id> --index-id <index_id>`.
  - Query index: `aws kendra query --index-id <index_id> --query-text "..."`.

> 📸 Source: Screenshot 2026-07-05 at 16.53.36.png, Screenshot 2026-07-05 at 16.53.49.png, Screenshot 2026-07-05 at 16.53.53.png, Screenshot 2026-07-05 at 16.53.57.png, Screenshot 2026-07-05 at 21.11.17.png, Screenshot 2026-07-05 at 21.13.00.png, Screenshot 2026-07-05 at 21.13.08.png, Screenshot 2026-07-05 at 21.13.20.png

## Amazon Lex
*Domain: D3 — Applications of Foundation Models*

- **Amazon Lex (V2)** is a conversational interface service. Build conversational voice and text chatbots.
  - 🎯 Chọn khi: cần **xây chatbot hội thoại** (voice/text), quản lý **intents & slots**; cùng công nghệ với Alexa. Đừng nhầm: **Lex** = build bot hội thoại; **Comprehend** = phân tích NLP; **Kendra** = search tài liệu; **Polly** = text→speech; **Transcribe** = speech→text (Lex có thể ghép Kendra để trả lời, Polly để phát giọng nói).
- Lex V2 provides: Natural Language Understanding (NLU), Automatic Speech Recognition (ASR).
- AWS provides multiple bot templates for common industries as starting points; provide transcripts to create a new bot; use Gen AI to build a bot by describing what you want; choose a target language from multiple AWS-provided voices.
- Integrates with **AWS Lambda** to connect to various AWS services.
- **Amazon Lex Network of Bots** — a feature that adds multiple bots to a single network; intelligently routes the query to the appropriate bot, providing a unified experience and reducing duplication of intent configuration for multiple specialized bots.
- **Components of a Bot:**
  - **Bot** — performs automated tasks; the input to interact with your conversation model.
    - **Version** — a numbered snapshot of your bot model.
      - **Alias** — a label/tag pointing to a specific version of a bot.
    - **Language** — the target language(s) the bot can converse in (e.g. English, Spanish).
  - **Intent** — represents an action the user wants to perform.
    - **Sample Utterance** — text of how a user might request their intent (e.g. "Can I order a pizza").
    - **Slot** — inputs an intent will require of the user (can be zero).
      - **Slot Type** — defines the data type of the slot; can be a custom enumeration (e.g. "Small", "Medium", "Large") or a predefined data type (e.g. `AMAZON.Number`).

> 📸 Source: Screenshot 2026-07-05 at 16.55.54.png, Screenshot 2026-07-05 at 16.55.59.png

## Amazon Polly
*Domain: D3 — Applications of Foundation Models*

- **Amazon Polly** is a text-to-speech service. Upload text and an audio file spoken by a synthesized voice is generated.
  - 🎯 Chọn khi: cần **chuyển text → giọng nói** (đọc bài, IVR, e-learning, lồng tiếng). Đừng nhầm: **Polly** = text→speech; **Transcribe** = speech→text (chiều ngược lại); **Translate** = dịch text; **Lex** = chatbot hội thoại.
- **Engine Types:**
  - **Standard ($)** — not as natural sounding as other engines, but most cost effective.
  - **Long Form ($$)** — sounds more natural when reading long forms of text.
  - **Neural ($$$)** — supports a Newscaster speaking style tailored to news narration use cases.
- There is variation between voices depending on the text being spoken; **no standard speed** (words per minute) is available for Amazon Polly voices.
- **Lexicon** — for specialized pronunciation of words. A lexicon file (`.xml`, `.pls`) with up to 40,000 characters and up to 100 pronunciation rules.
- **Speech Marks** — metadata that describes the speech (where a word starts or ends). Utilize Speech Synthesis Markup Language (SSML). Integrate with Visme (third-party AI service) to create marketing materials.
- CLI: `aws polly synthesize-speech --engine neural --output-format mp3 --voice-id Joanna --text "Hello, world!" hello_world.mp3`.

> 📸 Source: Screenshot 2026-07-05 at 21.43.01.png, Screenshot 2026-07-05 at 21.43.04.png

---
*Note: Screenshot 2026-07-05 at 19.40.34.png is a mobile app UI (Journal / emotions app), not a course slide — skipped.*
