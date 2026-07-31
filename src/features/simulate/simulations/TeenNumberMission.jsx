// src/features/simulate/simulations/TeenNumberMission.jsx
// Station 2: "Toy Box Mission" -- build teen numbers (11-20) as 10 + extra ones.
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import FeedbackOverlay from '../../../components/FeedbackOverlay.jsx';
import { TenFrame } from '../../../components/NumberVisuals.jsx';
import { distinctTargets } from './roundGen.js';

const ROUNDS = 3;

export default function TeenNumberMission({ onComplete, playNarration }) {
  const targets = useMemo(() => distinctTargets(ROUNDS, 11, 20), []);
  const [round, setRound] = useState(0);
  const [ones, setOnes] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const target = targets[round];
  const targetOnes = target - 10;
  const built = 10 + ones;

  function adjust(delta) {
    if (locked) return;
    setOnes((o) => Math.max(0, Math.min(10, o + delta)));
  }

  function handleSubmit() {
    if (locked) return;
    const isCorrect = built === target;
    setLocked(true);
    setLastCorrect(isCorrect);
    if (isCorrect) setCorrectCount((c) => c + 1);
    if (playNarration) {
      playNarration([{
        text: isCorrect ? 'Perfect! One full ten, plus the extra ones!' : `${target} is 1 ten and ${targetOnes} ones.`,
        style: 'encouragement',
      }]);
    }
  }

  function handleDismiss() {
    setLocked(false);
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
        <h3>🧸 Toy Box Mission</h3>
        <span className="mission-round-badge">Round {round + 1} / {ROUNDS}</span>
      </div>

      <p className="mission-instruction">
        Build <strong>{target}</strong> toy cars: one full ten-frame, plus extra ones.
      </p>

      <div className="question-visual" style={{ flexDirection: 'column', gap: 14 }}>
        <div className="mission-block-label">1 full ten 🧸</div>
        <TenFrame filled={10} />
        <div className="mission-block-label">+ extra ones</div>
        <TenFrame filled={ones} max={10} />
      </div>

      <div className="mission-ones-controls">
        <button className="block-control-btn" onClick={() => adjust(-1)} disabled={locked}>➖</button>
        <span className="mission-filled-readout">Extra ones: <strong>{ones}</strong></span>
        <button className="block-control-btn" onClick={() => adjust(1)} disabled={locked}>➕</button>
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
        message={lastCorrect ? 'Excellent! 🎉' : `It should be ${target} -- 1 ten and ${targetOnes} ones!`}
        onDismiss={handleDismiss}
        autoAdvanceMs={1800}
      />
    </div>
  );
}
