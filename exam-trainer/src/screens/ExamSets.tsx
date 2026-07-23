import { EXAM_SETS } from '../lib/questions';
import { PASS_SCALED } from '../lib/domains';
import { getAttempts } from '../lib/storage';

export default function ExamSets({ onPick, onBack }: {
  onPick: (id: string) => void; onBack: () => void;
}) {
  const attempts = getAttempts().filter((a) => a.setId);
  // best score + number of attempts per set
  const best = new Map<string, { score: number; count: number }>();
  for (const a of attempts) {
    const cur = best.get(a.setId!) ?? { score: -1, count: 0 };
    best.set(a.setId!, { score: Math.max(cur.score, a.scaledScore), count: cur.count + 1 });
  }
  const doneCount = best.size;

  return (
    <div>
      <div className="card">
        <h1>Practice exam sets</h1>
        <p className="muted small">
          {EXAM_SETS.length} fixed sets, each with 65 questions matching the exact domain ratios of AIF-C01.
          Each set keeps the same questions so you can retake it and track progress (answer choices still shuffle each time).
        </p>
        <p className="small" style={{ marginTop: 6 }}>
          Completed <strong>{doneCount}</strong>/{EXAM_SETS.length} sets · pass at ≥ {PASS_SCALED}/1000.
        </p>
      </div>

      <div className="sets-grid">
        {EXAM_SETS.map((s, i) => {
          const b = best.get(s.id);
          const passed = b && b.score >= PASS_SCALED;
          return (
            <button key={s.id} className="set-cell" onClick={() => onPick(s.id)}>
              <span className="set-no">{String(i + 1).padStart(2, '0')}</span>
              {b ? (
                <span className={`set-score ${passed ? 'pass' : 'fail'}`}>
                  {b.score}
                  {b.count > 1 && <span className="muted small"> ×{b.count}</span>}
                </span>
              ) : (
                <span className="muted small">not taken</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="sticky-actions">
        <button onClick={onBack}>← Home</button>
      </div>
    </div>
  );
}
