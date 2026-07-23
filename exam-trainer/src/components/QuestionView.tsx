import { useRef, useState } from 'react';
import { marked } from 'marked';
import type { RenderQuestion } from '../types';
import { DOMAIN_NAMES } from '../lib/domains';
import { fetchExplanation, type ExplainResult } from '../lib/explain';

interface Props {
  rq: RenderQuestion;
  selected: number[];
  onToggle?: (idx: number) => void;
  revealed?: boolean;   // show correct/incorrect + explanation
  disabled?: boolean;
  index?: number;       // display number (1-based)
  total?: number;
  aiExplain?: boolean;  // enable the "Explain (AI)" button (on by default)
}

export default function QuestionView({ rq, selected, onToggle, revealed, disabled, index, total, aiExplain = true }: Props) {
  const isMulti = rq.q.type === 'multi';
  const correct = new Set(rq.correctIdx);
  const sel = new Set(selected);

  return (
    <div>
      <div className="row small muted" style={{ marginBottom: 8 }}>
        {index != null && <span>Question {index}{total ? ` / ${total}` : ''}</span>}
        <span className="badge">D{rq.q.domain} · {DOMAIN_NAMES[rq.q.domain]}</span>
        {isMulti && <span className="badge">Choose {rq.correctIdx.length}</span>}
        <span className="badge">{rq.q.difficulty}</span>
      </div>
      <div className="qstem">{rq.q.question}</div>
      <div className="opts">
        {rq.shuffled.map((opt, i) => {
          let cls = 'opt';
          if (revealed) {
            if (correct.has(i)) cls += ' correct';
            else if (sel.has(i)) cls += ' wrong';
          } else if (sel.has(i)) cls += ' selected';
          const letter = String.fromCharCode(65 + i);
          return (
            <button
              key={i}
              className={cls}
              disabled={disabled}
              onClick={() => onToggle?.(i)}
            >
              <span className="mark">{letter}</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="explain">
          <strong>Explanation. </strong>{rq.q.explanation}
          {rq.q.sectionId && (
            <div className="small muted" style={{ marginTop: 6 }}>
              Source: {rq.q.source}
            </div>
          )}
        </div>
      )}
      {aiExplain && <AiExplain rq={rq} selected={selected} />}
    </div>
  );
}

function AiExplain({ rq, selected }: { rq: RenderQuestion; selected: number[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Question changed → reset the panel (parent should key by question, but guard against instance reuse).
  const lastId = useRef(rq.q.id);
  if (lastId.current !== rq.q.id) {
    lastId.current = rq.q.id;
    if (result || error) { setResult(null); setError(null); }
  }

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const r = await fetchExplanation(rq, selected, ac.signal);
      setResult(r);
    } catch (e) {
      if (!ac.signal.aborted) setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }

  return (
    <div className="ai-explain">
      <button className="ai-explain-btn" onClick={run} disabled={loading}>
        {loading ? '🤖 Explaining…' : result ? '🔄 Explain again (AI)' : '🤖 Explain (AI)'}
      </button>

      {error && <div className="ai-explain-err small">⚠️ {error}</div>}

      {result && (
        <div className="ai-explain-body">
          <div
            className="ai-explain-md"
            dangerouslySetInnerHTML={{ __html: marked.parse(result.explanation) as string }}
          />
          {result.sources.length > 0 && (
            <div className="small muted ai-explain-src">
              📚 Wiki sources: {result.sources.map((s) => `${s.source} · ${s.heading}`).join('  •  ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
