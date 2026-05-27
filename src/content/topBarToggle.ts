import { NOTIFY_BELL } from './selectors';
import { getToggleEnabled, setToggleEnabled, subscribeToggle } from './toggleState';

export const TOGGLE_ID = 'lichess-buzzer-topbar-toggle';

let unsubscribe: (() => void) | null = null;

function applyStyle(el: HTMLElement, enabled: boolean): void {
  el.style.color = enabled ? '#629924' : '';
  el.style.opacity = enabled ? '1' : '0.5';
  el.textContent = enabled ? 'ON' : 'off';
  el.style.fontSize = '11px';
  el.style.fontWeight = 'bold';
}

export function injectTopBarToggle(enabledArg?: boolean): boolean {
  const enabled = enabledArg ?? getToggleEnabled();

  const existing = document.getElementById(TOGGLE_ID);
  if (existing) {
    applyStyle(existing as HTMLElement, enabled);
    return true;
  }

  const bell = document.querySelector(NOTIFY_BELL);
  if (!bell) return false;

  // The bell is wrapped in an anonymous <div> inside .site-buttons.
  // Insert as a sibling of that wrapper so we land in the icon row, not
  // inside the bell's dropdown-bearing wrapper.
  const bellWrapper = bell.parentElement;
  const row = bellWrapper?.parentElement;
  if (!bellWrapper || !row) return false;

  const el = document.createElement('button');
  el.id = TOGGLE_ID;
  el.type = 'button';
  el.className = 'toggle link';
  el.title = 'Toggle bullet buzzer';
  applyStyle(el, enabled);
  el.addEventListener('click', () => {
    setToggleEnabled(!getToggleEnabled());
  });

  row.insertBefore(el, bellWrapper);

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
