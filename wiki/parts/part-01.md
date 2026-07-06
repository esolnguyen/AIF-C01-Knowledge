# Part 01 — AI/ML Fundamentals, Data Concepts, and GenAI Building Blocks

## What is Inference?
- **Inference** = the act of requesting and getting a prediction.
- In ML, inference is when you:
  1. Input **data**
  2. Into a **Machine Learning Model** that has been deployed for production use
  3. To **output a prediction**.
- Example: image of a banana → ML model ("tell me what this is") → output `Class: Yellow Banana, Confidence: 0.9`.
- Textbook definition: inference = steps in reasoning, moving from premises to logical consequences.

> 📸 Source: Screenshot 2026-07-04 at 22.05.28.png — Domain: D1

## Parameters and Hyperparameters
- **Model Parameter**: a variable that configures the **internal** state of a model; its value **can be estimated / learned**.
  - Not manually set — it is learned and output after training.
  - Parameters are used to make predictions.
- **Model Hyperparameter**: a variable that is **external** to the model; its value **cannot be estimated** (learned).
  - Manually set **before** training.
  - Used to help estimate the model's parameters.
  - Examples: `learning_rate`, `epochs`, `batch_size`.

> 📸 Source: Screenshot 2026-07-04 at 22.05.47.png — Domain: D1

## AWS AI Service Cards
- **AI Service Cards** provide transparency and document the intended use cases and fairness considerations for AWS AI services.
- A single place to find: intended use cases, responsible AI design choices, best practices, and performance for a set of AI service use cases.
- Part of AWS Responsible AI resources (aws.amazon.com/ai/responsible-ai/resources/).

> 📸 Source: Screenshot 2026-07-04 at 22.06.07.png — Domain: D4

## What is Labeling?
- **Data Labeling** = the process of identifying raw data (images, text files, videos, etc.) and adding one or more meaningful, informative labels to provide context so an ML model can learn.
- With **supervised** ML, labeling is a prerequisite to produce training data; each piece of data is generally labeled by a **human**.
- With **unsupervised** ML, labels are produced by the machine and may not be human readable.
- Task types example (SageMaker Ground Truth): Image classification, Bounding box.
- **Ground truth** = a properly labeled dataset used as the objective standard to train and assess a model. Model accuracy depends on the accuracy of your ground truth.

> 📸 Source: Screenshot 2026-07-04 at 22.06.20.png — Domain: D1

## What is Data Mining?
- **Data Mining** = the extraction of **patterns and knowledge** from large amounts of data (NOT the extraction of the data itself).
- **CRISP-DM** (Cross-Industry Standard Process for Data Mining) defines 6 phases:
  1. **Business understanding** — what does the business need?
  2. **Data understanding** — what data do we have / need?
  3. **Data preparation** — how do we organize data for modeling?
  4. **Modeling** — which modeling techniques to apply?
  5. **Evaluation** — which model best meets the business objective?
  6. **Deployment** — how do people access the data?

> 📸 Source: Screenshot 2026-07-04 at 22.06.29.png — Domain: D1

## Data Mining Methods
- Data mining methods/techniques = a way to find **valid patterns and relationships** in huge data sets:
  - **Classification** — classify data into different classes.
  - **Clustering** — divide information into groups of connected objects.
  - **Regression** — identify/analyze the relationship between variables.
  - **Sequential** — evaluate sequential data to discover sequential patterns.
  - **Association Rules** — discover a link between two or more items; find hidden patterns. Common constraints (math formulas):
    - **Support** — how frequently the itemset appears in the dataset.
    - **Confidence** — how often the rule has been found true.
    - **Lift** — importance compared to other items.
    - **Conviction** — strength of the rule from statistical independence.
  > 🎯 Exam: "Market basket analysis" (customers who buy X also buy Y) = Association Rules; classic recommendation-engine use case.
  - **Outlier Detection** — items that don't match an expected pattern/behavior.
  - **Prediction** — combines other techniques (trends, clustering, classification) to predict future data.

> 📸 Source: Screenshot 2026-07-04 at 22.06.35.png — Domain: D1

