# Part 07 — SageMaker Inference, MLOps, Bias/Explainability & ML Metrics

## Inference Pipelines — Create Model
- Before you can deploy a model you must first **create a model**.
- Use the **`CreateModel`** API command to do so.

> 📸 Source: Screenshot 2026-07-05 at 15.29.17.png

## Pre and Post Processing Variants
- Three ways to apply **pre and post processing**:
  1. **Single Model** — include pre/post processing within your inference script. When using a TensorFlow Serving model, there are designated function handlers for pre and post.
  2. **Inference Pipeline** — create a model out of multiple containers that run in **sequential order**. You do NOT use SageMaker Processing; you create a model using an **Estimator**.
  3. **SageMaker Pipelines** — create pre/post processing steps in your Pipeline. Uses **SageMaker Processing** (which is only intended to work with Pipeline).

> 📸 Source: Screenshot 2026-07-05 at 15.29.25.png

## SageMaker Hosting Services
- **Hosting Services** = running your ML model on an **ML EC2 instance** (real-time inference).
  - Real-time = **persistent endpoint** always on, low-latency, synchronous request/response. Dùng khi cần trả lời ngay (một record/lần).
  > 🎯 Exam: Real-time endpoint = luôn chạy (trả tiền liên tục) cho low-latency. Nếu chỉ cần suy luận theo lô, không cần endpoint thường trực → dùng **Batch Transform** rẻ hơn.
- On the **Estimator**, call the **`deploy`** function when ready to deploy for real-time inference.
  - Specify the **ML EC2 instance** to use (e.g. `instance_type='ml.t2.medium'`, `initial_instance_count=1`).
  - `deploy` returns a **Predictor** — a deployable model that launches EC2 server(s) and configures a SageMaker hosting services endpoint.
- Get endpoint name via **`endpoint_name`** → format e.g. `sagemaker-xgboost-YYYY-MM-DD-HH-MM-SS-SSS`.
- Make a prediction with **`invoke_endpoint`**, supplying the endpoint name and data via `Body` (plus `ContentType`, `Accept`).

> 📸 Source: Screenshot 2026-07-05 at 15.29.36.png

## SageMaker — Batch Transform
- Instead of hosting a production endpoint, run a **one-time batch inference job** on a test dataset using **batch transform**.
  - No persistent endpoint: spins up instances, scores the whole dataset from S3, writes results to S3, then shuts down. **Rẻ hơn** khi không cần real-time; tốt cho large datasets & offline scoring.
  > 🎯 Exam: Batch Transform vs Real-time endpoint là bẫy hay gặp — "no need for a persistent/always-on endpoint", "process a large dataset at once" ⇒ Batch Transform.
- On the Estimator, create a **`transformer`** — specifies which ML EC2 instance to use (`instance_count`, `instance_type='ml.m4.xlarge'`) and an **S3 output path** (`output_path`).
- Calling **`transform`** on the transformer starts the batch job — specify an **S3 input path** (`data`, `data_type='S3Prefix'`, `content_type='text/csv'`, `split_type='Line'`), then `transformer.wait()`.
- When complete, it creates a file at the output path; download results using S3 recursively: `aws s3 cp {batch_output} ./ --recursive`.

> 📸 Source: Screenshot 2026-07-05 at 15.30.45.png

## Multi-Model Endpoints
- Save money by **hosting multiple models on a shared serving container**.
  - **Nhiều models cùng loại/framework** dùng chung 1 container & 1 endpoint; models nạp/xả khỏi memory theo nhu cầu (time-sharing). Lý tưởng cho **nhiều models nhỏ tương tự nhau** (vd. 1 model mỗi khách hàng/khu vực).
  > 🎯 Exam: Multi-Model = nhiều models **cùng container** (same framework, load on demand) → tiết kiệm chi phí khi có rất nhiều models. Đừng nhầm với Multi-Container (khác framework/container).
- Key facts:
  - Scalable, cost-effective for deploying large numbers of models.
  - Enable **time-sharing of memory resources** across models.
  - Support **A/B testing**.
  - Work with **Auto Scaling** and **AWS PrivateLink**.
  - Work with **serial inference pipelines**.
  - Work best when models are **fairly similar in size and invocation latency**.
  - You **can't** use multi-model-enabled containers with **Amazon Elastic Inference**.
