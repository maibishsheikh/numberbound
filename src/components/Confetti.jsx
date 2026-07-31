// src/components/Confetti.jsx
// Lightweight celebratory confetti burst — pure CSS/Framer Motion, no
// external dependency. Renders a fixed overlay of falling pieces for a
// few seconds. Used on world-complete, boss-battle wins, and finishing
// the Reflect-phase quiz.
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#ffb300', '#29b6f6', '#66bb6a', '#ec407a', '#ba68c8', '#ff8f00'];

export default function Confetti({ count = 36 }) {
  const pieces = useMemo(() => (
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 1.6 + Math.random() * 1.2,
      rotate: Math.random() * 360,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
    }))
  ), [count]);

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, background: p.color, width: p.size, height: p.size * 1.6 }}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}
