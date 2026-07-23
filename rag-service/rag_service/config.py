"""Central configuration.

Loads runtime settings from environment / ``.env`` (via pydantic-settings) and the
knowledge-base registry from ``wikis.yaml``. Nothing here is specific to any single
certificate — all wiki-specific data lives in ``wikis.yaml``.
"""

from __future__ import annotations

import functools
from pathlib import Path

import yaml
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
# config.py lives at:  <repo>/rag-service/rag_service/config.py
#   parents[0] = rag_service/   parents[1] = rag-service/   parents[2] = <repo root>
_PKG_DIR = Path(__file__).resolve().parent
SERVICE_DIR = _PKG_DIR.parent
REPO_ROOT = SERVICE_DIR.parent
WIKIS_YAML = SERVICE_DIR / "wikis.yaml"


# ---------------------------------------------------------------------------
# Pricing (USD per 1,000 tokens).
#
# NOTE: these are PLACEHOLDER rates modelled on comparable public list prices.
# Adjust them to match your Azure OpenAI contract / region before relying on the
# ``cost_usd`` figures for billing. Completion price is ignored for embeddings.
# ---------------------------------------------------------------------------
PRICING: dict[str, dict[str, float]] = {
    "gpt-5.4-mini": {"prompt": 0.00015, "completion": 0.00060},
    "text-embedding-3-large": {"prompt": 0.00013, "completion": 0.0},
}


class Wiki(BaseModel):
    """One knowledge base, as declared in ``wikis.yaml``."""

    id: str
    name: str
    description: str = ""
    path: str  # repo-relative root of the wiki content (e.g. "AIF-C01-Knowledge/wiki")
    include_dirs: list[str] = Field(default_factory=lambda: ["parts"])
    collection: str  # Chroma collection name
    langsmith_project: str | None = None

    def source_dirs(self) -> list[Path]:
        """Absolute directories to scan for ``*.md`` during ingestion."""
        base = REPO_ROOT / self.path
        return [base / d for d in self.include_dirs]

    def repo_rel_path(self, source_dir: Path, filename: str) -> str:
        """Repo-relative path for a source file, used in citation metadata."""
        return str((source_dir / filename).relative_to(REPO_ROOT))


class Settings(BaseSettings):
    """Runtime settings. Environment variables (or ``.env``) override defaults."""

    model_config = SettingsConfigDict(
        env_file=SERVICE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- Azure OpenAI ---------------------------------------------------
    azure_openai_endpoint: str = Field("", alias="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: str = Field("", alias="AZURE_OPENAI_API_KEY")
    azure_openai_api_version: str = Field("2024-12-01-preview", alias="AZURE_OPENAI_API_VERSION")
    azure_chat_deployment: str = Field("gpt-5.4-mini", alias="AZURE_CHAT_DEPLOYMENT")
    azure_embed_deployment: str = Field("text-embedding-3-large", alias="AZURE_EMBED_DEPLOYMENT")

    # --- Server ---------------------------------------------------------
    port: int = Field(8009, alias="RAG_PORT")
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"]
    )

    # --- Retrieval / chunking ------------------------------------------
    retrieval_k: int = Field(6, alias="RAG_RETRIEVAL_K")
    grade_threshold: float = Field(0.30, alias="RAG_GRADE_THRESHOLD")
    max_chunk_chars: int = Field(1800, alias="RAG_MAX_CHUNK_CHARS")
    embed_batch_size: int = Field(64, alias="RAG_EMBED_BATCH_SIZE")

    # --- LLM client -----------------------------------------------------
    request_timeout: float = Field(60.0, alias="RAG_REQUEST_TIMEOUT")
    max_retries: int = Field(2, alias="RAG_MAX_RETRIES")

    # --- Confidence weights (must sum to 1.0) ---------------------------
    conf_w_retrieval: float = 0.50
    conf_w_self: float = 0.25
    conf_w_faithfulness: float = 0.25

    # --- LangSmith / tracing -------------------------------------------
    langchain_api_key: str = Field("", alias="LANGCHAIN_API_KEY")
    langsmith_api_key: str = Field("", alias="LANGSMITH_API_KEY")
    langchain_project: str = Field("", alias="LANGCHAIN_PROJECT")
    langchain_endpoint: str = Field(
        "https://api.smith.langchain.com", alias="LANGCHAIN_ENDPOINT"
    )

    # --- Storage --------------------------------------------------------
    chroma_dir: str = Field("", alias="RAG_CHROMA_DIR")

    @property
    def chroma_path(self) -> Path:
        return Path(self.chroma_dir) if self.chroma_dir else (SERVICE_DIR / ".chroma")

    @property
    def tracing_api_key(self) -> str:
        return self.langchain_api_key or self.langsmith_api_key

    @property
    def tracing_enabled(self) -> bool:
        return bool(self.tracing_api_key)

    def pricing_for(self, model: str) -> dict[str, float]:
        return PRICING.get(model, {"prompt": 0.0, "completion": 0.0})


@functools.lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


@functools.lru_cache(maxsize=1)
def load_wikis() -> list[Wiki]:
    """Parse ``wikis.yaml`` into a list of :class:`Wiki` models."""
    if not WIKIS_YAML.exists():
        return []
    data = yaml.safe_load(WIKIS_YAML.read_text(encoding="utf-8")) or {}
    return [Wiki(**w) for w in data.get("wikis", [])]


def get_wiki(wiki_id: str) -> Wiki | None:
    return next((w for w in load_wikis() if w.id == wiki_id), None)
