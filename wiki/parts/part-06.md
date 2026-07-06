# Part 06 — SageMaker Python SDK, Ground Truth, Model Tuning & Inference

## SageMaker Python SDK — Session
- SageMaker `Session` provides convenient methods for manipulating entities and resources that Amazon SageMaker uses (training jobs, endpoints, input datasets).
  - **SageMaker Python SDK** — high-level, open-source Python library to train/deploy models on SageMaker → hides raw boto3 API calls; the usual way you interact with SageMaker from a notebook.
  - **Estimator** — the SDK object that wraps a training job (algorithm + instance config); `.fit()` trains, `.deploy()` creates an endpoint.
- Basic usage: `import sagemaker`; `session = sagemaker.Session()`; `bucket = session.default_bucket()`.
- Notable methods:
  - `upload_data` — upload local file/directory to S3
  - `upload_string_as_file_body` — upload a string as a file body
  - `download_data` — download file/directory from S3
  - `read_s3_file` — read a single file from S3
  - `list_s3_files` — list S3 files given a bucket and key
  - `default_bucket` — return the name of the default bucket for SageMaker interactions
  - `train` — create a training job
  - `update_training_job` — calls the UpdateTrainingJob API
  - `process` — create a processing job
  - `auto_ml` — create an AutoML job
  - `compile_model` — create a SageMaker Neo compilation job
  - `tune` / `create_tuning_job` — create a hyperparameter tuning job
  - `create_model` — create a SageMaker Model
  - `create_endpoint` — create an endpoint from the request configuration

> 📸 Source: Screenshot 2026-07-05 at 15.22.02.png

## SageMaker Python SDK — Training Source
- Training data can be supplied from various locations:
  - S3 path to your data
  - Mount an EFS / FSx Lustre to the EC2 instance running the training job
- Use either `FileSystemInput` or `FileSystemRecordSet` to reference a mounted file system.
  - **S3 vs EFS/FSx Lustre** — S3 is the default/simplest source; mount EFS or FSx Lustre when you need high-throughput, low-latency access to large datasets reused across many training jobs (FSx Lustre = fastest for HPC/DL).
- Example: `TensorFlow` estimator with `entry_point`, `role`, `instance_count`, `instance_type`, `subnets`, `security_group_ids`; then `FileSystemInput(file_system_id, file_system_type='EFS', directory_path, file_system_access_mode='ro')`; start with `estimator.fit(file_system_input)`.

> 📸 Source: Screenshot 2026-07-05 at 15.22.21.png

## SageMaker Python SDK — Training Channels
- When training, you can partition training data into different logical "channels".
  - **Channel** — a named input data source passed to a training job (e.g. `train`, `test`, `validation`) → lets the algorithm read each split separately; each channel is exposed to the script as an env var like `SM_CHANNEL_TRAIN`.
- Common channel ideas depend on the problem: Training, Testing, Evaluation, Images, labels.
- Hyperparameters sent by the client are passed as command-line arguments to the script (via `argparse`); alternatively load via the `SM_HPS` environment variable.
- Input data/model directories use env vars such as `SM_MODEL_DIR`, `SM_CHANNEL_TRAIN`, `SM_CHANNEL_TEST`.

> 📸 Source: Screenshot 2026-07-05 at 15.22.40.png

## SageMaker Ground Truth (Overview)
- Amazon SageMaker Ground Truth is a fully managed **data labeling service** that makes it easy to build highly accurate training datasets for ML.
  - **Purpose** — turns raw/unlabeled data into a labeled training set *before* training; combines human labelers with optional automated (active) labeling to cut cost.
  - **Automated data labeling** — after enough human labels, Ground Truth trains a model to auto-label the easy items and only sends ambiguous ones to humans → lower cost on large datasets.
  > 🎯 Exam: Ground Truth = build/label a TRAINING dataset (offline, pre-training). Amazon A2I (Augmented AI) = human review of model PREDICTIONS in production (post-inference). Don't confuse the two.
