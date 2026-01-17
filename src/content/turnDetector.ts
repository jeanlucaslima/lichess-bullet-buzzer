import { CLOCK_BOTTOM_CONTAINER, CLOCK_RUNNING_CLASS } from './selectors';

type TurnCallback = () => void;

let observer: MutationObserver | null = null;
let wasPlayerTurn = false;

export function startTurnObserver(
  onTurnStart: TurnCallback,
  onTurnEnd: TurnCallback
): void {
  stopTurnObserver();

  const clockContainer = document.querySelector(CLOCK_BOTTOM_CONTAINER);

  const checkTurn = () => {
    const isPlayerTurn = clockContainer?.classList.contains(CLOCK_RUNNING_CLASS) ?? false;

    if (isPlayerTurn && !wasPlayerTurn) {
      onTurnStart();
    } else if (!isPlayerTurn && wasPlayerTurn) {
      onTurnEnd();
    }

    wasPlayerTurn = isPlayerTurn;
  };

  observer = new MutationObserver(checkTurn);

  if (clockContainer) {
    observer.observe(clockContainer, {
      attributes: true,
      attributeFilter: ['class'],
    });
    // Check initial state
    checkTurn();
  }
}

export function stopTurnObserver(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  wasPlayerTurn = false;
}
