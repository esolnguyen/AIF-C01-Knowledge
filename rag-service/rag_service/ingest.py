"""Ingestion CLI: markdown → H2-heading chunks → Azure embeddings → Chroma.

    python -m rag_service.ingest --wiki aif-c01
    python -m rag_service.ingest --all

Idempotent: the target collection is reset (dropped) and repopulated so stale
chunks never accumulate. Chunking is config-driven and wiki-agnostic — the same
code ingests any certificate registered in ``wikis.yaml``.
"""

from __future__ import annotations

import argparse
import re
import sys

import chromadb
from langchain_core.documents import Document

from . import azure
from .config import Wiki, get_settings, get_wiki, load_wikis


# ---------------------------------------------------------------------------
# Chunking (pure functions — unit-tested without any network)
# ---------------------------------------------------------------------------
def source_of(filename: str) -> str:
    """``part-09.md`` -> ``part-09``."""
    return filename.rsplit("/", 1)[-1].rsplit(".", 1)[0]


def split_sections(md: str) -> tuple[str, list[tuple[str, str]]]:
    """Split markdown by H2 (``## ``). The H1 (``# ``) title is kept as shared context.

    Returns ``(title, [(heading, body), ...])`` with empty bodies dropped.
    """
    lines = md.splitlines()
    title = next((ln[2:].strip() for ln in lines if ln.startswith("# ")), "")
    sections: list[tuple[str, str]] = []
    heading = title or "Intro"
    buf: list[str] = []
    for line in lines:
        if line.startswith("## "):
            if buf:
                sections.append((heading, "\n".join(buf).strip()))
            heading = line[3:].strip()
            buf = []
        else:
            buf.append(line)
    if buf:
        sections.append((heading, "\n".join(buf).strip()))
    return title, [(h, b) for h, b in sections if b]


def hard_wrap(text: str, max_chars: int) -> list[str]:
    """Split a too-long section on paragraph boundaries to stay under ``max_chars``."""
    if len(text) <= max_chars:
        return [text]
    parts: list[str] = []
    cur = ""
    for para in re.split(r"\n\s*\n", text):
        if cur and len(cur) + len(para) + 2 > max_chars:
            parts.append(cur.strip())
            cur = para
        else:
            cur = f"{cur}\n\n{para}" if cur else para
    if cur.strip():
        parts.append(cur.strip())
    return parts


def build_documents(wiki: Wiki, max_chars: int) -> list[Document]:
    """Read every source file for a wiki and produce embeddable LangChain Documents."""
    docs: list[Document] = []
    for src_dir in wiki.source_dirs():
        if not src_dir.exists():
            continue
        for path in sorted(src_dir.glob("*.md")):
            source = source_of(path.name)
            title, sections = split_sections(path.read_text(encoding="utf-8"))
            rel_path = wiki.repo_rel_path(src_dir, path.name)
            for si, (heading, body) in enumerate(sections):
                for ci, chunk in enumerate(hard_wrap(body, max_chars)):
                    doc_id = f"{source}#{si}.{ci}"
                    # Title + heading are embedded WITH the body for retrieval context,
                    # and returned verbatim by the /source endpoint.
                    content = f"# {title}\n## {heading}\n\n{chunk}"
                    docs.append(
                        Document(
                            page_content=content,
                            metadata={
                                "wiki": wiki.id,
                                "source": source,
                                "title": title,
                                "heading": heading,
                                "path": rel_path,
                                "doc_id": doc_id,
                            },
                        )
                    )
    return docs


# ---------------------------------------------------------------------------
# Ingestion
# ---------------------------------------------------------------------------
def ingest_wiki(wiki: Wiki) -> int:
    """Reset + repopulate a wiki's Chroma collection. Returns the chunk count."""
    s = get_settings()
    docs = build_documents(wiki, s.max_chunk_chars)
    print(f"[{wiki.id}] built {len(docs)} chunks from {wiki.path}")
    if not docs:
        print(f"[{wiki.id}] WARNING: no markdown found under {wiki.include_dirs}")
        return 0

    # Drop any existing collection so ingestion is idempotent.
    client = chromadb.PersistentClient(path=str(s.chroma_path))
    try:
        client.delete_collection(wiki.collection)
    except Exception:
        pass

    # Import late so a fresh vectorstore binds to the just-cleared collection.
    from .store import get_vectorstore, reset_caches

    reset_caches()
    vs = get_vectorstore(wiki.id)

    embeddings = azure.get_embeddings()  # noqa: F841  (warm the cached client)
    ids = [d.metadata["doc_id"] for d in docs]
    batch = s.embed_batch_size
    for i in range(0, len(docs), batch):
        vs.add_documents(docs[i : i + batch], ids=ids[i : i + batch])
        print(f"[{wiki.id}]   embedded {min(i + batch, len(docs))}/{len(docs)}")

    total = vs._collection.count()
    print(f"[{wiki.id}] done — collection '{wiki.collection}' now holds {total} chunks")
    return total


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Ingest wiki markdown into Chroma.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--wiki", help="wiki id to ingest (see wikis.yaml)")
    group.add_argument("--all", action="store_true", help="ingest every registered wiki")
    args = parser.parse_args(argv)

    if args.all:
        wikis = load_wikis()
        if not wikis:
            print("No wikis registered in wikis.yaml", file=sys.stderr)
            return 1
        for w in wikis:
            ingest_wiki(w)
        return 0

    wiki = get_wiki(args.wiki)
    if wiki is None:
        print(f"Unknown wiki '{args.wiki}'. Known: {[w.id for w in load_wikis()]}", file=sys.stderr)
        return 1
    ingest_wiki(wiki)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