- Flow: Input Manifest File + Unlabeled Data → S3 Bucket → Ground Truth UI (labeled by a human Workforce) → labeled output written back to an S3 Bucket.

> 📸 Source: Screenshot 2026-07-05 at 15.22.55.png

## SageMaker Ground Truth — Input Manifest File
- With automatic setup, Ground Truth **generates an input manifest file** and places it in your bucket (e.g. `s3://my-bucket/dataset-20210510T161755.manifest`).
- You get a connection error if: CORS not enabled on the bucket; data not present; data not properly formatted; wrong data type selected; or bucket not in the same region as the labeling job.
- Use the "Complete data setup" button to process/complete input data setup (shows "Input data connection successful").
- You can also **manually create** the manifest file:
  - Each line is an entry containing a **JSON object**; input data and manifest must be stored in S3.
  - Give SageMaker access to read the S3 data.
  - Manifest must be in the same AWS Region as the data files and as the labeling job.
  - UTF-8 encoded; each line delimited by a standard line break (`\n` or `\r\n`); no unescaped line breaks.
  - Each JSON object ≤ 100,000 characters; no single attribute > 20,000 characters; attribute names can't begin with `$`.
  - Object must contain either **`source-ref`** (key for binary data such as images/videos) or **`source`** (key for text data).
    > 🎯 Exam: `source-ref` = S3 URI pointing to a binary file (image/video/point cloud); `source` = the raw inline text itself. Wrong key → connection/format error.
- Supported data formats:
  - Image: `.jpg`, `.jpeg`, `.png` → `{"source-ref": "s3://.../example-image.png"}`
  - Text: raw text → `{"source": "Lorem ipsum dolor sit amet"}`
  - Video clips: `.mp4`, `.ogg`, `.webm` → `{"source-ref": "s3://.../example-video.mp4"}`
  - Video frames / sequence files (Object Tracking): frames `.jpg/.jpeg/.png`, sequence files `json`
  - Point clouds / sequence files (Object Tracking): Binary pack format and ASCII

> 📸 Source: Screenshot 2026-07-05 at 15.23.14.png, Screenshot 2026-07-05 at 15.23.57.png, Screenshot 2026-07-05 at 15.24.05.png

## SageMaker Ground Truth — CORS
- Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain that served the first resource.
- CORS configuration on the S3 bucket containing Ground Truth input data **is required**: some browsers show images in the wrong orientation, and CORS must be enabled to rotate images to the correct orientation.
- If you create a job through the Ground Truth console, CORS is enabled by default.
- If input data is NOT in the same S3 bucket as the input manifest, you must add a CORS configuration to all S3 buckets containing input data.
- Configured under the **Permissions** tab of the S3 bucket.

> 📸 Source: Screenshot 2026-07-05 at 15.24.11.png

## SageMaker Ground Truth — Task Templates
- Ground Truth offers various task templates by data category: Image, Text, Video, Point cloud, or Custom.
- Selecting Image/Text/Video/Point cloud gives an easy WYSIWYG editor to describe job requirements (with good/bad example guidance, up to 30 labels).

> 📸 Source: Screenshot 2026-07-05 at 15.24.17.png

## SageMaker Ground Truth — Labeling Images
- **Image Classification (Single Label)** — categorize images into individual classes.
- **Image Classification (Multi-label)** — categorize images into one or more classes.
- **Bounding box** — draw bounding boxes around specified objects.
- **Semantic segmentation** — draw pixel-level labels around specific objects/segments.
- **Label verification** — verify existing labels in your dataset (correct vs incorrect label).
  > 🎯 Exam: Bounding box = rough rectangle around an object (cheap, "where roughly"). Semantic segmentation = per-pixel mask (precise shape, e.g. medical/autonomous driving). Single-label = exactly one class per image; Multi-label = several classes at once.

