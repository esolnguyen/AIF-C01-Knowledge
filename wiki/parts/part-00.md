# Part 00 — Fundamentals of AI/ML (AIF-C01)

## Regression
- **Regression** = process of finding a function to **correlate a labeled dataset into a continuous variable/number**.
- Outcome: predict a variable in the future (eg. "What will the temperature be next week? → 20°C").
- How it works: vectors (dots) are plotted on a graph in multiple dimensions eg (X,Y); a **regression line** is drawn through the dataset.
- The **distance** of a vector (dot) from the regression line is called an **Error**.
- Different regression algorithms use the error to predict future variables:
  - **Mean Squared Error (MSE)**
    - Trung bình của (sai số)²; phạt mạnh sai số lớn → rất nhạy với outlier; đơn vị bị bình phương (khó diễn giải).
  - **Root Mean Squared Error (RMSE)**
    - Căn của MSE; cùng đơn vị với biến mục tiêu → dễ diễn giải; vẫn nhạy với outlier.
  - **Mean Absolute Error (MAE)**
    - Trung bình |sai số|; robust với outlier hơn MSE/RMSE; giữ đơn vị gốc.
    > 🎯 Exam: outlier nhiều → chọn MAE; muốn phạt nặng sai số lớn → MSE/RMSE.
- Regression is a **Supervised Learning** task (labeled data).

> 📸 Source: Screenshot 2026-07-04 at 21.36.10.png

## Classification
- **Classification** = process of finding a function to **divide a labeled dataset into classes/categories**.
- Outcome: predict a category to apply to the inputted data (eg. "Will it rain next Saturday? → Sunny, Rainy").
- A **classification line** divides the dataset (data on one side = Sunny, the other = Rainy).
- **Classification Algorithms:**
  - Logistic Regression
    - Dùng sigmoid để xuất xác suất; tuyến tính & dễ diễn giải; baseline cho binary classification.
  - Decision Tree / Random Forest
    - Tree: chia dữ liệu theo luật if/else, dễ hiểu nhưng dễ overfit. Random Forest: ensemble nhiều cây (bagging) → chính xác & ổn định hơn.
  - Neural Networks
    - Nhiều node/layer có trọng số; học được quan hệ phi tuyến phức tạp; cần nhiều dữ liệu & tính toán.
  - Naive Bayes
    - Dựa trên định lý Bayes, giả định các feature độc lập; nhanh, hợp text/spam classification.
  - K-Nearest Neighbors (K-NN)
    - Phân loại theo K điểm gần nhất (majority vote); lazy learner, không "train" thật; nhạy với scale & K.
- Classification is a **Supervised Learning** task.

> 📸 Source: Screenshot 2026-07-04 at 21.37.22.png

## Clustering
- **Clustering** = process of **grouping unlabeled data based on similarities and differences**.
- Outcome: group data based on their similarities or differences.
- Example: recommend a Windows Computer to one cluster, a Mac Computer to another cluster.
- **Clustering Algorithms:**
  - K-means
    - Chia data thành K cụm quanh centroid (điểm trung bình); nhanh & phổ biến; phải chọn trước K, nhạy với outlier.
  - K-medoids
    - Giống K-means nhưng tâm cụm là một điểm dữ liệu thật (medoid); robust với outlier hơn K-means.
  - Density Based
    - Nhóm theo mật độ điểm (eg. DBSCAN); tự tìm số cụm, phát hiện được noise & cụm hình dạng bất kỳ.
  - Hierarchical
    - Xây cây cụm lồng nhau (dendrogram) không cần chọn trước K; trực quan nhưng chậm với data lớn.
- Clustering is an **Unsupervised Learning** task (unlabeled data).

> 📸 Source: Screenshot 2026-07-04 at 21.38.49.png

## Types of Machine Learning
- Many types of ML, grouped by the problem they solve.
- **Learning Problems:**
  - **Supervised** — using a model to learn a mapping between input examples and the target variable.
  - **Unsupervised** — using a model to describe or extract relationships in data.
  - **Reinforcement** — an agent operates in an environment and must learn to operate using feedback.
- **Hybrid Learning Problems:**
  - **Semi-Supervised** — training data has very few labeled examples and a large number of unlabeled examples.
  - **Self-Supervised** — framed as a supervised learning problem to apply supervised algorithms.
  - **Multi-Instance** — individual examples are unlabeled; instead, bags/groups of samples are labeled.
