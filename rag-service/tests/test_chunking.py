"""Chunking is pure and network-free."""

from rag_service.config import get_wiki
from rag_service.ingest import build_documents, hard_wrap, source_of, split_sections

SAMPLE = """# Part 42 — Sample

Intro line under the title.

## First Heading

Body of the first section.

## Second Heading

Para one.

Para two.
"""


def test_source_of():
    assert source_of("parts/part-09.md") == "part-09"
    assert source_of("security-governance.md") == "security-governance"


def test_split_sections_keeps_title_and_headings():
    title, sections = split_sections(SAMPLE)
    assert title == "Part 42 — Sample"
    headings = [h for h, _ in sections]
    assert "First Heading" in headings
    assert "Second Heading" in headings
    # Intro text before the first H2 is retained under the title heading.
    assert any("Intro line" in body for _, body in sections)


def test_hard_wrap_respects_max_chars():
    text = "\n\n".join(["paragraph " * 30 for _ in range(6)])
    parts = hard_wrap(text, max_chars=400)
    assert len(parts) > 1
    assert all(len(p) <= 500 for p in parts)  # some slack for paragraph boundaries


def test_hard_wrap_short_text_single_part():
    assert hard_wrap("short", max_chars=1800) == ["short"]


def test_build_documents_over_real_wiki():
    """Ingest chunking runs against the real aif-c01 markdown (local files only)."""
    wiki = get_wiki("aif-c01")
    assert wiki is not None
    docs = build_documents(wiki, max_chars=1800)
    assert len(docs) > 50
    d = docs[0]
    for key in ("wiki", "source", "title", "heading", "path", "doc_id"):
        assert key in d.metadata
    assert d.metadata["wiki"] == "aif-c01"
    assert d.metadata["path"].startswith("AIF-C01-Knowledge/wiki/")
    assert "#" in d.metadata["doc_id"]
