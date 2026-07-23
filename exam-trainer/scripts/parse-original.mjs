// Parses the 128 original questions in wiki/practice-questions/d1..d5.md → src/data/original.json
// (same schema as the auto-generated pool). Fails loudly if the parsed question count is off from expected.
import { readFileSync, writeFileSync } from 'node:fs';

const PQ = new URL('../../AIF-C01-Knowledge/wiki/practice-questions/', import.meta.url).pathname;
const EXPECT = { d1: 26, d2: 30, d3: 32, d4: 20, d5: 20 };

const all = [];
for (const [file, domainStr] of [['d1', 1], ['d2', 2], ['d3', 3], ['d4', 4], ['d5', 5]]) {
  const domain = domainStr;
  const text = readFileSync(PQ + file + '.md', 'utf8');
  // Split on "### Qn."
  const blocks = text.split(/^### Q\d+\.?\s*/m).slice(1);
  let n = 0;
  for (const raw of blocks) {
    const block = raw.trim();
    // stem = everything before the first option line
    const optStart = block.search(/^- [A-E]\.\s/m);
    if (optStart === -1) continue;
    const stem = block.slice(0, optStart).trim();
    const rest = block.slice(optStart);
    const detailsIdx = rest.indexOf('<details>');
    const optionsBlock = (detailsIdx === -1 ? rest : rest.slice(0, detailsIdx));
    const options = [];
    for (const m of optionsBlock.matchAll(/^- ([A-E])\.\s+(.+?)\s*$/gm)) {
      options.push({ key: m[1], text: m[2].trim() });
    }
    const detailsBlock = detailsIdx === -1 ? '' : rest.slice(detailsIdx);
    const ansMatch = detailsBlock.match(/\*\*Answer:\s*([A-E](?:\s*,\s*[A-E])*)\*\*/);
    if (!ansMatch || options.length < 2) continue;
    const answer = ansMatch[1].split(/\s*,\s*/).map(s => s.trim());
    // explanation = the part after the answer line, before </details>
    let explanation = detailsBlock
      .replace(/[\s\S]*?\*\*Answer:[^*]*\*\*/, '')
      .replace(/<\/details>/, '')
      .trim();
    n++;
    all.push({
      id: `orig-${file}-q${n}`,
      question: stem,
      source: 'curated',
      sectionId: null,
      domain,
      type: answer.length > 1 ? 'multi' : 'single',
      options,
      answer,
      explanation,
      difficulty: 'medium',
      origin: 'curated',
    });
  }
  if (n !== EXPECT[file]) {
    console.error(`⚠️  ${file}: parsed ${n}, expected ${EXPECT[file]}`);
    process.exitCode = 1;
  } else {
    console.log(`${file}: ${n} questions ✓`);
  }
}

writeFileSync(new URL('../src/data/original.json', import.meta.url).pathname, JSON.stringify(all, null, 2));
console.log(`Total curated: ${all.length} → src/data/original.json`);
