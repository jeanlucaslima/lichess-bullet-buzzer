const STORAGE_KEY = 'lichess-buzzer-enabled';

type Listener = (enabled: boolean) => void;
const listeners = new Set<Listener>();

let enabled: boolean = readFromStorage();

function readFromStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeToStorage(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {}
}

export function getToggleEnabled(): boolean {
  return enabled;
}

export function setToggleEnabled(value: boolean): void {
  if (value === enabled) return;
  enabled = value;
  writeToStorage(value);
  listeners.forEach((l) => l(value));
}

export function subscribeToggle(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
