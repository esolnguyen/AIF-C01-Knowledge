"""Test fixtures + fakes. No real Azure or Chroma network access occurs."""

from __future__ import annotations

from typing import Any, Iterator

import pytest
from langchain_core.language_models import BaseChatModel
from langchain_core.messages import AIMessage, AIMessageChunk
from langchain_core.outputs import ChatGeneration, ChatGenerationChunk, ChatResult

# Canned answers keyed by which system prompt the node used.
_GENERATE_ANSWER = (
    "Amazon Macie is a data security service that discovers and protects sensitive "
    "data in S3 [1]. Amazon Inspector is a vulnerability scanner for workloads [2]."
)
_CONF_JSON = '{"sufficiency": 0.8, "faithfulness": 0.85, "note": "Well grounded."}'


def _route(messages: list) -> str:
    """Pick a canned response based on the system/human content."""
    text = "\n".join(getattr(m, "content", "") or "" for m in messages)
    if "strict evaluator" in text:  # confidence node
        return _CONF_JSON
    if "Standalone query" in text or "standalone search query" in text:  # rewrite node
        return "difference between Amazon Macie and Amazon Inspector"
    return _GENERATE_ANSWER  # generate node (and anything else)


class FakeChat(BaseChatModel):
    """Deterministic offline chat model that mimics token streaming + usage."""

    @property
    def _llm_type(self) -> str:
        return "fake-chat"

    def _generate(self, messages, stop=None, run_manager=None, **kwargs: Any) -> ChatResult:
        msg = AIMessage(
            content=_route(messages),
            usage_metadata={"input_tokens": 100, "output_tokens": 20, "total_tokens": 120},
        )
        return ChatResult(generations=[ChatGeneration(message=msg)])

    def _stream(self, messages, stop=None, run_manager=None, **kwargs: Any) -> Iterator[ChatGenerationChunk]:
        content = _route(messages)
        tokens = content.split(" ")
        for i, tok in enumerate(tokens):
            piece = tok if i == 0 else " " + tok
            usage = (
                {"input_tokens": 100, "output_tokens": 20, "total_tokens": 120}
                if i == len(tokens) - 1
                else None
            )
            yield ChatGenerationChunk(
                message=AIMessageChunk(content=piece, usage_metadata=usage)
            )


# Canned retrieval hits (two relevant chunks about Macie / Inspector).
_HITS = [
    {
        "doc_id": "part-09#3.0",
        "wiki": "aif-c01",
        "source": "part-09",
        "title": "Part 09 — AWS AI Services, Governance & Data Services",
        "heading": "Amazon Macie",
        "path": "AIF-C01-Knowledge/wiki/parts/part-09.md",
        "page_content": "# Part 09 — AWS AI Services\n## Amazon Macie\n\nMacie discovers and "
        "protects sensitive data in Amazon S3 using machine learning.",
        "score": 0.82,
    },
    {
        "doc_id": "part-09#4.0",
        "wiki": "aif-c01",
        "source": "part-09",
        "title": "Part 09 — AWS AI Services, Governance & Data Services",
        "heading": "Amazon Inspector",
        "path": "AIF-C01-Knowledge/wiki/parts/part-09.md",
        "page_content": "# Part 09 — AWS AI Services\n## Amazon Inspector\n\nInspector is an "
        "automated vulnerability management service that scans workloads.",
        "score": 0.55,
    },
]


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    """Patch Azure + Chroma access with in-memory fakes for every test."""
    from rag_service import azure, store

    fake = FakeChat()
    monkeypatch.setattr(azure, "get_chat_model", lambda: fake)
    monkeypatch.setattr(azure, "get_streaming_chat_model", lambda: fake)
    monkeypatch.setattr(store, "search", lambda wiki, query, k=None: [dict(h) for h in _HITS])
    monkeypatch.setattr(store, "count", lambda wiki_id: 412)

    def fake_get_chunk(wiki_id, doc_id):
        for h in _HITS:
            if h["doc_id"] == doc_id:
                return {
                    "wiki": wiki_id,
                    "doc_id": doc_id,
                    "source": h["source"],
                    "title": h["title"],
                    "heading": h["heading"],
                    "markdown": h["page_content"],
                    "path": h["path"],
                }
        return None

    monkeypatch.setattr(store, "get_chunk", fake_get_chunk)
    yield


@pytest.fixture
def hits() -> list[dict]:
    return [dict(h) for h in _HITS]
