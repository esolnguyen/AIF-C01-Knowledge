// Generates N fixed exam sets (default 40) from src/data/pool.json → src/data/exams.json
// Each set = 65 questions weighted per the AIF-C01 blueprint (13/16/18/9/9), with NO duplicate questions within a set.
// Spread evenly across sets using a usage counter; a fixed seed keeps the exam sets stable (rerunning gives the exact same result).
import { readFileSync, writeFileSync } from 'node:fs';

const N = Number(process.argv[2] || 50);
const PER_DOMAIN = { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 };

const pool = JSON.parse(readFileSync(new URL('../src/data/pool.json', import.meta.url), 'utf8'));

// A seeded PRNG (mulberry32) — stable tie-breaking, independent of Math.random.
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260711);

const byDomain = { 1: [], 2: [], 3: [], 4: [], 5: [] };
for (const q of pool) byDomain[q.domain].push(q.id);
// Shuffle each domain once (deterministic) so the initial order is random but fixed
for (const d of Object.keys(byDomain)) {
  const arr = byDomain[d];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const usage = new Map(pool.map((q) => [q.id, 0]));

// pick the `count` least-used ids in the domain, distinct, tie-break via rand()
function pick(domain, count) {
  const cand = byDomain[domain]
    .map((id) => ({ id, u: usage.get(id), r: rand() }))
    .sort((a, b) => (a.u - b.u) || (a.r - b.r));
  const chosen = cand.slice(0, count).map((c) => c.id);
  for (const id of chosen) usage.set(id, usage.get(id) + 1);
  return chosen;
}

const exams = [];
for (let i = 0; i < N; i++) {
  const ids = [];
  for (const d of [1, 2, 3, 4, 5]) ids.push(...pick(d, PER_DOMAIN[d]));
  // shuffle the question order within the set (mixing domains) — deterministic
  for (let k = ids.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [ids[k], ids[j]] = [ids[j], ids[k]];
  }
  exams.push({
    id: `set-${String(i + 1).padStart(2, '0')}`,
    title: `Exam Set ${String(i + 1).padStart(2, '0')}`,
    questionIds: ids,
  });
}

writeFileSync(new URL('../src/data/exams.json', import.meta.url), JSON.stringify(exams, null, 2));

// verification stats
const u = [...usage.values()];
const dupInSet = exams.some((e) => new Set(e.questionIds).size !== e.questionIds.length);
const never = [...usage.entries()].filter(([, v]) => v === 0).length;
console.log(`✅ ${N} exam sets × 65 questions → src/data/exams.json`);
console.log(`   Duplicate question within the same set: ${dupInSet ? '✗ YES (bug)' : 'no ✓'}`);
console.log(`   Each question used: ${Math.min(...u)}–${Math.max(...u)} times`);
console.log(`   Questions never used: ${never}/${pool.length} ${never === 0 ? '→ FULL COVERAGE ✓' : '✗'}`);

// Coverage per domain: how many distinct questions used / total
const domInfo = { 1: [], 2: [], 3: [], 4: [], 5: [] };
for (const q of pool) domInfo[q.domain].push(usage.get(q.id));
console.log('   Coverage per domain (distinct used / total · min–max times):');
for (const d of [1, 2, 3, 4, 5]) {
  const arr = domInfo[d];
  const used = arr.filter((v) => v > 0).length;
  console.log(`     D${d}: ${used}/${arr.length} questions  ·  ${Math.min(...arr)}–${Math.max(...arr)} times  ${used === arr.length ? '✓' : '✗ MISSING'}`);
}
