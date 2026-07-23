# Explain API (RAG sidecar)

A small backend that powers the **"🤖 Explain (AI)"** feature while working through questions.
It does RAG over the wiki markdown (`../../AIF-C01-Knowledge/wiki`) and calls Azure OpenAI to explain.

## Architecture

```
QuestionView (Explain button)
   → /api/explain  (Vite proxy, vite.config.ts)
      → localhost:8008  (FastAPI, app.py)
         → Chroma local (.chroma)  ← ingest.py embeds the wiki via Azure
         → Azure OpenAI chat (gpt-5.4-mini) generates a Vietnamese-language explanation
```

- **Embedding**: Azure `text-embedding-3-large` → Chroma persistent (`server/.chroma`).
- **Chat**: Azure `gpt-5.4-mini`.
- Credentials borrowed from `quilbyte-rag/.env`, copied to `server/.env` (gitignored).

## Run

```bash
cd server
./run.sh            # first time: create venv, install deps, ingest the wiki, then start the API
```

Then in another terminal run the frontend as usual: `npm run dev`.
The "Explain (AI)" button calls through the `/api` proxy → the Azure key is never exposed to the browser.

## Reload the wiki when content changes

```bash
rm -rf .chroma && ./.venv/bin/python ingest.py
```

## Configuration

Copy `.env.example` → `.env` and fill it in (defaults already point to the `thang-sw-central` resource):

| Variable | Meaning |
|------|---------|
| `AZURE_OPENAI_ENDPOINT` / `AZURE_OPENAI_API_KEY` | Azure OpenAI |
| `AZURE_CHAT_DEPLOYMENT` | chat deployment (gpt-5.4-mini) |
| `AZURE_EMBED_DEPLOYMENT` | embedding deployment (text-embedding-3-large) |

## Endpoints

- `GET /health` → `{ok, chunks}`
- `POST /explain` → `{explanation (markdown), sources[], model}`