- **Statistical Inference:**
  - **Inductive** — using evidence to determine the outcome.
  - **Deductive** — using general rules to determine specific outcomes.
  - **Transductive** — used in statistical learning theory to predict specific examples given a specific domain.
- **Learning Techniques:**
  - **Multi-Task** — fitting a model on one dataset that addresses multiple related problems.
  - **Active** — model can query a human operator during learning to resolve ambiguity.
  - **Online** — uses available data and updates the model before a prediction is required or after the last observation.
  - **Transfer** — a model trained on one task is used as the starting point for a related task.
  - **Ensemble** — two or more models fit on the same data and predictions are combined.

> 📸 Source: Screenshot 2026-07-04 at 21.39.20.png

## Division of Machine Learning
- Course divides ML into the following categories:
  - **Classical Machine Learning** (simple data, clear features): Supervised, Unsupervised.
  - **Reinforcement Learning** (when there is no data): Real-time Decisions, Game AI, Learning Tasks, Robot Navigation.
  - **Ensemble Methods** (when quality of data is a problem): Bagging, Boosting, Stacking.
    - **Bagging** — train nhiều model song song trên các mẫu bootstrap rồi lấy trung bình/vote; giảm variance (chống overfit). Eg. Random Forest.
    - **Boosting** — train tuần tự, mỗi model sửa lỗi model trước; giảm bias → chính xác cao. Eg. XGBoost, AdaBoost.
    - **Stacking** — kết hợp nhiều model khác loại qua một meta-model học cách "trộn" dự đoán.
  - **Neural Networks and Deep Learning** (when data is complicated and/or features are unclear): CNN, RNN, GAN, MultiLayer Perceptron (MLP), Auto Encoders.
    - **CNN** (Convolutional) — dùng bộ lọc tích chập để bắt đặc trưng không gian; chuẩn cho ảnh/thị giác máy tính.
    - **RNN** (Recurrent) — có vòng lặp/bộ nhớ, xử lý dữ liệu tuần tự (text, time-series, âm thanh).
    - **GAN** (Generative Adversarial) — generator vs discriminator "đối kháng" nhau; sinh dữ liệu giả thực (ảnh, deepfake).
    - **MLP** (MultiLayer Perceptron) — mạng feed-forward fully-connected cơ bản; hợp dữ liệu bảng.
    - **Auto Encoders** — nén (encode) rồi tái tạo (decode) dữ liệu; unsupervised, dùng cho giảm chiều & phát hiện bất thường.

> 📸 Source: Screenshot 2026-07-04 at 21.39.54.png

## Classical Machine Learning
- ML algorithms have existed since the early 1950s; applying these older algorithms = "Classical ML".
- Eg. Nearest Neighbor Algorithm invented 1967. Most business learning problems today use Classic ML.
- **Supervised Learning (SL)** — data labeled into categories; *task-driven — make a prediction*.
  - **Classification** — predict what category data belongs to; Use Case: Identity Fraud Detection.
  - **Regression** — predict a variable in the future; Use Case: Market Forecast.
- **Unsupervised Learning (UL)** — data not labeled; *data-driven — recognize a structure or pattern*.
  - **Clustering** — group data by similarities/differences; Use Case: Targeted Marketing.
  - **Association** — find a relationship between variables; Use Case: Customer Recommendation.
  - **Dimensionality Reduction** — reduce amount of data (pre-processing).

> 📸 Source: Screenshot 2026-07-04 at 21.53.18.png

## Supervised vs Unsupervised Learning
- **Supervised Learning (SL):** ML task/function that needs **training data** (labeled data / the correct answer); the machine learns from these results. "Show me how to do it, and then I can do it on my own."
  - SL Models: **Classification, Regression**.
- **Unsupervised Learning (UL):** ML task/function that needs no existing training data. UL takes unlabeled data, discovers patterns, and applies its own labels. "I am an independent worker, I can figure this out on my own."
  - UL Models: **Clustering, Association, Dimensionality Reduction**.
- **Key comparison:** SL tends to be more accurate than UL but requires more upfront work. UL still requires human intervention to validate results.

> 📸 Source: Screenshot 2026-07-04 at 21.55.21.png

