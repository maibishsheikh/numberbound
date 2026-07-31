// src/components/NumberVisuals.jsx
// Shared CPA (Concrete-Pictorial-Abstract) visual components used across
// Simulate missions and Practice/Reflect question visuals:
//   - ObjectGroup: concrete objects, grouped in tens for counts > 10
//   - TenFrame: the classic 2x5 ten-frame (counts 0-10 only)
//   - Base10Blocks: pictorial tens-sticks + ones-cubes
import React from 'react';

// -- Concrete counting: individual icons up to 10, grouped-in-tens above --
export function ObjectGroup({ count, icon = '⭐', highlightIndex = null }) {
  if (count <= 10) {
    return (
      <div className="object-group-flat" role="img" aria-label={`${count} ${icon}`}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={`object-icon${highlightIndex === i ? ' highlight' : ''}`}>{icon}</span>
        ))}
      </div>
    );
  }
  const tens = Math.floor(count / 10);
  const ones = count % 10;
  return (
    <div className="object-group-tens" role="img" aria-label={`${count} ${icon}`}>
      <div className="object-group-tens-rows">
        {Array.from({ length: tens }, (_, g) => (
          <div key={g} className="object-group-ten-pack">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="object-icon small">{icon}</span>
            ))}
          </div>
        ))}
      </div>
      {ones > 0 && (
        <div className="object-group-ones-row">
          {Array.from({ length: ones }, (_, i) => (
            <span key={i} className="object-icon small">{icon}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// -- Classic 2x5 ten-frame (0-10 only) --
export function TenFrame({ filled, max = 10, onCellClick = null }) {
  return (
    <div className="ten-frame">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`ten-frame-cell ${i < filled ? 'filled' : ''}`}
          onClick={onCellClick ? () => onCellClick(i) : undefined}
          role={onCellClick ? 'button' : 'img'}
          tabIndex={onCellClick ? 0 : undefined}
          aria-label={`Cell ${i + 1}, ${i < filled ? 'filled' : 'empty'}`}
        >
          {i < filled ? '⭐' : ''}
        </div>
      ))}
    </div>
  );
}

// -- Pictorial base-10 blocks: tens sticks + ones cubes --
export function Base10Blocks({ tens, ones }) {
  return (
    <div className="blocks-area">
      <div className="tens-column">
        <div className="column-label">Tens</div>
        <div className="blocks-row">
          {Array.from({ length: tens }, (_, i) => <div key={i} className="ten-stick" />)}
        </div>
      </div>
      <div className="ones-column">
        <div className="column-label">Ones</div>
        <div className="blocks-row wrap">
          {Array.from({ length: ones }, (_, i) => <div key={i} className="unit-cube" />)}
        </div>
      </div>
    </div>
  );
}
