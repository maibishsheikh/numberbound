# Reading & Writing Numbers — Grade 1 Math Module

Intellia SG · Singapore MOE-aligned gamified math module, rebuilt onto the
shared five-phase reference architecture (Wonder → Story → Simulate →
Practice → Reflect) established by the **line-graphs (Grade 4 Data
Handling)** reference module, so it shares the same UI, viewports, and
architecture while teaching its own Grade 1 content.

Story theme: **"Wei Ming's Library Adventure"** — Wei Ming visits the
school library and is puzzled by a big number ("forty-two books!") until
his classmate Priya shows him the tens-and-ones trick. Characters: Wei
Ming (protagonist), Priya (classmate), Bintang the bear 🐻 (mascot) — all
non-English names, per the platform's story-phase requirement.

Core skill taught: **reading and writing numbers 0–100** — counting a set
of objects, converting a numeral to/from its number word, decomposing a
number into tens and ones (concrete ten-frame → pictorial base-10 blocks →
abstract fill-in-the-blank), finding the number before/after, ordering a
small set of numbers, and solving a simple Singapore-context word problem.

## Setup

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

## Audio narration

This module ships with **no pre-generated audio** — `src/utils/audioMap.js`
is empty, matching the reference architecture. To generate static
narration for the hand-authored Wonder/Story/Simulate/Boss-Battle lines:

1. Add `VITE_ELEVENLABS_API_KEY=your_key` to a `.env.local` file at the
   project root.
2. Run `node scripts/generate_audio.js` (or `npm run generate-audio`).

This hits the ElevenLabs API for every phrase in `scripts/generate_audio.js`,
saves `.mp3` files into `public/assets/audio/`, and rewrites `audioMap.js`.
The 100 procedurally generated Practice-phase questions (and the Reflect
quiz sampled from them) are narrated **live** at runtime instead — every
question and its hint calls `playNarration()` on mount via `QuestionCard`
and `ReflectQuestion` — so they work with a live ElevenLabs key even
without being pre-generated; without a key, narration is silently skipped
rather than falling back to the browser's Web Speech API, by design.

Run `node scripts/clean_audio.js` afterwards to remove any orphaned `.mp3`
files no longer referenced in `audioMap.js`.

## Story images

Real story artwork ships in `src/assets/story/1.png`–`4.png`, one per
slide of "Wei Ming's Library Adventure". The display frame is CSS-capped
at 660px max-width × 210px height (175px on tablets, 140px on phones),
`object-fit: cover`, matching the reference module exactly.

## What's different from the line-graphs reference module

- **Topic:** Grade 1 Reading & Writing Numbers 0–100, replacing Grade 4
  line graphs. 10 worlds are grouped into 5 range tiers matching the
  Singapore P1 syllabus progression — Counting Corner & Fruit Stall
  (0–10), Toy Box & Sticker Album (11–20), Market Day & School Bookshop
  (21–40), Piggy Bank & Sports Day (41–100), and Library Adventure &
  Number Explorer (0–100, word-focused finale) — each world's 10
  questions generated around its own object/theme, exactly like the
  reference module's per-world theming.
- **Protagonist Wei Ming carried over**, joined by classmate Priya and
  mascot Bintang the bear — all non-English names throughout Story,
  Wonder, and every Practice-phase word problem.
- **"Play" phase relabelled "Practice"** throughout the UI, matching the
  reference (internal phase key `play` unchanged for backward
  compatibility).
- **New CPA visual components** in `src/components/NumberVisuals.jsx` —
  `TenFrame` (2×5 grid, 0–10), `Base10Blocks` (tens-sticks + ones-cubes),
  and `ObjectGroup` (concrete icons, auto-grouped into tens above 10) —
  replacing the reference module's SVG line graph, since these are how
  Grade 1 students actually build and read numbers.
- **4 new Simulate stations**, each a genuinely interactive live-build
  mission rather than a plain reveal-and-answer question, scored 0–3
  stars per station same as the reference:
  - 🌟 **Star Counting Mission** — tap a ten-frame to build a target
    number 0–10.
  - 🧸 **Toy Box Mission** — build a teen number as one full ten plus
    extra ones.
  - 🧱 **Block Builder Mission** — use tens/ones +/− controls to build a
    2-digit number with base-10 blocks.
  - 📖 **Word Match Mission** — a numeral/number-word matching game,
    scored on mismatch count.
- **10-type / 100-question procedural bank** (`src/core/questions/
  questionBank.js`) — count-and-choose, numeral→word, numeral/word
  true-false check, tens-and-ones fill-in-the-blank, base-10 block
  reading, before/after, word→numeral, ordering (pick the correctly
  sorted list), quick-picture counting, and Singapore-context word
  problems — distributed across 10 worlds and 3 difficulty tiers. Two
  of the original flat-architecture question types (free-form matching
  and free-form ordering) were redesigned as multiple-choice to fit this
  architecture's MCQ-only Practice/Reflect engine.
- **Reflect-phase quiz only draws from text-only question types**
  (`visual === 'none'`) since `ReflectQuestion` renders no visual aid —
  a stricter filter than the reference module needed, since more of this
  module's question types depend on a visual to answer.
- **Audio toggle placed at the top-left corner** on every screen (a
  platform design-system requirement); the home button moves to the
  top-right to avoid overlapping it.
- Design tokens, component library (`Button`, `Confetti`, `FeedbackOverlay`,
  `HintBubble`, `NumberPad`, `PhaseNav`, `ProgressRing`, `TopBar`, `XPBar`,
  `XPPopup`), badge/XP economy, and all four Practice modes (Guided/
  Independent/Timed/Boss) are carried over unchanged from the reference
  module, so this module looks and behaves like part of the same
  application.