## Knowledge Mining
- **Knowledge mining** = a discipline in AI that uses a combination of intelligent services to quickly learn from vast amounts of information.
- Lets organizations understand/explore information, uncover hidden insights, and find relationships/patterns at scale.
- Three-stage workflow:
  - **Ingest** — content from a range of sources via connectors to first/third-party data stores. Structured (Databases, CSV) and Unstructured (PDF, Video, Image, Audio).
  - **Enrich** — content with AI capabilities to extract info and find patterns. Managed AI Services: Vision, Language, Speech, Decision, Search.
  - **Explore** — newly indexed data via search, bots, business apps, and visualizations. Enrich structured data: CRM, RAP Systems, Power BI.

> 📸 Source: Screenshot 2026-07-04 at 22.06.52.png — Domain: D1

## What is Data Wrangling?
- **Data Wrangling** = the process of transforming and mapping data from one "raw" data form into another format to make it more appropriate/valuable for downstream purposes such as analytics. Also called **data munging**.
- **6 core steps**:
  1. **Discovery** — understand what your data is about; keep domain-specific details in mind.
  2. **Structuring** — organize content into a structure easier to work with.
  3. **Cleaning** — remove outliers, change null values, remove duplicates/special characters, standardize formatting.
  4. **Enriching** — append/enhance data with relevant context from additional sources.
  5. **Validating** — authenticate reliability, quality, and safety of the data.
  6. **Publishing** — place data in a datastore for downstream use.

> 📸 Source: Screenshot 2026-07-04 at 22.07.57.png — Domain: D1

## What is Data Modeling?
- **Data Model** = an abstract model that organizes elements of data and standardizes how they relate to one another and to properties of real-world entities (e.g., a relational database with many tables).
- **Data modeling** = a process used to define and analyze data requirements needed to support business processes within information systems.
- A data model could be:
  - **Conceptual** — how data is represented at the organization level abstractly (e.g., People, Orders, Projects, Relationships). Includes Entities/Subtypes, Attributes, Relationships, Integrity Rules.
  - **Logical** — how data is presented in software (e.g., tables & columns, object-oriented classes).
  - **Physical** — how data is physically stored (e.g., partitions, CPUs, tablespaces; Tables, Columns, Keys/Indices, Triggers).

> 📸 Source: Screenshot 2026-07-04 at 22.08.06.png, Screenshot 2026-07-04 at 22.08.25.png — Domain: D1

## Data Analytics
- **Data Analytics** = examining, transforming, and arranging data so you can extract and study useful information.
- A data analyst commonly uses **SQL, Business Intelligence (BI) tools, and Spreadsheets**.
- Data Analytics Workflow: Data Ingestion → Data Cleaning and Transformation → Dimensionality Reduction → Data Analysis → Visualization.

> 📸 Source: Screenshot 2026-07-04 at 22.09.00.png — Domain: D1

## What is a Data Scientist?
- A **Data Scientist** has **multi-disciplinary skills** in math, statistics, predictive modeling, and machine learning.
- Venn diagram of three overlapping skill areas (Data Scientist at the intersection):
  - **Computer Science** — ML models are algorithms, so a CompSci background is useful. Python is the most popular language; performant models can require low-level language knowledge.
  - **Math and Statistics** — classical ML relies heavily on statistics.
  - **Domain Knowledge** — deep understanding of the industry you build models for; sourcing, cleaning, preparing, analyzing data is a must.
- The definition/responsibility varies per company, but a data scientist generally has strong specialization in one of the three skills.

> 📸 Source: Screenshot 2026-07-04 at 22.09.21.png — Domain: D1

## Data Role Comparisons
- **Data Mining** — get knowledge about a particular data set and use it for learning/processing.
- **Data Wrangling** — convert/map data from raw form to another format to make it more valuable for advanced tasks (Data Analytics, ML).
- **Data Analysis** — use existing information to uncover actionable data; answer questions for better business decisions.
- **Data Scientist** — multi-disciplinary skills (math, statistics, predictive modeling, ML) to make future predictions.
- **Data Engineer** — focused on infrastructure and architecture for data generation and movement; deploying ML models at scale / in distributed architecture.

