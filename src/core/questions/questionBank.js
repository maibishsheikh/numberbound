// src/core/questions/questionBank.js
// Procedural question generator -- 100 questions, 10 types, 10 worlds.
// Topic: Reading and Writing Numbers 0-100, Grade 1 (Singapore MOE P1.2).
//
// Every world's 10 questions are generated around that world's own theme
// (see WORLD_THEMES) -- e.g. "Counting Corner" questions are always about
// stars, "Piggy Bank" questions are always about coins -- rather than
// drawing from one generic, world-agnostic pool.
//
// Core skill taught: reading and writing numbers 0-100 -- counting a set,
// converting numerals to/from number words, decomposing into tens and
// ones, ordering, and number-before/after fluency -- at Grade 1 level.
import { BADGES } from '../../config/worlds.config.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// -- Number <-> word conversion (0-100) --
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

export function numberToWord(n) {
  if (n < 0 || n > 100 || !Number.isInteger(n)) return '';
  if (n === 100) return 'one hundred';
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  const o = n % 10;
  return o === 0 ? t : `${t}-${ONES[o]}`;
}

// Singapore-context names used in word problems (no English names, per
// platform story-phase requirement -- kept consistent throughout Practice
// question text too).
const NAMES = ['Wei Ming', 'Priya', 'Farhan', 'Siti', 'Li Hua', 'Arjun', 'Kavitha', 'Zhi Hao', 'Nabila', 'Ravi'];

// -- World themes --
// Mirrors the 10 worlds in config/worlds.config.js (by index). Each theme
// supplies the object noun / count range every question in that world is
// built around -- keeps each world's 10 questions feeling distinct and
// on-theme, e.g. Counting Corner questions are always about stars.
const WORLD_THEMES = [
  { icon: '🌟', object: 'stars',       min: 0,  max: 10  }, // 0 Counting Corner
  { icon: '🍎', object: 'apples',      min: 0,  max: 10  }, // 1 Fruit Stall
  { icon: '🧸', object: 'toy cars',    min: 11, max: 20  }, // 2 Toy Box
  { icon: '📔', object: 'stickers',    min: 11, max: 20  }, // 3 Sticker Album
  { icon: '🥕', object: 'carrots',     min: 21, max: 40  }, // 4 Market Day
  { icon: '📚', object: 'books',       min: 21, max: 40  }, // 5 School Bookshop
  { icon: '🐷', object: 'coins',       min: 41, max: 100 }, // 6 Piggy Bank
  { icon: '🏅', object: 'points',      min: 41, max: 100 }, // 7 Sports Day
  { icon: '📖', object: 'library books', min: 0, max: 100 }, // 8 Library Adventure
  { icon: '💯', object: 'number cards', min: 0, max: 100 }, // 9 Number Explorer (finale)
];

// Difficulty rises with world index: worlds 0-1 easy, 2-5 medium, 6-9 hard.
function difficultyForWorld(worldId) {
  if (worldId <= 1) return 1;
  if (worldId <= 5) return 2;
  return 3;
}

// Numeric-answer distractors -- plausible nearby values (classic
// off-by-a-bit misreads), clamped to the world's range.
function numericDistractors(correct, min, max) {
  const pool = new Set();
  const add = (v) => { if (v >= min && v <= max && v !== correct) pool.add(v); };
  [1, 2, -1, -2, 10, -10].forEach((d) => add(correct + d));
  let arr = shuffleArray([...pool]).slice(0, 3);
  let guard = 0;
  while (arr.length < 3 && guard < 30) {
    guard++;
    const cand = randInt(min, max);
    if (cand !== correct && !arr.includes(cand)) arr.push(cand);
  }
  return shuffleArray([correct, ...arr.slice(0, 3)]);
}

function wordDistractors(correct, min, max) {
  const correctNum = numberFromWord(correct, min, max);
  const nums = numericDistractors(correctNum, min, max).filter((n) => n !== correctNum);
  return nums.map(numberToWord);
}

// Helper: recover the source numeral of a word we generated (words are
// always generated from a known numeral in this file, so a reverse
// lookup table isn't needed -- callers pass the numeral alongside).
function numberFromWord(word, min, max) {
  for (let i = min; i <= max; i++) if (numberToWord(i) === word) return i;
  return min;
}

// -- Q1: Count a set of objects and choose the numeral --
function genQ1(id, diff, theme) {
  const correct = randInt(theme.min, theme.max);
  return {
    id, type: 'count_choose_numeral', world: 0, difficulty: diff,
    visual: 'objects', visualCount: correct, visualObject: theme.object, visualIcon: theme.icon,
    questionText: `${theme.icon} Count the ${theme.object}. How many are there?`,
    hint1: `Try counting each ${theme.object.replace(/s$/, '')} one by one, in groups of ten.`,
    hint2: `There are ${Math.floor(correct / 10)} full group(s) of ten and ${correct % 10} extra.`,
    explanation: `There are ${correct} ${theme.object}. The number is ${correct} (${numberToWord(correct)}).`,
    options: numericDistractors(correct, theme.min, theme.max).map(String),
    correctAnswer: String(correct),
  };
}

