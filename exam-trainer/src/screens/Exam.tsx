import { useEffect, useMemo, useRef, useState } from 'react';
import type { Domain, ExamAttempt, RenderQuestion, ReviewItem } from '../types';
import { buildExam, isCorrect, scaleScore } from '../lib/questions';
import { EXAM_MINUTES, ALL_DOMAINS } from '../lib/domains';
import { saveAttempt, recordWrong } from '../lib/storage';
import QuestionView from '../components/QuestionView';

function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Exam({ onFinish, initialQuestions, setId, setTitle }: {
  onFinish: (a: ExamAttempt, review: ReviewItem[]) => void;
  initialQuestions?: RenderQuestion[];
  setId?: string;
  setTitle?: string;
}) {
  const questions = useMemo<RenderQuestion[]>(() => initialQuestions ?? buildExam(), [initialQuestions]);
  const startedAt = useRef(Date.now());
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [remaining, setRemaining] = useState(EXAM_MINUTES * 60);
  const submitted = useRef(false);

  const submit = useRef<() => void>(() => {});
  submit.current = () => {
    if (submitted.current) return;
    submitted.current = true;
    let correct = 0;
    const perDomain = {} as ExamAttempt['perDomain'];
    for (const d of ALL_DOMAINS) perDomain[d] = { correct: 0, total: 0 };
    const wrongIds: string[] = [];
    const correctIds: string[] = [];
    const review: ReviewItem[] = [];
    questions.forEach((rq, i) => {
      const d = rq.q.domain as Domain;
      perDomain[d].total++;
      const sel = answers[i] ?? [];
      const ok = isCorrect(rq, sel);
      review.push({ rq, selected: sel, correct: ok });
      if (ok) { correct++; perDomain[d].correct++; correctIds.push(rq.q.id); }
      else wrongIds.push(rq.q.id);
    });
    const attempt: ExamAttempt = {
      id: `exam-${startedAt.current}`,
      setId,
      setTitle,
      startedAt: startedAt.current,
      finishedAt: Date.now(),
      mode: 'exam',
      scaledScore: scaleScore(correct, questions.length),
      correct,
      total: questions.length,
      perDomain,
      wrongIds,
    };
    saveAttempt(attempt);
    recordWrong(wrongIds, correctIds);
    onFinish(attempt, review);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(t); submit.current(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const answeredCount = Object.values(answers).filter((a) => a.length > 0).length;
  const unanswered = questions.length - answeredCount;
  const timerCls = remaining < 300 ? 'timer danger' : remaining < 600 ? 'timer warn' : 'timer';

  function toggle(qi: number, idx: number) {
    setAnswers((prev) => {
      const c = prev[qi] ?? [];
      if (questions[qi].q.type === 'single') return { ...prev, [qi]: c.includes(idx) ? [] : [idx] };
      return { ...prev, [qi]: c.includes(idx) ? c.filter((x) => x !== idx) : [...c, idx] };
    });
  }
  function toggleFlag(qi: number) {
    setFlags((prev) => { const n = new Set(prev); n.has(qi) ? n.delete(qi) : n.add(qi); return n; });
  }
  function doSubmit() {
    const msg = unanswered > 0
      ? `${unanswered} questions are still unanswered. Submit and grade?`
      : 'Submit and grade?';
    if (confirm(msg)) submit.current();
  }

  return (
    <div>
      {/* sticky status bar: progress + timer */}
      <div className="exam-status">
        {setTitle && <span className="badge" style={{ fontWeight: 700 }}>{setTitle}</span>}
        <span className="badge">Answered {answeredCount}/{questions.length}</span>
        <div className="bar grow"><span style={{ width: `${(answeredCount / questions.length) * 100}%` }} /></div>
        <span className={timerCls}>⏱ {fmt(remaining)}</span>
      </div>

      {/* the whole exam, one card per question, scroll through all */}
      {questions.map((rq, qi) => (
        <div className="card" id={`q-${qi}`} key={qi}>
          <QuestionView
            rq={rq}
            selected={answers[qi] ?? []}
            onToggle={(idx) => toggle(qi, idx)}
            index={qi + 1}
            total={questions.length}
          />
          <div className="row" style={{ marginTop: 12 }}>
            <button className="ghost small" onClick={() => toggleFlag(qi)}
              style={{ color: flags.has(qi) ? 'var(--flag)' : undefined }}>
              {flags.has(qi) ? '🚩 Flagged' : '⚑ Flag'}
            </button>
            {(answers[qi]?.length ?? 0) === 0 && <span className="small muted">unanswered</span>}
          </div>
        </div>
      ))}

      <div className="sticky-actions">
        <span className="small muted grow">
          {unanswered > 0 ? `${unanswered} unanswered` : 'All answered'}
          {flags.size > 0 ? ` · ${flags.size} flagged` : ''}
        </span>
        <button className="primary" onClick={doSubmit}>Submit</button>
      </div>
    </div>
  );
}
