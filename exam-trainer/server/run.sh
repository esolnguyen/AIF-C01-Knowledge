#!/usr/bin/env bash
# Run the explain API. First run: create venv, install deps, ingest wiki.
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d .venv ]; then
  python3 -m venv .venv
  ./.venv/bin/pip install -q -U pip
  ./.venv/bin/pip install -q -r requirements.txt
fi

# Ingest if there is no Chroma index yet.
if [ ! -d .chroma ]; then
  echo "Ingesting wiki → Chroma..."
  ./.venv/bin/python ingest.py
fi

echo "Explain API → http://localhost:8008 (health: /health)"
exec ./.venv/bin/uvicorn app:app --host 127.0.0.1 --port 8008 --reload