- When creating your model: choose **"Use multiple models"** (Provide model artifacts and inference image options).
- When creating your endpoint: just add **production variants** (model name, training job, variant name, instance type, initial instance count, initial weight).

> 📸 Source: Screenshot 2026-07-05 at 15.31.00.png

## Multi-Container Endpoints
- SageMaker multi-container endpoints let you **deploy multiple containers** to run different models on a single SageMaker endpoint.
  - Tối đa **15 containers khác nhau** (có thể khác framework) trên 1 endpoint; gọi trực tiếp từng cái (Direct) hoặc nối chuỗi (Serial/pipeline).
  > 🎯 Exam: Multi-**Container** = models dùng **framework/container khác nhau**; Multi-**Model** = nhiều models **cùng một container**. Direct mode = chọn container cụ thể qua `TargetContainerHostname`.
- Containers can:
  - Run in a **sequence** as an inference pipeline, OR
  - Be accessed **individually via direct invocation** (`'Mode': 'Direct'`) — improves endpoint utilization and optimizes costs.
- Create via `sagemaker.create_model(...)` passing `InferenceExecutionConfig` and a `Containers=[container1, container2]` list.
- To invoke a specific container, use `invoke_endpoint` with **`TargetContainerHostname`** (e.g. `'secondContainer'`).

> 📸 Source: Screenshot 2026-07-05 at 15.31.04.png, Screenshot 2026-07-05 at 15.31.14.png

## SageMaker Model Monitor
- **Model Drift** = when a model's prediction accuracy degrades over time due to changes in data / input & output variables → leads to **"model decay"**.
- **Amazon SageMaker Model Monitor** monitors the quality of ML models in production.
- Monitoring modes:
  - Continuous monitoring with a **real-time endpoint**.
  - Continuous monitoring with a **batch transform job** that runs regularly.
  - **On-schedule** monitoring for asynchronous batch transform jobs.
- Monitors 4 loại: **data quality** (drift vs baseline), **model quality** (accuracy vs ground-truth labels), **bias drift** (dùng Clarify), **feature attribution drift** (SHAP importance đổi). Emits CloudWatch metrics → alert khi lệch baseline.
  > 🎯 Exam: "Model accuracy giảm dần theo thời gian / data phân phối đổi (drift)" ⇒ **Model Monitor**. Nó phát hiện & cảnh báo, không tự retrain.

> 📸 Source: Screenshot 2026-07-05 at 15.31.32.png

## Model Registry
- **SageMaker Model Registry** lets you easily **govern, catalog, version and deploy ML models**.
  - Catalog models for production, manage model versions, associate metadata (e.g. training metrics), manage approval status, deploy to production, automate deployment with **CI/CD**.
- **Model Groups** — a logical grouping of ML models; contains many versions of models.
- **Model Version** — a specific version of an ML model; includes the trained weights and the inference code for the model.
  > 🎯 Exam: "quản lý phiên bản model + trạng thái approval (approve/reject) trước khi deploy, tích hợp CI/CD" ⇒ **Model Registry**. Đừng nhầm với **Model Cards** (tài liệu/governance) hay **Model Monitor** (giám sát drift lúc chạy).

> 📸 Source: Screenshot 2026-07-05 at 15.31.38.png

## SageMaker Processing
- **SageMaker Processing** lets you run **preprocessing, postprocessing and model evaluation workloads** on fully managed infrastructure.
- Helps with ML processing workloads: **feature engineering, data validation, model evaluation, model interpretation**.
- Processing APIs can be used during the **experimentation phase** and **after code is deployed in production** (to evaluate performance).
- Architecture: S3 input → `/opt/ml/processing/input` → Processing Container (on a fully managed cluster instance) → `/opt/ml/processing/output` → S3.
- The processing container image can be a **SageMaker built-in image** (or your own).

> 📸 Source: Screenshot 2026-07-05 at 15.31.44.png

