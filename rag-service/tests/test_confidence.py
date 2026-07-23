"""Confidence math + citation parsing (pure functions)."""

from rag_service.graph import build_citations, compute_confidence, label_for


def test_label_thresholds():
    assert label_for(0.2) == "Low"
    assert label_for(0.6) == "Medium"
    assert label_for(0.9) == "High"


def test_compute_confidence_high():
    c = compute_confidence([0.85, 0.8], self_score=0.9, faithfulness=0.9)
    assert 0.0 <= c["score"] <= 1.0
    assert c["label"] == "High"
    assert "faithfulness" in c["rationale"]


def test_compute_confidence_low_when_nothing_grounded():
    c = compute_confidence([], self_score=0.2, faithfulness=0.2)
    assert c["score"] < 0.5
    assert c["label"] == "Low"


def test_compute_confidence_is_weighted_combo():
    # retrieval 1.0, self 0.0, faithfulness 0.0 with default 0.5/0.25/0.25 weights.
    c = compute_confidence([1.0], self_score=0.0, faithfulness=0.0)
    assert abs(c["score"] - 0.5) < 1e-6


def test_build_citations_maps_markers(hits):
    answer = "Macie protects S3 data [1]. Inspector scans workloads [2]."
    cites = build_citations(answer, hits)
    assert [c["n"] for c in cites] == [1, 2]
    assert cites[0]["doc_id"] == "part-09#3.0"
    assert cites[0]["snippet"]  # non-empty
    assert "score" in cites[0]


def test_build_citations_fallback_when_no_markers(hits):
    cites = build_citations("An answer with no markers.", hits)
    assert len(cites) == 1
    assert cites[0]["n"] == 1
