import { CLOCK_BOTTOM, CLOCK_RUNNING_CLASS } from './selectors';

type TurnCallback = () => void;

let observer: MutationObserver | null = null;
let wasPlayerTurn = false;

export function startTurnObserver(
  onTurnStart: TurnCallback,
  onTurnEnd: TurnCallback
): void {
  stopTurnObserver();

  const checkTurn = () => {
    const clock = document.querySelector(CLOCK_BOTTOM);
    const isPlayerTurn = clock?.classList.contains(CLOCK_RUNNING_CLASS) ?? false;

    if (isPlayerTurn && !wasPlayerTurn) {
      onTurnStart();
    } else if (!isPlayerTurn && wasPlayerTurn) {
      onTurnEnd();
    }

    wasPlayerTurn = isPlayerTurn;
  };

  observer = new MutationObserver(checkTurn);

  const targetNode = document.querySelector('.rclock-bottom');
  if (targetNode) {
    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
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
