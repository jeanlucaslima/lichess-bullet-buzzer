import { CLOCK_BOTTOM_CONTAINER, CLOCK_RUNNING_CLASS } from './selectors';

type TurnCallback = () => void;

let observer: MutationObserver | null = null;
let observedClock: Element | null = null;
let wasPlayerTurn = false;
let onTurnStartCb: TurnCallback | null = null;
let onTurnEndCb: TurnCallback | null = null;

function checkTurn(): void {
  const isPlayerTurn =
    observedClock?.classList.contains(CLOCK_RUNNING_CLASS) ?? false;

  if (isPlayerTurn && !wasPlayerTurn) {
    onTurnStartCb?.();
  } else if (!isPlayerTurn && wasPlayerTurn) {
    onTurnEndCb?.();
  }

  wasPlayerTurn = isPlayerTurn;
}

function attachTo(clock: Element): void {
  observer?.disconnect();
  observedClock = clock;
  wasPlayerTurn = false;
  observer = new MutationObserver(checkTurn);
  observer.observe(clock, {
    attributes: true,
    attributeFilter: ['class'],
  });
  checkTurn();
}

export function startTurnObserver(
  onTurnStart: TurnCallback,
  onTurnEnd: TurnCallback,
): void {
  stopTurnObserver();
  onTurnStartCb = onTurnStart;
  onTurnEndCb = onTurnEnd;

  const clock = document.querySelector(CLOCK_BOTTOM_CONTAINER);
  if (clock) {
    attachTo(clock);
  }
}

/**
 * Re-checks the current clock element and re-attaches the observer if it
 * has been replaced (e.g., lichess SPA navigation or game-start re-render).
 * Safe to call frequently; no-op if the observed element is still current.
 */
export function ensureTurnObserver(): void {
  if (!onTurnStartCb || !onTurnEndCb) return;
  const clock = document.querySelector(CLOCK_BOTTOM_CONTAINER);
  if (!clock) return;
  if (clock !== observedClock) {
    attachTo(clock);
  }
}

export function stopTurnObserver(): void {
  observer?.disconnect();
  observer = null;
  observedClock = null;
  wasPlayerTurn = false;
  onTurnStartCb = null;
  onTurnEndCb = null;
}
