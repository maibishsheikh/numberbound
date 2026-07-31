// src/features/simulate/simulations/Base10BlockMission.jsx
// Station 3: "Block Builder Mission" -- build 2-digit numbers with tens sticks + ones cubes.
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import FeedbackOverlay from '../../../components/FeedbackOverlay.jsx';
import { Base10Blocks } from '../../../components/NumberVisuals.jsx';
import { distinctTargets } from './roundGen.js';

const ROUNDS = 3;

export default function Base10BlockMission({ onComplete, playNarration }) {
  const targets = useMemo(() => distinctTargets(ROUNDS, 21, 99), []);
  const [round, setRound] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const target = targets[round];
  const targetTens = Math.floor(target / 10);
  const targetOnes = target % 10;
  const built = tens * 10 + ones;

  function adjustTens(delta) {
    if (locked) return;
    setTens((t) => Math.max(0, Math.min(9, t + delta)));
  }
  function adjustOnes(delta) {
    if (locked) return;
    setOnes((o) => Math.max(0, Math.min(9, o + delta)));
  }

  function handleSubmit() {
    if (locked) return;
    const isCorrect = built === target;
    setLocked(true);
    setLastCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (playNarration) {
      playNarration([{
        text: isCorrect ? 'Great building! You made the number exactly right!' : `${target} is ${targetTens} tens and ${targetOnes} ones.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleDismiss() {
    setLocked(false);
    setTens(0);
    setOnes(0);
    if (round + 1 >= ROUNDS) {
      const stars = correctCount >= 3 ? 3 : correctCount >= 2 ? 2 : correctCount >= 1 ? 1 : 0;
      onComplete(stars);
    } else {
      setRound((r) => r + 1);
    }
  }

  return (
    <div className="simulate-card glass-card">
      <div className="mission-header">
        <h3>🧱 Block Builder Mission</h3>
        <span className="mission-round-badge">Round {round + 1} / {ROUNDS}</span>
      </div>

      <p className="mission-instruction">
        Use the tens and ones controls to build the number <strong>{target}</strong>.
      </p>

      <div className="question-visual">
        <Base10Blocks tens={tens} ones={ones} />
      </div>

      <div className="mission-ones-controls">
        <button className="block-control-btn" onClick={() => adjustTens(-1)} disabled={locked}>➖</button>
        <span className="mission-filled-readout">Tens: <strong>{tens}</strong></span>
        <button className="block-control-btn" onClick={() => adjustTens(1)} disabled={locked}>➕</button>
      </div>
      <div className="mission-ones-controls">
        <button className="block-control-btn" onClick={() => adjustOnes(-1)} disabled={locked}>➖</button>
        <span className="mission-filled-readout">Ones: <strong>{ones}</strong></span>
        <button className="block-control-btn" onClick={() => adjustOnes(1)} disabled={locked}>➕</button>
      </div>

      <div className="mission-filled-readout">Total so far: <strong>{built}</strong></div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Button variant="primary" onClick={handleSubmit} disabled={locked}>
          Check My Answer ✅
        </Button>
      </motion.div>

      <FeedbackOverlay
        visible={locked}
        correct={lastCorrect}
        message={lastCorrect ? 'Excellent! 🎉' : `It should be ${target} -- ${targetTens} tens and ${targetOnes} ones!`}
        onDismiss={handleDismiss}
        autoAdvanceMs={1800}
      />
    </div>
  );
}
