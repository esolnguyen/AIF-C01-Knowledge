import type { RenderQuestion } from '../types';

export interface ExplainSource {
  source: string;
  heading: string;
}

export interface ExplainResult {
  explanation: string;
  sources: ExplainSource[];
  model: string;
}

// Calls the RAG backend through the Vite proxy (/api → rag-service).
export async function fetchExplanation(
  rq: RenderQuestion,
  selected: number[],
  signal?: AbortSignal,
): Promise<ExplainResult> {
  const correct = new Set(rq.correctIdx);
  const chosen = new Set(selected);
  const options = rq.shuffled.map((o, i) => ({
    letter: String.fromCharCode(65 + i),
    text: o.text,
    correct: correct.has(i),
    chosen: chosen.has(i),
  }));

  const res = await fetch('/api/explain', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    signal,
    body: JSON.stringify({
      question: rq.q.question,
      options,
      source: rq.q.source,
      domain: rq.q.domain,
      builtin_explanation: rq.q.explanation || null,
    }),
  });

  if (!res.ok) {
    throw new Error(`Explain API error ${res.status}. Is the backend running?`);
  }
  return res.json();
}
