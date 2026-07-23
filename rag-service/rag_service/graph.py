"""The RAG pipeline as a LangGraph ``StateGraph``.

Nodes: rewrite -> retrieve -> grade -> generate -> confidence.

  * rewrite     history-aware query condensation (skipped when there is no history)
  * retrieve    cosine similarity search (top-k, with scores) scoped to one wiki
  * grade       drop chunks below the relevance threshold; flag "not grounded"
  * generate    answer in English, grounded in context, with inline [n] citations
  * confidence  explainable score in [0,1]: retrieval grounding + LLM self-assessment
                + answer/context faithfulness

The generate node's model is tagged ``GENERATE_TAG`` so the SSE layer can stream
only its tokens (and not the rewrite/confidence model chatter).
"""

from __future__ import annotations

import json
import re
from typing import Any, TypedDict

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig

from . import azure, store
from .config import get_settings

GENERATE_TAG = "generate_llm"

# Marker like [1] or [2]; used to detect which chunks the answer actually cites.
_CITE_RE = re.compile(r"\[(\d{1,2})\]")

NOT_GROUNDED_MSG = (
    "I could not find this in the knowledge base. The retrieved sections do not "
    "cover your question, so I cannot answer it reliably from the available material."
)


class RagState(TypedDict, total=False):
    # inputs
    wiki: str
    message: str
    history: list[dict]
    # pipeline
    query: str
    retrieved: list[dict]
    graded: list[dict]
    grounded: bool
    answer: str
    citations: list[dict]
    confidence: dict


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _is_streaming(config: RunnableConfig | None) -> bool:
    return bool((config or {}).get("configurable", {}).get("streaming"))


async def _complete(messages: list, config: RunnableConfig | None, tags: list[str] | None = None,
                    run_name: str | None = None) -> str:
    """Run a chat completion, streaming when the request is an SSE stream.

    On the streaming path we use a model with ``stream_options.include_usage`` so
    token usage is still reported; otherwise a plain non-streaming call is made
    (which would reject ``stream_options``). Callbacks propagate automatically from
    the surrounding LangGraph run context, so we do not forward ``config`` here.
    """
    if _is_streaming(config):
        model = azure.get_streaming_chat_model()
        if tags:
            model = model.with_config(tags=tags, run_name=run_name or "generate")
        chunk = None
        async for piece in model.astream(messages):
            chunk = piece if chunk is None else chunk + piece
        return (getattr(chunk, "content", "") or "") if chunk is not None else ""

    model = azure.get_chat_model()
    if tags:
        model = model.with_config(tags=tags, run_name=run_name or "generate")
    resp = await model.ainvoke(messages)
    return resp.content or ""


def _chunk_body(page_content: str) -> str:
    """Strip the embedded ``# title`` / ``## heading`` lines to get the raw body."""
    lines = page_content.splitlines()
    body = [ln for ln in lines if not (ln.startswith("# ") or ln.startswith("## "))]
    return "\n".join(body).strip()


def _snippet(page_content: str, n: int = 240) -> str:
    body = _chunk_body(page_content) or page_content.strip()
    body = " ".join(body.split())
    return body[:n]


def _parse_json_object(text: str) -> dict:
    """Extract the first JSON object from an LLM response, tolerant of code fences."""
    if not text:
        return {}
    fenced = re.search(r"\{.*\}", text, re.DOTALL)
    if not fenced:
        return {}
    try:
        return json.loads(fenced.group(0))
    except Exception:
        return {}


def label_for(score: float) -> str:
    if score < 0.5:
        return "Low"
    if score < 0.75:
        return "Medium"
    return "High"


def compute_confidence(retrieval_scores: list[float], self_score: float, faithfulness: float) -> dict:
    """Combine the three signals into an explainable confidence dict.

    * retrieval grounding = mean relevance of the chunks actually used
    * self_score          = LLM self-assessment of context sufficiency [0,1]
    * faithfulness        = LLM check that the answer is supported by context [0,1]
    """
    s = get_settings()
    grounding = sum(retrieval_scores) / len(retrieval_scores) if retrieval_scores else 0.0
    grounding = max(0.0, min(1.0, grounding))
    self_score = max(0.0, min(1.0, self_score))
    faithfulness = max(0.0, min(1.0, faithfulness))

    score = (
        s.conf_w_retrieval * grounding
        + s.conf_w_self * self_score
        + s.conf_w_faithfulness * faithfulness
    )
    score = round(max(0.0, min(1.0, score)), 3)
    rationale = (
        f"{len(retrieval_scores)} grounded chunk(s); "
        f"retrieval grounding {grounding:.2f}, self-assessment {self_score:.2f}, "
        f"faithfulness {faithfulness:.2f}."
    )
    return {"score": score, "label": label_for(score), "rationale": rationale}


# ---------------------------------------------------------------------------
# Nodes
# ---------------------------------------------------------------------------
async def rewrite_node(state: RagState, config: RunnableConfig | None = None) -> dict:
    """Condense conversation + latest message into a standalone search query."""
    message = state["message"]
    history = state.get("history") or []
    if not history:
        return {"query": message}

    convo = "\n".join(f"{m.get('role', 'user')}: {m.get('content', '')}" for m in history[-6:])
    prompt = (
        "Given the conversation and a follow-up message, rewrite the follow-up as a "
        "standalone search query in English. Return ONLY the query text.\n\n"
        f"Conversation:\n{convo}\n\nFollow-up: {message}\n\nStandalone query:"
    )
    text = await _complete([HumanMessage(content=prompt)], config)
    query = text.strip() or message
    return {"query": query}


