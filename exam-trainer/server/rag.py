"""Shared RAG plumbing: Azure OpenAI clients + Chroma collection.

Both embeddings and chat go through Azure OpenAI (credentials borrowed from quilbyte-rag).
The vector store is a local persistent Chroma instance — no separate server required.
"""

from __future__ import annotations

import os
from functools import lru_cache

import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from dotenv import load_dotenv
from openai import AzureOpenAI

# Load server/.env next to this file (independent of CWD).
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

CHROMA_DIR = os.path.join(os.path.dirname(__file__), ".chroma")
COLLECTION = "aif_wiki"

# --- Azure config (see .env.example) ---------------------------------------
AZURE_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
AZURE_API_KEY = os.environ["AZURE_OPENAI_API_KEY"]
AZURE_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
CHAT_DEPLOYMENT = os.environ.get("AZURE_CHAT_DEPLOYMENT", "gpt-5.4-mini")
EMBED_DEPLOYMENT = os.environ.get("AZURE_EMBED_DEPLOYMENT", "text-embedding-3-large")


@lru_cache(maxsize=1)
def get_client() -> AzureOpenAI:
    return AzureOpenAI(
        azure_endpoint=AZURE_ENDPOINT,
        api_key=AZURE_API_KEY,
        api_version=AZURE_API_VERSION,
    )


class AzureEmbeddingFunction(EmbeddingFunction):
    """Chroma embedding function backed by Azure OpenAI embeddings."""

    def __init__(self, deployment: str = EMBED_DEPLOYMENT) -> None:
        self.deployment = deployment

    @staticmethod
    def name() -> str:
        return "azure_openai"

    def __call__(self, input: Documents) -> Embeddings:  # noqa: A002 (chroma API name)
        client = get_client()
        # Azure embeddings accept a batch list[str].
        resp = client.embeddings.create(model=self.deployment, input=list(input))
        return [d.embedding for d in resp.data]


@lru_cache(maxsize=1)
def get_collection():
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    return client.get_or_create_collection(
        name=COLLECTION,
        embedding_function=AzureEmbeddingFunction(),
        metadata={"hnsw:space": "cosine"},
    )
