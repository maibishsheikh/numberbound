// src/features/wonder/wonder.constants.js
//
// Digits are fine to leave as digits -- text-to-speech reads "47" or
// "83" correctly. This text is narrated directly by wonderHookNarration().
export const WONDER_QUESTIONS = [
  {
    id: 1,
    emoji: '⭐',
    question: "If you had 47 stars, could you write that number in words instead of digits?",
    subtext: "What if there's a secret code that turns numbers into words?",
    narrationId: 'wonder_1',
  },
  {
    id: 2,
    emoji: '🗣️',
    question: "What if numbers could talk? What would sixty-seven look like written down?",
    subtext: "Every number has a name, and a hidden shape made of tens and ones.",
    narrationId: 'wonder_2',
  },
  {
    id: 3,
    emoji: '🧱',
    question: "Can you guess how many blocks are hiding inside the number 83?",
    subtext: "Numbers are like treasure chests -- let's open one and see what's inside.",
    narrationId: 'wonder_3',
  },
  {
    id: 4,
    emoji: '🍬',
    question: "If someone gave you twenty-five candies, how would you count them super fast?",
    subtext: "There's a magical trick using groups of ten.",
    narrationId: 'wonder_4',
  },
  {
    id: 5,
    emoji: '💯',
    question: "What comes after ninety-nine? And how do we write it?",
    subtext: "The biggest number we'll explore today has a very special name.",
    narrationId: 'wonder_5',
  },
];