// -- Q2: Numeral -> number word --
function genQ2(id, diff, theme) {
  const num = randInt(theme.min, theme.max);
  const correct = numberToWord(num);
  return {
    id, type: 'numeral_to_word', world: 0, difficulty: diff, visual: 'none',
    questionText: `${theme.icon} What is the number word for "${num}"?`,
    hint1: 'Say the number out loud -- how does it sound?',
    hint2: num >= 10 ? `This number has ${Math.floor(num / 10)} ten(s) and ${num % 10} one(s).` : `Count up from zero to ${num}.`,
    explanation: `${num} is written as "${correct}".`,
    options: shuffleArray([correct, ...wordDistractors(correct, theme.min, theme.max)]),
    correctAnswer: correct,
  };
}

// -- Q3: True/False -- does this numeral-word pair actually match? --
function genQ3(id, diff, theme) {
  const num = randInt(theme.min, theme.max);
  const isTrue = Math.random() > 0.5;
  const shownWord = isTrue ? numberToWord(num) : numberToWord(pick(numericDistractors(num, theme.min, theme.max).filter((n) => n !== num)) ?? num);
  return {
    id, type: 'numeral_word_match_check', world: 0, difficulty: diff, visual: 'none',
    questionText: `${theme.icon} True or False: ${num} is written as "${shownWord}".`,
    hint1: 'Break the number into tens and ones, then say it out loud.',
    hint2: `${num} is actually "${numberToWord(num)}".`,
    explanation: isTrue ? `That's correct -- ${num} is "${numberToWord(num)}".` : `That's not correct -- ${num} is really "${numberToWord(num)}", not "${shownWord}".`,
    options: ['True', 'False'],
    correctAnswer: isTrue ? 'True' : 'False',
  };
}

// -- Q4: Fill in the blank -- ___ tens and N ones = ? --
function genQ4(id, diff, theme) {
  const min = Math.max(theme.min, 10);
  const num = randInt(min, theme.max);
  const t = Math.floor(num / 10);
  const o = num % 10;
  return {
    id, type: 'tens_ones_fill', world: 0, difficulty: diff,
    visual: 'blocks', visualTens: t, visualOnes: o,
    questionText: `${theme.icon} ${t} ten${t !== 1 ? 's' : ''} and ${o} one${o !== 1 ? 's' : ''} = ?`,
    hint1: 'Count the tens sticks first -- each one is worth 10!',
    hint2: `${t} tens = ${t * 10}. Now add ${o} more.`,
    explanation: `${t} tens and ${o} ones = ${t * 10} + ${o} = ${num}.`,
    options: numericDistractors(num, theme.min, theme.max).map(String),
    correctAnswer: String(num),
  };
}

// -- Q5: Read base-10 blocks directly --
function genQ5(id, diff, theme) {
  const min = Math.max(theme.min, 10);
  const num = randInt(min, theme.max);
  const t = Math.floor(num / 10);
  const o = num % 10;
  return {
    id, type: 'base10_read', world: 0, difficulty: diff,
    visual: 'blocks', visualTens: t, visualOnes: o,
    questionText: `${theme.icon} What number do these base-10 blocks show?`,
    hint1: 'Each long stick = 10, each small cube = 1.',
    hint2: `Count: ${t} stick(s) and ${o} cube(s).`,
    explanation: `${t} tens + ${o} ones = ${num}.`,
    options: numericDistractors(num, theme.min, theme.max).map(String),
    correctAnswer: String(num),
  };
}

// -- Q6: Number before / after --
function genQ6(id, diff, theme) {
  const min = Math.max(theme.min, 1);
  const num = randInt(min, theme.max - 1);
  const isBefore = Math.random() > 0.5;
  const correct = isBefore ? num - 1 : num + 1;
  return {
    id, type: 'before_after', world: 0, difficulty: diff, visual: 'none',
    questionText: `${theme.icon} What number comes ${isBefore ? 'before' : 'after'} ${num}?`,
    hint1: `Think: ${num} ${isBefore ? 'minus' : 'plus'} 1.`,
    hint2: `Count: ${isBefore ? `..., ?, ${num}` : `${num}, ?, ...`}`,
    explanation: `The number ${isBefore ? 'before' : 'after'} ${num} is ${correct}.`,
    options: numericDistractors(correct, theme.min, theme.max).map(String),
    correctAnswer: String(correct),
  };
}

