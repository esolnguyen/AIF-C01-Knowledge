"""rag_service — a wiki-agnostic, production-grade RAG backend.

Each knowledge base ("wiki") maps to its own Chroma collection. Adding a new
certificate later is: add a wiki folder + register it in ``wikis.yaml`` + run
ingestion. No code changes required.
"""

__version__ = "1.0.0"
