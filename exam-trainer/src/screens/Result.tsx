import { useState } from 'react';
import type { ExamAttempt, ReviewItem } from '../types';
import { DOMAIN_NAMES, ALL_DOMAINS, PASS_SCALED } from '../lib/domains';
import QuestionView from '../components/QuestionView';

export default function Result({ attempt, review, onHome, onRetry }: {
  attempt: ExamAttempt; review: ReviewItem[]; onHome: () => void; onRetry: () => void;
}) {
  const [filter, setFilter] = useState<'all' | 'wrong'>('wrong');
  const passed = attempt.scaledScore >= PASS_SCALED;
  const mins = Math.round((attempt.finishedAt - attempt.startedAt) / 60000);
  const shown = review.filter((r) => (filter === 'wrong' ? !r.correct : true));

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className={`score-big ${passed ? 'pass' : 'fail'}`}>{attempt.scaledScore}</div>
        <div className="muted small">scale 100–1000 · passing at {PASS_SCALED}</div>
        <h1 style={{ marginTop: 10 }} className={passed ? 'pass' : 'fail'}>
          {passed ? '✓ PASS' : '✗ NOT PASSED'}
        </h1>
        <p className="muted">
          {attempt.correct}/{attempt.total} correct ({Math.round((attempt.correct / attempt.total) * 100)}%) · finished in {mins}′
        </p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 8 }}>
          <button className="primary" onClick={onRetry}>Retry with a new exam</button>
          <button onClick={onHome}>Home</button>
        </div>
      </div>

      <div className="card">
        <h2>Results by domain</h2>
        {ALL_DOMAINS.map((d) => {
          const s = attempt.perDomain[d];
          if (!s || s.total === 0) return null;
          const pct = Math.round((s.correct / s.total) * 100);
          const cls = pct >= 70 ? 'bar good' : 'bar bad';
          return (
            <div key={d} style={{ marginBottom: 10 }}>
              <div className="row small" style={{ justifyContent: 'space-between' }}>
                <span><strong>D{d}</strong> · {DOMAIN_NAMES[d]}</span>
                <span className="muted">{s.correct}/{s.total} · {pct}%</span>
              </div>
              <div className={cls}><span style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}
        <p className="small muted" style={{ marginTop: 6 }}>
          Any domain below 70% is where you should focus your review.
        </p>
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Review answers</h2>
          <div className="row">
            <button className={filter === 'wrong' ? 'primary small' : 'small'} onClick={() => setFilter('wrong')}>
              Wrong ({review.filter((r) => !r.correct).length})
            </button>
            <button className={filter === 'all' ? 'primary small' : 'small'} onClick={() => setFilter('all')}>
              All ({review.length})
            </button>
          </div>
        </div>
      </div>

      {shown.map((r, i) => (
        <div className="card" key={i}>
          <QuestionView rq={r.rq} selected={r.selected} revealed disabled />
          {!r.correct && r.selected.length === 0 && (
            <div className="small muted" style={{ marginTop: 8 }}>You left this question blank.</div>
          )}
        </div>
      ))}
      {shown.length === 0 && (
        <div className="card muted">No questions to show. 🎉</div>
      )}
    </div>
  );
}
