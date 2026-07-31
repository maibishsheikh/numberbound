// src/features/simulate/simulations/TenFrameMission.jsx
// Station 1: "Star Counting Mission" -- build a number 0-10 on a ten-frame.
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import FeedbackOverlay from '../../../components/FeedbackOverlay.jsx';
import { TenFrame } from '../../../components/NumberVisuals.jsx';
import { distinctTargets } from './roundGen.js';

const ROUNDS = 3;

export default function TenFrameMission({ onComplete, playNarration }) {
  const targets = useMemo(() => distinctTargets(ROUNDS, 3, 10), []);
  const [round, setRound] = useState(0);
  const [filled, setFilled] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const target = targets[round];

  function handleCellClick(i) {
    if (locked) return;
    setFilled(i < filled ? i : i + 1);
  }

  function handleSubmit() {
    if (locked) return;
    const isCorrect = filled === target;
    setLocked(true);
    setLastCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (playNarration) {
      playNarration([{
        text: isCorrect ? 'Excellent! That\'s exactly right!' : `Not quite -- ${target} stars means filling ${target} cells.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleDismiss() {
    setLocked(false);
    setFilled(0);
    if (round + 1 >= ROUNDS) {
      const final = correctCount + (lastCorrect ? 0 : 0);
      const stars = final >= 3 ? 3 : final >= 2 ? 2 : final >= 1 ? 1 : 0;
      onComplete(stars);
    } else {
      setRound((r) => r + 1);
    }
  }

  return (
    <div className="simulate-card glass-card">
      <div className="mission-header">
        <h3>🌟 Star Counting Mission</h3>
        <span className="mission-round-badge">Round {round + 1} / {ROUNDS}</span>
      </div>

      <p className="mission-instruction">
        Tap the ten-frame to fill in exactly <strong>{target}</strong> star{target !== 1 ? 's' : ''}.
      </p>

      <div className="question-visual">
        <TenFrame filled={filled} onCellClick={handleCellClick} />
      </div>

      <div className="mission-filled-readout">You've filled: <strong>{filled}</strong></div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="primary" onClick={handleSubmit} disabled={filled === 0 || locked}>
          Check My Answer ✅
        </Button>
      </motion.div>

      <FeedbackOverlay
        visible={locked}
        correct={lastCorrect}
        message={lastCorrect ? 'Excellent! 🎉' : `It should be ${target} stars -- nice try!`}
        onDismiss={handleDismiss}
        autoAdvanceMs={1600}
      />
    </div>
  );
}