> 📸 Source: Screenshot 2026-07-05 at 15.24.22.png

## SageMaker Ground Truth — Labeling Text
- **Text Classification (Single Label)** — categorize text into individual classes.
- **Text Classification (Multi-label)** — categorize text into one or more classes.
- **Named entity recognition** — apply labels to words or phrases within a larger text.
  > 🎯 Exam: NER labels spans *inside* a sentence (e.g. person/place/org); Text Classification labels the *whole* text with one (single) or several (multi) classes.

> 📸 Source: Screenshot 2026-07-05 at 15.24.46.png

## SageMaker Ground Truth — Labeling Video
- **Video Classification** — Video clip classification: categorize video clips into specific classes.
- **Video Object Detection** (single frame): Bounding box, Polygon, Polyline, Key point — draw around specified objects in your video.
- **Video Object Tracking** (across multiple frames): track specific instances of objects across frames using Bounding box, Polygon, Polyline, or Key point.
  > 🎯 Exam: Object Detection = label objects in a *single* frame; Object Tracking = follow the *same* object instance *across* frames over time (motion). Same distinction applies to point clouds.

> 📸 Source: Screenshot 2026-07-05 at 15.24.50.png, Screenshot 2026-07-05 at 15.25.00.png, Screenshot 2026-07-05 at 15.25.08.png

## SageMaker Ground Truth — Labeling Point Cloud
- A point cloud is a set of data points in space, generally produced by 3D scanners (LIDAR).
- **Point cloud object detection** — identify objects in LIDAR frames by drawing cuboids around them.
- **Point cloud object tracking** — track object movement in LIDAR frames over time.
- **Point cloud semantic segmentation** — identify objects by painting all pixels associated with a label.

> 📸 Source: Screenshot 2026-07-05 at 15.25.39.png

## SageMaker Ground Truth — Custom Labeling
- **Custom** — customize tasks for workers to label your dataset; AWS provides many template examples.
- Template categories include:
  - Text: Document Classification, Intent Detection, Sentiment Analysis, Named Entity Recognition, Text Classification (Multi-select / single).
  - Audio: Collect Utterance, Intent Detection, Sentiment Analysis, Transcription.
  - Image: Bounding Box (multi/single-class), Image Classification (+ Multi-select, Zoomable), Image Contains, Image Similarity, Instance Segmentation, Keypoint, Polygon, Semantic Segmentation.
  - Video: Video Clip Classification.
  - Custom.
- Custom Labeling uses the **Liquid templating language**, allowing custom HTML and pre-built web components.
- With custom labeling you can set a **pre- and post-labeling task via AWS Lambda**:
  - Pre-labeling task Lambda — triggered for each dataset object before sending it to workers.
  - Post-labeling task Lambda — used for custom label consolidation algorithms.

> 📸 Source: Screenshot 2026-07-05 at 15.25.55.png, Screenshot 2026-07-05 at 15.26.32.png

## SageMaker Ground Truth — Crowd HTML
- The prebuilt components for custom labeling are called **Crowd HTML** (~30 prebuilt components).
- Examples: crowd-alert, crowd-badge, crowd-button, crowd-bounding-box, crowd-card, crowd-checkbox, crowd-classifier (+ multi-select), crowd-entity-annotation, crowd-fab, crowd-form, crowd-icon-button, crowd-image-classifier (+ multi-select), crowd-input, crowd-instance-segmentation, crowd-instructions, crowd-keypoint, crowd-line, crowd-modal, crowd-polygon, crowd-polyline, crowd-radio-button, crowd-radio-group, crowd-semantic-segmentation, crowd-slider, crowd-tab(s), crowd-text-area, crowd-toast, crowd-toggle-button.
- Example slider: `<crowd-slider name="howMuch" min="1" max="10" step="1" pin="true" required>`.

> 📸 Source: Screenshot 2026-07-05 at 15.26.40.png

