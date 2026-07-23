import { useState } from 'react';
import type { ExamAttempt, ReviewItem } from './types';
import { buildExamFromIds, EXAM_SETS } from './lib/questions';
import Home from './screens/Home';
import Exam from './screens/Exam';
import Result from './screens/Result';
import Practice from './screens/Practice';
import ExamSets from './screens/ExamSets';
import Docs from './screens/Docs';
import Chat from './screens/Chat';

type Screen =
  | { name: 'home' }
  | { name: 'exam'; setId?: string; setTitle?: string }
  | { name: 'sets' }
  | { name: 'practice' }
  | { name: 'docs'; source?: string }
  | { name: 'chat' }
  | { name: 'result'; attempt: ExamAttempt; review: ReviewItem[] };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });

  function startSet(id: string) {
    const set = EXAM_SETS.find((s) => s.id === id);
    if (set) setScreen({ name: 'exam', setId: set.id, setTitle: set.title });
  }

  const wide = screen.name === 'docs' || screen.name === 'chat';

  return (
    <div className={`app${wide ? ' wide' : ''}`}>
      <div className="topbar">
        <div className="brand" onClick={() => setScreen({ name: 'home' })} style={{ cursor: 'pointer' }}>
          AIF-C01 <span>Exam Trainer</span>
        </div>
        <div className="spacer" />
        {screen.name !== 'home' && (
          <button className="ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
            onClick={() => {
              if (screen.name === 'exam' && !confirm('Leave the exam? Your current progress will be lost.')) return;
              setScreen({ name: 'home' });
            }}>
            &larr; Home
          </button>
        )}
      </div>

      {screen.name === 'home' && (
        <Home
          onStartExam={() => setScreen({ name: 'exam' })}
          onOpenSets={() => setScreen({ name: 'sets' })}
          onStartPractice={() => setScreen({ name: 'practice' })}
          onOpenDocs={() => setScreen({ name: 'docs' })}
          onOpenChat={() => setScreen({ name: 'chat' })}
        />
      )}
      {screen.name === 'sets' && (
        <ExamSets onPick={startSet} onBack={() => setScreen({ name: 'home' })} />
      )}
      {screen.name === 'exam' && (
        <Exam
          key={screen.setId ?? 'random'}
          initialQuestions={screen.setId ? buildExamFromIds(EXAM_SETS.find((s) => s.id === screen.setId)!.questionIds) : undefined}
          setId={screen.setId}
          setTitle={screen.setTitle}
          onFinish={(attempt, review) => setScreen({ name: 'result', attempt, review })}
        />
      )}
      {screen.name === 'result' && (
        <Result
          attempt={screen.attempt}
          review={screen.review}
          onHome={() => setScreen({ name: 'home' })}
          onRetry={() => screen.attempt.setId
            ? startSet(screen.attempt.setId)
            : setScreen({ name: 'exam' })}
        />
      )}
      {screen.name === 'practice' && (
        <Practice onHome={() => setScreen({ name: 'home' })} />
      )}
      {screen.name === 'docs' && (
        <Docs onHome={() => setScreen({ name: 'home' })} initialSource={screen.source} />
      )}
      {screen.name === 'chat' && (
        <Chat
          onHome={() => setScreen({ name: 'home' })}
          onViewInDocs={(source) => setScreen({ name: 'docs', source })}
        />
      )}
    </div>
  );
}
