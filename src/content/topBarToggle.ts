import { NOTIFY_BELL } from './selectors';
import { getToggleEnabled, setToggleEnabled, subscribeToggle } from './toggleState';

export const TOGGLE_ID = 'lichess-buzzer-topbar-toggle';

let unsubscribe: (() => void) | null = null;

function applyStyle(el: HTMLElement, enabled: boolean): void {
  Object.assign(el.style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    margin: '0',
    width: '2em',
    height: '100%',
    fontSize: '14px',
    lineHeight: '1',
    verticalAlign: 'middle',
    opacity: enabled ? '1' : '0.5',
    color: enabled ? '#629924' : 'currentColor',
  });
  el.textContent = enabled ? 'ON' : 'off';
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
