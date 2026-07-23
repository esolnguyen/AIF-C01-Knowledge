# Part 09 — AWS AI Services, Governance & Data Services

## Amazon Polly — SSML (D3)

- **Amazon Polly** is a text-to-speech (TTS) service that turns text into lifelike speech.
  - What: managed TTS (text → audio). Key prop: supports **Standard** vs **Neural (NTTS)** voices; Neural = more natural, plus features like Newscaster style & brand voices. Use when you need to read text aloud (IVR, e-learning, accessibility).
  - > 🎯 Exam: Polly = TTS (text→speech). Don't confuse with **Transcribe** = STT (speech→text). Real-time bidirectional voice → **Amazon Lex** (chatbot).
- **SSML (Speech Synthesis Markup Language)** is an XML-based markup language for speech synthesis applications, giving fine control over how speech is generated.
  - What: XML markup to fine-tune how Polly pronounces text (pause, pitch, emphasis, phoneme, whisper...). Key prop: some tags (Newscaster domain, DRC) only work with **Neural** voices. Use when the default voice isn't natural/accurate enough.
- Example SSML uses a root `<speak>` element with tags like `<break time="1s"/>`, `<sub alias="World Wide Web Consortium">W3C</sub>`, and `<amazon:effect name="whispered">...</amazon:effect>`.
- SSML tags Polly supports:
  - `<speak>` — the root element
  - `<break>` — pause
  - `<emphasis>` — emphasize words (Strong, Moderate, Reduced)
  - `<lang>` — specify a different language
  - `<mark>` — custom tag for metadata
  - `<p>` — pause between paragraphs
  - `<phoneme>` — phonetic pronunciation for specific text
  - `<prosody>` — control volume, speaking rate, and pitch
  - `<s>` — pause between sentences
  - `<say-as>` — control how special word types are spoken
  - `<sub>` — pronounce acronyms and abbreviations
  - `<w>` — improve pronunciation by specifying parts of speech
  - `<amazon:breath>` / `<amazon:auto-breaths>` — add breathing sound
  - `<amazon:domain name="news">` — Newscaster speaking style (only for Neural)
  - `<amazon:effect name="drc">` — dynamic range compression
  - `<amazon:effect phonation="soft">` — speak softly
  - `<amazon:effect vocal-tract-length>` — control timbre
  - `<amazon:effect name="whispered">` — whispering

> 📸 Source: Screenshot 2026-07-05 at 21.43.09.png, Screenshot 2026-07-05 at 21.43.24.png

## Amazon Rekognition (D3)

- **Amazon Rekognition** is an image and video recognition service. Analyze images and videos to detect and label objects, people, and celebrities.
  - What: managed computer-vision API (no ML expertise needed). Key prop: **prebuilt models** produce results immediately; **Custom Labels** when you need to recognize business-specific objects (trained on your own images). Choose when you need image/video analysis without training a model yourself.
  - > 🎯 Exam: Rekognition = vision (objects/faces/PPE/moderation/text-in-image). Image/video content moderation → Rekognition; **Face Liveness** prevents spoofing during face authentication. Text-in-image ≠ **Textract** (Textract = extract structured documents/forms/tables).
- Prebuilt models: Object Detection, Face Detection, Searching Faces in a Collection, People Pathing, Detecting Personal Protective Equipment (PPE), Recognizing Celebrities, Moderating Content, Detecting Text, Detecting Video Segments, Detecting Face Liveness.
- **Image requirements**: JPG or PNG; Base64 encoding when passed via the HTTP API (AWS SDKs for Java, JavaScript, Python, PHP automatically base64-encode); can access images from an S3 bucket.
- **Amazon Rekognition Custom Labels** can identify objects, logos, and scenes in images that are specific to your business needs.
- **Object Detection** (code): uses `detect_labels` — pass an S3 object (bucket + photo) with `max_labels`; response returns labels with name, confidence, instances (bounding boxes: top/left/width/height), and parents.
- **Face Detection** (code): uses `detect_faces` with `attributes: ['ALL']` — response returns `face_details` including age_range (low/high), bounding_box (width/height/left/top), mustache value/confidence, eyes_open value, and overall confidence.