> 📸 Source: Screenshot 2026-07-04 at 22.09.30.png — Domain: D1

## Train vs Test vs Validation Dataset
- **Training Dataset** — data used to train the model; the model **sees and learns** from it.
- **Validation Dataset** — data used to evaluate the model; the model **sees but does NOT learn** from it. Used to **fine-tune** the model's hyperparameters.
- **Test Dataset** — provides an unbiased evaluation of the final model after training; carefully sampled to test the broadest amount of real-world data; generally not used for training or validation.

> 📸 Source: Screenshot 2026-07-04 at 22.09.44.png — Domain: D1

## Corpus and Corpus Linguistics
- **Corpus** (text corpus) = a large collection of naturally occurring text that is structured for analysis.
  - Can range from ~50,000 words to tens of millions of words.
  - Sourced from books, newspapers, magazines, transcripts, webpages.
  - Intended to be analyzed to see how a language is being used (e.g., building dictionaries, academic textbooks from lecture transcripts).
- **Corpus Linguistics** (the study of language) uses corpuses to perform: statistical analysis, hypothesis testing, checking occurrences, validating linguistic rules — all within a **specific language territory**.
  - Looks for **patterns** associated with **lexical** and **grammatical** features (e.g., most frequent word, how words are used, idiomatic expression frequency, formal-situation words).

> 📸 Source: Screenshot 2026-07-04 at 22.09.54.png, Screenshot 2026-07-04 at 22.10.26.png — Domain: D1

## What is a Data Type?
- A **data type** is a particular kind of data item that serves a specific purpose so operations can be performed on it. Important ML data types:
- **Qualitative** — measured by the **quality** of something:
  - **Categorical** — values are **labels**:
    - **Discrete** — countable and finite; only certain values possible.
      - **Binary** — only two possible options. Ex: yes/no, true/false, spam/not-spam.
      - **Nominal** — labels where order does NOT matter. Ex: colors, country names, gender.
      - **Ordinal** — labels where order matters. Ex: low/medium/high, star ratings, education level.
- **Quantitative** — measured by the **quantity** of something:
  - **Numerical** — values are **numbers**:
    - **Continuous** — not countable, infinite; many possible values / measurements.
      - **Interval** — a continuous value that has **no true zero** (zero is arbitrary, ratios meaningless). Ex: temperature in °C, calendar years.
      - **Ratio** — a continuous value that **includes a true zero** (ratios meaningful, e.g. "twice as much"). Ex: height, weight, age, income.
  > 🎯 Exam: Ordinal vs Nominal = does order matter? Interval vs Ratio = is zero meaningful (a true absence)?

> 📸 Source: Screenshot 2026-07-04 at 22.10.39.png — Domain: D1

## AI vs Generative AI
- **Artificial Intelligence (AI)** = computer systems that perform tasks typically requiring human intelligence: problem-solving, decision-making, understanding natural language, recognizing speech/images.
  - Goal: interpret, analyze, and respond to human actions — to **simulate** human intelligence in machines.
  - **Simulate** = mimic aspects / resemble behaviour; **Emulate** = replicate exact processes and mechanisms.
  - Applications: expert systems, NLP, speech recognition, robotics. Industries: B2C chatbots, e-commerce recommendation systems, autonomous vehicles, medical diagnosis.
- **Generative AI (GenAI)** = a subset of AI focused on creating new content or data that is novel and realistic; it can interpret/analyze data but also **generates new data itself** (text, images, music, speech, other media).
  - Techniques: **Generative Adversarial Networks (GANs)**, **Variational Autoencoders (VAEs)**, **Transformer models (e.g., GPT)**.
    - **GANs** — two networks compete: a **generator** creates fakes, a **discriminator** tries to spot them; adversarial training yields highly realistic images/deepfakes.
    - **VAEs** — encode data into a compressed **probabilistic latent space** then decode/sample from it; good for generating variations and smooth interpolation.
    - **Transformers** — use **self-attention** to process whole sequences in parallel; the architecture behind modern LLMs (GPT) and most text GenAI.
  - Modalities: Vision (images/videos), Text (human-like text), Audio (music), Molecular (drug discovery via genomic data).
  - **Large Language Models (LLMs)** generate human-like text and are a subset of GenAI (often conflated with AI due to popularity).