// -- Q7: Number word -> numeral --
function genQ7(id, diff, theme) {
  const num = randInt(theme.min, theme.max);
  const word = numberToWord(num);
  return {
    id, type: 'word_to_numeral', world: 0, difficulty: diff, visual: 'none',
    questionText: `${theme.icon} Write the numeral for "${word}".`,
    hint1: 'Break the word into parts -- tens and ones.',
    hint2: `"${word}" -- think about what each part means.`,
    explanation: `"${word}" = ${num}.`,
    options: numericDistractors(num, theme.min, theme.max).map(String),
    correctAnswer: String(num),
  };
}

// -- Q8: Ordering -- pick the correctly-ordered list --
function genQ8(id, diff, theme) {
  const nums = [];
  while (nums.length < 4) {
    const n = randInt(theme.min, theme.max);
    if (!nums.includes(n)) nums.push(n);
  }
  const sorted = [...nums].sort((a, b) => a - b);
  const correct = sorted.join(', ');
  const wrongOrders = new Set();
  let guard = 0;
  while (wrongOrders.size < 3 && guard < 20) {
    guard++;
    const shuffled = shuffleArray(nums).join(', ');
    if (shuffled !== correct) wrongOrders.add(shuffled);
  }
  return {
    id, type: 'ordering_mcq', world: 0, difficulty: diff, visual: 'none',
    questionText: `${theme.icon} Which list has these numbers in order from smallest to largest? ${nums.join(', ')}`,
    hint1: 'Find the smallest number first!',
    hint2: `The smallest is ${sorted[0]}, the largest is ${sorted[sorted.length - 1]}.`,
    explanation: `Correct order: ${correct}.`,
    options: shuffleArray([correct, ...wrongOrders]),
    correctAnswer: correct,
  };
}

// -- Q9: Quick Picture -- count a grouped picture of objects --
function genQ9(id, diff, theme) {
  const correct = randInt(theme.min, theme.max);
  return {
    id, type: 'picture_count', world: 0, difficulty: diff,
    visual: 'picture', visualCount: correct, visualObject: theme.object, visualIcon: theme.icon,
    questionText: `${theme.icon} Look at the picture. How many ${theme.object} are shown?`,
    hint1: 'Count the full groups of ten first, then add the extra ones.',
    hint2: `There are ${Math.floor(correct / 10)} group(s) of ten and ${correct % 10} extra.`,
    explanation: `The picture shows ${correct} ${theme.object}.`,
    options: numericDistractors(correct, theme.min, theme.max).map(String),
    correctAnswer: String(correct),
  };
}

// -- Q10: Word problem, Singapore context --
function genQ10(id, diff, theme) {
  const num = randInt(theme.min, theme.max);
  const name = pick(NAMES);
  const word = numberToWord(num);
  const wantsWord = Math.random() > 0.5;
  const questionText = wantsWord
    ? `${theme.icon} ${name} has ${num} ${theme.object}. Write this number in words.`
    : `${theme.icon} ${name} has ${word} ${theme.object}. Write this as a numeral.`;
  const correct = wantsWord ? word : String(num);
  const options = wantsWord
    ? shuffleArray([correct, ...wordDistractors(correct, theme.min, theme.max)])
    : numericDistractors(num, theme.min, theme.max).map(String);
  return {
    id, type: 'word_problem', world: 0, difficulty: diff, visual: 'none',
    questionText,
    hint1: 'Read the question carefully -- what is being asked?',
    hint2: `The key number in this problem is ${num} (${word}).`,
    explanation: `${name} has ${num} (${word}) ${theme.object}.`,
    options,
    correctAnswer: correct,
  };
}

// One (type, genFn) pair per world -> each world gets exactly one question
// of every type, so every world still has full type variety, just themed.
const TYPE_GENERATORS = [
  ['count_choose_numeral',      genQ1],
  ['numeral_to_word',           genQ2],
  ['numeral_word_match_check',  genQ3],
  ['tens_ones_fill',            genQ4],
  ['base10_read',               genQ5],
  ['before_after',              genQ6],
  ['word_to_numeral',           genQ7],
  ['ordering_mcq',              genQ8],
  ['picture_count',             genQ9],
  ['word_problem',              genQ10],
];

export function generateSessionQuestions() {
  const all = [];
  for (let worldId = 0; worldId < WORLD_THEMES.length; worldId++) {
    const theme = WORLD_THEMES[worldId];
    const diff = difficultyForWorld(worldId);
    const worldQuestions = TYPE_GENERATORS.map(([type, genFn], i) =>
      genFn(`${type}_w${worldId}_${i}`, diff, theme)
    );
    shuffleArray(worldQuestions).forEach((q) => { q.world = worldId; all.push(q); });
  }
  return all;
}

export const BADGE_TESTS = {
  first_reading:   (s) => s.totalScore > 0,
  hot_streak:      (s) => s.maxStreak >= 5,
  station_star:    (s) => s.simulateDone,
  number_master:   (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  personal_best:   (s) => s.worldResults.some(w => w && w.correct === w.total),
  boss_slayer:     (s) => s.bossWon,
  full_journey:    (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter(b => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true; // direct phase/world switching is allowed throughout
}
