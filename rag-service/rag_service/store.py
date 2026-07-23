"""Chroma vector store, one persistent collection per wiki.

Collections are created lazily from ``wikis.yaml`` and use cosine space. All
retrieval flows through :func:`search`, which returns plain dicts (decoupling the
graph from LangChain ``Document`` objects) carrying the full citation metadata.
"""

from __future__ import annotations

import functools
import os

# Silence Chroma's anonymized product telemetry (noisy and unnecessary here).
os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")

from langchain_chroma import Chroma

from . import azure
from .config import Wiki, get_settings, get_wiki


class WikiNotFoundError(KeyError):
    """Raised when a wiki id is not present in ``wikis.yaml``."""


def _resolve(wiki: str | Wiki) -> Wiki:
    if isinstance(wiki, Wiki):
        return wiki
    w = get_wiki(wiki)
    if w is None:
        raise WikiNotFoundError(wiki)
    return w


@functools.lru_cache(maxsize=32)
def get_vectorstore(wiki_id: str) -> Chroma:
    """Return (creating if needed) the Chroma store for a wiki."""
    w = _resolve(wiki_id)
    s = get_settings()
    return Chroma(
        collection_name=w.collection,
        embedding_function=azure.get_embeddings(),
        persist_directory=str(s.chroma_path),
        collection_metadata={"hnsw:space": "cosine"},
    )


def count(wiki_id: str) -> int:
    """Number of chunks currently stored for a wiki (0 if not yet ingested)."""
    try:
        return get_vectorstore(wiki_id)._collection.count()
    except Exception:
        return 0


def _hit(doc, score: float) -> dict:
    m = doc.metadata or {}
    return {
        "doc_id": m.get("doc_id"),
        "wiki": m.get("wiki"),
        "source": m.get("source"),
        "title": m.get("title", ""),
        "heading": m.get("heading", ""),
        "path": m.get("path", ""),
        "page_content": doc.page_content,
        "score": round(float(score), 4),
    }


def search(wiki_id: str, query: str, k: int | None = None) -> list[dict]:
    """Similarity search scoped to one wiki, returning hits WITH relevance scores.

    Scores are cosine relevance in ``[0, 1]`` (higher = more similar).
    """
    s = get_settings()
    k = k or s.retrieval_k
    vs = get_vectorstore(wiki_id)
    pairs = vs.similarity_search_with_relevance_scores(query, k=k)
    return [_hit(doc, score) for doc, score in pairs]


def get_chunk(wiki_id: str, doc_id: str) -> dict | None:
    """Fetch a single stored chunk by its ``doc_id`` (for the /source endpoint)."""
    vs = get_vectorstore(wiki_id)
    res = vs._collection.get(ids=[doc_id], include=["documents", "metadatas"])
    ids = res.get("ids") or []
    if not ids:
        return None
    meta = (res.get("metadatas") or [{}])[0] or {}
    markdown = (res.get("documents") or [""])[0] or ""
    return {
        "wiki": meta.get("wiki", wiki_id),
        "doc_id": doc_id,
        "source": meta.get("source", ""),
        "title": meta.get("title", ""),
        "heading": meta.get("heading", ""),
        "markdown": markdown,
        "path": meta.get("path", ""),
    }


def reset_caches() -> None:
    get_vectorstore.cache_clear()
