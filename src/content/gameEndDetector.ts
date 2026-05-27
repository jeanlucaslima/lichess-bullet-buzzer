import { GAME_END_BANNER } from './selectors';

type EndCallback = () => void;

let observer: MutationObserver | null = null;
let onEnd: EndCallback | null = null;
let bannerWasPresent = false;

function bannerPresent(): boolean {
  return document.querySelector(GAME_END_BANNER) !== null;
}

function check(): void {
  const present = bannerPresent();
  if (present && !bannerWasPresent) {
    onEnd?.();
  }
  bannerWasPresent = present;
}

let scheduled = false;
function scheduledCheck(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    check();
  });
}

export function startGameEndObserver(callback: EndCallback): void {
  stopGameEndObserver();
  onEnd = callback;
  bannerWasPresent = false;
  check();

  observer = new MutationObserver(scheduledCheck);
  observer.observe(document.body, { childList: true, subtree: true });
}

export function stopGameEndObserver(): void {
  observer?.disconnect();
  observer = null;
  onEnd = null;
  bannerWasPresent = false;
}