> 📸 Source: Screenshot 2026-07-05 at 21.43.52.png, Screenshot 2026-07-05 at 21.43.57.png, Screenshot 2026-07-05 at 21.44.01.png

## ISO AI Standards — ISO/IEC 42001:2023 (D5)

- **ISO/IEC 42001:2023** is an international standard specifying requirements for establishing, implementing, maintaining, and continually improving an **Artificial Intelligence Management System (AIMS)** within organizations.
- Designed for entities providing or utilizing AI-based products or services, ensuring responsible development and use of AI systems.
  - What: the first international "AI governance" standard — provides a governance framework to deploy AI responsibly, control risk, and be certifiable. Key prop: similar to ISO 27001 but for an **AI management system**, not information security.
  - > 🎯 Exam: ISO/IEC 42001 = AIMS (AI governance/management), certifiable. Don't confuse with **NIST AI RMF** (an AI risk-management framework, voluntary, not certifiable) or the **EU AI Act** (a law, risk classification).

> 📸 Source: Screenshot 2026-07-05 at 21.45.30.png

## Algorithmic Accountability Act (D4)

- The **Algorithmic Accountability Act** is proposed US legislation that would require companies to be transparent about their algorithms to ensure they are fair and unbiased.
  - What: a US bill (proposed, not yet law) requiring companies to perform impact assessments of automated critical decision-making systems and report to the **FTC**. Key prop: targets **bias/fairness & transparency**, applying to both users and builders of models.
  - > 🎯 Exam: this is a US bill (proposed), focused on fairness/transparency — different from the EU AI Act (already an EU law) and GDPR (privacy/data protection).
- The Act of 2023 requires companies to assess the impacts of the AI systems they use and sell, creates new transparency about when/how such systems are used, and empowers consumers to make informed choices.
- What the bill does: baseline requirement that companies assess impacts of automating critical decision-making; requires the FTC to create structured assessment/reporting regulations; makes companies (both decision-makers and technology builders) responsible for assessing impact; requires reporting of select impact-assessment documentation to the FTC.

> 📸 Source: Screenshot 2026-07-05 at 21.45.43.png

## Generative AI Security Scoping Matrix (D5)

- The **GenAI Security Scoping Matrix** helps determine the scope of security to consider when working on or building GenAI solutions. Five scopes (increasing ownership/control):
  - **Scope 1 – Consumer App**: using "public" generative AI services. Ex: ChatGPT, Midjourney.
  - **Scope 2 – Enterprise App**: using an app or SaaS with generative AI features. Ex: Salesforce Einstein GPT, Amazon CodeWhisperer.
  - **Scope 3 – Pre-trained Models**: building your app on a versioned model. Ex: Amazon Bedrock base models.
  - **Scope 4 – Fine-tuned Models**: fine-tuning a model on your data. Ex: Amazon Bedrock customized models, Amazon SageMaker JumpStart.
  - **Scope 5 – Self-trained Models**: training a model from scratch on your data. Ex: Amazon SageMaker.
- All scopes rest on securing GenAI across: Governance & Compliance, Legal & Privacy, Risk Management, Controls, Resilience.
  - What: an AWS mental model — the higher the scope, the more you **own/control** the model and data → the more security responsibility. Key prop: used to determine "which part of security is mine" before building GenAI. Choose a low scope (1-2) when you want speed/less responsibility; a high scope (4-5) when you need customization/IP but take on full security.
  - > 🎯 Exam: remember the order — Scope 1 Consumer app → 2 Enterprise/SaaS → 3 Pre-trained (Bedrock base) → 4 Fine-tuned → 5 Self-trained (from scratch). Higher scope = more control & security ownership.

> 📸 Source: Screenshot 2026-07-05 at 21.46.00.png

## OWASP Top 10 for LLM Applications (D5)

