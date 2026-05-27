import { GAME_END_BANNER } from './selectors';

type EndCallback = () => void;

let observer: MutationObserver | null = null;
let onEnd: EndCallback | null = null;

function bannerPresent(): boolean {
  return document.querySelector(GAME_END_BANNER) !== null;
}

export function startGameEndObserver(callback: EndCallback): void {
  stopGameEndObserver();
  onEnd = callback;

  // If the banner is already present when we start, fire immediately.
  if (bannerPresent()) {
    onEnd();
    return;
  }

  observer = new MutationObserver(() => {
    if (bannerPresent()) {
      onEnd?.();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function stopGameEndObserver(): void {
  observer?.disconnect();
  observer = null;
  onEnd = null;
}
