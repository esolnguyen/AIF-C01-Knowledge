# RAG Service

A **wiki-agnostic**, production-grade Retrieval-Augmented Generation backend.

Each knowledge base ("wiki") maps to its own Chroma collection. Adding a new
certificate later is: add a wiki folder + register it in `wikis.yaml` + run
ingestion. **No code changes.**

- **Stack:** Python 3.12, FastAPI, LangChain + **LangGraph**, **LangSmith** tracing.
- **LLM:** Azure OpenAI — chat `gpt-5.4-mini`, embeddings `text-embedding-3-large`
  (via `langchain-openai`).
- **Vector store:** Chroma (persistent, one collection per wiki, cosine space).
- **Default port:** `8009`. The HTTP contract is authoritative in
  [`API_CONTRACT.md`](./API_CONTRACT.md).

## Architecture

```
                        ┌──────────────────────────────────────────────┐
  Frontend (Vite :5173) │                 FastAPI  :8009               │
   /api/* ──proxy──────▶ │  /health  /wikis  /chat(SSE)  /source  /explain │
                        └───────────────┬──────────────────────────────┘
                                        │
                                        ▼
                         ┌───────────────────────────────┐
                         │   LangGraph  StateGraph        │
                         │                                │
                         │  rewrite → retrieve → grade →  │
                         │            generate → confidence
                         └───┬───────────┬───────────┬────┘
                             │           │           │
                   Azure Chat│   Chroma  │   Azure Chat + Embeddings
                  (rewrite,  │ (per-wiki │
                 generate,   │ cosine)   │
                 confidence) │           │
                             ▼           ▼
                  ┌───────────────┐  ┌───────────────┐
                  │ Azure OpenAI  │  │  .chroma/     │
                  │ gpt-5.4-mini  │  │  collections  │
                  │ embed-3-large │  └───────────────┘
                  └───────────────┘
        Cross-cutting: cost.py (token/USD accounting) · tracing.py (LangSmith, env-gated)
```

### Pipeline nodes (`rag_service/graph.py`)

1. **rewrite** — history-aware query condensation (skipped when there is no history).
2. **retrieve** — cosine similarity search (top-k, with scores) scoped to the wiki.
3. **grade** — drop chunks below the relevance threshold; flag a "not grounded" path.
4. **generate** — answer in English, grounded strictly in context, with inline `[n]`
   citation markers. Refuses to fabricate when context is insufficient.
5. **confidence** — explainable score in `[0,1]` (see below).

## Layout

```
rag-service/
├── API_CONTRACT.md          # authoritative HTTP contract
├── wikis.yaml               # knowledge-base registry (add a cert here)
├── rag_service/
│   ├── config.py            # pydantic-settings + wiki registry + PRICING
│   ├── azure.py             # cached AzureChatOpenAI / AzureOpenAIEmbeddings
│   ├── store.py             # Chroma per wiki, similarity search w/ scores
│   ├── ingest.py            # CLI: chunk markdown → embed → Chroma (idempotent)
│   ├── graph.py             # LangGraph pipeline + confidence math
│   ├── cost.py              # token + USD accounting (LangChain callback)
│   ├── tracing.py           # LangSmith setup, env-gated no-op
│   └── app.py               # FastAPI endpoints (SSE + JSON)
├── evals/                   # small English eval harness (local + LangSmith)
├── tests/                   # pytest, Azure/Chroma mocked (no network)
├── requirements.txt · pyproject.toml
├── Dockerfile · docker-compose.yml · run.sh · .env.example
```

## Setup

```bash
cd rag-service
cp .env.example .env          # fill in Azure creds (same as exam-trainer/server/.env)
python3 -m venv .venv
./.venv/bin/pip install -r requirements.txt
```

### Environment

| Variable | Purpose |
| --- | --- |
| `AZURE_OPENAI_ENDPOINT` / `AZURE_OPENAI_API_KEY` | Azure OpenAI resource |
| `AZURE_OPENAI_API_VERSION` | default `2024-12-01-preview` |
| `AZURE_CHAT_DEPLOYMENT` | default `gpt-5.4-mini` |
| `AZURE_EMBED_DEPLOYMENT` | default `text-embedding-3-large` |
| `RAG_PORT` | server port (default `8009`) |
| `RAG_RETRIEVAL_K` / `RAG_GRADE_THRESHOLD` | retrieval tuning |
| `LANGCHAIN_API_KEY` | set to enable LangSmith tracing (else no-op) |