## Supervised vs Unsupervised vs Reinforcement
- **Supervised Learning (SL):** data labeled for training; task-driven — make a prediction. Use when labels are known and you want a precise/specific value returned. Eg. Classification, Regression.
- **Unsupervised Learning (UL):** data not labeled, model does its own labeling; data-driven — recognize a structure or pattern. Use when labels are not known and outcome doesn't need to be precise, when trying to make sense of data. Eg. Clustering, Dimensionality Reduction, Association.
- **Reinforcement Learning (RL):** no data — there is an environment and an ML model generates data in many attempts to reach a goal; decisions-driven. Eg. Game AI, Learning Tasks, Robot Navigation.

> 📸 Source: Screenshot 2026-07-04 at 21.55.32.png

## Supervised Learning Models (Classification & Regression)
- **Classification** = process of finding a function to divide a dataset into classes/categories (eg. "Will it be Cold or Hot tomorrow?").
  - **Classification Algorithms:** Logistic Regression, K-Nearest Neighbours, Support Vector Machines, Kernel SVM, Naive Bayes, Decision Tree Classification, Random Forest Classification.
    - **Support Vector Machines (SVM)** — tìm siêu phẳng phân tách các lớp với biên (margin) lớn nhất; mạnh với dữ liệu nhiều chiều.
    - **Kernel SVM** — SVM dùng "kernel trick" để phân tách dữ liệu không tuyến tính bằng cách ánh xạ lên không gian chiều cao hơn.
- **Regression** = process of finding a function to correlate a dataset into a continuous variable/number (eg. "What is the temperature going to be tomorrow?").
  - **Regression Algorithms:** Simple Linear Regression, Multiple Linear Regression, Polynomial Regression, Support Vector Regression, Decision Tree Regression, Random Forest Regression.
    - **Simple Linear Regression** — 1 biến đầu vào → đường thẳng y = ax + b.
    - **Multiple Linear Regression** — nhiều biến đầu vào; quan hệ tuyến tính đa chiều.
    - **Polynomial Regression** — thêm số mũ để fit đường cong (quan hệ phi tuyến).
    - **Support Vector Regression (SVR)** — áp dụng ý tưởng SVM cho regression, dự đoán trong một biên dung sai.

> 📸 Source: Screenshot 2026-07-04 at 21.56.31.png

## Unsupervised Learning Models (Clustering, Association, Dimensionality Reduction)
- **Clustering** = grouping unlabeled data based on similarities and differences.
  - **Clustering Algorithms:** K-Means, DBScan, K-Modes.
    - **K-Means** — cụm quanh centroid, cần chọn trước K; hợp dữ liệu số.
    - **DBScan** — cụm theo mật độ, tự tìm số cụm & phát hiện noise/outlier.
    - **K-Modes** — biến thể K-Means cho dữ liệu categorical (dùng mode thay vì mean).
- **Association** = finding a relationship between variables through association (eg. "If someone buys bread, suggest butter" — most frequently bought items).
  - **Association Algorithms:** Apriori, Euclat, FP-Growth.
    - **Apriori** — tìm tập item xuất hiện thường xuyên theo từng bước; kinh điển nhưng chậm (quét dữ liệu nhiều lần).
    - **Euclat** — dùng cách biểu diễn dọc (vertical/tidset) → giao tập nhanh hơn Apriori.
    - **FP-Growth** — nén dữ liệu vào cây FP-tree, không sinh candidate → nhanh hơn Apriori nhiều.
- **Dimensionality Reduction** = reducing the amount of data while retaining data integrity; often used as a pre-processing stage.
  - **Dimensionality Reduction Algorithms:** Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA), Generalized Discriminant Analysis (GDA), Singular Value Decomposition (SVD), Latent Dirichlet Allocation (LDA), Latent Semantic Analysis (LSA, pLSA, GLSA), t-SNE.
    - **PCA** — chiếu dữ liệu lên các trục giữ nhiều phương sai nhất; unsupervised, phổ biến nhất.
    - **Linear Discriminant Analysis (LDA)** — giảm chiều có giám sát, tối đa tách biệt giữa các lớp (dùng nhãn).
    - **SVD** — phân rã ma trận, nền tảng cho PCA & hệ gợi ý; nén dữ liệu.
    - **Latent Dirichlet Allocation (LDA)** — mô hình chủ đề (topic modeling) cho văn bản; đừng nhầm với Linear Discriminant Analysis dù cùng viết tắt.
    - **LSA/pLSA** — trích chủ đề ẩn trong văn bản qua ma trận term-document.
    - **t-SNE** — giảm chiều phi tuyến để trực quan hóa cụm ở 2D/3D; chỉ để visualize, không dùng làm feature.
    > 🎯 Exam: "LDA" có hai nghĩa — Linear Discriminant Analysis (giảm chiều/classification) vs Latent Dirichlet Allocation (topic modeling NLP).

