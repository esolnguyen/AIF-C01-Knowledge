"""FastAPI sidecar: POST /explain → RAG explains AIF-C01 questions.

The frontend calls this through the Vite proxy (/api/explain). The Azure key is never exposed to the browser.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag import CHAT_DEPLOYMENT, get_client, get_collection

app = FastAPI(title="AIF-C01 Explain API")

# Allow direct calls from vite dev (in case the proxy isn't used).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    builtin_explanation: str | None = None  # pre-existing static explanation (for the model to cross-check, if desired)


class Source(BaseModel):
    source: str
    heading: str


class ExplainResponse(BaseModel):
    explanation: str
    sources: list[Source]
    model: str


SYSTEM = (
    "You are a tutor helping students prepare for the AWS Certified AI Practitioner (AIF-C01) exam, "
    "explaining answers in English, accurately and closely following the provided material.\n"
    "Required answer format (markdown):\n"
    "1. **Correct answer**: state the correct answer(s) and explain BRIEFLY why they are correct.\n"
    "2. **Why the other options are wrong**: address EACH remaining option and explain why it is incorrect.\n"
    "3. **Key takeaway**: 1-2 bullet points with the core tip/concept to remember.\n"
    "Base your answer ONLY on the wiki CONTEXT below and accurate AWS knowledge. "
    "If the context is insufficient, say so clearly and explain using general knowledge, without fabricating figures.\n"
    "Respond ENTIRELY in English (technical terms may stay in their original form); "
    "never insert characters from another language (e.g., Cyrillic characters)."
)


def retrieve(req: ExplainRequest, k: int = 6):
    col = get_collection()
    query = req.question + "\n" + "\n".join(o.text for o in req.options)

    hits: dict[str, dict] = {}

    # Prioritize chunks with the same `source` as the question (maps directly to the wiki file).
    if req.source and req.source != "curated":
        r = col.query(query_texts=[query], n_results=4, where={"source": req.source})
        _collect(hits, r)
    # Add a global retrieval pass so relevant context isn't missed.
    r = col.query(query_texts=[query], n_results=k)
    _collect(hits, r)

    return list(hits.values())[: k + 2]


def _collect(hits: dict, r) -> None:
    if not r.get("ids") or not r["ids"][0]:
        return
    for cid, doc, meta in zip(r["ids"][0], r["documents"][0], r["metadatas"][0]):
        hits.setdefault(cid, {"doc": doc, "meta": meta})


@app.get("/health")
def health():
    try:
        return {"ok": True, "chunks": get_collection().count()}
    except Exception as e:  # pragma: no cover
        return {"ok": False, "error": str(e)}


@app.post("/explain", response_model=ExplainResponse)
def explain(req: ExplainRequest) -> ExplainResponse:
    chunks = retrieve(req)
    context = "\n\n---\n\n".join(
        f"[{c['meta']['source']} · {c['meta']['heading']}]\n{c['doc']}" for c in chunks
    )

    opts_txt = "\n".join(
        f"{o.letter}. {o.text}"
        + ("  ✅(correct answer)" if o.correct else "")
        + ("  👤(user's choice)" if o.chosen else "")
        for o in req.options
    )

    user = (
        f"QUESTION:\n{req.question}\n\n"
        f"OPTIONS:\n{opts_txt}\n\n"
        f"CONTEXT FROM WIKI:\n{context}\n\n"
    )
    if req.builtin_explanation:
        user += f"EXISTING NOTES (for reference, feel free to expand):\n{req.builtin_explanation}\n\n"
    user += "Please explain this question following the required format."

    resp = get_client().chat.completions.create(
        model=CHAT_DEPLOYMENT,
        messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": user}],
        max_completion_tokens=1200,
    )

    sources = []
    seen = set()
    for c in chunks:
        key = (c["meta"]["source"], c["meta"]["heading"])
        if key not in seen:
            seen.add(key)
            sources.append(Source(source=key[0], heading=key[1]))

    return ExplainResponse(
        explanation=resp.choices[0].message.content or "",
        sources=sources,
        model=CHAT_DEPLOYMENT,
    )
