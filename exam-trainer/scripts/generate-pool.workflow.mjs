export const meta = {
  name: 'aif-c01-generate-pool',
  description: 'Generate + verify the AIF-C01 question bank from 193 section notes',
  phases: [
    { title: 'Bootstrap', detail: 'read manifest.json' },
    { title: 'Generate', detail: 'each section generates qCount questions grounded in its notes' },
    { title: 'Verify', detail: 'check answers, drop ambiguous/wrong/2-answer questions' },
  ],
};

const OPTION = {
  type: 'object',
  properties: { key: { type: 'string' }, text: { type: 'string' } },
  required: ['key', 'text'], additionalProperties: false,
};
const QUESTION = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    type: { type: 'string', enum: ['single', 'multi'] },
    options: { type: 'array', items: OPTION, minItems: 4, maxItems: 5 },
    answer: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
    explanation: { type: 'string' },
    domain: { type: 'integer', minimum: 1, maximum: 5 },
    difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
  },
  required: ['question', 'type', 'options', 'answer', 'explanation', 'domain', 'difficulty'],
  additionalProperties: false,
};
const MANIFEST_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' }, source: { type: 'string' },
          heading: { type: 'string' }, qCount: { type: 'integer' },
          file: { type: 'string' },
          domainHint: { type: 'array', items: { type: 'integer' } },
        },
        required: ['id', 'source', 'heading', 'qCount', 'file', 'domainHint'],
        additionalProperties: false,
      },
    },
  },
  required: ['items'], additionalProperties: false,
};
const GEN_SCHEMA = {
  type: 'object',
  properties: { questions: { type: 'array', items: QUESTION } },
  required: ['questions'], additionalProperties: false,
};
const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    sectionId: { type: 'string' }, source: { type: 'string' },
    dropped: { type: 'integer' },
    kept: { type: 'array', items: QUESTION },
  },
  required: ['sectionId', 'source', 'kept', 'dropped'], additionalProperties: false,
};

const BASE = '/Users/nguyenthang/Workspace/aif-c001/exam-trainer/';

const genPrompt = (m) => `You are the question writer for the AWS Certified AI Practitioner (AIF-C01) exam.
Read the notes file: ${BASE}${m.file}

Generate EXACTLY ${m.qCount} exam-style multiple-choice questions, STRICTLY GROUNDED in the concepts in that file — do NOT add facts that aren't in the notes.

Requirements:
- The stem and the answer options must be written in ENGLISH, in an authentic AWS exam voice (realistic scenario, concise, doesn't leak the answer).
- Single-answer: 4 options A–D. Only use multi-answer (Choose TWO, 5 options A–E) when the notes genuinely contain 2 independently correct facts — at most ~1/5 of questions should be multi, the rest single.
- VARY the position of the correct answer (don't make it all B); distractor options must be plausible and mutually exclusive.
- Each question includes an "explanation" written in ENGLISH: explain why the correct answer is right and why the other options are wrong, staying grounded in the notes.
- Assign "domain" (1–5) based on the question's content. Domain hint for this section: ${JSON.stringify(m.domainHint)}.
- Assign "difficulty": easy/medium/hard, with a reasonable distribution.
Return exactly per the schema.`;

const verifyPrompt = (m, questions) => `You are an extremely strict AWS AIF-C01 exam reviewer.
Re-read the original notes file: ${BASE}${m.file}

Here are the candidate questions (JSON):
${JSON.stringify(questions)}

For EACH question, check:
1. Is the marked answer CORRECT and uniquely defensible from the notes? If not → fix "answer".
2. For single-answer questions: are there TWO options that are both correct? If so and it can't be fixed → DROP.
3. Is the question ambiguous, testing a fact NOT in the notes, or a duplicate of another question's idea? → DROP.
4. Are the distractor options plausible and mutually exclusive? Is the explanation correct? Fix if needed.

Return only the "kept" list of questions that PASS (fully corrected, keeping each question's schema), plus "dropped" = the number of questions removed, "sectionId"="${m.id}", "source"="${m.source}". If all of them are bad, kept can be empty.`;

phase('Bootstrap');
const manifest = await agent(
  `Read the JSON file at ${BASE}data/manifest.json and return its full content (the array of sections) per the schema.`,
  { schema: MANIFEST_SCHEMA, agentType: 'general-purpose', label: 'load-manifest' }
);
const items = manifest.items;
log(`Loaded ${items.length} sections, planned ${items.reduce((a, m) => a + m.qCount, 0)} questions`);

phase('Generate + Verify');
const results = await pipeline(
  items,
  (m) => agent(genPrompt(m), { schema: GEN_SCHEMA, agentType: 'general-purpose', label: `gen:${m.id}`, phase: 'Generate' }),
  (gen, m) => agent(verifyPrompt(m, gen.questions), { schema: VERIFY_SCHEMA, agentType: 'general-purpose', label: `verify:${m.id}`, phase: 'Verify' }),
);

const ok = results.filter(Boolean);
const totalKept = ok.reduce((a, r) => a + r.kept.length, 0);
const totalDropped = ok.reduce((a, r) => a + (r.dropped || 0), 0);
log(`DONE: kept ${totalKept}, dropped ${totalDropped}, sections ok ${ok.length}/${items.length}`);

// Return summary; full questions harvested from journal.jsonl by scripts/assemble-pool.mjs
return {
  totalKept, totalDropped, sectionsOk: ok.length, sectionsTotal: items.length,
  bySection: ok.map(r => ({ id: r.sectionId, source: r.source, kept: r.kept.length, dropped: r.dropped })),
};
