"""FastAPI application implementing the API contract in ``API_CONTRACT.md``.

Endpoints: GET /health, GET /wikis, POST /chat (SSE + non-streaming), GET
/source/{wiki}/{doc_id}, POST /explain. All answers are in English; every error is
returned as ``{"message", "detail"}``.
"""

from __future__ import annotations

import json
import uuid
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from langgraph.checkpoint.memory import MemorySaver
from pydantic import BaseModel, Field

from . import graph as graph_mod
from . import store, tracing
from .config import get_settings, get_wiki, load_wikis
from .cost import UsageCallback

@asynccontextmanager
async def _lifespan(_: FastAPI):
    tracing.configure_env()
    yield


app = FastAPI(title="RAG Service", version="1.0.0", lifespan=_lifespan)

_settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=_settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# One compiled graph + in-memory checkpointer (session memory keyed by session_id).
_CHECKPOINTER = MemorySaver()
_GRAPH = graph_mod.build_graph(checkpointer=_CHECKPOINTER)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class HistoryTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    wiki: str
    message: str
    history: list[HistoryTurn] = Field(default_factory=list)
    session_id: str | None = None
    stream: bool = True


class OptionIn(BaseModel):
    letter: str
    text: str
    correct: bool = False
    chosen: bool = False


class ExplainRequest(BaseModel):
    question: str
    options: list[OptionIn]
    source: str | None = None
    domain: int | None = None
    builtin_explanation: str | None = None
    wiki: str | None = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _err(status: int, message: str, detail: str = "") -> JSONResponse:
    return JSONResponse(status_code=status, content={"message": message, "detail": detail})


def _run_config(
    session_id: str, usage_cb: UsageCallback, collector: object | None, streaming: bool = False
) -> dict:
    return {
        "configurable": {"thread_id": session_id, "streaming": streaming},
        "callbacks": [usage_cb, *tracing.callbacks_for(collector)],
    }


def _final_payload(state: dict, usage_cb: UsageCallback, trace_url: str | None, session_id: str) -> dict:
    model = get_settings().azure_chat_deployment
    return {
        "answer": state.get("answer", ""),
        "citations": state.get("citations", []),
        "confidence": state.get(
            "confidence", {"score": 0.0, "label": "Low", "rationale": "No result."}
        ),
        "usage": usage_cb.usage(model),
        "model": model,
        "trace_url": trace_url,
        "session_id": session_id,
    }


def _inputs(req: ChatRequest) -> dict:
    return {
        "wiki": req.wiki,
        "message": req.message,
        "history": [h.model_dump() for h in req.history],
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
def health() -> dict:
    return {"ok": True, "wikis": [{"id": w.id, "count": store.count(w.id)} for w in load_wikis()]}


@app.get("/wikis")
def wikis() -> list[dict]:
    return [
        {"id": w.id, "name": w.name, "description": w.description, "count": store.count(w.id)}
        for w in load_wikis()
    ]


async def _run_chat(req: ChatRequest, session_id: str) -> dict:
    """Non-streaming: run the full graph and assemble the FinalPayload."""
    wiki = get_wiki(req.wiki)
    usage_cb = UsageCallback()
    with tracing.trace_run(wiki) as collector:
        state = await _GRAPH.ainvoke(_inputs(req), config=_run_config(session_id, usage_cb, collector))
        url = tracing.trace_url(collector)
    return _final_payload(state, usage_cb, url, session_id)


async def _stream_chat(req: ChatRequest, session_id: str) -> AsyncIterator[bytes]:
    """SSE: stream generate-node tokens, then emit the final payload."""
    wiki = get_wiki(req.wiki)
    usage_cb = UsageCallback()
    try:
        with tracing.trace_run(wiki) as collector:
            config = _run_config(session_id, usage_cb, collector, streaming=True)
            async for event in _GRAPH.astream_events(_inputs(req), config=config, version="v2"):
                if event["event"] == "on_chat_model_stream" and graph_mod.GENERATE_TAG in (
                    event.get("tags") or []
                ):
                    chunk = event["data"]["chunk"]
                    delta = getattr(chunk, "content", "") or ""
                    if delta:
                        yield _sse("token", {"delta": delta})
            snap = await _GRAPH.aget_state(config)
            url = tracing.trace_url(collector)
        payload = _final_payload(snap.values, usage_cb, url, session_id)
        yield _sse("done", payload)
    except Exception as exc:  # surface as an SSE error event
        yield _sse("error", {"message": "Chat pipeline failed", "detail": str(exc)})


def _sse(event: str, data: dict) -> bytes:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n".encode("utf-8")


@app.post("/chat")
async def chat(req: ChatRequest):
    if get_wiki(req.wiki) is None:
        return _err(400, f"Unknown wiki '{req.wiki}'", f"Known: {[w.id for w in load_wikis()]}")
    session_id = req.session_id or str(uuid.uuid4())

    if req.stream:
        return StreamingResponse(
            _stream_chat(req, session_id),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )
    try:
        return JSONResponse(await _run_chat(req, session_id))
    except Exception as exc:
        return _err(500, "Chat pipeline failed", str(exc))


@app.get("/source/{wiki}/{doc_id:path}")
def source(wiki: str, doc_id: str):
    if get_wiki(wiki) is None:
        return _err(404, f"Unknown wiki '{wiki}'", "")
    try:
        chunk = store.get_chunk(wiki, doc_id)
    except Exception as exc:
        return _err(500, "Failed to read source", str(exc))
    if not chunk:
        return _err(404, "Source not found", f"doc_id={doc_id}")
    return JSONResponse(chunk)


@app.post("/explain")
async def explain(req: ExplainRequest):
    """Backward-compat exam "Explain (AI)" button, powered by the same graph."""
    wiki = get_wiki(req.wiki) if req.wiki else (load_wikis()[0] if load_wikis() else None)
    if wiki is None:
        return _err(400, "No wiki available for /explain", "Register one in wikis.yaml")

    opts = "\n".join(
        f"{o.letter}. {o.text}"
        + ("  (correct answer)" if o.correct else "")
        + ("  (user chose this)" if o.chosen else "")
        for o in req.options
    )
    message = (
        f"Exam question:\n{req.question}\n\nOptions:\n{opts}\n\n"
        "Explain in English using this format:\n"
        "1. **Correct answer** — state it and briefly why it is right.\n"
        "2. **Why the others are wrong** — address each remaining option.\n"
        "3. **Remember** — 1-2 bullet-point mnemonics.\n"
    )
    if req.builtin_explanation:
        message += f"\nExisting note (may expand on it):\n{req.builtin_explanation}\n"

    chat_req = ChatRequest(wiki=wiki.id, message=message, history=[], stream=False)
    session_id = str(uuid.uuid4())
    try:
        payload = await _run_chat(chat_req, session_id)
    except Exception as exc:
        return _err(500, "Explain pipeline failed", str(exc))

    sources, seen = [], set()
    for c in payload.get("citations", []):
        key = (c["source"], c["heading"])
        if key not in seen:
            seen.add(key)
            sources.append({"source": c["source"], "heading": c["heading"]})
    conf = payload.get("confidence", {})
    return JSONResponse(
        {
            "explanation": payload.get("answer", ""),
            "sources": sources,
            "model": payload.get("model"),
            "confidence": {"score": conf.get("score", 0.0), "label": conf.get("label", "Low")},
        }
    )


@app.exception_handler(Exception)
async def _unhandled(_: Request, exc: Exception):  # pragma: no cover - safety net
    return _err(500, "Internal server error", str(exc))
