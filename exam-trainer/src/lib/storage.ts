import type { ExamAttempt } from '../types';

const K_ATTEMPTS = 'aif.attempts';
const K_WRONG = 'aif.wrong'; // { [questionId]: number of times wrong }
const K_READ = 'aif.read'; // { [topicId]: true } — study topics marked as read

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function getAttempts(): ExamAttempt[] {
  return read<ExamAttempt[]>(K_ATTEMPTS, []);
}

export function saveAttempt(a: ExamAttempt) {
  const list = getAttempts();
  list.unshift(a);
  write(K_ATTEMPTS, list.slice(0, 100));
}

export function getWrongCounts(): Record<string, number> {
  return read<Record<string, number>>(K_WRONG, {});
}

export function recordWrong(ids: string[], correctIds: string[]) {
  const w = getWrongCounts();
  for (const id of ids) w[id] = (w[id] || 0) + 1;
  // answering correctly again decreases the count (progress from review)
  for (const id of correctIds) if (w[id]) w[id] = Math.max(0, w[id] - 1);
  write(K_WRONG, w);
}

export function getReadTopics(): Record<string, boolean> {
  return read<Record<string, boolean>>(K_READ, {});
}

export function setTopicRead(id: string, isRead: boolean): Record<string, boolean> {
  const r = getReadTopics();
  if (isRead) r[id] = true;
  else delete r[id];
  write(K_READ, r);
  return r;
}

export function clearAll() {
  try {
    localStorage.removeItem(K_ATTEMPTS);
    localStorage.removeItem(K_WRONG);
  } catch { /* noop */ }
}