- **OWASP Top 10 for Large Language Model Applications** educates developers, designers, architects, managers, and organizations about potential security risks when deploying and managing LLMs.
  - What: a list of the 10 most critical security vulnerabilities **specifically for LLM applications** (published by OWASP). Key prop: the #1 risk is **Prompt Injection**; other items: insecure output handling, training data poisoning, model DoS, sensitive info disclosure, excessive agency. Use as a checklist when designing/deploying a secure LLM app.
  - > 🎯 Exam: OWASP Top 10 for LLM = LLM security threats (prompt injection...). Don't confuse with the traditional OWASP Top 10 web app list. Guardrails (Bedrock) is one mitigation.
- Lists the top 10 most critical vulnerabilities in LLM applications, highlighting impact, ease of exploitation, and prevalence. Examples: prompt injection, data leakage, inadequate sandboxing, unauthorized code execution.
- Goal: raise awareness, suggest remediation strategies, and improve the security posture of LLM applications.
- Includes a **Security & Governance Checklist** — a guide for a CISO managing rollout of GenAI technology.

> 📸 Source: Screenshot 2026-07-05 at 21.46.16.png

## Amazon Athena (D1)

- **Amazon Athena** is an interactive query service that makes it easy to analyze data directly from S3.
  - What: run SQL directly on S3 data, **serverless** (no cluster/infrastructure, pay per data scanned). Key prop: schema-on-read — don't load data into a DB, just query in place. Choose when you need ad-hoc SQL on S3 files (CSV/JSON/Parquet) without standing up a warehouse.
  - > 🎯 Exam: **Athena = query (serverless SQL on S3)** vs **Glue = ETL (prepare/move data)**. Athena uses the schema from the **Glue Data Catalog**. Need a long-lived warehouse/large complex joins → Redshift, not Athena.
- Based on the open-source distributed query engine **Apache Presto**.
- Athena can do two things:
  - **Athena SQL**: run SQL queries on S3 buckets. Uses **Trino SQL** (a fork of Apache Presto). Access via AWS Management Console, JDBC/ODBC drivers, or AWS CLI/SDKs.
  - **Apache Spark on Amazon Athena**: interactively run data analytics using Apache Spark; access via Jupyter-compatible notebooks.
- Athena is **serverless** — pay only for what you use.
- Integrates with: CloudFormation, CloudFront, CloudTrail, DataZone, ELB, EMR, AWS Glue Data Catalog, IAM, QuickSight, S3 Inventory, Step Functions, Systems Manager Inventory, VPC.

> 📸 Source: Screenshot 2026-07-05 at 21.47.16.png

## Athena SQL Components (D1)

- **Workgroup** — saved queries you grant permissions to other users to access.
- **Data source** — a group of databases (sometimes called a catalog); default is `AwsDataCatalog`.
- **Database** — a group of tables (sometimes called a schema).
- **Table** — data organized as a group of rows/columns.
- **Dataset** — the raw data of the table.
- SQL subsets:
  - **DDL (Data Definition Language)** — defines schema. e.g. CREATE, ALTER, DROP.
  - **DML (Data Manipulation Language)** — manipulates datasets. e.g. INSERT, UPDATE, DELETE.
  - **DQL (Data Query Language)** — selects datasets. e.g. SELECT.

> 📸 Source: Screenshot 2026-07-05 at 21.47.29.png

## Athena SQL Data Types (D1)

- **Boolean** — true/false
- **tinyint** — 8-bit signed integer (-128 to 127)
- **smallint** — 16-bit signed integer (-32,768 to 32,767)
- **integer** — 32-bit signed integer (~±2.14B); `Int` used in DDL Create Table, `Integer` used in DQL SELECT
- **bigint** — 64-bit (~±9.2 quintillion)
- **float** — 32-bit single-precision floating point
- **double** — 64-bit double-precision floating point
- **decimal(precision, scale)** — precision and scale both max 38
- **char(n)** — fixed-length character data
- **varchar(n)** — variable length, 1 to 65535
- **string** — string literal in single/double quotes (Hive data type)
- **ipaddress** — IP address in DML queries; not supported for DDL
- **binary** — used in parquet
- **date** — ISO format YYYY-MM-DD
- **timestamp** — java.sql.Timestamp (e.g. '2008-09-15 03:04:05.324')
- **array\<data type\>** — e.g. ARRAY[1,2,3]
- **map\<primitive_type, data_type\>** — e.g. MAP(ARRAY['foo','bar'], ARRAY[1,2])

