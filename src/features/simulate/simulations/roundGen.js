// src/features/simulate/simulations/roundGen.js
// Shared round-generation helpers for every Simulate mission.

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate `count` distinct random targets within [min, max], used so a
// mission's rounds never repeat the same number twice in one session.
export function distinctTargets(count, min, max) {
  const set = new Set();
  let guard = 0;
  while (set.size < count && guard < 200) {
    set.add(randInt(min, max));
    guard++;
  }
  return [...set];
}
