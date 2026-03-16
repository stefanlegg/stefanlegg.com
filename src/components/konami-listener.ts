/**
 * Konami Code Listener
 * Loaded during idle, then listens for the sequence.
 * Dynamically imports game when sequence is completed.
 */

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

let konamiIndex = 0;
let gameStarted = false;

function handleKeyDown(e: KeyboardEvent) {
  if (gameStarted) return;
  
  if (e.code === KONAMI_CODE[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI_CODE.length) {
      konamiIndex = 0;
      gameStarted = true;
      import('./konami-game').then(({ startGame }) => {
        startGame(() => { gameStarted = false; });
      });
    }
  } else {
    konamiIndex = 0;
    if (e.code === KONAMI_CODE[0]) konamiIndex = 1;
  }
}

export function init() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('astro:before-swap', function cleanup() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('astro:before-swap', cleanup);
    konamiIndex = 0;
    gameStarted = false;
  }, { once: true });
}