> 📸 Source: Screenshot 2026-07-04 at 21.56.42.png

## Neural Networks and Deep Learning
- **Neural Networks (NN):** often described as **mimicking the brain**; a **neuron/node represents an algorithm**. Data is inputted into a neuron and, based on output, passed to other connected neurons. Connections between neurons are **weighted**. Organized in layers: an input layer, multiple hidden layers, and an output layer.
- **Deep Learning:** a neural network with **3 or more hidden layers**.
- **Feed Forward Neural Network (FNN):** connections between nodes do not form a cycle (always move forward).
- **Backpropagation (BP):** moves backwards through the network adjusting weights to improve outcome on next iteration — this is how a neural net learns.
- **Loss Function:** compares the ground truth to the prediction to determine the error rate (how bad the network performed).
- **Activation Functions:** an algorithm applied to a hidden-layer node that affects connected output, eg. ReLU.
- **Dense:** when the next layer increases the number of nodes.
- **Sparse:** when the next layer decreases the number of nodes.
- **DL Algorithms split into:**
  - **Supervised:** Fully-connected Feed Forward (FNN), Recurrent Neural Networks (RNN), Convolutional Neural Network (CNN).
    - **FNN** — mạng fully-connected, dữ liệu chỉ đi tiến; hợp dữ liệu bảng.
    - **RNN** — có bộ nhớ/vòng lặp cho dữ liệu tuần tự (text, time-series).
    - **CNN** — bộ lọc tích chập bắt đặc trưng không gian; chuẩn cho ảnh.
  - **Unsupervised:** Deep Belief Networks (DBN), Stacked Auto Encoders (SAE), Restricted Boltzmann Machines (RBMs).
    - **RBM** — mạng 2 lớp (visible/hidden) học phân bố xác suất; khối xây dựng của DBN.
    - **DBN** — xếp chồng nhiều RBM để học đặc trưng phân cấp (pre-training).
    - **SAE** — xếp chồng nhiều autoencoder để học biểu diễn nén sâu.

> 📸 Source: Screenshot 2026-07-04 at 21.57.00.png, Screenshot 2026-07-04 at 21.57.07.png

## Introduction to Perceptrons
- **Perceptron** = an algorithm for **supervised learning of binary classifiers**, invented in **1943**; the machine was built in **1957**.
- The **Mark 1 perceptron** was designed for **image recognition**.
- A perceptron is a **single-neuron model** that was a precursor to larger neural networks.

> 📸 Source: Screenshot 2026-07-04 at 22.01.46.png

## Basic Perceptron Network
- A basic perceptron has an **input layer** and an **output layer**; each layer contains a number of nodes; nodes between layers have established connections that are **weighted**.
- **Number of nodes in input layer** determined by:
  - the number of dimensions of the inputted vectors (eg. a vector with X and Y = 2 input nodes).
  - input layer is just connection points — it does not modify the data.
- **Number of nodes in output layer** determined by:
  - the application of the neural net (eg. Yes/No classification = only one output node, regardless of how many input nodes).
  - output nodes (and other layers) can modify/compute new values based on inputted data.
- Data moving between nodes is multiplied by weights. **Weights are modified during the training process** to produce a better outcome.

> 📸 Source: Screenshot 2026-07-04 at 22.02.57.png

## Activation Functions
- When data arrives at a node that can perform a computation:
  1. All arriving inputted data is **summed**.
  2. Then an **activation function is triggered**.
- The activation function acts as a **gate between nodes** and determines whether output proceeds to the next layer — it determines if a node is active or inactive based on its own output, which could be a range between **0 to 1** or **-1 or 1**.

> 📸 Source: Screenshot 2026-07-04 at 22.03.04.png

## Types of Activation Functions
- **Linear Activation Functions** — can't do backpropagation.
  - **Linear** — just passes along the data.
