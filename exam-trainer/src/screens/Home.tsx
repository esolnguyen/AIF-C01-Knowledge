import { poolStats, EXAM_SETS } from '../lib/questions';
import { DOMAIN_NAMES, ALL_DOMAINS, EXAM_SIZE, EXAM_MINUTES, PASS_SCALED } from '../lib/domains';
import { getAttempts, getWrongCounts, clearAll } from '../lib/storage';

export default function Home({ onStartExam, onOpenSets, onStartPractice, onOpenDocs, onOpenChat }: {
  onStartExam: () => void; onOpenSets: () => void; onStartPractice: () => void; onOpenDocs: () => void; onOpenChat: () => void;
}) {
  const stats = poolStats();
  const attempts = getAttempts();
  const wrongCount = Object.values(getWrongCounts()).filter((n) => n > 0).length;

  return (
    <div>
      <div className="card">
        <h1>AWS Certified AI Practitioner Prep</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          A bank of <strong>{stats.total}</strong> questions that track the 5 domains of the AIF-C01 exam.
          Answer choices are shuffled on every attempt.
        </p>
        <div className="row" style={{ marginTop: 14 }}>
          <button className="primary" onClick={onOpenSets}>
            📚 Practice exam sets ({EXAM_SETS.length} sets)
          </button>
          <button onClick={onStartExam}>🎲 Random exam ({EXAM_SIZE} questions · {EXAM_MINUTES}′)</button>
          <button onClick={onStartPractice}>🎯 Practice by domain</button>
          <button onClick={onOpenDocs}>📖 Study notes</button>
          <button onClick={onOpenChat}>🤖 Ask AI</button>
        </div>
        <p className="small muted" style={{ marginTop: 10 }}>
          Real exam: 65 questions / 90 minutes, passing at {PASS_SCALED}/1000.
        </p>
      </div>

      <div className="card">
        <h2>Question bank distribution</h2>
        {ALL_DOMAINS.map((d) => {
          const n = stats.perDomain[d];
          const pct = stats.total ? Math.round((n / stats.total) * 100) : 0;
          return (
            <div key={d} style={{ marginBottom: 10 }}>
              <div className="row small" style={{ justifyContent: 'space-between' }}>
                <span><strong>D{d}</strong> · {DOMAIN_NAMES[d]}</span>
                <span className="muted">{n} questions</span>
              </div>
              <div className="bar"><span style={{ width: `${pct}%` }} /></div>
            </div>
          );
        })}
        <div className="small muted" style={{ marginTop: 6 }}>
          Sources: {Object.entries(stats.perOrigin).map(([k, v]) => `${k} (${v})`).join(' · ')}
        </div>
      </div>

      {attempts.length > 0 && (
        <div className="card">
          <h2>Recent history</h2>
          <div className="overflow-x">
            <table className="mini">
              <tbody>
                {attempts.slice(0, 8).map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.finishedAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>{a.mode === 'exam' ? 'Exam' : 'Practice'}</td>
                    <td>{a.correct}/{a.total} correct</td>
                    <td className={a.mode === 'exam' ? (a.scaledScore >= PASS_SCALED ? 'pass' : 'fail') : ''}>
                      {a.mode === 'exam' ? `${a.scaledScore}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            {wrongCount > 0 && <span className="small muted">{wrongCount} questions you have gotten wrong before.</span>}
            <div className="grow" />
            <button className="ghost small" onClick={() => { if (confirm('Clear all history and wrong-answer records?')) { clearAll(); location.reload(); } }}>
              Clear history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
