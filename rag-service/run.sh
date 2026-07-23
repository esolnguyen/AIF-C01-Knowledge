#!/usr/bin/env bash
# Create venv, install deps, ingest if the store is empty, then serve on :8009.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${RAG_PORT:-8009}"

if [ ! -d .venv ]; then
  echo "Creating virtualenv..."
  python3 -m venv .venv
  ./.venv/bin/pip install -q -U pip
  ./.venv/bin/pip install -q -r requirements.txt
fi

if [ ! -f .env ]; then
  echo "WARNING: .env not found. Copy .env.example to .env and fill in Azure creds." >&2
fi

# Ingest the default wiki if the Chroma store has not been built yet.
if [ ! -d .chroma ]; then
  echo "Chroma store missing — ingesting all wikis..."
  ./.venv/bin/python -m rag_service.ingest --all
fi

echo "RAG service -> http://localhost:${PORT}  (health: /health)"
exec ./.venv/bin/uvicorn rag_service.app:app --host 0.0.0.0 --port "${PORT}" --reload
