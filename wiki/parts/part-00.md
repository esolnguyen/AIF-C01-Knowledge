# Part 00 — Fundamentals of AI/ML (AIF-C01)

## Regression
- **Regression** = process of finding a function to **correlate a labeled dataset into a continuous variable/number**.
- Outcome: predict a variable in the future (eg. "What will the temperature be next week? → 20°C").
- How it works: vectors (dots) are plotted on a graph in multiple dimensions eg (X,Y); a **regression line** is drawn through the dataset.
- The **distance** of a vector (dot) from the regression line is called an **Error**.
- Different regression algorithms use the error to predict future variables:
  - **Mean Squared Error (MSE)**
    - Mean of (error)²; penalizes large errors heavily → very sensitive to outliers; units are squared (hard to interpret).
  - **Root Mean Squared Error (RMSE)**
    - Square root of MSE; same units as the target variable → easy to interpret; still sensitive to outliers.
  - **Mean Absolute Error (MAE)**
    - Mean of |error|; more robust to outliers than MSE/RMSE; keeps the original units.
    > 🎯 Exam: many outliers → choose MAE; want to penalize large errors heavily → MSE/RMSE.
- Regression is a **Supervised Learning** task (labeled data).

> 📸 Source: Screenshot 2026-07-04 at 21.36.10.png

## Classification
- **Classification** = process of finding a function to **divide a labeled dataset into classes/categories**.
- Outcome: predict a category to apply to the inputted data (eg. "Will it rain next Saturday? → Sunny, Rainy").
- A **classification line** divides the dataset (data on one side = Sunny, the other = Rainy).
- **Classification Algorithms:**
  - Logistic Regression
    - Uses sigmoid to output probabilities; linear & easy to interpret; a baseline for binary classification.
  - Decision Tree / Random Forest
    - Tree: splits data by if/else rules, easy to understand but prone to overfitting. Random Forest: ensemble of many trees (bagging) → more accurate & stable.
  - Neural Networks
    - Many weighted nodes/layers; can learn complex non-linear relationships; needs lots of data & compute.
  - Naive Bayes
    - Based on Bayes' theorem, assumes features are independent; fast, suited to text/spam classification.
  - K-Nearest Neighbors (K-NN)
    - Classifies by the K nearest points (majority vote); a lazy learner, no real "training"; sensitive to scale & K.
- Classification is a **Supervised Learning** task.

> 📸 Source: Screenshot 2026-07-04 at 21.37.22.png

## Clustering
- **Clustering** = process of **grouping unlabeled data based on similarities and differences**.
- Outcome: group data based on their similarities or differences.
- Example: recommend a Windows Computer to one cluster, a Mac Computer to another cluster.
- **Clustering Algorithms:**
  - K-means
    - Splits data into K clusters around a centroid (mean point); fast & popular; must pick K in advance, sensitive to outliers.
  - K-medoids
    - Like K-means but the cluster center is a real data point (medoid); more robust to outliers than K-means.
  - Density Based
    - Groups by point density (eg. DBSCAN); finds the number of clusters automatically, detects noise & clusters of any shape.
  - Hierarchical
    - Builds a nested tree of clusters (dendrogram) without pre-choosing K; intuitive but slow on large data.
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
    - **Bagging** — train many models in parallel on bootstrap samples then average/vote; reduces variance (fights overfitting). Eg. Random Forest.
    - **Boosting** — train sequentially, each model corrects the previous model's errors; reduces bias → high accuracy. Eg. XGBoost, AdaBoost.
    - **Stacking** — combine multiple different model types via a meta-model that learns how to "blend" the predictions.
  - **Neural Networks and Deep Learning** (when data is complicated and/or features are unclear): CNN, RNN, GAN, MultiLayer Perceptron (MLP), Auto Encoders.
    - **CNN** (Convolutional) — uses convolutional filters to capture spatial features; the standard for images/computer vision.
    - **RNN** (Recurrent) — has loops/memory, processes sequential data (text, time-series, audio).
    - **GAN** (Generative Adversarial) — generator vs discriminator "compete" against each other; generates realistic fake data (images, deepfakes).
    - **MLP** (MultiLayer Perceptron) — a basic fully-connected feed-forward network; suited to tabular data.
    - **Auto Encoders** — compress (encode) then reconstruct (decode) data; unsupervised, used for dimensionality reduction & anomaly detection.

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
    - **Support Vector Machines (SVM)** — finds a hyperplane separating the classes with the largest margin; strong on high-dimensional data.
    - **Kernel SVM** — SVM using the "kernel trick" to separate non-linear data by mapping it to a higher-dimensional space.