def retrieve_node(state: RagState) -> dict:
    query = state.get("query") or state["message"]
    hits = store.search(state["wiki"], query)
    return {"retrieved": hits}


def grade_node(state: RagState) -> dict:
    """Keep chunks at/above the relevance threshold; flag whether anything grounds."""
    s = get_settings()
    retrieved = state.get("retrieved") or []
    graded = [h for h in retrieved if h["score"] >= s.grade_threshold]
    # Fallback: if the threshold filtered everything but we did retrieve something,
    # keep the single best hit so the model can still attempt (low-confidence) grounding.
    if not graded and retrieved:
        best = max(retrieved, key=lambda h: h["score"])
        graded = [best] if best["score"] >= (s.grade_threshold * 0.6) else []
    return {"graded": graded, "grounded": bool(graded)}


def _context_block(graded: list[dict]) -> str:
    blocks = []
    for i, h in enumerate(graded, start=1):
        blocks.append(
            f"[{i}] (source={h['source']} · {h['heading']})\n{_chunk_body(h['page_content'])}"
        )
    return "\n\n---\n\n".join(blocks)


GENERATE_SYSTEM = (
    "You are a precise study assistant answering strictly from the provided wiki "
    "context. Rules:\n"
    "1. Answer in English, in clear Markdown.\n"
    "2. Ground every claim in the numbered context. Add inline citation markers "
    "like [1], [2] immediately after the sentence they support; the number is the "
    "context block index.\n"
    "3. Do NOT invent facts. If the context is insufficient, say so explicitly "
    "instead of guessing.\n"
    "4. Be concise and exam-focused."
)


async def generate_node(state: RagState, config: RunnableConfig | None = None) -> dict:
    graded = state.get("graded") or []
    if not state.get("grounded") or not graded:
        return {"answer": NOT_GROUNDED_MSG, "citations": []}

    context = _context_block(graded)
    user = (
        f"QUESTION:\n{state['message']}\n\n"
        f"CONTEXT (numbered):\n{context}\n\n"
        "Answer the question using only this context, with [n] citations."
    )
    answer = await _complete(
        [SystemMessage(content=GENERATE_SYSTEM), HumanMessage(content=user)],
        config,
        tags=[GENERATE_TAG],
        run_name="generate",
    )
    citations = build_citations(answer, graded)
    return {"answer": answer, "citations": citations}


def build_citations(answer: str, graded: list[dict]) -> list[dict]:
    """Map the [n] markers present in the answer back to their chunks.

    Only chunks actually cited are returned. If the model produced an answer but no
    markers, fall back to the top graded chunk so the UI still has a reference.
    """
    used = sorted({int(n) for n in _CITE_RE.findall(answer) if 1 <= int(n) <= len(graded)})
    if not used and graded:
        used = [1]
    citations = []
    for n in used:
        h = graded[n - 1]
        citations.append(
            {
                "n": n,
                "wiki": h["wiki"],
                "doc_id": h["doc_id"],
                "source": h["source"],
                "title": h["title"],
                "heading": h["heading"],
                "snippet": _snippet(h["page_content"]),
                "score": h["score"],
            }
        )
    return citations


CONF_SYSTEM = (
    "You are a strict evaluator. Given a question, retrieved context, and a proposed "
    "answer, assess two things on a 0.0-1.0 scale and reply with ONLY a JSON object:\n"
    '{"sufficiency": <how well the context supports answering the question>, '
    '"faithfulness": <how fully the answer is supported by the context, no fabrication>, '
    '"note": "<one short sentence>"}'
)


async def confidence_node(state: RagState, config: RunnableConfig | None = None) -> dict:
    graded = state.get("graded") or []
    citations = state.get("citations") or []
    if not state.get("grounded") or not graded:
        return {
            "confidence": {
                "score": 0.1,
                "label": "Low",
                "rationale": "No context passed the relevance threshold; answer not grounded.",
            }
        }

    # Retrieval grounding is measured on the chunks actually cited (fallback: all graded).
    cited_ids = {c["doc_id"] for c in citations}
    used = [h for h in graded if h["doc_id"] in cited_ids] or graded
    retrieval_scores = [h["score"] for h in used]

    context = _context_block(graded)
    user = (
        f"QUESTION:\n{state['message']}\n\nCONTEXT:\n{context}\n\n"
        f"PROPOSED ANSWER:\n{state.get('answer', '')}\n\nReturn the JSON assessment."
    )
    self_score, faithfulness = 0.5, 0.5
    try:
        text = await _complete(
            [SystemMessage(content=CONF_SYSTEM), HumanMessage(content=user)], config
        )
        data = _parse_json_object(text)
        self_score = float(data.get("sufficiency", self_score))
        faithfulness = float(data.get("faithfulness", faithfulness))
    except Exception:
        pass  # fall back to neutral self-assessment; retrieval grounding still counts

    return {"confidence": compute_confidence(retrieval_scores, self_score, faithfulness)}


# ---------------------------------------------------------------------------
# Graph assembly
# ---------------------------------------------------------------------------
def build_graph(checkpointer: Any | None = None):
    from langgraph.graph import END, START, StateGraph

    g = StateGraph(RagState)
    g.add_node("rewrite", rewrite_node)
    g.add_node("retrieve", retrieve_node)
    g.add_node("grade", grade_node)
    g.add_node("generate", generate_node)
    g.add_node("assess_confidence", confidence_node)

    g.add_edge(START, "rewrite")
    g.add_edge("rewrite", "retrieve")
    g.add_edge("retrieve", "grade")
    g.add_edge("grade", "generate")
    g.add_edge("generate", "assess_confidence")
    g.add_edge("assess_confidence", END)

    return g.compile(checkpointer=checkpointer)
