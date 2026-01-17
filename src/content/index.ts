import { initAudio, playBeepSequence, cancelBeepSequence } from './audioManager';
import { startTurnObserver, stopTurnObserver } from './turnDetector';
import { injectToggleButton, removeToggleButton, isToggleEnabled } from './toggleUI';
import { CLOCK_BOTTOM_CONTAINER } from './selectors';

let isInitialized = false;

function handleTurnStart(): void {
  if (isToggleEnabled()) {
    playBeepSequence();
  }
}

function handleTurnEnd(): void {
  cancelBeepSequence();
}

function handleToggle(enabled: boolean): void {
  if (enabled) {
    startTurnObserver(handleTurnStart, handleTurnEnd);
  } else {
    stopTurnObserver();
    cancelBeepSequence();
  }
}

function tryInjectUI(): boolean {
  const injected = injectToggleButton(handleToggle);
  if (injected && !isInitialized) {
    isInitialized = true;
  }
  return injected;
}

function setupPageObserver(): void {
  // Watch for game UI appearing/disappearing (SPA navigation)
  const pageObserver = new MutationObserver(() => {
    const clockExists = document.querySelector(CLOCK_BOTTOM_CONTAINER) !== null;

    if (clockExists) {
      tryInjectUI();
    } else {
      // Game ended or navigated away
      removeToggleButton();
      stopTurnObserver();
      cancelBeepSequence();
      isInitialized = false;
    }
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function init(): void {
  initAudio();
  tryInjectUI();
  setupPageObserver();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
