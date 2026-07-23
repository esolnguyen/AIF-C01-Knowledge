// Gathers notes from ../AIF-C01-Knowledge/wiki into src/data/docs.json, grouped by domain D1..D5.
// Domain comes from the table in INDEX.md; the nth topic of INDEX part-XX matches the nth "## " section of parts/part-XX.md.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const WIKI = new URL('../../AIF-C01-Knowledge/wiki/', import.meta.url).pathname;

const ENRICHMENT_DOMAIN = {
  'managed-ai-services': 3,
  'security-governance': 5,
  'business-responsible-framing': 4,
};

function splitSections(text) {
  const out = [];
  let cur = null;
  for (const line of text.split('\n')) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (cur) out.push(cur);
      cur = { heading: m[1].replace(/[*_`#]/g, '').trim(), body: [] };
    } else if (cur) cur.body.push(line);
  }
  if (cur) out.push(cur);
  return out.map((s) => ({
    heading: s.heading,
    // Drop "> 📸 Source: Screenshot ..." lines — just a trace of the original screenshot, not knowledge content.
    body: s.body.filter((l) => !/^>?\s*📸\s*Source:/.test(l)).join('\n').replace(/\n{3,}/g, '\n\n').trim(),
  }));
}

// INDEX.md: "| [ ] | 07-01 | Topic | Detail | D3 |" + part title "## Part 07 — ... → [notes](...)"
const index = readFileSync(join(WIKI, 'INDEX.md'), 'utf8');
const rows = {};   // part-07 -> [{ n, topic, detail, domain }]
const partTitles = {}; // part-07 -> "ML Fundamentals · ..."
for (const line of index.split('\n')) {
  const p = line.match(/^##\s+Part\s+(\d+)\s+—\s+(.+?)\s*(?:→.*)?$/);
  if (p) partTitles[`part-${p[1]}`] = p[2].trim();
  const m = line.match(/^\|\s*\[[ x]\]\s*\|\s*(\d+)-(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*D(\d)\s*\|/);
  if (m) {
    const key = `part-${m[1]}`;
    (rows[key] ??= []).push({ n: Number(m[2]), topic: m[3], detail: m[4], domain: Number(m[5]) });
  }
}

const topics = [];
const warnings = [];

const partFiles = readdirSync(join(WIKI, 'parts')).filter((f) => /^part-\d+\.md$/.test(f)).sort();
for (const f of partFiles) {
  const key = basename(f, '.md');
  const secs = splitSections(readFileSync(join(WIKI, 'parts', f), 'utf8'));
  const idx = rows[key] ?? [];
  if (idx.length !== secs.length)
    warnings.push(`${key}: INDEX has ${idx.length} topics but the file has ${secs.length} sections`);
  secs.forEach((s, i) => {
    const row = idx[i];
    if (!row) { warnings.push(`${key} §${i + 1} "${s.heading}" has no INDEX row → skipped`); return; }
    if (!s.body) return;
    topics.push({
      id: `${key}-${String(row.n).padStart(2, '0')}`,
      domain: row.domain,
      heading: s.heading,
      detail: row.detail,
      part: key,
      partTitle: partTitles[key] ?? key,
      body: s.body,
    });
  });
}

for (const f of readdirSync(join(WIKI, 'enrichment')).filter((f) => f.endsWith('.md')).sort()) {
  const key = basename(f, '.md');
  const domain = ENRICHMENT_DOMAIN[key] ?? 3;
  const text = readFileSync(join(WIKI, 'enrichment', f), 'utf8');
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.replace(/\s*—.*$/, '').trim() ?? key;
  splitSections(text).forEach((s, i) => {
    if (!s.body) return;
    topics.push({
      id: `${key}-${String(i + 1).padStart(2, '0')}`,
      domain,
      heading: s.heading,
      detail: '',
      part: key,
      partTitle: `Supplementary — ${title}`,
      body: s.body,
    });
  });
}

const docs = {
  generatedFrom: 'AIF-C01-Knowledge/wiki',
  topics: topics.sort((a, b) => a.domain - b.domain || a.id.localeCompare(b.id)),
};

const out = new URL('../src/data/docs.json', import.meta.url).pathname;
writeFileSync(out, JSON.stringify(docs, null, 2));

const byDomain = {};
for (const t of topics) byDomain[`D${t.domain}`] = (byDomain[`D${t.domain}`] || 0) + 1;
console.log(`Built ${topics.length} topics → ${out}`);
console.table(byDomain);
if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(' -', w);
}
