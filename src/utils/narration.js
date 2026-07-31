// src/utils/narration.js
//
// Every narration segment is a { text, style } object, where `style`
// selects a voice-setting preset from config/audio.config.js.
//
// Digits are spoken naturally by text-to-speech ("47", "83") so no
// rewriting is needed for numerals themselves. spokenSafe() is kept as
// a general-purpose cleanup pass (e.g. stripping stray symbols) so
// procedurally generated Practice-phase question text is always safe
// to narrate as-is.
export function spokenSafe(text) {
  if (!text) return text;
  let t = text;
  t = t.replace(/\$(\d+)/g, '$1 dollars');
  t = t.replace(/["“”]/g, '');
  return t;
}

// ── Story narration ──
// One segment per slide, in slide order. StoryPhase.jsx plays
// storyNarrations.readingNumbers[currentSlide] whenever the slide changes.
export const storyNarrations = {
  readingNumbers: [
    {
      text: "One sunny morning, Wei Ming walked into the school library. He loved books, especially about dinosaurs! He looked around at the tall shelves full of colourful books and wondered how many were on just one shelf.",
      style: 'thinking',
    },
    {
      text: "The librarian smiled and said, we have forty-two books about dinosaurs! Wei Ming was puzzled. Forty-two? That sounded like a lot, but what did forty-two really mean?",
      style: 'instruction',
    },
    {
      text: "Then his classmate Priya showed him a trick! She grouped 4 bundles of ten books and 2 single books. Look, she said, 4 tens and 2 ones make 42! Suddenly, the number made perfect sense.",
      style: 'emphasis',
    },
    {
      text: "Wei Ming grinned. Now he could read and write any number from zero all the way to one hundred! Can we practise more, he asked Bintang the bear. And so, the number adventure began.",
      style: 'celebration',
    },
  ],
};

// ── Wonder-hook narration ──
// Speaks the hook question, then its follow-up subtext.
export function wonderHookNarration(wonder) {
  if (!wonder) return [];
  const segments = [];
  if (wonder.question) segments.push({ text: wonder.question, style: 'question' });
  if (wonder.subtext) segments.push({ text: wonder.subtext, style: 'thinking' });
  return segments;
}

// ── Simulate station intro narration ──
export function simulationStationNarration(stationId) {
  const scripts = [
    [
      { text: 'Star Counting Mission!', style: 'emphasis' },
      { text: 'Tap the ten-frame to fill in exactly the right number of stars.', style: 'instruction' },
    ],
    [
      { text: 'Toy Box Mission!', style: 'emphasis' },
      { text: 'Build teen numbers as one full ten, plus a few extra ones.', style: 'instruction' },
    ],
    [
      { text: 'Block Builder Mission!', style: 'emphasis' },
      { text: 'Use the tens and ones controls to build each number with base-ten blocks.', style: 'instruction' },
    ],
    [
      { text: 'Word Match Mission!', style: 'emphasis' },
      { text: 'Tap a numeral, then tap its matching number word.', style: 'instruction' },
    ],
  ];
  return scripts[stationId] || [];
}

// ── Boss Battle narration ──
export function bossBattleNarration() {
  return [
    { text: 'Boss battle time! Answer every question correctly to win.', style: 'emphasis' },
    { text: 'Remember: break each number into tens and ones, then count up.', style: 'instruction' },
  ];
}

export function bossWinNarration() {
  return [
    { text: 'Boss defeated! Fantastic number reading!', style: 'celebration' },
  ];
}
