// scripts/generate_audio.js
//
// Pre-generates all known narration phrases as .mp3 files into
// public/assets/audio/ and writes src/utils/audioMap.js.
//
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌  VITE_ELEVENLABS_API_KEY not set in .env.local');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

// ── Phrases to pre-generate ────────────────────────────────────────────────
// Every string here must exactly match the text passed to playNarration()
// in src/utils/narration.js, so audioMap.js lookups succeed at runtime.
// Generated from the segments actually fired by the app — keep this in
// sync whenever narration.js changes.
const phrases = [
  // WONDER — narrated text is wonder.question then wonder.subtext for each
  // WONDER_QUESTIONS entry, exactly as wonderHookNarration() emits them.
  { text: "If you had 47 stars, could you write that number in words instead of digits?", style: 'question' },
  { text: "What if there's a secret code that turns numbers into words?", style: 'thinking' },
  { text: "What if numbers could talk? What would sixty-seven look like written down?", style: 'question' },
  { text: "Every number has a name, and a hidden shape made of tens and ones.", style: 'thinking' },
  { text: "Can you guess how many blocks are hiding inside the number 83?", style: 'question' },
  { text: "Numbers are like treasure chests -- let's open one and see what's inside.", style: 'thinking' },
  { text: "If someone gave you twenty-five candies, how would you count them super fast?", style: 'question' },
  { text: "There's a magical trick using groups of ten.", style: 'thinking' },
  { text: "What comes after ninety-nine? And how do we write it?", style: 'question' },
  { text: "The biggest number we'll explore today has a very special name.", style: 'thinking' },
  // STORY — Wei Ming's Library Adventure (storyNarrations.readingNumbers, one segment per slide)
  { text: "One sunny morning, Wei Ming walked into the school library. He loved books, especially about dinosaurs! He looked around at the tall shelves full of colourful books and wondered how many were on just one shelf.", style: 'thinking' },
  { text: "The librarian smiled and said, we have forty-two books about dinosaurs! Wei Ming was puzzled. Forty-two? That sounded like a lot, but what did forty-two really mean?", style: 'instruction' },
  { text: "Then his classmate Priya showed him a trick! She grouped 4 bundles of ten books and 2 single books. Look, she said, 4 tens and 2 ones make 42! Suddenly, the number made perfect sense.", style: 'emphasis' },
  { text: "Wei Ming grinned. Now he could read and write any number from zero all the way to one hundred! Can we practise more, he asked Bintang the bear. And so, the number adventure began.", style: 'celebration' },
  // SIMULATE — simulationStationNarration(stationId)
  { text: "Star Counting Mission!", style: 'emphasis' },
  { text: "Tap the ten-frame to fill in exactly the right number of stars.", style: 'instruction' },
  { text: "Toy Box Mission!", style: 'emphasis' },
  { text: "Build teen numbers as one full ten, plus a few extra ones.", style: 'instruction' },
  { text: "Block Builder Mission!", style: 'emphasis' },
  { text: "Use the tens and ones controls to build each number with base-ten blocks.", style: 'instruction' },
  { text: "Word Match Mission!", style: 'emphasis' },
  { text: "Tap a numeral, then tap its matching number word.", style: 'instruction' },
  // PRACTICE — Boss Battle (bossBattleNarration / bossWinNarration)
  { text: "Boss battle time! Answer every question correctly to win.", style: 'emphasis' },
  { text: "Remember: break each number into tens and ones, then count up.", style: 'instruction' },
  { text: "Boss defeated! Fantastic number reading!", style: 'celebration' },
  // SIMULATE — Word Match Mission per-attempt feedback (the only mission
  // feedback that's fixed text; the other 3 missions narrate a target
  // number inline (e.g. "It should be 14 stars"), so that feedback is
  // generated live at runtime instead of pre-baked here -- same as the
  // 100 procedurally generated Practice-phase questions.
  { text: "Great match!", style: 'encouragement' },
  { text: "Not quite a match -- try again!", style: 'encouragement' },
];


// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 55);
}

// ── CLI args ──────────────────────────────────────────────────────────────
// node scripts/generate_audio.js --index 4
// node scripts/generate_audio.js --text "Hello there!" --style celebration
// node scripts/generate_audio.js --list                (show all phrases + indices)
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    console.log(`ℹ️   This single run does NOT rewrite audioMap.js — run without flags to regenerate the full map.`);
    return;
  }

  // No flags: full batch generation
  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    try {
      process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
      const buf = await generateAudio(text, style);
      fs.writeFileSync(filePath, buf);
      console.log(`✓ ${filename}`);
      generated++;
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`\n❌  Failed: ${err.message}`);
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. Generated ${generated} new files. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
