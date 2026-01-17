import { CLOCK_BOTTOM_CONTAINER } from './selectors';

const BUTTON_ID = 'lichess-buzzer-toggle';

let isEnabled = false;
let onToggleCallback: ((enabled: boolean) => void) | null = null;

export function injectToggleButton(onToggle: (enabled: boolean) => void): boolean {
  // Don't inject if already exists
  if (document.getElementById(BUTTON_ID)) {
    return true;
  }

  const clockContainer = document.querySelector(CLOCK_BOTTOM_CONTAINER);
  if (!clockContainer) {
    return false;
  }

  onToggleCallback = onToggle;

  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.textContent = isEnabled ? '🔔' : '🔕';
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
    backgroundColor: isEnabled ? '#629924' : '#666',
    zIndex: '10',
  });

  button.addEventListener('click', handleToggle);

  // Ensure container has relative positioning for absolute child
  const containerEl = clockContainer as HTMLElement;
  if (getComputedStyle(containerEl).position === 'static') {
    containerEl.style.position = 'relative';
  }

  clockContainer.appendChild(button);
  return true;
}

function handleToggle(): void {
  isEnabled = !isEnabled;
  updateButtonAppearance();
  onToggleCallback?.(isEnabled);
}

function updateButtonAppearance(): void {
  const button = document.getElementById(BUTTON_ID);
  if (button) {
    button.textContent = isEnabled ? '🔔' : '🔕';
    (button as HTMLElement).style.backgroundColor = isEnabled ? '#629924' : '#666';
  }
}

export function removeToggleButton(): void {
  const button = document.getElementById(BUTTON_ID);
  if (button) {
    button.removeEventListener('click', handleToggle);
    button.remove();
  }
}

export function isToggleEnabled(): boolean {
  return isEnabled;
}
