// Gathers verify results from the workflow's journal.jsonl → validates → merges with the 128 original questions → src/data/pool.json
// Usage: node scripts/assemble-pool.mjs [path-to-journal.jsonl]
// No path passed → automatically finds the newest workflow dir that has "kept" results.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

function findJournals() {
  const root = join(homedir(), '.claude/projects');
  const found = [];
  function walk(dir, depth) {
    if (depth > 8) return;
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (e.name === 'journal.jsonl') found.push(p);
    }
  }
  walk(root, 0);
  return found.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
}

function loadResults(journalPath) {
  const lines = readFileSync(journalPath, 'utf8').trim().split('\n').filter(Boolean);
  const out = [];
  for (const l of lines) {
    try {
      const o = JSON.parse(l);
      if (o.type === 'result' && o.result && Array.isArray(o.result.kept)) out.push(o.result);
    } catch { /* skip */ }
  }
  return out;
}

let journalArg = process.argv[2];
let verifyResults = [];
let usedPath = journalArg;
if (journalArg) {
  verifyResults = loadResults(journalArg);
} else {
  for (const j of findJournals()) {
    const r = loadResults(j);
    if (r.length > 0) { verifyResults = r; usedPath = j; break; }
  }
}
if (!verifyResults.length) {
  console.error('❌ No "kept" results found in the journal. Has the workflow finished?');
  process.exit(1);
}
// A resume can emit duplicate verify-results for the same section (old run + replay).
// Keep only 1 result per sectionId (the latest one) to avoid duplicate ids/questions.
const dedupBySection = new Map();
for (const r of verifyResults) if (r.sectionId) dedupBySection.set(r.sectionId, r);
const rawCount = verifyResults.length;
verifyResults = [...dedupBySection.values()];
console.log(`Journal: ${usedPath}`);
console.log(`Raw verify-results: ${rawCount} → after de-duping by section: ${verifyResults.length}`);

// Validate + normalize each question.
function validQuestion(q) {
  if (!q || typeof q.question !== 'string' || q.question.length < 8) return false;
  if (!Array.isArray(q.options) || q.options.length < 4) return false;
  const keys = new Set(q.options.map((o) => o && o.key));
  if (keys.size !== q.options.length) return false; // duplicate key
  if (!Array.isArray(q.answer) || q.answer.length < 1) return false;
  if (!q.answer.every((k) => keys.has(k))) return false; // answer points to a key that doesn't exist
  if (q.type === 'single' && q.answer.length !== 1) return false;
  if (q.type === 'multi' && q.answer.length < 2) return false;
  if (![1, 2, 3, 4, 5].includes(q.domain)) return false;
  return true;
}

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const seen = new Set();
const usedIds = new Set();
const uniqueId = (base) => {
  let id = base, k = 1;
  while (usedIds.has(id)) id = `${base}-${++k}`;
  usedIds.add(id);
  return id;
};
const pool = [];
let dropped = 0, dupes = 0;
const bySource = {};

for (const r of verifyResults) {
  let idx = 0;
  for (const q of r.kept) {
    if (!validQuestion(q)) { dropped++; continue; }
    const key = norm(q.question).slice(0, 120);
    if (seen.has(key)) { dupes++; continue; }
    seen.add(key);
    const src = r.source || 'unknown';
    bySource[src] = (bySource[src] || 0) + 1;
    pool.push({
      id: uniqueId(`${r.sectionId || src}-q${idx++}`),
      question: q.question.trim(),
      source: src,
      sectionId: r.sectionId || null,
      domain: q.domain,
      type: q.type === 'multi' ? 'multi' : 'single',
      options: q.options.map((o) => ({ key: o.key, text: String(o.text).trim() })),
      answer: q.answer,
      explanation: (q.explanation || '').trim(),
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
      origin: 'generated',
    });
  }
}

// Merge the 128 original (curated) questions — also dedupe by stem.
let curatedAdded = 0;
const origPath = new URL('../src/data/original.json', import.meta.url).pathname;
if (existsSync(origPath)) {
  const curated = JSON.parse(readFileSync(origPath, 'utf8'));
  for (const q of curated) {
    const key = norm(q.question).slice(0, 120);
    if (seen.has(key)) continue;
    seen.add(key);
    pool.push(q);
    curatedAdded++;
    bySource['curated'] = (bySource['curated'] || 0) + 1;
  }
}

const perDomain = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
for (const q of pool) perDomain[q.domain]++;

writeFileSync(new URL('../src/data/pool.json', import.meta.url).pathname, JSON.stringify(pool, null, 2));
console.log(`\n✅ pool.json: ${pool.length} questions (generated ${pool.length - curatedAdded}, curated ${curatedAdded})`);
console.log(`   Dropped (invalid): ${dropped} · Duplicates: ${dupes}`);
console.log('   By domain:', perDomain);
console.log('   By source:', bySource);
