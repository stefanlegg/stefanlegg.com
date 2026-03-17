/**
 * Konami Code Listener
 * Loaded during idle, then listens for the sequence.
 * Dynamically imports game when sequence is completed.
 */

import { KONAMI_CODE, createSequenceMatcher } from './konami-sequence';

const matcher = createSequenceMatcher(KONAMI_CODE);
let gameStarted = false;

function handleKeyDown(e: KeyboardEvent) {
  if (gameStarted) return;

  if (matcher.feed(e.code)) {
    gameStarted = true;
    import('./konami-game').then(({ startGame }) => {
      startGame(() => { gameStarted = false; });
    });
  }
}

export function init() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('astro:before-swap', function cleanup() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('astro:before-swap', cleanup);
    matcher.reset();
    gameStarted = false;
  }, { once: true });
}
