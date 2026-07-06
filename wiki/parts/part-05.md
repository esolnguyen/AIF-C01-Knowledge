# Part 05 — Amazon SageMaker: ML Pipeline, Data, Feature Store & Python SDK

## SageMaker ML Pipeline

- **Amazon SageMaker** = a **unified ML platform** for building ML solutions end-to-end.
- Pipeline stages (left to right): **Data Readiness → Feature Engineering → Training / HP-Tuning → Model Serving → Understanding / Tuning → Edge → Model Monitoring → Model Management**.
- **Auto ML** spans across the whole pipeline.
- Capabilities mapped to stages:
  - Data Readiness: **Data Labeling**, **Datasets**
  - Feature Engineering: **Feature Store**, **Optimization**
  - Training: **Training**, **Experiments**, **AI Accelerators**
  - Model Serving: **Prediction**, **Explainable AI**
  - Edge: **Hybrid AI**
  - Model Monitoring: **Continuous Monitoring**
  - Model Management: **Metadata**
- Cross-cutting layers: **Pipelines (Orchestration)**, **Deep Learning Environment (DL VM, DL Containers)**, **Notebooks**.

> 📸 Source: Screenshot 2026-07-05 at 15.08.10.png

## Data Readiness

- **Data Collection** — where you collect data for ML models:
  - **Amazon S3** – serverless storage.
  - **AWS Glue Data Catalog** – stores metadata (schema/structure of your data).
  - **AWS Data Lake** – import data from multiple sources and manage access for your data team.
- **Exploratory Data Analysis (EDA)** — analyze and investigate a dataset:
  - **SageMaker Notebooks** – spin up Jupyter Notebooks + Python data tools.
  - **SageMaker Studio Labs** – Jupyter Notebooks, offers **free CPU and GPU for researchers**.
  - **Amazon Athena** – run SQL against semi-structured data in S3 (e.g. CSV files).
- **Data Pre-Processing** — change data format so it's ready for ML models:
  - **SageMaker Data Wrangler** – simplify data prep & feature engineering via a visual + natural language interface.
    - **Data Wrangler** — visual (low-code) tool INSIDE SageMaker Studio; 300+ built-in transforms; end goal = export features for training. 🎯 nhớ: đây là "data prep for ML".
  - **AWS Glue DataBrew** – visual data prep tool to clean and normalize data.
    - **Glue DataBrew** — no-code data cleaning that lives in Glue (không thuộc SageMaker); general-purpose ETL prep, không gắn riêng ML pipeline.
    > 🎯 Exam: Data Wrangler = SageMaker/ML-centric; DataBrew = Glue/generic ETL prep.

> 📸 Source: Screenshot 2026-07-05 at 15.08.22.png

## AWS Data Wrangler Library

- Open-source library by AWS that **extends the Pandas library to AWS**, connecting Pandas DataFrames to AWS-related services.
  - **AWS Data Wrangler (awswrangler)** — a **Python/Pandas code library** (now "AWS SDK for pandas"); bạn viết code. Khác hẳn **SageMaker Data Wrangler** = **visual no-code tool** trong Studio. 🎯 bẫy tên trùng.
- Note: distinct from *SageMaker* Data Wrangler (the library vs. the SageMaker feature).
- Offers **abstracted functions** for usual ETL tasks (load/unload data) from **Data Lakes, Data Warehouses, and Databases**.
- Example usage: `import awswrangler as wr`; `wr.s3.read_csv(...)`; connect to PostgreSQL via a Glue Catalog connection and run `read_sql_query`.
- Easy integration with: **Athena, Glue, Redshift, Timestream, QuickSight, Chime, CloudWatchLogs, DynamoDB, EMR, SecretManager**, and PostgreSQL/MySQL/SQLServer via Glue Catalog Connection.

> 📸 Source: Screenshot 2026-07-05 at 15.08.34.png

## SageMaker Data Wrangler