## Ingest

```bash
./.venv/bin/python -m rag_service.ingest --wiki aif-c01   # one wiki
./.venv/bin/python -m rag_service.ingest --all            # every registered wiki
```

Ingestion chunks markdown by H2 heading (keeping the H1 title as context),
hard-wraps long sections (~1800 chars), embeds in batches, and **resets** the
collection first so it is idempotent.

## Run

```bash
./run.sh                     # venv + install + ingest-if-empty + uvicorn --reload
# or:
./.venv/bin/uvicorn rag_service.app:app --host 0.0.0.0 --port 8009 --reload
```

Smoke test:

```bash
curl -s localhost:8009/health | jq
curl -s localhost:8009/chat -H 'content-type: application/json' \
  -d '{"wiki":"aif-c01","message":"Difference between Macie and Inspector?","stream":false}' | jq
```

## Test

```bash
./.venv/bin/python -m pytest        # all Azure/Chroma calls are mocked (no network)
```

## Evals

```bash
./.venv/bin/python -m evals.run_evals             # local groundedness scoring
./.venv/bin/python -m evals.run_evals --langsmith  # log an experiment if a key is set
```

## Deploy (Docker)

Build context is the **repo root** (the image needs the wiki content):

```bash
docker compose -f rag-service/docker-compose.yml up --build
```

The container ingests all wikis on first boot (the `.chroma` volume persists it),
then serves on `8009`.

## Confidence score

`confidence.score ∈ [0,1]` is a weighted, **explainable** combination (weights in
`config.py`, default `0.50 / 0.25 / 0.25`):

- **retrieval grounding (0.50)** — mean cosine relevance of the chunks actually cited.
- **LLM self-assessment (0.25)** — the model rates how sufficient the context is.
- **faithfulness (0.25)** — a check that the answer is supported by the context.

Labels: `< 0.5 → Low`, `< 0.75 → Medium`, else `High`. The `rationale` string reports
each signal so the badge is auditable. If nothing passes the relevance threshold,
the pipeline returns a low-confidence "not in knowledge base" answer.

## Cost tracking

`cost.py` attaches a LangChain callback (`UsageCallback`) that sums prompt/completion
tokens across every LLM call in a request. `compute_cost` multiplies by the `PRICING`
map in `config.py` (USD per 1K tokens). The result appears in every response `usage`
block (`prompt_tokens`, `completion_tokens`, `total_tokens`, `cost_usd`) and is
attached to the LangSmith run when tracing is on.

> **Tuning:** the `PRICING` rates are placeholders modelled on comparable list prices.
> Update them in `config.py` to match your Azure contract before trusting `cost_usd`.

## LangSmith setup

Set `LANGCHAIN_API_KEY` in `.env`. Tracing then auto-enables
(`LANGCHAIN_TRACING_V2=true`) with a **per-wiki project** taken from
`wikis.yaml` (`langsmith_project`). When the response includes a `trace_url`, it links
to the run. With no key set, `tracing.py` is a complete no-op — the service behaves
identically without LangSmith.

## Adding a new certificate / wiki

1. Add the content, e.g. `SAA-C03-Knowledge/wiki/parts/*.md` (H1 title, H2 sections).
2. Append an entry to `wikis.yaml`:

   ```yaml
     - id: saa-c03
       name: "AWS Solutions Architect Associate (SAA-C03)"
       description: "..."
       path: "SAA-C03-Knowledge/wiki"
       include_dirs: ["parts"]
       collection: "saa_c03_wiki"
       langsmith_project: "rag-saa-c03"
   ```

3. Ingest: `python -m rag_service.ingest --wiki saa-c03`.

That is all — every endpoint (`/wikis`, `/chat`, `/source`, `/explain`) works for the
new wiki with **no code changes**.
