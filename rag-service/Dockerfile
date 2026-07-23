FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first for better layer caching.
COPY requirements.txt ./
RUN pip install -U pip && pip install -r requirements.txt

# The service needs the wiki content, which lives one level up in the repo.
# Build context should be the repo root; see docker-compose.yml.
COPY rag-service/ ./rag-service/
COPY AIF-C01-Knowledge/ ./AIF-C01-Knowledge/

WORKDIR /app/rag-service
ENV RAG_CHROMA_DIR=/app/rag-service/.chroma

EXPOSE 8009

# Ingestion is expected to have run (mounted .chroma) or is triggered on first boot.
CMD ["uvicorn", "rag_service.app:app", "--host", "0.0.0.0", "--port", "8009"]