- A SageMaker feature that **simplifies data preparation and feature engineering**.
- Contains **300+ built-in data transformations** to normalize, transform, and combine features **without writing code**.
- Per State of Data Science 2020 survey, preparing data takes **~66% of a Data Scientist's time** (data loading 19%, data cleansing 26%, visualization 21%, model selection 11%, training/scoring 12%, deploying 11%).
- **Data Flow**: creating a data flow launches a **server that runs Data Wrangler**; it connects to many AWS services (import from Amazon S3, Amazon Athena, etc.).
- Cost/ops caveat: Data Wrangler defaults to an **ml.m5.4xlarge** (16 vCPU + 64 GiB) instance ≈ **$0.922/hr, $22.12/day, $673.06/month** — **remember to turn it off when not in use**.

> 📸 Source: Screenshot 2026-07-05 at 15.08.42.png, Screenshot 2026-07-05 at 15.09.51.png

## SageMaker Canvas

- **No-code interface** to prepare data, build, and deploy highly accurate ML models in a unified environment.
  - **Canvas** — visual point-and-click tool for **business analysts / non-coders**; no notebook required. 🎯 dùng khi câu hỏi nói "no-code / no ML expertise".
- Includes: **Data Wrangler, Datasets, Autopilot (AutoML), Ready-to-use models, GenAI**.
- Cost caveat (important): launching Canvas launches **compute just for the interface**; you must click **Logout** — closing the tab does NOT stop the compute, and AWS does **not display running compute** for this service (risk of unexpected spend). Instructor says he'd avoid using it.

> 📸 Source: Screenshot 2026-07-05 at 15.10.41.png

## SageMaker Canvas – Datasets

- Datasets let you **easily manage your dataset** without worrying about underlying storage, reusable across Canvas services.
- Import data types:
  - **Documents**: PNG, JPG, PDF
  - **Images**: PNG, JPG
  - **Tabular**: CSV, Parquet files
- Data sourced from S3, filterable by data type (All / Tabular / Document / Image).

> 📸 Source: Screenshot 2026-07-05 at 15.10.55.png

## What is AutoML?

- **Automated Machine Learning (AutoML)** = automation of the ML pipeline; reduces complexity/work to set up an ML model.
- Traditional pipeline (many steps): Acquire Data → Explore → Prepare → Feature Engineering → Model Selection → Model Training → Hyperparameter Tuning → Predictions.
- With AutoML: **1. Upload data, 2. Choose a type of ML → get a result** (the middle steps are handled automatically).
  - **AutoML** — automates model selection + training + HP-tuning so non-experts get a model fast; in SageMaker it's delivered via **Autopilot**. 🎯 AutoML = the concept, Autopilot = the AWS feature.

> 📸 Source: Screenshot 2026-07-05 at 15.11.09.png

## SageMaker Canvas – Autopilot

- **SageMaker Autopilot** (formerly AutoML) lets you easily create custom ML models via a **no-code UI**.
  - **Autopilot** — trains & tunes many candidate models automatically on your tabular/image/text data, then ranks them; key extra = **full visibility** (auto-generates notebooks explaining each model, no black box).
- Workflow tabs: Select → Build → Analyze → Predict → Deploy; you pick a **target column** and Canvas recommends the model type.
- Supported **problem types**:
  - **Predictive analysis** (tabular, single/multiple categories, regression, time-series forecasting)
  - **Image analysis** (image classification)
  - **Text analysis** (text classification)
  - **Fine-tuning FM** (customize a foundation model on your data for a specific task/domain)

> 📸 Source: Screenshot 2026-07-05 at 15.11.14.png

## SageMaker Autopilot – ML Problem Types

- **Binary classification** — predict if something is **true or false** (2 outcomes).
  - Examples: email spam detection, medical test (pos/neg), churn prediction, sales conversion (buy/not buy).
- **Linear regression** — predict a **number** (predict X based on Y).
  - Examples: height from weight, GPA from highschool, vehicle sales from country GDP, rating from book length.
- **Multiclass classification** — predict a **category** something belongs to.
  - Examples: difficulty (Easy/Medium/Hard), city, fruit, medical treatment.
- **Custom model → use case → data type** mapping:
  - **Numeric prediction** → predict house prices → Numeric data
  - **2 category prediction** → predict customer churn → Binary/Categorical
  - **3+ category prediction** → predict patient outcomes after discharge → Categorical
  - **Time series forecasting** → predict next quarter inventory → Timeseries
  - **Single-label image prediction** → predict manufacturing defects in images → Image (JPG, PNG)
  - **Multi-category text prediction** → predict product categories from descriptions → Text/Binary/Categorical
  > 🎯 Exam: **number → regression**; **2 outcomes → binary classification**; **3+ labels → multiclass**; **future values over time → time-series forecasting**.