- **AI vs GenAI comparison:**
  - **Functionality**: AI focuses on understanding & decision-making; GenAI is about creating new, original outputs.
  - **Data Handling**: AI analyzes/decides based on existing data; GenAI uses existing data to generate new, unseen outputs.
  - **Applications**: AI spans data analysis, automation, NLP, healthcare; GenAI is creative/innovative — content creation, synthetic data generation, deepfakes, design.

> 📸 Source: Screenshot 2026-07-04 at 22.10.48.png, Screenshot 2026-07-04 at 22.11.01.png, Screenshot 2026-07-04 at 22.11.07.png — Domain: D2

## What is a Foundational Model?
- **Foundational Model (FM)** = a general-purpose model trained on vast amounts of data.
- An FM is **pretrained** because it can be **fine-tuned** for specific tasks.
- Trained on data (Text, Images, Videos, Structured Data) → FM → used for: Prediction, Classification, Text Generation, Video Generation, Image Generation, Audio Generation.
- **LLMs** are a specialized subset of FMs that use **transformer architecture**.
  > 🎯 Exam: FM = broad, multi-modal, general-purpose base model; LLM = an FM specialized for text. All LLMs are FMs, not all FMs are LLMs. On AWS, FMs are accessed via **Amazon Bedrock**.

> 📸 Source: Screenshot 2026-07-04 at 22.11.15.png — Domain: D2

## What is a Large Language Model (LLM)?
- An **LLM** is a Foundational Model that **implements the transformer architecture**.
- Flow: Natural Language → Input (Prompt) → LLM → Predict (Inference) → Output (Word/Token), with Refinement/Feedback loop.
- During training, the model learns **semantics (patterns)** of language: grammar, word usage, sentence structure, style, and tone.
- Simplistically, an LLM predicts the next sequence of words, but researchers don't fully know how LLMs generate their outputs.

> 📸 Source: Screenshot 2026-07-04 at 22.11.27.png — Domain: D2

## Transformer Architecture
- **Transformer Architecture** was developed by researchers at **Google**; effective at NLP due to **multi-head attention** and **positional encoding**.
- Consists of **two parts**:
  1. **Encoder** — reads and understands the input text; goes through everything it's been taught and picks up meanings of words and how they're used in different contexts.
  2. **Decoder** — based on what the encoder learned, generates new pieces of text; like a skilled writer producing sentences that flow and make sense.
- Diagram components: Embeddings/Projections, Positional Encoding, Norm, Multi-Headed Self-Attention, Masked Multi-Headed Self-Attention, Multi-Headed Cross-Attention, Feed-Forward Network, Linear, Predictions; repeated Nx "Layers".
  - **Embeddings/Projections** — turn tokens into numeric vectors the model can process.
  - **Positional Encoding** — inject word-order info (see section below) since attention has no inherent sense of sequence.
  - **Norm (Layer Normalization)** — stabilizes/scales activations so training stays stable across deep stacks.
  - **Masked Multi-Headed Self-Attention** — in the decoder, hides future tokens so prediction of the next word can't "cheat" by seeing ahead.
  - **Multi-Headed Cross-Attention** — lets the decoder attend to the encoder's output (links input↔output, e.g. translation).
  - **Feed-Forward Network (FFN)** — per-position dense layer that transforms each token's representation after attention.
  - **Linear + Softmax → Predictions** — final layer maps vectors to vocabulary logits; Softmax turns them into next-token probabilities.
  - **Nx Layers** — the encoder/decoder blocks are stacked N times; more layers = more capacity.
  > 🎯 Exam: encoder-only = BERT (understanding/classification); decoder-only = GPT (generation); encoder-decoder = T5 (translation/summarization).

> 📸 Source: Screenshot 2026-07-04 at 22.11.41.png — Domain: D2

