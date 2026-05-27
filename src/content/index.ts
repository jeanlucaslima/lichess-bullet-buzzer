import { initAudio, playBeepSequence, cancelBeepSequence, playEndSound } from './audioManager';
import { startTurnObserver, stopTurnObserver, ensureTurnObserver } from './turnDetector';
import { startGameEndObserver, stopGameEndObserver } from './gameEndDetector';
import { injectTopBarToggle } from './topBarToggle';
import { getToggleEnabled, subscribeToggle } from './toggleState';
import { CLOCK_BOTTOM_CONTAINER } from './selectors';

function handleTurnStart(): void {
  if (getToggleEnabled()) {
    playBeepSequence();
  }
}

function handleTurnEnd(): void {
  cancelBeepSequence();
}

function handleGameEnd(): void {
  if (getToggleEnabled()) {
    cancelBeepSequence();
    playEndSound();
  }
}

function applyEnabledState(enabled: boolean): void {
  if (enabled) {
    startTurnObserver(handleTurnStart, handleTurnEnd);
    startGameEndObserver(handleGameEnd);
  } else {
    stopTurnObserver();
    stopGameEndObserver();
    cancelBeepSequence();
  }
}

function setupPageObserver(): void {
  let scheduled = false;
  const run = (): void => {
    scheduled = false;
    injectTopBarToggle();

    const clockExists = document.querySelector(CLOCK_BOTTOM_CONTAINER) !== null;
    if (clockExists) {
      ensureTurnObserver();
    } else {
      stopTurnObserver();
      cancelBeepSequence();
    }
  };

  const pageObserver = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(run);
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function init(): void {
  initAudio();
  subscribeToggle(applyEnabledState);
  injectTopBarToggle();
  if (getToggleEnabled()) {
    applyEnabledState(true);
  }
  setupPageObserver();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