> 📸 Source: Screenshot 2026-07-05 at 21.47.46.png

## Athena SQL — Tables (D1)

- Tables can be created two ways: using a **SQL CREATE TABLE statement** or the **AWS Glue Wizard**.
- Tables can be created automatically using an **AWS Glue crawler**, which crawls the data to produce a table schema.
- Athena tables are AWS Glue Data Catalog tables — they exist in both services when creating an Athena table.
- When you query `FROM`, you use `AWSDataCatalog` (e.g. `FROM "AWSDataCatalog"."your_database_name"."your_table_name"`). Tables are likely created in the default database called `default`.
- Using SQL you specify: how to parse each row (possibly with regex) and the location of the data. Example uses `CREATE EXTERNAL TABLE IF NOT EXISTS`, `ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.RegexSerDe'`, `WITH SERDEPROPERTIES`, and `LOCATION 's3://...'`.

> 📸 Source: Screenshot 2026-07-05 at 21.48.45.png

## AWS Glue (D1)

- **AWS Glue** is a serverless data integration service that makes it easy for analytics users to discover, prepare, move, and integrate data from multiple sources.
  - What: a **serverless ETL/ELT** service — discover, prepare, move, integrate data from many sources into a data lake/warehouse. Key prop: covers everything — **Data Catalog (metadata)**, **Crawlers**, **ETL jobs (Spark/Python/Ray)**, DataBrew, Data Quality. Choose when you need to transform/integrate data, not just query.
  - > 🎯 Exam: Glue = ETL + Catalog (shared metadata for Athena/EMR/Redshift Spectrum). Don't confuse: **Glue = ETL; Data Catalog = metadata; Crawler = auto-detect schema**.
- Use cases: analytics, machine learning, application development.
- Can discover and connect to more than 70 diverse data sources and manage data in a centralized data catalog.
- Visually create, run, and monitor ETL (extract, transform, load) pipelines to load data into data lakes.
- Immediately search and query cataloged data using: Amazon Athena, Amazon EMR, Amazon Redshift Spectrum.
- Capabilities: data discovery, modern ETL/ELT, cleansing, transforming, centralized cataloging.

> 📸 Source: Screenshot 2026-07-05 at 21.48.56.png

## AWS Glue Studio (Visual ETL) (D1)

- **AWS Glue Studio** allows you to visually build ETL pipelines (a.k.a. Visual ETL). For visually preparing a Glue Job with little to no coding.
  - What: a drag-and-drop interface (Sources → Transforms → Targets) to build a Glue Job visually, auto-generating a PySpark script. Key prop: low/no-code ETL for **data engineers**. Choose when you want to build an ETL pipeline quickly with little coding.
  - > 🎯 Exam: Glue Studio (Visual ETL for developers, generates a Spark script) is different from **DataBrew** (no-code data prep for analysts, 250+ transforms, does not generate a script).
- A pipeline is composed of **nodes**:
  - **Sources** — the data you plan to use
  - **Transforms** — what you want to do to the data
  - **Targets** — where you want to send the data
- Version control your pipelines using: AWS CodeCommit, GitHub, GitLab, BitBucket.
- The Visual ETL produces a **Python script** you can download and execute (run in your ELT tool) or run as a job via AWS Glue jobs. You must install the required AWS Glue Libraries (github.com/awslabs/aws-glue-libs). Script uses `awsglue` imports, `GlueContext`, `SparkContext`, `DynamicFrame`, and `job.commit()`.

