"""API contract tests via FastAPI TestClient (all Azure/Chroma calls faked)."""

import json

import pytest
from fastapi.testclient import TestClient

from rag_service.app import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    ids = {w["id"] for w in body["wikis"]}
    assert "aif-c01" in ids
    assert all("count" in w for w in body["wikis"])


def test_wikis():
    r = client.get("/wikis")
    assert r.status_code == 200
    body = r.json()
    assert body[0]["id"] == "aif-c01"
    assert "name" in body[0] and "description" in body[0] and "count" in body[0]


def test_chat_non_streaming_shape():
    r = client.post(
        "/chat",
        json={"wiki": "aif-c01", "message": "Difference between Macie and Inspector?", "stream": False},
    )
    assert r.status_code == 200
    body = r.json()
    # FinalPayload shape.
    for key in ("answer", "citations", "confidence", "usage", "model", "trace_url", "session_id"):
        assert key in body
    assert body["answer"]
    assert body["citations"][0]["n"] == 1
    assert body["citations"][0]["doc_id"] == "part-09#3.0"
    conf = body["confidence"]
    assert 0.0 <= conf["score"] <= 1.0 and conf["label"] in {"Low", "Medium", "High"}
    usage = body["usage"]
    assert usage["total_tokens"] > 0
    assert usage["cost_usd"] >= 0.0
    assert body["model"]


def test_chat_streaming_sse():
    with client.stream(
        "POST",
        "/chat",
        json={"wiki": "aif-c01", "message": "What is Amazon Macie?", "stream": True},
    ) as r:
        assert r.status_code == 200
        assert "text/event-stream" in r.headers["content-type"]
        raw = "".join(chunk for chunk in r.iter_text())
    assert "event: token" in raw
    assert "event: done" in raw
    # Parse the done payload.
    done_line = [ln for ln in raw.splitlines() if ln.startswith("data: ") and "answer" in ln][-1]
    payload = json.loads(done_line[len("data: "):])
    assert payload["citations"]
    assert payload["confidence"]["label"] in {"Low", "Medium", "High"}


def test_chat_unknown_wiki():
    r = client.post("/chat", json={"wiki": "nope", "message": "hi", "stream": False})
    assert r.status_code == 400
    assert "message" in r.json()


def test_source_found():
    r = client.get("/source/aif-c01/part-09%233.0")
    assert r.status_code == 200
    body = r.json()
    assert body["doc_id"] == "part-09#3.0"
    assert body["heading"] == "Amazon Macie"
    assert body["markdown"].lstrip().startswith("#")
    assert body["path"].endswith("part-09.md")


def test_source_not_found():
    r = client.get("/source/aif-c01/part-99%230.0")
    assert r.status_code == 404
    assert "message" in r.json()


def test_explain():
    r = client.post(
        "/explain",
        json={
            "question": "Which service protects sensitive data in S3?",
            "options": [
                {"letter": "A", "text": "Amazon Macie", "correct": True, "chosen": True},
                {"letter": "B", "text": "Amazon Inspector", "correct": False, "chosen": False},
            ],
            "source": "part-09",
            "domain": 3,
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["explanation"]
    assert "model" in body
    assert body["confidence"]["label"] in {"Low", "Medium", "High"}
    assert isinstance(body["sources"], list)