- **Non-Linear Activation Functions** — can do backpropagation, can stack (have many) layers.
  - **Binary Step** — if greater than threshold then activate.
  - **Sigmoid** — used in binary classification; susceptible to the **vanishing gradient problem**.
  - **Tanh** — modified (scaled) version of Sigmoid; still susceptible to vanishing gradient.
  - **ReLU** — most commonly used activation function; treats any negative value as 0.
  - **Leaky ReLU** — counters the dying ReLU problem with a small slope of negative values.
  - **Parameterised ReLU** — type of Leaky ReLU where the negative slope is a learnable parameter (not fixed at 0.01x like Leaky ReLU).
  - **Exponential Linear Unit (ELU)** — similar to ReLU, no dying ReLU problem, saturates negative large numbers.
  - **Swish** — alternative to ReLU by the Google Brain Team.
  - **Maxout** — used in a maxout layer, chooses output to be the max of the inputs.
  - **Softmax** — converts output to probabilities for multiple classifications.

> 📸 Source: Screenshot 2026-07-04 at 22.03.18.png

## Linear Activation Function
- A Linear function is also known as an **identity function** (f(x) = x).
- Characteristics:
  - Model is not really learning; does not improve upon the error term.
  - **Cannot perform Backpropagation.**
  - **Cannot stack layers** — only ever has one layer.
  - Model will behave as if it's linear — cannot handle complex, non-linear data.
  - **Range (-∞, ∞)** — unbound (infinite).
  - **Derivative is 1** — what you put in is what comes out.

> 📸 Source: Screenshot 2026-07-04 at 22.03.25.png

## Binary Step Activation Function
- Returns either 0 or 1:
  - value 0.0 or less → 0.
  - value greater than 0.0 → 1.
- Characteristics:
  - Can only handle **binary classification** (On/Off, True/False, 0/1).
  - **Range {0,1}** — bound (not infinite).
  - One of the earliest activation functions; **not used much today**.

> 📸 Source: Screenshot 2026-07-04 at 22.03.33.png

## Sigmoid Activation Function
- A Sigmoid is a **Logistic curve** resembling an **S-shape**.
- Characteristics:
  - Can handle **binary and multi-classification** (eg. Cow, Horse, Pig).
  - Can now **stack layers**.
  - **Range (0,1)**.
  - Tends to bring activations to either side of the curve → clear distinctions on prediction.
  - **One of the most widely used functions.**
  - Near the end of the function, Y responds less to X → causes **vanishing gradients** (network refuses to learn further or is drastically slow).
  - Sigmoid is analog — almost all neurons fire (be active) → activation is dense, slower, and costly.

> 📸 Source: Screenshot 2026-07-04 at 22.03.46.png

## Tanh Activation Function
- A Tanh is the same as a Sigmoid function but **scaled (made larger)**.
- Characteristics:
  - Can handle binary and multi-classification.
  - Can now stack layers.
  - **Range (-1,1)**.
  - The gradient is **stronger (steeper curving)** than Sigmoid.
  - Still has the vanishing gradient problem like Sigmoid.
  - Tanh vs Sigmoid depends on use case: Tanh can assist in avoiding bias in gradients and can outperform Sigmoid.

> 📸 Source: Screenshot 2026-07-04 at 22.03.54.png

## ReLU Activation Function
- **Rectified Linear Unit** where the positive axis is linear and the negative axis always returns 0.
- Characteristics:
  - **Range [0, ∞)** — positive axis is unbound (infinite).
  - Sigmoid and Tanh fire almost all neurons → dense, slow, costly. ReLU **sparsely triggers** activations because its negative-axis gradient is zero → less-costly and more-efficient (speedy).
  - **ReLU dying gradient** side effect: with a zero gradient on the negative axis, gradients go towards 0 and get stuck at 0 (nothing to adjust to) → nodes essentially "die".

> 📸 Source: Screenshot 2026-07-04 at 22.04.02.png

## Leaky ReLU Activation Function
- **Leaky Rectified Linear Unit** where the positive axis is linear and the negative axis has a **gentle gradient closer to zero**.
- Similar to ReLU but reduces the effects of the ReLU dying gradient. It is "Leaky" because the negative axis leaks → causes some nodes not to die.
- **Parameterised ReLU** = Leaky ReLU where the negative slope is a learnable parameter (not fixed at 0.01x).
- **ReLU6** = ReLU where the positive axis has an upper limit so it's not infinite (bound to a max value).

> 📸 Source: Screenshot 2026-07-04 at 22.04.12.png

## ELU Activation Function
- **Exponential Linear Unit**: has a slope toward -1 in the negative axis; has a linear gradient in the positive axis.
- Something between a ReLU and a Leaky ReLU.
- ELU sloping towards -1 causes negative values → pushes the mean of the activations closer to zero → faster learning and convergence.
- **Avoids the dying ReLU problem.**
- Saturates for large negative numbers.

