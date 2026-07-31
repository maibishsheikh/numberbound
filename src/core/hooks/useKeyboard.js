// src/core/hooks/useKeyboard.js
import { useEffect } from 'react';

/**
 * Calls `onEnter`/`onEscape`/`onArrow` for keyboard-driven navigation,
 * supporting WCAG keyboard-accessibility requirements.
 */
export function useKeyboard({ onEnter, onEscape, onArrowLeft, onArrowRight } = {}) {
  useEffect(() => {
    function handleKeyDown(e) {
      switch (e.key) {
        case 'Enter':
        case ' ':
          if (onEnter) {
            e.preventDefault();
            onEnter(e);
          }
          break;
        case 'Escape':
          if (onEscape) onEscape(e);
          break;
        case 'ArrowLeft':
          if (onArrowLeft) onArrowLeft(e);
          break;
        case 'ArrowRight':
          if (onArrowRight) onArrowRight(e);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowLeft, onArrowRight]);
}

/**
 * Lets the student press 1..count on a physical keyboard to choose an
 * option, mirroring on-screen tap targets — the same "type instead of
 * click" accessibility NumberPad already provides for numeric entry.
 * Used by QuestionCard's option grid and every Simulate mission's
 * tap-to-choose interactions.
 */
export function useNumberKeySelect(count, onSelect, enabled = true) {
  useEffect(() => {
    if (!enabled || !count) return;
    function handleKeyDown(e) {
      const n = parseInt(e.key, 10);
      if (Number.isInteger(n) && n >= 1 && n <= count) {
        e.preventDefault();
        onSelect(n - 1);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count, onSelect, enabled]);
}