> 📸 Source: Screenshot 2026-07-05 at 21.49.07.png, Screenshot 2026-07-05 at 21.49.12.png

## AWS Glue Jobs (D1)

- **AWS Glue Jobs** — the unit of work that executes ETL (runs a script to extract/transform/load).
  - What: a job that runs your defined ETL logic. Key prop: choose the engine by workload — **Spark** (distributed big data), **Python Shell** (small/lightweight tasks), **Ray** (distributed Python/ML). Billed by **DPU** runtime. Choose a Glue Job when you need to run a pipeline on a schedule/on-demand.
- Three engines for AWS Glue Jobs: **Python Shell Engine**, **Ray Job**, **Spark Job**.
- Glue Jobs can be created in: **Visual ETL (AWS Glue Studio)**, **Jupyter Notebooks**, **Script Editor (within AWS)**.
- Charged based on number of **Data Processing Units (DPUs)**:
  - 10 DPUs allocated to each Spark job
  - 2 DPUs to each Spark Streaming job
  - 6 M-DPUs allocated to each Ray job

> 📸 Source: Screenshot 2026-07-05 at 21.49.19.png

## AWS Glue Data Catalog (D1)

- **AWS Glue Data Catalog** is a fully managed, Apache Hive Metastore-compatible catalog service that makes it easy to store, annotate, and share metadata about data. Serverless — pay for what you use.
  - What: a shared **metadata** store (schema/table/database), Hive-compatible. Key prop: one catalog serves many engines — **Athena, EMR, Redshift Spectrum, Glue ETL** all read from it. Choose when you need a centralized schema "directory" for a data lake.
  - > 🎯 Exam: Data Catalog = metadata (does NOT hold the actual data, the data stays in S3). Glue = ETL; Crawler = auto-detect schema to populate the Catalog.
- Integrates with: Amazon S3, Amazon RDS, Amazon Redshift, Amazon Athena, AWS Glue ETL, Amazon EMR.
- **AWS Glue database** — a container for multiple AWS Glue tables.
- **AWS Glue table** — metadata definition representing your data (including schema); can be a source or target in a job.
- **AWS Glue Crawler** — discovers schema formats to define your AWS Glue tables.
- Two table formats:
  - **Standard AWS Glue table** — must specify data format (Avro, CSV, JSON, XML, Parquet, ORC); data sourced from Amazon S3, Kinesis, Kafka.
  - **Apache Iceberg table** — uses its own expressive SQL data format.

> 📸 Source: Screenshot 2026-07-05 at 21.49.48.png

## AWS Glue Data Catalog — Crawlers (D1)

- **AWS Glue Data Crawler** analyzes a targeted data source to determine its schema and generate AWS Glue Data Tables.
  - What: automatically scans a data source, **infers the schema**, and creates/updates tables in the Data Catalog. Key prop: runs on a schedule or on-demand; eliminates manual schema definition. Choose when data changes/is new and you want the Catalog to update itself.
  - > 🎯 Exam: Crawler = discover schema (populate the Catalog). It is not where you query, nor does it transform data.
- Data sources it can connect to: Amazon S3; JDBC (Amazon Redshift, Snowflake, Amazon RDS); DynamoDB; MongoDB Client (MongoDB server, MongoDB Atlas, DocumentDB); Delta Lake; Apache Iceberg tables in S3; Hudi tables in S3.
- Data Crawler can run on a schedule or on demand.

> 📸 Source: Screenshot 2026-07-05 at 21.49.56.png

## AWS Glue Data Quality (D1)

- **AWS Glue Data Quality** measures and monitors the quality of your data so you can make good business decisions.
  - What: measure & monitor data quality using rules and ML anomaly detection. Key prop: use **DQDL** to define rules, built on **DeeQu**, produces a **Data Quality score**. Choose when you need to ensure "clean" data before analytics/ML training (bad data → bad model).
  - > 🎯 Exam: Data Quality = data quality/reliability (rules + anomaly), different from DataBrew (transform/clean data).
