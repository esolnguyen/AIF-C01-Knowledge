// Extracts 179 sections from parts/*.md + enrichment/*.md into a work-list for the question-generation pipeline.
// Each section = a block starting at "## " up to the next "## ".
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';

const WIKI = new URL('../../AIF-C01-Knowledge/wiki/', import.meta.url).pathname;

// Domain hint per file (one part can cover multiple domains — the agent finalizes the domain based on
// question content; this is just a hint to balance things out). Per the wiki's README.
const DOMAIN_HINT = {
  'part-00': [1], 'part-01': [1, 2], 'part-02': [3, 2], 'part-03': [3],
  'part-04': [3, 4, 5], 'part-05': [1, 3], 'part-06': [3], 'part-07': [3, 4, 5, 1],
  'part-08': [3], 'part-09': [3, 5, 4],
  'managed-ai-services': [3], 'security-governance': [5], 'business-responsible-framing': [4],
};

function slug(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

function splitSections(text) {
  const lines = text.split('\n');
  const out = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      if (cur) out.push(cur);
      cur = { heading: m[1].replace(/[*_`#]/g, '').trim(), body: [] };
    } else if (cur) {
      cur.body.push(line);
    }
  }
  if (cur) out.push(cur);
  return out;
}

const sections = [];
const files = [];
for (const f of readdirSync(join(WIKI, 'parts')).filter(f => /^part-\d+\.md$/.test(f)).sort())
  files.push(join(WIKI, 'parts', f));
for (const f of readdirSync(join(WIKI, 'enrichment')).filter(f => f.endsWith('.md')).sort())
  files.push(join(WIKI, 'enrichment', f));

for (const path of files) {
  const key = basename(path, '.md');
  const text = readFileSync(path, 'utf8');
  const secs = splitSections(text);
  secs.forEach((s, i) => {
    const body = s.body.join('\n').trim();
    if (body.length < 40) return; // skip empty sections / sections with only a source line
    sections.push({
      id: `${key}#${String(i).padStart(2, '0')}-${slug(s.heading)}`,
      source: key,
      domainHint: DOMAIN_HINT[key] ?? [3],
      heading: s.heading,
      body,
      words: body.split(/\s+/).length,
    });
  });
}

// Number of questions per section based on length (min/max capped to balance quality).
function qCount(words) {
  if (words < 80) return 3;
  if (words < 160) return 4;
  if (words < 260) return 5;
  return 6;
}

// Write each section to its own small file for the workflow agent to Read (instead of stuffing it into args).
const secDir = new URL('../data/sections/', import.meta.url).pathname;
rmSync(secDir, { recursive: true, force: true });
mkdirSync(secDir, { recursive: true });

const manifest = sections.map(s => {
  const n = qCount(s.words);
  const fileName = `${s.id.replace(/[#]/g, '_')}.md`;
  writeFileSync(join(secDir, fileName), `# ${s.heading}\n(source: ${s.source})\n\n${s.body}\n`);
  return { id: s.id, source: s.source, domainHint: s.domainHint, heading: s.heading, qCount: n, file: `data/sections/${fileName}` };
});

const outPath = new URL('../data/sections.json', import.meta.url).pathname;
writeFileSync(outPath, JSON.stringify(sections, null, 2));
writeFileSync(new URL('../data/manifest.json', import.meta.url).pathname, JSON.stringify(manifest, null, 2));

const byFile = {};
for (const s of sections) byFile[s.source] = (byFile[s.source] || 0) + 1;
console.log(`Extracted ${sections.length} sections from ${files.length} files`);
console.table(byFile);
console.log(`Total words: ${sections.reduce((a, s) => a + s.words, 0)}`);
console.log(`Planned questions (sum qCount): ${manifest.reduce((a, m) => a + m.qCount, 0)}`);
console.log(`Written → ${outPath} + manifest.json + ${manifest.length} section files`);