## SageMaker Ground Truth — Managing Workforces
- When creating a labeling job you must **assign a workforce**. There are **3 workforce options**:
  - **Amazon Mechanical Turk** — on-demand 24/7 workforce of 500,000+ independent contractors worldwide.
  - **Private** — a team of workers you source yourself (your own employees/contractors) for data that must stay within your organization.
  - **Vendor managed** — a curated list of third-party vendors specializing in data labeling, available via the AWS Marketplace.
  > 🎯 Exam: pick by sensitivity/scale — **Mechanical Turk** = cheapest, public crowd, NOT for confidential data; **Private** = your own staff, best for sensitive/PII or specialized data that must stay internal; **Vendor** = need expertise/scale but no internal team, still bound by NDA via Marketplace.

> 📸 Source: Screenshot 2026-07-05 at 15.26.55.png

## SageMaker Ground Truth — Private Workforce
- For a private workforce you create **private teams**.
- To authenticate them to your AWS account, choose an identity provider: **OpenID Connect (OIDC)** (e.g. Facebook Connect) or **AWS Cognito**.
  - "Create a private team with AWS Cognito" — invite/import from existing Cognito user groups.
  - "Create a private team with OpenID Connect (OIDC)" — use your own IdP (must support OIDC user groups).
- Invite your team by email (up to 50 workers, comma-separated) or import them from your Cognito User Pool.
- Once you have a workforce, create a labeling job and assign them to label your data.
- Workers log into the Ground Truth UI and are tasked to label the content (e.g. "Select an option", Submit).

> 📸 Source: Screenshot 2026-07-05 at 15.27.03.png, Screenshot 2026-07-05 at 15.27.21.png

## Automatic Model Tuning
- SageMaker **Automatic Model Tuning** finds the best version of a model by running many training jobs using the algorithm and ranges of hyperparameters you specify, then choosing the hyperparameter values that produce the best model (measured by a metric you choose).
- Also known as **hyperparameter tuning**.
- Can be applied to: built-in algorithms, custom algorithms, SageMaker pre-built containers for ML frameworks.
- Save money by using **EC2 Spot Instance Pricing**.
- Before tuning you need: a dataset, understanding of the algorithm type to train, and understanding of how to measure success.
- Caveat: hyperparameter tuning **might not** improve your model; it is an advanced tool, part of the scientific development process.
- Especially useful for complex Deep Learning Neural Networks where there are too many combinations to explore manually.

> 📸 Source: Screenshot 2026-07-05 at 15.27.26.png

## Automatic Model Tuning — Use Case
- Example: using the **XGBoost** algorithm for a binary classification problem on a marketing dataset, aiming to maximize the **AUC** (area under the curve) metric.
- Tunable parameters: `eta`, `alpha`, `min_child_weight`, `max_depth` — but you don't know which parameter to tune or what value to assign.
- Use SageMaker Automatic Model Tuning by: specifying the range of values for a parameter → SageMaker runs training jobs on parameter value variants → returns the training job with the highest AUC.

> 📸 Source: Screenshot 2026-07-05 at 15.27.35.png

## Automatic Model Tuning — How It Works
- SageMaker Hyperparameter Tuning offers two optimization types: **Random Search** and **Bayesian Search**.
- **Grid Search** — evaluates all possible combinations; can be an unfeasible computing cost; only viable when candidates are limited.
  - Exhaustive/brute-force → guaranteed to hit best combo in the grid but cost explodes with # of params (curse of dimensionality); jobs are independent so can run in parallel.
- **Random Search** — cheaper than grid search; tests only as many tuples as you choose; completely random; required time decreases significantly.
  - Samples random combos → good coverage per budget, fully parallel, but doesn't learn from past results; use when you want speed and many parallel jobs.