- Built on top of the AWS open-source **DeeQu** unit test framework (built on Apache Spark unit tests).
- Works with **Data Quality Definition Language (DQDL)** — a domain-specific language to define data quality rules.
- Uses machine learning (ML) to detect anomalies and hard-to-detect data quality issues.
- 25+ out-of-the-box DQ rules; create rules for specific needs.
- After evaluation you get a **Data Quality score** overviewing the health of your data; helps identify the exact records that lowered scores.
- Serverless (pay for what you use); enforces data quality checks on Data Catalog and AWS Glue ETL pipelines.

> 📸 Source: Screenshot 2026-07-05 at 21.50.05.png

## AWS Glue DataBrew (D1)

- **AWS Glue DataBrew** is a visual data preparation tool that enables users to clean and normalize data without writing any code.
  - What: a **no-code data prep** tool (clean/normalize) via a visual interface, 250+ built-in transforms. Key prop: for **analysts/data scientists** who don't code; different from Glue Studio (which generates a Spark script for engineers). Choose when you need to clean/normalize data quickly without writing code.
  - > 🎯 Exam: DataBrew = no-code prep (analyst); Glue Studio = visual ETL that generates code (engineer); Data Quality = quality validation. These three are easy to confuse.
- Helps reduce data prep time for analytics and ML by up to 80 percent.
- Choose from over 250 ready-made transformations to automate data preparation tasks.
- Easier collaboration to get insights from raw data.
- Serverless offering — pay for what you use.

> 📸 Source: Screenshot 2026-07-05 at 21.55.46.png

## Introduction to Data Lakes (D1)

- A **data lake** is a centralized data repository for unstructured and semi-structured data, intended to store vast amounts of data. Generally uses objects (blobs) or files as its storage medium.
  - What: a centralized store holding **all types** of data (structured/semi/unstructured) in raw form at large scale — on AWS this is usually **S3**. Key prop: **schema-on-read** (store raw first, apply schema at query time). Choose when you need to gather many sources/formats for flexible analytics & ML.
  - > 🎯 Exam: a **data lake** (raw, schema-on-read, any format, S3) is different from a **data warehouse** (processed, schema-on-write, structured, Redshift). A data lake on AWS = S3 + Glue Catalog + Lake Formation.
- Data lake stages:
  - **Collect** — pull from various data sources.
  - **Transform** — change or blend data into new semi-structured data using ELT/ETL engines.
  - **Publish** — publish dataset to meta catalogs so analysts can quickly find useful data.
  - **Distribution** — allow access to data to various programs or APIs.

> 📸 Source: Screenshot 2026-07-05 at 21.56.46.png

## AWS Lake Formation (D1/D5)

- **AWS Lake Formation** is a data lake service to centrally govern, secure, and globally share data for analytics and machine learning.
  - What: a **governance/security** layer to build and govern a data lake on S3 — fine-grained access control and centralized data sharing. Key prop: an RDBMS-style **grant/revoke** model at the **column/row/cell** level, applied to Athena/Redshift Spectrum/EMR/QuickSight/Glue. Choose when you need to manage who can see which data in fine detail.
  - > 🎯 Exam: **Lake Formation = governance/permissions** (fine-grained access) vs **Glue Data Catalog = metadata** (they share the same catalog). Lake Formation **augments** IAM rather than replacing it.
- Manage fine-grained access control for data lake data on Amazon S3.
- Manages metadata in AWS Glue Data Catalog.
- Provides its own permissions model that augments the IAM permissions model — through a simple grant/revoke mechanism similar to an RDBMS.
- Share data internally and externally across multiple AWS accounts, AWS organizations, or directly with IAM principals in another account.
- Permissions enforced with granular controls at column, row, and cell levels across: Athena, QuickSight, Redshift Spectrum, EMR, Glue.
- Note: **AWS Lake Formation and AWS Glue share the same Data Catalog.**

> 📸 Source: Screenshot 2026-07-05 at 21.56.53.png