- **Regression** = process of finding a function to correlate a dataset into a continuous variable/number (eg. "What is the temperature going to be tomorrow?").
  - **Regression Algorithms:** Simple Linear Regression, Multiple Linear Regression, Polynomial Regression, Support Vector Regression, Decision Tree Regression, Random Forest Regression.
    - **Simple Linear Regression** — 1 input variable → a straight line y = ax + b.
    - **Multiple Linear Regression** — many input variables; multi-dimensional linear relationship.
    - **Polynomial Regression** — adds exponents to fit a curve (non-linear relationship).
    - **Support Vector Regression (SVR)** — applies the SVM idea to regression, predicting within a tolerance margin.

> 📸 Source: Screenshot 2026-07-04 at 21.56.31.png

## Unsupervised Learning Models (Clustering, Association, Dimensionality Reduction)
- **Clustering** = grouping unlabeled data based on similarities and differences.
  - **Clustering Algorithms:** K-Means, DBScan, K-Modes.
    - **K-Means** — clusters around a centroid, need to pick K in advance; suited to numeric data.
    - **DBScan** — clusters by density, finds the number of clusters automatically & detects noise/outliers.
    - **K-Modes** — a K-Means variant for categorical data (uses mode instead of mean).
- **Association** = finding a relationship between variables through association (eg. "If someone buys bread, suggest butter" — most frequently bought items).
  - **Association Algorithms:** Apriori, Euclat, FP-Growth.
    - **Apriori** — finds frequent itemsets step by step; classic but slow (scans the data many times).
    - **Euclat** — uses a vertical representation (vertical/tidset) → set intersection faster than Apriori.
    - **FP-Growth** — compresses data into an FP-tree, generates no candidates → much faster than Apriori.
- **Dimensionality Reduction** = reducing the amount of data while retaining data integrity; often used as a pre-processing stage.
  - **Dimensionality Reduction Algorithms:** Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA), Generalized Discriminant Analysis (GDA), Singular Value Decomposition (SVD), Latent Dirichlet Allocation (LDA), Latent Semantic Analysis (LSA, pLSA, GLSA), t-SNE.
    - **PCA** — projects data onto the axes retaining the most variance; unsupervised, the most common.
    - **Linear Discriminant Analysis (LDA)** — supervised dimensionality reduction, maximizes separation between classes (uses labels).
    - **SVD** — matrix decomposition, the foundation for PCA & recommender systems; compresses data.
    - **Latent Dirichlet Allocation (LDA)** — topic modeling for text; don't confuse with Linear Discriminant Analysis despite the same acronym.
    - **LSA/pLSA** — extracts latent topics in text via a term-document matrix.
    - **t-SNE** — non-linear dimensionality reduction to visualize clusters in 2D/3D; for visualization only, not used as a feature.
    > 🎯 Exam: "LDA" has two meanings — Linear Discriminant Analysis (dimensionality reduction/classification) vs Latent Dirichlet Allocation (NLP topic modeling).

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
    - **FNN** — fully-connected network, data only moves forward; suited to tabular data.
    - **RNN** — has memory/loops for sequential data (text, time-series).
    - **CNN** — convolutional filters capture spatial features; the standard for images.
  - **Unsupervised:** Deep Belief Networks (DBN), Stacked Auto Encoders (SAE), Restricted Boltzmann Machines (RBMs).
    - **RBM** — a 2-layer network (visible/hidden) that learns a probability distribution; the building block of a DBN.
    - **DBN** — stacks multiple RBMs to learn hierarchical features (pre-training).
    - **SAE** — stacks multiple autoencoders to learn a deep compressed representation.

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
  - **Euclidean** — straight-line distance (√Σ(a−b)²); the most common default.
  - **Manhattan** — sum of |differences| per axis (grid/city-block movement); less sensitive to outliers than Euclidean.
  - **Minkowski** — the general form: p=1 → Manhattan, p=2 → Euclidean.
  - **Hamming** — counts the number of differing positions; used for categorical data/binary strings.
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
