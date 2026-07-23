"""Ingest wiki markdown → chunk by heading → embed → Chroma.

Run once (or whenever the wiki changes):  python ingest.py
Idempotent: clears the collection and reloads it to avoid leftover stale chunks.
"""

from __future__ import annotations

import glob
import os
import re

import chromadb

from rag import CHROMA_DIR, COLLECTION, AzureEmbeddingFunction

HERE = os.path.dirname(__file__)
# The wiki lives in a sibling repo next to exam-trainer.
WIKI_ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "AIF-C01-Knowledge", "wiki"))

# Maps file name → `source` value in pool.json (part-0X stays as-is, enrichment uses the slug).
SOURCE_DIRS = [
    os.path.join(WIKI_ROOT, "parts"),
    os.path.join(WIKI_ROOT, "enrichment"),
]

MAX_CHARS = 1800  # long sections are split further to keep chunks compact


def source_of(path: str) -> str:
    return os.path.splitext(os.path.basename(path))[0]  # part-00.md → part-00


def split_sections(md: str):
    """Split by H2 heading (`## `). Keep H1 as the shared title for every chunk."""
    lines = md.splitlines()
    title = next((l[2:].strip() for l in lines if l.startswith("# ")), "")
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


def hard_wrap(text: str) -> list[str]:
    """Split an overly long section along paragraph boundaries to stay under MAX_CHARS."""
    if len(text) <= MAX_CHARS:
        return [text]
    parts, cur = [], ""
    for para in re.split(r"\n\s*\n", text):
        if len(cur) + len(para) + 2 > MAX_CHARS and cur:
            parts.append(cur.strip())
            cur = para
        else:
            cur = f"{cur}\n\n{para}" if cur else para
    if cur.strip():
        parts.append(cur.strip())
    return parts


def main() -> None:
    ids, docs, metas = [], [], []
    for d in SOURCE_DIRS:
        for path in sorted(glob.glob(os.path.join(d, "*.md"))):
            src = source_of(path)
            with open(path, encoding="utf-8") as f:
                title, sections = split_sections(f.read())
            for si, (heading, body) in enumerate(sections):
                for ci, chunk in enumerate(hard_wrap(body)):
                    ids.append(f"{src}#{si}.{ci}")
                    # Embed title+heading into the text so the embedding has context.
                    docs.append(f"# {title}\n## {heading}\n\n{chunk}")
                    metas.append({"source": src, "title": title, "heading": heading})

    print(f"Chunks: {len(docs)} from {WIKI_ROOT}")

    # Reset the collection for a clean ingest.
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    try:
        client.delete_collection(COLLECTION)
    except Exception:
        pass
    col = client.get_or_create_collection(
        name=COLLECTION,
        embedding_function=AzureEmbeddingFunction(),
        metadata={"hnsw:space": "cosine"},
    )

    # Embed in batches to avoid an overly large payload.
    B = 64
    for i in range(0, len(docs), B):
        col.add(ids=ids[i : i + B], documents=docs[i : i + B], metadatas=metas[i : i + B])
        print(f"  embedded {min(i + B, len(docs))}/{len(docs)}")

    print(f"Done. Collection '{COLLECTION}' has {col.count()} chunks at {CHROMA_DIR}")


if __name__ == "__main__":
    main()