## SageMaker Processing — SciKit-Learn
- To run a processing job with SciKit-Learn, use **`SKLearnProcessor`** to define the EC2 **instance type** and Sci-Kit Learn **framework version** (e.g. `framework_version='0.20.0'`, `instance_type='ml.m5.xlarge'`, `instance_count=1`).
- Call **`run`** to run the job — supply `code='preprocessing.py'`, `inputs=[ProcessingInput(...)]`, `outputs=[ProcessingOutput(...)]` (train/validation/test).

> 📸 Source: Screenshot 2026-07-05 at 15.31.56.png

## SageMaker Processing — Apache Spark
- To run a processing job with Apache Spark, use **`PySparkProcessor`** to define the EC2 **instance type** and PySpark **framework version** (e.g. `framework_version='2.4'`, `instance_count=2`, `instance_type='ml.m5.xlarge'`, `max_runtime_in_seconds=1200`).
- Call `run` with `submit_app='preprocess.py'` and `arguments=[...]` (input/output buckets & key prefixes).

> 📸 Source: Screenshot 2026-07-05 at 15.32.01.png

## SageMaker Pipelines
- **SageMaker Model Building Pipelines** = a tool for **building ML pipelines** with direct integration into SageMaker.
- Advantages over other AWS workflows:
  - **SageMaker Integration** — fully managed, directly within SageMaker; no need to interact with other AWS services.
  - **SageMaker Python SDK Integration** — create pipelines programmatically using Python.
  - **SageMaker Studio Integration** — track, view and execute pipelines in the Studio UI.
  - **Data Lineage Tracking** — track history of data within pipeline execution (where data came from, where it was used as input, outputs generated).
  - **Step Reuse** — designate steps for **caching**; reuse output from previous executions of the same step in the same pipeline without re-running.

> 📸 Source: Screenshot 2026-07-05 at 15.32.29.png, Screenshot 2026-07-05 at 15.32.46.png

