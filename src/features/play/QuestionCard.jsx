// src/features/play/QuestionCard.jsx
import React, { useEffect, useRef } from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import { ObjectGroup, Base10Blocks } from '../../components/NumberVisuals.jsx';
import { spokenSafe } from '../../utils/narration.js';
import { useNumberKeySelect } from '../../core/hooks/useKeyboard.js';
import { WORLDS } from '../../config/worlds.config.js';

/**
 * Renders a single question card with topic badge, visual aid,
 * question text, option grid, optional hint, and mascot row.
 *
 * If `playNarration` is supplied, the question text is narrated once
 * automatically whenever `question.id` changes (every question gets its
 * own voice narration), and the hint is narrated the moment it's first
 * shown -- both routed through spokenSafe() so text-to-speech reads
 * everything naturally.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
  playNarration,
}) {
  const { questionText, visual, options, correctAnswer, explanation,
    visualCount, visualObject, visualIcon, visualTens, visualOnes, world } = question;

  // The badge always names the question's own world/theme (e.g. "🐷 Piggy
  // Bank"), matching the world card the player chose -- not the internal
  // question-type key.
  const worldInfo = WORLDS[world];
  const topicLabel = worldInfo ? `${worldInfo.emoji} ${worldInfo.name}` : '';

  const narratedQIdRef = useRef(null);
  const narratedHintQIdRef = useRef(null);

  // Narrate the question itself once per question.
  useEffect(() => {
    if (!playNarration || !question?.id) return;
    if (narratedQIdRef.current === question.id) return;
    narratedQIdRef.current = question.id;
    playNarration([{ text: spokenSafe(questionText), style: 'question' }]);
  }, [question?.id, questionText, playNarration]);

  // Narrate the hint the moment it first appears for this question.
  useEffect(() => {
    if (!playNarration || !showHint || confirmed || !question?.id) return;
    if (narratedHintQIdRef.current === question.id) return;
    narratedHintQIdRef.current = question.id;
    playNarration([{ text: spokenSafe(question.hint1), style: 'instruction' }]);
  }, [showHint, confirmed, question?.id, question?.hint1, playNarration]);

  // Press 1..N on the keyboard to pick an option, mirroring the on-screen taps.
  useNumberKeySelect(options.length, (idx) => onSelect(options[idx]), !confirmed);

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Visual aid */}
      {(visual === 'objects' || visual === 'picture') && (
        <div className="question-visual">
          <ObjectGroup count={visualCount} icon={visualIcon || '⭐'} />
        </div>
      )}
      {visual === 'blocks' && (
        <div className="question-visual">
          <Base10Blocks tens={visualTens} ones={visualOnes} />
        </div>
      )}

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>{question.hint1}</HintBubble>
      )}

      {/* Options */}
      <div className="options-grid">
        {options.map((opt, idx) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
              <span className="option-key-hint">{idx + 1}</span> {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🐻</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Count the groups of ten first, then the extra ones…"}
        </div>
      </div>
    </div>
  );
}
