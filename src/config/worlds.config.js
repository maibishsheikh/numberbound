// src/config/worlds.config.js
// 10 worlds across 5 number-range tiers (mirrors Singapore P1 syllabus
// progression: 0-10 -> 11-20 -> 21-40 -> 41-100 -> full-range number words).
export const WORLDS = [
  { id: 0, name: 'Counting Corner',   emoji: '🌟', accent: '#42a5f5',
    description: 'Count stars and toys from 0 to 10',
    boss: { name: 'Counting Cloud',    emoji: '☁️', reward: 'Counting Corner Badge 🌟' } },
  { id: 1, name: 'Fruit Stall',       emoji: '🍎', accent: '#66bb6a',
    description: 'Count fruit at the fruit stall, 0 to 10',
    boss: { name: 'Fruit Stall Boss',  emoji: '🍉', reward: 'Fruit Stall Badge 🍎' } },
  { id: 2, name: 'Toy Box',           emoji: '🧸', accent: '#ff7043',
    description: 'Discover teen numbers, 11 to 20',
    boss: { name: 'Toy Box Boss',      emoji: '🪀', reward: 'Toy Box Badge 🧸' } },
  { id: 3, name: 'Sticker Album',     emoji: '📔', accent: '#ec407a',
    description: 'Count stickers, 11 to 20',
    boss: { name: 'Sticker Boss',      emoji: '✨', reward: 'Sticker Album Badge 📔' } },
  { id: 4, name: 'Market Day',        emoji: '🥕', accent: '#8d6e63',
    description: 'Build numbers with tens and ones, 21 to 40',
    boss: { name: 'Market Day Boss',   emoji: '🧺', reward: 'Market Day Badge 🥕' } },
  { id: 5, name: 'School Bookshop',   emoji: '📚', accent: '#ba68c8',
    description: 'Count books with base-10 blocks, 21 to 40',
    boss: { name: 'Bookshop Boss',     emoji: '📖', reward: 'School Bookshop Badge 📚' } },
  { id: 6, name: 'Piggy Bank',        emoji: '🐷', accent: '#26c6da',
    description: 'Count coins saved, 41 to 100',
    boss: { name: 'Piggy Bank Boss',   emoji: '🪙', reward: 'Piggy Bank Badge 🐷' } },
  { id: 7, name: 'Sports Day',        emoji: '🏅', accent: '#fdd835',
    description: 'Count points scored, 41 to 100',
    boss: { name: 'Sports Day Boss',   emoji: '🏆', reward: 'Sports Day Badge 🏅' } },
  { id: 8, name: 'Library Adventure', emoji: '📖', accent: '#5c6bc0',
    description: 'Match numerals to number words, 0 to 100',
    boss: { name: 'Library Boss',      emoji: '🦉', reward: 'Library Adventure Badge 📖' } },
  { id: 9, name: 'Number Explorer',   emoji: '💯', accent: '#ff8f00',
    description: "Master every number skill with Wei Ming's journal, 0 to 100",
    boss: { name: 'Champion Explorer', emoji: '👑', reward: 'Finale Badge 💯' } },
];

// -- Practice modes (within each world) --
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// -- Badges --
export const BADGES = [
  { id: 'first_reading',   name: 'First Reading',    icon: '🏅', desc: 'First correct answer' },
  { id: 'hot_streak',      name: 'Hot Streak',       icon: '🔥', desc: '5 consecutive correct' },
  { id: 'station_star',    name: 'Station Star',     icon: '🥈', desc: 'Completed Simulate' },
  { id: 'number_master',   name: 'Number Master',    icon: '🥇', desc: '80%+ correct overall' },
  { id: 'personal_best',   name: 'Personal Best',    icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',     name: 'Boss Slayer',      icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',    name: 'Full Journey',     icon: '🌟', desc: 'Completed every phase' },
];

// -- XP economy --
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};