## SageMaker Pipelines — Pipeline Definition
- SageMaker Pipelines = a **series of interconnected steps** defined by a **JSON pipeline definition**.
- **Pipeline Definition** — encodes a pipeline using a **Directed Acyclic Graph (DAG)**.
- **DAG** = a graph where everything flows in the same direction and no node can reference back to itself.
- Relationships between steps are determined by **data dependencies** (you don't define relationships; they are pre-determined).
- Visualized in SageMaker Studio as a DAG (example steps: AbaloneProcess → AbaloneTrain → AbaloneEval → AbaloneMSECond → RegisterModel / CreateModel → Transform).

> 📸 Source: Screenshot 2026-07-05 at 15.32.52.png

## SageMaker Clarify
- **SageMaker Clarify** detects **potential bias** during data preparation, after model training, and in a deployed model by examining attributes you specify.
- A system may be biased if it discriminates against individuals/groups (e.g. Sex, Age, Gender, Annual Income, Nationality).
- Provides **bias metrics** to quantify various fairness criteria (e.g. Difference in Positive Proportions in Labels / DPL, range -1 to 1).
- Integrations:
  - **Identify imbalances in data** — integrated with **SageMaker Data Wrangler** (bias due to imbalanced dataset).
  - **Check trained model for bias** — integrated with **SageMaker AutoPilot** experiments.
  - **Monitor your model for bias** — integrated with **SageMaker Model Monitor**; configure alerting (e.g. Amazon CloudWatch) if bias metric thresholds are exceeded.
  > 🎯 Exam: **Clarify = bias detection + explainability (SHAP)**. "Phát hiện thiên vị / giải thích vì sao model quyết định / feature importance / fairness" ⇒ Clarify. (Explainability & transparency, đáp ứng quy định.)

> 📸 Source: Screenshot 2026-07-05 at 15.33.00.png, Screenshot 2026-07-05 at 15.35.37.png

## SageMaker Clarify — Terminologies
- **Feature** — an individual measurable property/characteristic (a column in tabular data).
- **Label** — feature that is the target for training; the *observed label / observed outcome*.
- **Predicted label** — the label predicted by the model; the *predicted outcome*.
- **Sample** — an observed entity described by feature values and label value (a row).
- **Dataset** — a collection of samples.
- **Bias** — an imbalance in training data or prediction behavior across groups (e.g. age, income bracket).
- **Bias metric** — a function returning numerical values indicating level of potential bias.
- **Bias report** — a collection of bias metrics for a dataset (or dataset + model).
- **Positive / Negative label values** — label values favorable / unfavorable to a demographic group.
- **Group variable** — categorical column used to form subgroups for Conditional Demographic Disparity (CDD); required only for that metric (Simpson's paradox).
- **Facet** — a column/feature containing the attributes with respect to which bias is measured.
- **Facet value** — feature values that bias might favor or disfavor.
- **Predicted probability** — model-predicted probability of a sample having a positive/negative outcome.

> 📸 Source: Screenshot 2026-07-05 at 15.35.48.png

## SHAP Algorithm
- **SHAP (SHapley Additive exPlanations)** = a **game-theoretic approach** to explain the output of any ML model.
- Extracts an explanation from your ML model — shows contribution of each input feature to the final decision (positive/negative pushes from a base rate to the output).
- Driven by expanding **business needs** and **legislative regulations** requiring explanations of *why* a model made a decision.
- **SageMaker Clarify uses SHAP** to explain each input feature's contribution to the final decision.
- A SHAP baseline can be **generated** within SageMaker Autopilot experiments (feature-importance bar chart).

> 📸 Source: Screenshot 2026-07-05 at 15.36.00.png

## Measuring Bias in ML Models
- In SageMaker Clarify you generate **bias reports in Data Wrangler**, using various **pretraining bias metrics**:
  - **Class Imbalance (CI)** — imbalance in the number of members between facet values (e.g. not enough data outside a middle-aged facet).
  - **Difference in Proportions of Labels (DPL)** — imbalance of positive outcomes between facet values.
  - **Kullback-Leibler Divergence (KL)** — how much outcome distributions of facets diverge entropically.
  - **Jensen-Shannon Divergence (JS)** — how much outcome distributions of facets diverge entropically.
  - **Lp-norm (LP)** — p-norm difference between distinct demographic distributions of outcomes.
  - **Total Variation Distance (TVD)** — half the L1-norm difference between distinct demographic distributions.
  - **Kolmogorov-Smirnov (KS)** — maximum divergence between outcome distributions for facets.
  - **Conditional Demographic Disparity (CDD)** — disparity of outcomes between facets as a whole and by subgroups.

> 📸 Source: Screenshot 2026-07-05 at 15.37.28.png

## SageMaker Model Cards
- **SageMaker Model Cards** = a **documentation framework** to manage and govern ML models.
- Capture critical info: **model details, training metrics, performance evaluations, deployment history**.
- Models trained on SageMaker can **auto-populate** Model Cards.
- Model Cards can be: **versioned**, in various states (e.g. Draft), created via the **SageMaker Python SDK**.

> 📸 Source: Screenshot 2026-07-05 at 15.37.33.png

## What are Metrics? (Evals)
- **Performance / Evaluation Metrics** are used to evaluate different ML algorithms; commonly known as **"Evals"**.
- Different metrics matter for different problem types:
  - **Classification** — accuracy, precision, recall, F1-score, ROC, AUC.
  - **Regression** — MSE, RMSE, MAE.
  - **Ranking** — MRR, DCG, NDCG.
  - **Statistical** — Correlation.
  - **Computer Vision** — PSNR, SSIM, IoU.
  - **NLP** — Perplexity, BLEU, METEOR, ROUGE.
  - **Deep Learning** — Inception score, Frechet Inception distance.
- Regression metrics (lower = better, đo sai số dự đoán giá trị liên tục):
  - **MSE** (Mean Squared Error) — trung bình bình phương sai số; **phạt nặng lỗi lớn** (outliers).
  - **RMSE** (Root MSE) — căn bậc hai của MSE; cùng đơn vị với target nên dễ diễn giải.
  - **MAE** (Mean Absolute Error) — trung bình trị tuyệt đối sai số; ít nhạy với outliers hơn MSE.
- Two categories:
  - **Internal Evaluation** — evaluate the internals of the model (Accuracy, F1, Precision, Recall = "the famous four", used in all model types).
  - **External Evaluation** — evaluate the final prediction of the model.

> 📸 Source: Screenshot 2026-07-05 at 15.39.03.png

## Classification Metrics — Confusion Matrix
- A **confusion matrix** (aka **error matrix**) visualizes **model predictions (predicted)** vs **ground truth labels (actual)**; useful in classification problems.
- Cells: **True Positives (TP)**, **True Negatives (TN)**, **False Positives (FP)**, **False Negatives (FN)**.
  - **TP** = dự đoán Positive & đúng. **TN** = dự đoán Negative & đúng. **FP** ("false alarm", Type I error) = dự đoán Positive nhưng thực ra Negative. **FN** ("miss", Type II error) = dự đoán Negative nhưng thực ra Positive.
  - Là nền tảng để tính accuracy/precision/recall/F1; đường chéo (TP, TN) = dự đoán đúng.
- Totals shown: Total False (tF), Total True (tT), Total Negative (tN), Total Positive (tP), Total (t).
- Matrix **size depends on the number of labels** (e.g. Apple, Banana, Orange = 3x3 = 9 cells).

> 📸 Source: Screenshot 2026-07-05 at 15.39.24.png

## Classification Metrics — Accuracy and F1 Score
- **Accuracy** — use when **True Positives and True Negatives** are more important; good when **class distribution is similar**.
- **F1-score** — use when **False Negatives and False Positives** matter to the optimal answer; good for **imbalanced class distribution**.
- **F1 Score** = the **harmonic mean** of precision and recall; used in **binary classification**.
- **Precision** = "how many selected items are relevant?" (TP / (TP + FP)). Trong số dự đoán Positive, bao nhiêu đúng; **cao khi FP tốn kém** (vd. spam filter chặn nhầm email quan trọng). Higher = better.
- **Recall** (Sensitivity/TPR) = "how many relevant items are selected?" (TP / (TP + FN)). Trong số Positive thực tế, bắt được bao nhiêu; **cao khi FN tốn kém** (vd. bỏ sót chẩn đoán ung thư, phát hiện gian lận). Higher = better.
- **Accuracy** = (TP+TN)/tổng — % tổng thể đoán đúng; higher = better. **F1** = harmonic mean của precision & recall (0–1), cân bằng cả hai; higher = better.
- Diagram: relevant vs selected elements → true positives, false positives, false negatives, true negatives.
  > 🎯 Exam: **Accuracy gây hiểu lầm với dữ liệu imbalanced** — model đoán toàn class đa số vẫn "chính xác" 99% nhưng vô dụng → dùng **F1/Precision/Recall**. Precision↔FP, Recall↔FN. Có sự đánh đổi precision-recall (tăng cái này thường giảm cái kia).

> 📸 Source: Screenshot 2026-07-05 at 15.39.38.png

## Classification Metrics — ROC Curve and AUC
- **Receiver Operating Characteristic (ROC) curve** — plots confusion-matrix results at different **thresholds** to determine which threshold produces the least false-positives with the most true-positives.
- Axes: **TPR** (True Positive Rate, y) vs **FPR** (False Positive Rate, x).
- **Area Under the Curve (AUC)** — the probability that the model ranks a random positive example more highly than a random negative example.
  - Thang **0.5 → 1.0**: 0.5 = đoán bừa (random), 1.0 = phân loại hoàn hảo; higher = better. Đo khả năng phân biệt lớp **độc lập với threshold**, dùng để so sánh models.
  > 🎯 Exam: AUC = 0.5 nghĩa là model **vô dụng** (như tung đồng xu); AUC gần 1 = tốt. ROC/AUC vẫn hữu ích với imbalanced data và không phụ thuộc một ngưỡng cụ thể.

> 📸 Source: Screenshot 2026-07-05 at 15.39.47.png

## Ranking Metrics
- Important in ML such as **recommendation systems** — trying to place relevant items at the top of a list.
- Chung: tất cả từ 0→1, **higher = better**; đánh giá thứ tự (order) chứ không chỉ đúng/sai.
- Two families: **binary relevance based** (item is good or bad) and **utility based** (item is a measurement of good/bad).
- **Mean Reciprocal Rank (MRR)** — measures where the first item is (binary). Simple, fast, easy; focuses on the first item, not great if you want a full list.
- **Mean Average Precision (MAP)** — uses area under the Precision-Recall curve to measure relevant items (binary). Good for a generally relevant list; not great for fine-grained lists (e.g. 1-5 stars).
- **Normalized Discounted Cumulative Gain (NDCG)** — measures a list of relevant items with **graded relevance** values (utility); can determine some relevant items are more relevant than others. Complex, slower, hard; use when exact ranking matters (e.g. 1-5 stars).

> 📸 Source: Screenshot 2026-07-05 at 15.39.54.png

## Computer Vision Metrics
- **Peak Signal-to-Noise Ratio (PSNR)** — chất lượng ảnh/video tái tạo (đo bằng dB); **higher = better** (ít nhiễu). Dùng cho image compression, denoising, super-resolution.
- **Structural Similarity Index Measure (SSIM)** — độ giống nhau về cấu trúc/độ sáng/tương phản giữa 2 ảnh, thang 0→1 (**1 = giống hệt**, higher = better); gần cảm nhận con người hơn PSNR.
- **Intersection over Union (IoU)** — vùng giao / vùng hợp giữa 2 bounding boxes (predicted vs ground-truth), thang 0→1; **higher = better** (1 = trùng khít). Dùng cho **object detection & segmentation** (thường IoU ≥ 0.5 tính là đúng).

> 📸 Source: Screenshot 2026-07-05 at 15.39.59.png

## NLP Metrics
- **Perplexity** — đo mức "bối rối" của language model khi dự đoán từ tiếp theo; **lower = better** (model dự đoán text tốt hơn). Dùng đánh giá LLM/language models.
- **Bilingual Evaluation Understudy (BLEU)** — evaluates quality of machine-translated text; score between 0 and 1 measuring similarity to high-quality reference translations.
  - **Precision-based** (n-gram trùng với reference); **higher = better**. Đo trên toàn corpus, không tốt cho từng câu lẻ.
  - Performs badly on individual sentences; doesn't distinguish content vs function words; not good at capturing meaning/grammaticality. Ideal for machine translation (e.g. English→French).
- **Metric for Evaluation of Translation with Explicit Ordering (METEOR)** — machine-translation metric based on the **harmonic mean of unigram precision and recall (recall weighted higher)**; overcomes BLEU pitfalls; allows synonyms and stemmed words to match a reference word. Ideal for machine translation.
- **Recall-Oriented Understudy for Gisting Evaluation (ROUGE)** — measures recall; ideal for **summarization** tasks.
  - **Recall-based** (bao nhiêu n-gram của reference xuất hiện trong output); higher = better.
  > 🎯 Exam: nhớ theo task — **BLEU/METEOR = translation** (precision, METEOR cho phép synonyms), **ROUGE = summarization** (recall), **Perplexity = đánh giá language model (lower better)**.

> 📸 Source: Screenshot 2026-07-05 at 15.40.09.png

## Deep Learning Metrics
- **Inception Score (IS)** — a metric for evaluating **Generative Adversarial Networks (GANs)**. A GAN learns to generate new unique images similar to its training data; the score measures how realistic a GAN's output is.
  - Does NOT capture how synthetic images compare to real images. **Higher = better** (ảnh sinh ra rõ ràng & đa dạng).
- **Frechet Inception Distance (FID)** — another metric for evaluating GANs; **captures how synthetic images compare to real images**.
  - Đo **khoảng cách** giữa phân phối ảnh thật và ảnh sinh → **lower = better** (0 = giống hệt thật). Nói chung tốt/đáng tin hơn Inception Score.
  > 🎯 Exam: hướng ngược nhau — **Inception Score cao là tốt**, **FID thấp là tốt**; FID so sánh với ảnh thật, IS thì không.

> 📸 Source: Screenshot 2026-07-05 at 16.51.14.png