> 📸 Source: Screenshot 2026-07-04 at 22.04.17.png

## Swish Activation Function
- **Swish activation**: has a slope that dips and eases out to 0 in the negative axis; has a linear gradient in the positive axis.
- Proposed by the **Google Brain Team** as a replacement for ReLU.
- Called "Swish" because of the swishing dip.
- Looks similar to ReLU but is a **smooth function** — never abruptly changes direction; it is **non-monotonic** (does not remain stable).
- Similar to ReLU it will have sparsity; very negative values will zero out.
- Other variants in the Swish family: **Mish, Hard-Swish, Hard-Mish**.

> 📸 Source: Screenshot 2026-07-04 at 22.04.27.png

## Maxout Activation Function
- Looks at multiple inputs and selects the **maximum value**, returning that value.
- **Generalization** of the ReLU and Leaky ReLU functions.
- A Maxout neuron has all the benefits of a ReLU neuron without having to be a dying ReLU.
- Downside: **expensive** — it doubles the number of parameters for each neuron.

> 📸 Source: Screenshot 2026-07-04 at 22.04.33.png

## Softmax Activation Function
- Calculates the **probabilities of each class over all possible classes**.
- When used for a multi-classification model, it returns the probabilities of each class; the target class will have the highest probability.
- Calculated probabilities are in the range **0 to 1**; the **sum of all probabilities equals 1**.
- Generally used in **multi-classification on the output layer**.
- Can only assign a single label to a probability.

> 📸 Source: Screenshot 2026-07-04 at 22.04.40.png

## What is an Algorithm and Function?
- **Algorithm** = a set of mathematical or computer instructions to perform a specific task. An algorithm **can be composed of several smaller algorithms**. ("How do you do something.")
- Example: **k-Nearest Neighbors (K-NN)** can be used to create a Supervised Classification ML algorithm. ("Tell me who are my closest neighbours and we will infer that I'm of the same class.")
- Within K-NN you can use different **distance metrics** (aka algorithms): eg. Euclidean, Hamming, **Minkowski**, Manhattan.
  - **Euclidean** — khoảng cách đường chim bay (√Σ(a−b)²); mặc định phổ biến nhất.
  - **Manhattan** — tổng |chênh lệch| theo từng trục (đi theo ô bàn cờ); ít nhạy outlier hơn Euclidean.
  - **Minkowski** — dạng tổng quát: p=1 → Manhattan, p=2 → Euclidean.
  - **Hamming** — đếm số vị trí khác nhau; dùng cho dữ liệu categorical/chuỗi nhị phân.
- **Function** = a way of grouping algorithms together so you can call them to compute a result (sounds like an ML model).
- Key point: **K-NN itself is not ML, but when applied to solve an ML problem it becomes an ML Algorithm.**

> 📸 Source: Screenshot 2026-07-04 at 22.04.55.png

## What is an ML Model?
- **Model (general terms)** = an informative representation of an object, person, or system.
  - **Concrete** — has a physical form (eg. a design for a vehicle, a person posing for a painting).
  - **Abstract** — expressed as behavioural patterns (eg. mathematical, computer code, written words).
- **ML Model** = a function that takes in data, performs an ML algorithm, and produces a prediction.
  - The ML model is trained. Not to be confused with the **training model** (which is learning to make correct predictions).
  - An ML model can be the training model that is deployed once it has been **tuned** to make good predictions.
- **Diagram:** Training Data (labeled) → Learning Algorithm (training model, with **Hyper-tuning** loop) → **Deployed** → ML Model (trained model). At inference, Unlabeled Data → ML Model → **[Prediction]**.

> 📸 Source: Screenshot 2026-07-04 at 22.05.10.png

## What is a Feature?
- **Feature** = a characteristic **extracted** from an unstructured dataset that has been **prepared** to be ingested by the ML model to infer a prediction.
- ML models generally only accept **numerical data**, so we prepare data into a machine-readable format by **encoding**.
- **Feature Engineering** = the process of **extracting features** from provided data sources.
- **Diagram:** Data Source 1 & Data Source 2 → **Raw Data** → (Clean and Transform) → **Features** → **ML Model**.

> 📸 Source: Screenshot 2026-07-04 at 22.05.20.png
