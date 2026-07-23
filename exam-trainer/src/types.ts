export type Domain = 1 | 2 | 3 | 4 | 5;

export interface Option {
  key: string; // original "A".."E" — reference only; the UI always shuffles
  text: string;
}

export interface Question {
  id: string;
  question: string; // the question stem
  source: string; // part-0x | curated | enrichment key
  sectionId: string | null;
  domain: Domain;
  type: 'single' | 'multi';
  options: Option[];
  answer: string[]; // the correct keys
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  origin?: string;
}

// A pre-shuffled question ready to render, keeping the mapping to the correct answers by new index.
export interface RenderQuestion {
  q: Question;
  shuffled: Option[]; // options in shuffled order
  correctIdx: number[]; // indices (within shuffled) of the correct options
}

export interface ReviewItem {
  rq: RenderQuestion;
  selected: number[];
  correct: boolean;
}

export interface ExamAttempt {
  id: string;
  setId?: string;    // set if this is a numbered exam set
  setTitle?: string;
  startedAt: number;
  finishedAt: number;
  mode: 'exam' | 'practice';
  scaledScore: number; // 100..1000 (exam)
  correct: number;
  total: number;
  perDomain: Record<Domain, { correct: number; total: number }>;
  wrongIds: string[];
}
