"""Evaluation harness for the RAG pipeline.

Runs a handful of Q/A items through the real LangGraph pipeline and scores each on
groundedness (keyword coverage + reported confidence + citation presence).

    python -m evals.run_evals            # local scoring
    python -m evals.run_evals --langsmith  # also log an experiment to LangSmith

LangSmith mode requires LANGCHAIN_API_KEY and the ``langsmith`` package; when the
key is absent it falls back to local scoring automatically.
"""

from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from rag_service.app import _GRAPH, _inputs  # reuse the compiled graph
from rag_service.app import ChatRequest
from rag_service.config import get_settings
from rag_service.cost import UsageCallback

ITEMS_PATH = Path(__file__).with_name("eval_items.json")


async def _answer(wiki: str, question: str) -> dict:
    req = ChatRequest(wiki=wiki, message=question, history=[], stream=False)
    usage_cb = UsageCallback()
    config = {"configurable": {"thread_id": f"eval-{question[:16]}"}, "callbacks": [usage_cb]}
    state = await _GRAPH.ainvoke(_inputs(req), config=config)
    return state


def _keyword_score(answer: str, keywords: list[str]) -> float:
    if not keywords:
        return 1.0
    lower = answer.lower()
    hit = sum(1 for k in keywords if k.lower() in lower)
    return hit / len(keywords)


def score_item(state: dict, keywords: list[str]) -> dict:
    answer = state.get("answer", "")
    kw = _keyword_score(answer, keywords)
    conf = state.get("confidence", {}).get("score", 0.0)
    has_citations = 1.0 if state.get("citations") else 0.0
    # Groundedness = keyword coverage (0.5) + confidence (0.3) + citations present (0.2).
    grounded = round(0.5 * kw + 0.3 * conf + 0.2 * has_citations, 3)
    return {
        "keyword_coverage": round(kw, 3),
        "confidence": conf,
        "has_citations": bool(has_citations),
        "grounded_score": grounded,
        "answer_preview": answer[:160],
    }


async def run_local() -> int:
    data = json.loads(ITEMS_PATH.read_text(encoding="utf-8"))
    wiki = data["wiki"]
    results = []
    for item in data["items"]:
        state = await _answer(wiki, item["question"])
        res = score_item(state, item.get("expected_keywords", []))
        res["id"] = item["id"]
        results.append(res)
        print(f"- {item['id']:<22} grounded={res['grounded_score']:.2f} "
              f"kw={res['keyword_coverage']:.2f} conf={res['confidence']:.2f} "
              f"cite={res['has_citations']}")
    avg = sum(r["grounded_score"] for r in results) / len(results)
    print(f"\nAverage groundedness: {avg:.3f} over {len(results)} items")
    return 0


def run_langsmith() -> int:
    if not get_settings().tracing_enabled:
        print("No LangSmith key set — falling back to local scoring.\n")
        return asyncio.run(run_local())
    try:
        from langsmith import Client
        from langsmith.evaluation import evaluate
    except Exception as exc:  # pragma: no cover
        print(f"langsmith unavailable ({exc}); running local scoring.\n")
        return asyncio.run(run_local())

    data = json.loads(ITEMS_PATH.read_text(encoding="utf-8"))
    wiki = data["wiki"]
    client = Client()
    dataset_name = f"rag-evals-{wiki}"
    if not client.has_dataset(dataset_name=dataset_name):
        ds = client.create_dataset(dataset_name=dataset_name)
        for item in data["items"]:
            client.create_example(
                inputs={"question": item["question"]},
                outputs={"keywords": item.get("expected_keywords", [])},
                dataset_id=ds.id,
            )

    def target(inputs: dict) -> dict:
        state = asyncio.run(_answer(wiki, inputs["question"]))
        return {"answer": state.get("answer", ""), "state": state}

    def grounded_evaluator(run, example) -> dict:
        state = run.outputs.get("state", {})
        res = score_item(state, example.outputs.get("keywords", []))
        return {"key": "groundedness", "score": res["grounded_score"]}

    evaluate(target, data=dataset_name, evaluators=[grounded_evaluator], client=client)
    print(f"Logged experiment to LangSmith dataset '{dataset_name}'.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Run RAG evals.")
    parser.add_argument("--langsmith", action="store_true", help="log to LangSmith if a key is set")
    args = parser.parse_args()
    return run_langsmith() if args.langsmith else asyncio.run(run_local())


if __name__ == "__main__":
    raise SystemExit(main())
