// src/features/simulate/simulations/WordMatchMission.jsx
// Station 4: "Word Match Mission" -- tap a numeral, then its matching number word.
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FeedbackOverlay from '../../../components/FeedbackOverlay.jsx';
import { numberToWord } from '../../../core/questions/questionBank.js';
import { distinctTargets } from './roundGen.js';

const PAIR_COUNT = 4;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordMatchMission({ onComplete, playNarration }) {
  const numbers = useMemo(() => distinctTargets(PAIR_COUNT, 1, 99), []);
  const numeralCards = useMemo(() => shuffleArray(numbers.map((n) => ({ id: `n${n}`, value: String(n), pair: n }))), [numbers]);
  const wordCards = useMemo(() => shuffleArray(numbers.map((n) => ({ id: `w${n}`, value: numberToWord(n), pair: n }))), [numbers]);

  const [selectedNumeral, setSelectedNumeral] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState([]); // array of pair values
  const [wrongCount, setWrongCount] = useState(0);
  const [flashWrong, setFlashWrong] = useState(false);
  const [done, setDone] = useState(false);

  function tryMatch(numeral, word) {
    if (numeral.pair === word.pair) {
      const nextMatched = [...matched, numeral.pair];
      setMatched(nextMatched);
      setSelectedNumeral(null);
      setSelectedWord(null);
      if (playNarration) playNarration([{ text: 'Great match!', style: 'encouragement' }]);
      if (nextMatched.length === PAIR_COUNT) {
        setDone(true);
        const stars = wrongCount === 0 ? 3 : wrongCount <= 2 ? 2 : 1;
        setTimeout(() => onComplete(stars), 1400);
      }
    } else {
      setWrongCount((c) => c + 1);
      setFlashWrong(true);
      if (playNarration) playNarration([{ text: 'Not quite a match -- try again!', style: 'encouragement' }]);
      setTimeout(() => {
        setFlashWrong(false);
        setSelectedNumeral(null);
        setSelectedWord(null);
      }, 700);
    }
  }

  function handleNumeralClick(card) {
    if (matched.includes(card.pair) || flashWrong) return;
    setSelectedNumeral(card);
    if (selectedWord) tryMatch(card, selectedWord);
  }
  function handleWordClick(card) {
    if (matched.includes(card.pair) || flashWrong) return;
    setSelectedWord(card);
    if (selectedNumeral) tryMatch(selectedNumeral, card);
  }

  return (
    <div className="simulate-card glass-card">
      <div className="mission-header">
        <h3>📖 Word Match Mission</h3>
        <span className="mission-round-badge">{matched.length} / {PAIR_COUNT} matched</span>
      </div>

      <p className="mission-instruction">Tap a numeral, then tap its matching number word.</p>

      <div className="matching-grid">
        <div className="matching-column">
          {numeralCards.map((card) => (
            <button
              key={card.id}
              className={`match-card ${matched.includes(card.pair) ? 'matched' : ''} ${selectedNumeral?.id === card.id ? 'selected' : ''} ${flashWrong && selectedNumeral?.id === card.id ? 'wrong' : ''}`}
              onClick={() => handleNumeralClick(card)}
              disabled={matched.includes(card.pair)}
            >
              {card.value}
            </button>
          ))}
        </div>
        <div className="matching-column">
          {wordCards.map((card) => (
            <button
              key={card.id}
              className={`match-card ${matched.includes(card.pair) ? 'matched' : ''} ${selectedWord?.id === card.id ? 'selected' : ''} ${flashWrong && selectedWord?.id === card.id ? 'wrong' : ''}`}
              onClick={() => handleWordClick(card)}
              disabled={matched.includes(card.pair)}
            >
              {card.value}
            </button>
          ))}
        </div>
      </div>

      <motion.div className="mission-filled-readout" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Mismatches so far: <strong>{wrongCount}</strong>
      </motion.div>

      <FeedbackOverlay
        visible={done}
        correct={true}
        message="All matched! Fantastic work! 🎉"
      />
    </div>
  );
}
