"""LangSmith tracing — env-gated, safe no-op when disabled.

If a LangSmith/LangChain API key is present, tracing is turned on (with a per-wiki
project name from ``wikis.yaml``) and we try to surface the run's trace URL. If no
key is configured, everything degrades to a no-op so the service runs identically
without LangSmith.
"""

from __future__ import annotations

import contextlib
import os
from typing import Iterator

from .config import Wiki, get_settings


def tracing_enabled() -> bool:
    return get_settings().tracing_enabled


def configure_env() -> None:
    """Export the environment variables LangChain reads for tracing.

    Called once at startup. When no key is set, we explicitly disable tracing so a
    stray ``LANGCHAIN_TRACING_V2=true`` in the shell cannot force partial tracing.
    """
    s = get_settings()
    if not s.tracing_enabled:
        os.environ["LANGCHAIN_TRACING_V2"] = "false"
        return
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ["LANGCHAIN_API_KEY"] = s.tracing_api_key
    os.environ["LANGCHAIN_ENDPOINT"] = s.langchain_endpoint


def project_for(wiki: Wiki | None) -> str:
    s = get_settings()
    if wiki and wiki.langsmith_project:
        return wiki.langsmith_project
    return s.langchain_project or "rag-service"


@contextlib.contextmanager
def trace_run(wiki: Wiki | None) -> Iterator[object]:
    """Context manager yielding a run collector (or ``None`` when tracing is off).

    Usage::

        with trace_run(wiki) as collector:
            result = await graph.ainvoke(..., config={"callbacks": cbs})
        url = trace_url(collector)
    """
    if not tracing_enabled():
        yield None
        return

    try:
        from langchain_core.tracers.context import tracing_v2_enabled
        from langchain_core.tracers.run_collector import RunCollectorCallbackHandler
    except Exception:  # pragma: no cover - defensive
        yield None
        return

    collector = RunCollectorCallbackHandler()
    with tracing_v2_enabled(project_name=project_for(wiki)):
        yield collector


def trace_url(collector: object | None) -> str | None:
    """Best-effort trace URL for the collected root run; ``None`` if unavailable."""
    if collector is None:
        return None
    try:
        runs = getattr(collector, "traced_runs", None)
        if not runs:
            return None
        run = runs[0]
        from langsmith import Client

        return Client().get_run_url(run=run)
    except Exception:  # pragma: no cover - tracing must never break the request
        return None


def callbacks_for(collector: object | None) -> list:
    """Return the callback list to attach a collector to a run (empty if off)."""
    return [collector] if collector is not None else []
