# AIF-C01 Exam Trainer

An app for practicing the **AWS Certified AI Practitioner (AIF-C01)** exam in the real exam format, running fully static (no backend needed). The question bank is generated + verified from the notes in `../AIF-C01-Knowledge/`.

## Features

- **Exam mode:** 65 questions drawn by the 5-domain weighting (20/24/28/14/14%), a 90-minute countdown timer, flagging, a review screen before submitting, and scoring on a 100–1000 scale (pass at 700) with a correct/wrong breakdown per domain.
- **Practice mode (by domain):** pick a domain, with feedback + explanation right after each question.
- **Answer shuffling** on every render → prevents memorizing answer positions.
- **Progress saving** (attempt history, previously-missed questions) in `localStorage`.

## Run

```bash
npm install
npm run dev       # dev server
npm run build     # build static output to dist/
npm run preview   # preview the build
```

## Data pipeline

The question bank (`src/data/pool.json`) is created via 3 steps:

```bash
npm run extract         # parts/*.md → 193 sections + manifest.json
# → run the generate + verify workflow (scripts/generate-pool.workflow.mjs)
npm run parse-original  # 128 original questions in the wiki → src/data/original.json
npm run assemble        # collect verify results + merge curated → src/data/pool.json
```

- `scripts/extract-sections.mjs` — cuts the notes into 193 sections, computing the number of questions per section by length.
- `scripts/generate-pool.workflow.mjs` — a multi-agent workflow: each section **generates** 4–6 questions grounded in the notes, then an agent **verifies** the answers, discarding ambiguous/wrong/two-answer questions.
- `scripts/assemble-pool.mjs` — validates each question (valid answer, no duplicates), merges with the set of 128 curated questions.

## Deploy

A static build, deployable to GitHub Pages / Vercel / Netlify. `vite.config.ts` sets `base: './'` so it works at both the root and a subpath.
