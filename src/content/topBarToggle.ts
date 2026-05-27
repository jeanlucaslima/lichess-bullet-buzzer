import { NOTIFY_BELL } from './selectors';
import { getToggleEnabled, setToggleEnabled, subscribeToggle } from './toggleState';

export const TOGGLE_ID = 'lichess-buzzer-topbar-toggle';

let unsubscribe: (() => void) | null = null;

function applyStyle(el: HTMLElement, enabled: boolean): void {
  Object.assign(el.style, {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0 6px',
    fontSize: '18px',
    lineHeight: '1',
    opacity: enabled ? '1' : '0.45',
    color: enabled ? '#629924' : 'inherit',
  });
  el.textContent = enabled ? '🔔' : '🔕';
}

export function injectTopBarToggle(enabledArg?: boolean): boolean {
  const enabled = enabledArg ?? getToggleEnabled();

  const existing = document.getElementById(TOGGLE_ID);
  if (existing) {
    applyStyle(existing as HTMLElement, enabled);
    return true;
  }

  const bell = document.querySelector(NOTIFY_BELL);
  if (!bell || !bell.parentElement) return false;

  const el = document.createElement('button');
  el.id = TOGGLE_ID;
  el.type = 'button';
  el.title = 'Toggle bullet buzzer';
  applyStyle(el, enabled);
  el.addEventListener('click', () => {
    setToggleEnabled(!getToggleEnabled());
  });

  bell.parentElement.insertBefore(el, bell);

  unsubscribe?.();
  unsubscribe = subscribeToggle((v) => setTopBarToggleState(v));

  return true;
}

export function setTopBarToggleState(enabled: boolean): void {
  const el = document.getElementById(TOGGLE_ID);
  if (el) applyStyle(el as HTMLElement, enabled);
}

export function removeTopBarToggle(): void {
  document.getElementById(TOGGLE_ID)?.remove();
  unsubscribe?.();
  unsubscribe = null;
}
