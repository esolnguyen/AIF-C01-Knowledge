import type { Question, RenderQuestion, Domain } from '../types';
import { EXAM_PER_DOMAIN, ALL_DOMAINS } from './domains';
import poolRaw from '../data/pool.json';
import examsRaw from '../data/exams.json';

export const POOL: Question[] = poolRaw as unknown as Question[];

export interface ExamSet { id: string; title: string; questionIds: string[]; }
export const EXAM_SETS: ExamSet[] = examsRaw as unknown as ExamSet[];

const BY_ID = new Map(POOL.map((q) => [q.id, q]));
export function getById(id: string): Question | undefined { return BY_ID.get(id); }

// Build an exam from a fixed list of ids (numbered sets). Answer choices still shuffle on each render.
export function buildExamFromIds(ids: string[]): RenderQuestion[] {
  return ids.map((id) => getById(id)).filter((q): q is Question => !!q).map(toRender);
}

export function byDomain(domain: Domain): Question[] {
  return POOL.filter((q) => q.domain === domain);
}

export function poolStats() {
  const perDomain = {} as Record<Domain, number>;
  const perOrigin: Record<string, number> = {};
  for (const d of ALL_DOMAINS) perDomain[d] = 0;
  for (const q of POOL) {
    perDomain[q.domain]++;
    const o = q.origin ?? q.source;
    perOrigin[o] = (perOrigin[o] || 0) + 1;
  }
  return { total: POOL.length, perDomain, perOrigin };
}

// Fisher–Yates (Math.random is fine in the browser).
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

// Shuffle a question's options and recompute the indices of the correct answers.
export function toRender(q: Question): RenderQuestion {
  const shuffled = shuffle(q.options);
  const correctSet = new Set(q.answer);
  const correctIdx: number[] = [];
  shuffled.forEach((opt, i) => {
    if (correctSet.has(opt.key)) correctIdx.push(i);
  });
  return { q, shuffled, correctIdx };
}

// Draw a 65-question exam weighted by domain (take as many as available if short).
export function buildExam(): RenderQuestion[] {
  const picked: Question[] = [];
  for (const d of ALL_DOMAINS) {
    picked.push(...sample(byDomain(d), EXAM_PER_DOMAIN[d]));
  }
  return shuffle(picked).map(toRender);
}

// Draw a practice set from the selected domains.
export function buildPractice(domains: Domain[], count: number): RenderQuestion[] {
  const src = POOL.filter((q) => domains.includes(q.domain));
  return sample(src, Math.min(count, src.length)).map(toRender);
}

export function isCorrect(rq: RenderQuestion, selected: number[]): boolean {
  const a = new Set(rq.correctIdx);
  if (selected.length !== a.size) return false;
  return selected.every((i) => a.has(i));
}

// Convert the correct ratio → a 100..1000 scale (like AWS: pass at 700).
export function scaleScore(correct: number, total: number): number {
  if (total === 0) return 100;
  const ratio = correct / total;
  return Math.round(100 + ratio * 900);
}