## Tokenization
- **Tokenization** = the process of breaking data input (text) into smaller parts (tokens).
- Each token is mapped to a **unique ID** in the model's vocabulary (e.g., "Hello" → 15496).
- Tokenization Algorithms:
  - **Byte Pair Encoding (BPE)** — used by GPT-3. Iteratively merges the most frequent character/byte pairs into subword tokens; handles rare/unknown words by splitting them into pieces.
  - **WordPiece** — used by BERT. Similar subword merging to BPE but chooses merges that maximize training-data likelihood; marks continuation pieces (e.g. `##ing`).
  - **SentencePiece** — used by Google T5 and Llama. Treats text as a raw stream (spaces included), so it's language-agnostic and needs no pre-tokenization/whitespace splitting.
  - Common thread: all are **subword** tokenizers — a middle ground between whole-word (huge vocab, unknown-word problem) and per-character (tiny vocab, long sequences).
- When working with LLMs, input text must be tokenized into a sequence of tokens that **match the model's internal vocabulary**.
- When an LLM is trained it creates an internal vocabulary of tokens, typically **30,000 to 100,000 tokens**.

> 📸 Source: Screenshot 2026-07-04 at 22.11.51.png — Domain: D2

## Tokens and Capacity
- With transformers, the decoder continuously feeds the sequence of tokens back in as output to help predict the next word (e.g., "The quick" → "The quick brown" → "...fox" → "...jumps" → "...over").
- **Memory**: each token in a sequence requires memory; as token count increases, memory increases and eventually becomes exhausted.
- **Compute**: the model performs more operations per additional token; longer sequences require more compute.
- AI services offering **Models-as-a-Service** often have a limit on **combined input and output** (tokens).
  - This combined limit is the **context window** — the max tokens a model can consider at once; larger windows cost more memory/compute and usually more money.
  > 🎯 Exam: pricing for hosted LLMs (e.g. Bedrock) is typically **per-token** (input + output), so longer prompts/answers = higher cost. ~1 token ≈ 0.75 English words.

> 📸 Source: Screenshot 2026-07-04 at 22.12.01.png — Domain: D2

## What are Embeddings?
- **Vector** = an arrow with a length and a direction.
- **Vector Space Model** = represents text documents (or other data) as vectors in a high-dimensional space.
- **Embeddings** = vectors of data used by ML models to **find relationships between data**. ML models can also create embeddings.
- Different embedding algorithms capture different kinds of relationships.
- Think of embeddings as **external memory** for an ML model's task; embeddings can be **shared across models** (multi-model pattern) to coordinate a task between models.

> 📸 Source: Screenshot 2026-07-04 at 22.12.19.png — Domain: D2

## Positional Encoding
- **Positional encoding** = a technique used to preserve the **order of words** when processing natural language.
- Transformers need positional encoders because they do **not process data sequentially** and would otherwise lose order understanding when analyzing large bodies of text.
- Adds a **positional vector** to each word to keep track of word positions (e.g., "I(0) heard(1) a(2) dog(3) bark(4) loudly(5) at(6) a(7) cat(8)").
- Applied after Tokenization + Embedding, before the series of transformer blocks (Attention → Feedforward → Softmax output).

> 📸 Source: Screenshot 2026-07-04 at 22.12.29.png — Domain: D2

## Attention
- **Attention** figures out how each word (or token) in a sequence is important to other words within that sequence by assigning the words weights.
- **Self-Attention** — computes attention weights within the same input sequence, where each element attends to all other elements. Feeds back its own sequence. Used in transformers to model relationships in sequences (e.g., words in a sentence).
- **Cross-Attention** — computes attention weights between two different sequences, allowing one sequence to attend to another. Feeds sequence inputs from two different sources. Used in tasks like translation where the output sequence (decoder) needs to focus on the input sequence (encoder).
- **Multi-head Attention** — combines multiple self-attention (or cross-attention) heads in parallel, each focusing on different aspects of the input; receives multiple inputs. Used in transformers to improve performance and capture various dependencies simultaneously.
  > 🎯 Exam: attention is the key innovation that lets transformers weigh long-range word relationships and process a sequence **in parallel** (vs RNNs which are sequential) — the reason transformers scale so well.

> 📸 Source: Screenshot 2026-07-04 at 22.12.38.png, Screenshot 2026-07-04 at 22.12.50.png — Domain: D2
