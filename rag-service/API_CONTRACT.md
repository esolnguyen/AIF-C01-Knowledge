# RAG Service — API Contract (v1)

This is the **single source of truth** shared between the backend (`rag-service/`) and the
frontend (`exam-trainer/src`). Both must conform to it exactly. All text in English.

## Overview

`rag-service` is a **wiki-agnostic**, production-grade Retrieval-Augmented Generation service.
Each knowledge base ("wiki") maps to its own Chroma collection. Adding a new certificate later =
add a wiki folder + register it in `wikis.yaml` + run ingestion. No code changes.

- Language: Python 3.12, FastAPI, LangChain + LangGraph, LangSmith tracing.
- LLM: **Azure OpenAI** — chat `gpt-5.4-mini`, embeddings `text-embedding-3-large` (reuse creds
  from `exam-trainer/server/.env`; copy to `rag-service/.env`).
- Vector store: Chroma (persistent, one collection per wiki, `hnsw:space=cosine`).
- Default port: **8009**. Frontend reaches it via the Vite proxy at `/api`.

## HTTP Endpoints

### `GET /health`
→ `200 { "ok": true, "wikis": [ { "id": "aif-c01", "count": 412 } ] }`

### `GET /wikis`
List available knowledge bases (from `wikis.yaml`, with live chunk counts).
→ `200 [ { "id": "aif-c01", "name": "AWS AI Practitioner (AIF-C01)", "description": "...", "count": 412 } ]`

### `POST /chat`
Conversational RAG. Supports Server-Sent Events (SSE) streaming and a non-streaming fallback.

Request body:
```json
{
  "wiki": "aif-c01",
  "message": "What is the difference between Macie and Inspector?",
  "history": [ { "role": "user", "content": "..." }, { "role": "assistant", "content": "..." } ],
  "session_id": "optional-uuid",
  "stream": true
}
```

**Streaming (`stream: true`, default):** `Content-Type: text/event-stream`. Events:
- `event: token`  `data: {"delta": "partial text"}`  (many)
- `event: done`   `data: <FinalPayload>`  (once, at end)
- `event: error`  `data: {"message": "..."}`  (on failure)

**Non-streaming (`stream: false`):** `200 <FinalPayload>` as a single JSON body.

**FinalPayload** (identical in both modes):
```json
{
  "answer": "Markdown answer with inline citation markers like [1], [2].",
  "citations": [
    {
      "n": 1,
      "wiki": "aif-c01",
      "doc_id": "part-09#3.0",
      "source": "part-09",
      "title": "Part 09 — ...",
      "heading": "Amazon Macie",
      "snippet": "First ~240 chars of the cited chunk...",
      "score": 0.82
    }
  ],
  "confidence": { "score": 0.86, "label": "High", "rationale": "Strong grounding; 3 relevant chunks." },
  "usage": { "prompt_tokens": 1203, "completion_tokens": 240, "total_tokens": 1443, "cost_usd": 0.00072 },
  "model": "gpt-5.4-mini",
  "trace_url": "https://smith.langchain.com/... (null if LangSmith disabled)",
  "session_id": "uuid"
}
```

- `confidence.score` ∈ [0,1]; `label` ∈ {"Low","Medium","High"}. Computed from retrieval grounding
  (similarity of used chunks) + an LLM self-assessment + answer/context faithfulness. Must be explainable
  via `rationale`.
- `citations[].n` matches the `[n]` markers in `answer`. Only include chunks actually used.

### `GET /source/{wiki}/{doc_id}`
Return the full markdown of a cited chunk/section so the UI can **open the reference** in a drawer.
`doc_id` is URL-encoded (it contains `#`). 
→ `200 { "wiki": "aif-c01", "doc_id": "part-09#3.0", "source": "part-09", "title": "...", "heading": "Amazon Macie", "markdown": "## Amazon Macie\n\n...", "path": "AIF-C01-Knowledge/wiki/parts/part-09.md" }`
→ `404` if not found.

### `POST /explain` (backward-compat for the exam "Explain (AI)" button)
Keeps the existing exam-trainer feature working, now powered by the LangGraph pipeline.
Request (unchanged from current app):
```json
{ "question": "...", "options": [ {"letter":"A","text":"...","correct":true,"chosen":false} ],
  "source": "part-00", "domain": 1, "builtin_explanation": "..." }
```
→ `200 { "explanation": "markdown", "sources": [ {"source":"part-00","heading":"Clustering"} ],
         "model": "gpt-5.4-mini", "confidence": { "score": 0.9, "label": "High" } }`
Answer must be in **English**.

## Frontend integration notes
- Vite proxy `/api` → `http://localhost:8009` (strip `/api` prefix), so:
  - `POST /api/chat`, `GET /api/wikis`, `GET /api/source/...`, `POST /api/explain`.
- Chat screen streams via SSE (`EventSource` cannot POST — use `fetch` + `ReadableStream` reader).
- Citations render as clickable chips `[n]`; clicking opens a drawer that fetches `/api/source/{wiki}/{doc_id}`
  and renders the markdown (reuse `marked`). Also offer a "View in Docs" deep link by `source`.
- Show the confidence badge (color by label) and, in a collapsible dev panel, token usage + cost + trace link.

## Errors
All errors: `{ "message": "...", "detail": "..." }` with appropriate 4xx/5xx. Frontend shows `message`.
