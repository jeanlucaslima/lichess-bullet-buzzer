import { CLOCK_BOTTOM_CONTAINER } from './selectors';
import { getToggleEnabled, setToggleEnabled, subscribeToggle } from './toggleState';

const BUTTON_ID = 'lichess-buzzer-toggle';

let unsubscribe: (() => void) | null = null;

function paint(button: HTMLElement, enabled: boolean): void {
  button.textContent = enabled ? '🔔' : '🔕';
  button.style.backgroundColor = enabled ? '#629924' : '#666';
}

export function injectToggleButton(_onToggle?: (enabled: boolean) => void): boolean {
  if (document.getElementById(BUTTON_ID)) return true;

  const clockContainer = document.querySelector(CLOCK_BOTTOM_CONTAINER);
  if (!clockContainer) return false;

  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.title = 'Toggle bullet buzzer';

  Object.assign(button.style, {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10',
  });
  paint(button, getToggleEnabled());

  button.addEventListener('click', () => {
    setToggleEnabled(!getToggleEnabled());
  });

  const containerEl = clockContainer as HTMLElement;
  if (getComputedStyle(containerEl).position === 'static') {
    containerEl.style.position = 'relative';
  }

  clockContainer.appendChild(button);

  unsubscribe?.();
  unsubscribe = subscribeToggle((v) => {
    const el = document.getElementById(BUTTON_ID);
    if (el) paint(el as HTMLElement, v);
  });

  return true;
}

export function removeToggleButton(): void {
  document.getElementById(BUTTON_ID)?.remove();
  unsubscribe?.();
  unsubscribe = null;
}

export function isToggleEnabled(): boolean {
  return getToggleEnabled();
}
