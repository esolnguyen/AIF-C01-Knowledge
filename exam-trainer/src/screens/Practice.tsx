import { useMemo, useRef, useState } from 'react';
import type { Domain, ExamAttempt, RenderQuestion } from '../types';
import { buildPractice, isCorrect, scaleScore, byDomain } from '../lib/questions';
import { DOMAIN_NAMES, ALL_DOMAINS } from '../lib/domains';
import { saveAttempt, recordWrong } from '../lib/storage';
import QuestionView from '../components/QuestionView';

type Phase = 'setup' | 'run';

export default function Practice({ onHome }: { onHome: () => void }) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [domains, setDomains] = useState<Set<Domain>>(new Set(ALL_DOMAINS));
  const [count, setCount] = useState(15);
  const [questions, setQuestions] = useState<RenderQuestion[]>([]);

  if (phase === 'setup') {
    const avail = ALL_DOMAINS.filter((d) => domains.has(d)).reduce((a, d) => a + byDomain(d).length, 0);
    return (
      <div>
        <div className="card">
          <h1>Practice by domain</h1>
          <p className="muted small">Pick the domains you want to practice. Feedback and an explanation appear right after each question.</p>
          <div className="row" style={{ marginTop: 12 }}>
            {ALL_DOMAINS.map((d) => (
              <span
                key={d}
                className={`chip ${domains.has(d) ? 'active' : ''}`}
                onClick={() => setDomains((prev) => {
                  const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d);
                  return n.size ? n : prev; // always keep at least one
                })}
              >
                D{d} · {DOMAIN_NAMES[d]} <span className="muted">({byDomain(d).length})</span>
              </span>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <label className="small muted">Questions: <strong>{count}</strong> (max {avail})</label>
            <input type="range" min={5} max={Math.min(50, avail)} value={Math.min(count, avail)}
              onChange={(e) => setCount(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="primary" onClick={() => {
              setQuestions(buildPractice([...domains], count));
              setPhase('run');
            }}>Start</button>
            <button onClick={onHome}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return <PracticeRun questions={questions} onHome={onHome} />;
}

function PracticeRun({ questions, onHome }: { questions: RenderQuestion[]; onHome: () => void }) {
  const [cur, setCur] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const startedAt = useRef(Date.now());
  const correctCount = useRef(0);
  const wrongIds = useRef<string[]>([]);
  const correctIds = useRef<string[]>([]);
  const [done, setDone] = useState(false);

  const rq = questions[cur];
  const finished = useMemo(() => done, [done]);

  function check() {
    if (revealed) return;
    const ok = isCorrect(rq, selected);
    if (ok) { correctCount.current++; correctIds.current.push(rq.q.id); }
    else wrongIds.current.push(rq.q.id);
    setRevealed(true);
  }
  function next() {
    if (cur < questions.length - 1) {
      setCur((c) => c + 1); setSelected([]); setRevealed(false);
    } else {
      // save the practice session
      recordWrong(wrongIds.current, correctIds.current);
      const attempt: ExamAttempt = {
        id: `practice-${startedAt.current}`,
        startedAt: startedAt.current, finishedAt: Date.now(), mode: 'practice',
        scaledScore: scaleScore(correctCount.current, questions.length),
        correct: correctCount.current, total: questions.length,
        perDomain: {} as ExamAttempt['perDomain'], wrongIds: wrongIds.current,
      };
      saveAttempt(attempt);
      setDone(true);
    }
  }
  function toggle(idx: number) {
    if (revealed) return;
    setSelected((prev) => {
      if (rq.q.type === 'single') return prev.includes(idx) ? [] : [idx];
      return prev.includes(idx) ? prev.filter((x) => x !== idx) : [...prev, idx];
    });
  }

  if (finished) {
    const pct = Math.round((correctCount.current / questions.length) * 100);
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div className={`score-big ${pct >= 70 ? 'pass' : 'fail'}`}>{pct}%</div>
        <p className="muted">{correctCount.current}/{questions.length} correct</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="primary" onClick={onHome}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="row small muted" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <span>Question {cur + 1}/{questions.length}</span>
          <span>Correct: {correctCount.current}</span>
        </div>
        <div className="bar" style={{ marginBottom: 14 }}>
          <span style={{ width: `${((cur + (revealed ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <QuestionView rq={rq} selected={selected} onToggle={toggle} revealed={revealed} disabled={revealed} />
      </div>
      <div className="sticky-actions">
        {!revealed
          ? <button className="primary grow" disabled={selected.length === 0} onClick={check}>Check</button>
          : <button className="primary grow" onClick={next}>
              {cur < questions.length - 1 ? 'Next question →' : 'See results →'}
            </button>}
        <button onClick={onHome}>Exit</button>
      </div>
    </div>
  );
}
