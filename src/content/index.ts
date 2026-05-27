import { initAudio, playBeepSequence, cancelBeepSequence, playEndSound } from './audioManager';
import { startTurnObserver, stopTurnObserver, ensureTurnObserver } from './turnDetector';
import { startGameEndObserver, stopGameEndObserver } from './gameEndDetector';
import { injectToggleButton, removeToggleButton } from './toggleUI';
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

function tryInjectUI(): void {
  // Legacy in-clock toggle (to be removed in a follow-up commit).
  injectToggleButton(applyEnabledState);
  // New top-bar toggle.
  injectTopBarToggle();
}

function setupPageObserver(): void {
  const pageObserver = new MutationObserver(() => {
    const clockExists = document.querySelector(CLOCK_BOTTOM_CONTAINER) !== null;

    if (clockExists) {
      tryInjectUI();
      ensureTurnObserver();
    } else {
      removeToggleButton();
      stopTurnObserver();
      cancelBeepSequence();
    }
  });

  pageObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function init(): void {
  initAudio();
  subscribeToggle(applyEnabledState);
  tryInjectUI();
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
