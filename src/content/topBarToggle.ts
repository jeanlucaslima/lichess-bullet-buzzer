import { NOTIFY_BELL } from './selectors';

export const TOGGLE_ID = 'lichess-buzzer-topbar-toggle';

export function injectTopBarToggle(): boolean {
  if (document.getElementById(TOGGLE_ID)) return true;

  const bell = document.querySelector(NOTIFY_BELL);
  if (!bell || !bell.parentElement) return false;

  const el = document.createElement('button');
  el.id = TOGGLE_ID;
  el.type = 'button';
  el.title = 'Toggle bullet buzzer';

  bell.parentElement.insertBefore(el, bell);
  return true;
}

export function removeTopBarToggle(): void {
  document.getElementById(TOGGLE_ID)?.remove();
}