> 📸 Source: Screenshot 2026-07-05 at 15.11.44.png, Screenshot 2026-07-05 at 15.11.57.png

## SageMaker Canvas – Ready-to-Use Models

- Choose from multiple **Ready-to-use models** presented with an **easy, no-code interface**; single or batch prediction.
- Backed by managed AI services:
  - Entity/sentiment analysis & language detection → **Amazon Comprehend**
  - Expense analysis & document queries → **Amazon Textract**
  - Object detection in images → **Amazon Rekognition**
  - **Personal information detection** (PII entities like NAME, credit card, bank account) with confidence scores.
- Note: Canvas ready-to-use models currently support **English only**; non-English text yields incorrect results.

> 📸 Source: Screenshot 2026-07-05 at 15.12.31.png

## SageMaker Feature Store

- Makes it easy for data scientists, ML engineers, and practitioners to **create, share, and manage features for ML development**.
- Accelerates work by reducing **repetitive data processing** and **curation work** to convert raw data into features.
- Centralized store for **features and associated metadata**, so features are easily discovered and reused.
- Two store types:
  - **Online store** – low-latency, **real-time inference** use cases.
  - **Offline store** – **training and batch inference** (stored in **S3**).
    - **Online store** — low-latency lookup của **1 record mới nhất** cho real-time inference; **Offline store** — lưu **toàn bộ lịch sử** trên S3 cho training/batch. 🎯 nhớ cặp đối lập: online=fast/latest, offline=history/S3.
- Processing logic authored **only once**; features used for **both training and inference**, reducing **training-serving skew**.
  - **Training-serving skew** — khi feature ở lúc train khác lúc serve → model kém; Feature Store tránh việc này bằng cách dùng chung 1 định nghĩa feature. 🎯 đây là lý do chính "why use Feature Store".

> 📸 Source: Screenshot 2026-07-05 at 15.15.01.png

## SageMaker Feature Store – Components

- **Feature Group** – a logical grouping of ML features holding metadata for all data in the Feature Store. A feature group's definition is composed of:
  - a list of **feature definitions**
  - a **record identifier** name
  - configurations for its **online and offline store**
- **FeatureDefinitions** define features and support **FeatureTypes**:
  - **String** (default data type)
  - **Integral** (Int64 – 64-bit signed integer)
  - **Fractional** (IEEE 64-bit floating point)
- **Record** – a set of values for features in a feature group.
- Config JSON includes: FeatureDefinitions, FeatureGroupName, OfflineStoreConfig (DataCatalogConfig, S3StorageConfig with KmsKeyId/S3Uri), OnlineStoreConfig (EnableOnlineStore, SecurityConfig KmsKeyId), RecordIdentifierFeatureName, RoleArn.

> 📸 Source: Screenshot 2026-07-05 at 15.15.45.png

## Feature Store – Data Ingestion

- **Ingest features** from a data source two ways:
  - **Streaming** → **PutRecord API** → Streaming Ingestion API
  - **Batching** → Data Wrangler / Spark Container
    - **Streaming ingestion** — real-time single-record writes via PutRecord (Kafka/Kinesis); **Batch ingestion** — bulk load qua Data Wrangler/Spark, dùng để **backfill** dữ liệu lịch sử. 🎯 streaming=live, batch=bulk/backfill.
- Feature Store holds **Online Store** and **Offline Store** with **automatic replication** between them.
- **Serve and reuse features**: Serving API + Offline Store Query feed the **ML Model**; SageMaker Python SDK + SageMaker Studio UI serve **Data Scientists** (to extract training data and register features).
- Feature Store provides **data and schema validations at ingestion time** to ensure data quality — validates that input data conforms to defined data types and that the input record contains all features (relevant if an offline store is configured).

> 📸 Source: Screenshot 2026-07-05 at 15.16.03.png, Screenshot 2026-07-05 at 15.16.05.png

## Feature Store – Streaming Ingestion