- **Bayesian Search** — uses previous iterations to guide the next ones; builds a distribution of functions (Gaussian Process); each iteration updates the Gaussian and detects which regions of the hyperparameter space to explore; the number of iterations is predetermined and the most optimal tuples are returned.
  - Treats tuning as a regression problem → converges to good values in fewer jobs (smart, sequential), but is less parallelizable since each pick depends on prior results.
  > 🎯 Exam: Bayesian = fewest training jobs / most efficient (learns from history). Grid = exhaustive & most expensive. Random = fast + highly parallel but naive. SageMaker also offers **Hyperband** (early-stops poor jobs, best for iterative DL training).

> 📸 Source: Screenshot 2026-07-05 at 15.27.41.png, Screenshot 2026-07-05 at 15.27.47.png

## Deploy Models for Inference on SageMaker
- Inference is **the act of requesting and getting a prediction**. Once a model is trained, it must be deployed to infer predictions.
- Two deployment options:
  - **1. Realtime Prediction (Endpoints)** — host the model on a server with an accessible API endpoint; send an HTTPS request and get a prediction back. Uses **SageMaker Hosting Services**.
  - **2. Batch Predictions (Batch Transform Jobs)** — apply predictions to a large dataset; only need a server for the duration of the batch; uses **Batch Transform**.
  > 🎯 Exam: Real-time endpoint = low-latency, always-on, per-request, pay while running → use for interactive/online predictions. Batch Transform = no persistent endpoint, spins up only for the job → use for large offline datasets, cheaper when latency doesn't matter. (SageMaker also has **Serverless** = auto-scale-to-zero for intermittent traffic, and **Async** = large payloads / long inference with a queue.)
- SageMaker has a whole Inference service category (Compilation jobs, Model packages, Models, Endpoint configurations, Endpoints, Batch transform jobs). Deploy via SDK or AWS Console.

> 📸 Source: Screenshot 2026-07-05 at 15.27.57.png

## Inference Pipelines
- An **inference pipeline** is an Amazon SageMaker model composed of **a linear sequence of two to fifteen containers** that process requests for inferences on data.
  - What/why: chain preprocessing → model → postprocessing behind a *single* endpoint (or batch job) → the same feature-engineering code runs at training and inference, avoiding train/serve skew; deploy as one unit.
- Used to define and deploy any combination of pretrained SageMaker built-in algorithms and your own custom algorithms packaged in Docker containers.
- Combine data science tasks for: preprocessing, predictions, post-processing.
- Reuse containers used for data transforms from training: SageMaker Spark ML Serving container, scikit-learn container.
- The first container handles the initial request; when deployed, SageMaker installs and runs all containers on each EC2 instance in the endpoint or transform job.
  - Containers are co-located on the same EC2 → low latency for inference.
  - Inference pipelines are **immutable** — you must deploy a new version to update an endpoint.
- Example pipeline flow: Raw Payload (CSV) → Pre-processing (SparkML Serving Image + pre-processor artifacts) → XGBoost Model (XGBoost image + artifacts) → Post-processing (SparkML Serving Image + post-processor artifacts) → Post-Process Output (CSV). Models can chain (e.g. PCA to DeepAR); post-processing converts predictions back into human-readable format.

> 📸 Source: Screenshot 2026-07-05 at 15.28.03.png, Screenshot 2026-07-05 at 15.28.08.png

## Inference Pipelines — Feature Processing
- Before training, use **preprocessors** to transform data and engineer features. Use either **Spark ML jobs** or **Scikit-Learn jobs**.
- **Spark ML**:
  - Run Spark ML with AWS Glue from SageMaker Notebooks.
  - Connect to existing Amazon EMR clusters to run Spark ML jobs.
  - Package/serialize Spark ML jobs with **MLeap** into MLeap containers, then add the MLeap container to your inference pipeline.
- **Sci-Kit Learn** — run and package scikit-learn jobs into containers directly in Amazon SageMaker.

> 📸 Source: Screenshot 2026-07-05 at 15.28.15.png
