// src/components/NumberPad.jsx
import { useEffect } from 'react';
import { sounds } from '../utils/audio.js';

export default function NumberPad({ value, onChange, onSubmit, status = null }) {
  const handleKey = (key) => {
    sounds.click();
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '✓') {
      if (value) onSubmit();
    } else {
      if (value.length < 3) onChange(value + key);
    }
  };

  // ── Physical keyboard support ───────────────────────────────────────────
  // Mirrors the on-screen pad exactly: number row / numpad digits type,
  // Backspace deletes, Enter submits — so students on a computer aren't
  // forced to click every digit with the mouse.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKey('⌫');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('✓');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, onChange, onSubmit]);

  const keys = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280 }}>
      <div className={`num-display${status ? ` ${status}` : ''}`}>{value || '?'}</div>
      <div className="number-pad">
        {keys.map((k) => (
          <button
            key={k}
            className={`num-key${k === '⌫' ? ' del' : ''}${k === '✓' ? ' submit' : ''}`}
            onClick={() => handleKey(k)}
            aria-label={k === '⌫' ? 'delete' : k === '✓' ? 'submit' : k}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