- Data is pushed to a stream to be ingested via the **PutRecord API**.
- The endpoint is designed for **millisecond-level latency** and **high-throughput cost-optimized ingestion**.
- Called by different streams: **Apache Kafka, Amazon Kinesis, Spark Streaming**, or other sources.
- **PutRecord API can be parallelized** for higher-throughput writes.
- Data from PUT requests is:
  - **synchronously written to the online store**
  - **(optionally) buffered and written to an offline store (S3)** — written within a few minutes of ingestion.
- Feature Store provides **automatic replication** of ingested data into the offline store for future training / historical record access.

> 📸 Source: Screenshot 2026-07-05 at 15.16.34.png

## Feature Store – Batch Ingestion

- Batch ingestion has **three** models:
  1. **Into the online store** – call synchronous **PutRecord API** (eventually replicated to offline store).
  2. **Into the offline store** – ingest directly; **useful for backfilling historical records for training**. Done via **SageMaker Data Wrangler** or **SageMaker Processing job Spark container**.
  3. **Into both online and offline store** – call PutRecord API (buffered and written to offline store).

> 📸 Source: Screenshot 2026-07-05 at 15.16.56.png

## Feature Store – API

- SageMaker Feature Store **Runtime** supports these API calls:
  - **GetRecord** – get **only the latest records** stored in the **OnlineStore**. If no record with RecordIdentifierValue found, returns empty. (`GET /FeatureGroup/{name}`)
  - **PutRecord** – writes to **both** OnlineStore and OfflineStore. If it's the latest record for the identifier → written to both; if it's a **historic record → written only to the OfflineStore**. (`PUT /FeatureGroup/{name}`)
  - **DeleteRecord** – deletes a record from a FeatureGroup. A new record appears in the OfflineStore with `is_deleted` = True. (`DELETE /FeatureGroup/{name}`)
  > 🎯 Exam: **GetRecord** reads **only the OnlineStore** (latest); **PutRecord** writes **both** stores (historic rows go to Offline only). Read fast = Online, keep history = Offline.

> 📸 Source: Screenshot 2026-07-05 at 15.17.04.png

## Data Wrangler to Feature Store

- To import data into Feature Store from Data Wrangler, add an **Export Step** under the **Export tab** of your data flow.
- Export options: Processing Job, Pipeline, Python Code, and **Feature Store** (exports a Jupyter Notebook that creates a Feature Store feature group and adds features to an offline or online store).

> 📸 Source: Screenshot 2026-07-05 at 15.17.13.png

## Feature Store to Athena

- After a feature group is created in an **offline** feature store, you can **run queries using Amazon Athena on an AWS Glue catalog**.
- Flow: **Feature Store → Glue Data Catalog → Athena → S3 Bucket**.
- Requires data registered in a data catalog (catalog details are **auto-registered** in Feature Store).
- Useful for building a dataset via SQL, then training a model for inference.
- Example query: `SELECT * FROM <DatabaseName>.<TableName> LIMIT 1000`.

> 📸 Source: Screenshot 2026-07-05 at 15.17.25.png

## SageMaker – Endpoints

- SageMaker has **Service Endpoints** and **Region-specific endpoints**, both accepting **HTTPS** requests.
- **Service Endpoint**: `api.sagemaker.<region>.amazonaws.com`
  - Used for: training and deploying models, creating/managing notebook instances, endpoint configurations.
- **Region-specific endpoint**: `runtime.sagemaker.<region>.amazonaws.com` and `runtime-fips.sagemaker.<region>.amazonaws.com`
  - Used for: making **inference requests** against models hosted in SageMaker.
  > 🎯 Exam: `api.sagemaker...` = **control plane** (create/train/manage); `runtime.sagemaker...` = **data plane** (invoke/inference). "runtime" = predictions.

> 📸 Source: Screenshot 2026-07-05 at 15.17.50.png

## SageMaker Python SDK

- Library for **training and deploying ML models** on SageMaker.
- **vs boto3**: boto3 (AWS Python SDK) broadly interacts with AWS services; the SageMaker Python SDK integrates specifically with SageMaker and specific ML frameworks/tools.
  - **SageMaker Python SDK** — high-level, ML-purpose-built (Estimators/Predictors); **boto3** — low-level, generic AWS API for every service. 🎯 SDK = tiện cho ML workflow, boto3 = quyền kiểm soát API thô cho mọi service.
