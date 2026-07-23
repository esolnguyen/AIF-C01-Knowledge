"""Token + cost accounting.

A LangChain callback (:class:`UsageCallback`) captures prompt/completion tokens
across every LLM call in a single request; :func:`compute_cost` turns those into a
USD figure using the ``PRICING`` map in ``config``.
"""

from __future__ import annotations

from typing import Any

from langchain_core.callbacks import BaseCallbackHandler

from .config import get_settings


def compute_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    """USD cost for a chat completion, rounded to 6 dp."""
    rates = get_settings().pricing_for(model)
    cost = (prompt_tokens / 1000.0) * rates["prompt"] + (
        completion_tokens / 1000.0
    ) * rates["completion"]
    return round(cost, 6)


def embedding_cost(tokens: int, model: str) -> float:
    rates = get_settings().pricing_for(model)
    return round((tokens / 1000.0) * rates["prompt"], 6)


class UsageCallback(BaseCallbackHandler):
    """Accumulate token usage across all chat-model calls in one request."""

    def __init__(self) -> None:
        self.prompt_tokens = 0
        self.completion_tokens = 0

    # ``on_llm_end`` fires for chat models too; usage is attached either as
    # ``usage_metadata`` on the message or as ``token_usage`` in ``llm_output``.
    def on_llm_end(self, response: Any, **kwargs: Any) -> None:  # noqa: ANN401
        for gen_list in getattr(response, "generations", []) or []:
            for gen in gen_list:
                msg = getattr(gen, "message", None)
                usage = getattr(msg, "usage_metadata", None) if msg is not None else None
                if usage:
                    self.prompt_tokens += int(usage.get("input_tokens", 0) or 0)
                    self.completion_tokens += int(usage.get("output_tokens", 0) or 0)
                    return
        llm_output = getattr(response, "llm_output", None) or {}
        tu = llm_output.get("token_usage") or llm_output.get("usage") or {}
        if tu:
            self.prompt_tokens += int(tu.get("prompt_tokens", 0) or 0)
            self.completion_tokens += int(tu.get("completion_tokens", 0) or 0)

    @property
    def total_tokens(self) -> int:
        return self.prompt_tokens + self.completion_tokens

    def usage(self, model: str) -> dict:
        """Assemble the ``usage`` block used in API responses / LangSmith metadata."""
        return {
            "prompt_tokens": self.prompt_tokens,
            "completion_tokens": self.completion_tokens,
            "total_tokens": self.total_tokens,
            "cost_usd": compute_cost(model, self.prompt_tokens, self.completion_tokens),
        }