- **ML frameworks**: MXNet, TensorFlow, Chainer, PyTorch, Sci-Kit Learn.
- **ML Algorithms**: XGBoost.
- **Tools**: BYO Model, Secure Training and Inference with VPC.
- **SageMaker features** include: Reinforcement Learning Estimators, SparkML Serving, Built-in Algorithm Estimators, Algorithm Estimators, Model Packages, BYO Docker Containers, Automatic Model Tuning, Batch Transform, Inference Pipelines, Operators in Apache Airflow, Autopilot, Model Monitoring, Debugger, Processing.
- Install: `pip install sagemaker`.
- High-level abstractions:
  - **Estimators** – encapsulate training; an estimator is an equation for picking the "best" ML model based on Training, Evaluation, Prediction, Export for serving.
  - **Models** – encapsulate built ML models.
  - **Predictors** – real-time inference & transformation using Python data-types against a SageMaker endpoint.
  - **Session** – collection of methods for working with SageMaker resources.
  - **Transformers** – encapsulate batch transform jobs for inference.
  - **Processors** – encapsulate running processing jobs for data processing.

> 📸 Source: Screenshot 2026-07-05 at 15.18.16.png, Screenshot 2026-07-05 at 15.18.42.png

## SageMaker Python SDK – Training Script

- To train a model with the SDK: **1. Prepare a training script, 2. Create an estimator, 3. Call the estimator's `fit` method.**
- Training script parameters (environment variables):
  - **Env vars** — SageMaker **injects these into the container** so your script finds data/model paths without hardcoding; you read them (e.g. via `os.environ`). 🎯 chỉ cần nhớ *SM_MODEL_DIR→artifacts to S3*, *SM_CHANNEL_XXXX→input data path*.
  - **SM_MODEL_DIR** – path where the training job writes model artifacts; after training these are uploaded to **S3** for model hosting.
  - **SM_NUM_GPUS** – integer count of GPUs available to the host.
  - **SM_CHANNEL_XXXX** – path to the directory holding input data for a channel (e.g. two channels 'train'/'test' set `SM_CHANNEL_TRAIN` and `SM_CHANNEL_TEST`).
  - **SM_HPS** – a JSON dump of the hyperparameters, preserving JSON types (boolean, integer, etc.).
- Script uses `argparse` to read hyperparameters (epochs, batch-size, learning-rate) — arguments vary based on your model; your training code goes in the script body.

> 📸 Source: Screenshot 2026-07-05 at 15.19.15.png, Screenshot 2026-07-05 at 15.19.20.png

## SageMaker Python SDK – Local Mode

- SDK supports **local mode** — create estimators and deploy them to **your local environment**; test deep learning scripts before running in SageMaker's managed training/hosting.
  - **Local Mode** — chạy training/inference trong **Docker container trên máy bạn** (instance_type=`"local"`) để debug nhanh & rẻ trước khi trả tiền cho managed instances. 🎯 dùng để test, không phải để train production.
- Install: `pip install 'sagemaker[local]' --upgrade` or `conda install -c conda-forge sagemaker-python-sdk`.
- **Two ways** to configure local mode globally:
  1. Create `~/.sagemaker/config.yaml` containing `local:\n  local_code: true`. If you enable "local code", you **cannot use the `dependencies` parameter** in your estimator/model.
  2. Use a **local session**: `from sagemaker.local import LocalSession`; set `sagemaker_session.config = {'local': {'local_code': True}}`; pass the session to your estimator/model.
- Supported framework images: TensorFlow, MXNet, Chainer, PyTorch, Scikit-Learn, your own custom images.
- Requirements/caveats even in local mode:
  - You **still need AWS credentials** (so it can send to S3) — even if you don't want S3, credentials are required; may need env variable credentials.
  - **Must install docker-compose** to use local mode.
  - Local Mode is **experimental on Windows**.
- Example estimator: `TensorFlow(... train_instance_type="local", train_instance_count=1, script_mode=True ...)` ensures training on a local instance.

> 📸 Source: Screenshot 2026-07-05 at 15.19.55.png, Screenshot 2026-07-05 at 15.20.03.png, Screenshot 2026-07-05 at 15.20.32.png
