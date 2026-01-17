let beep1: HTMLAudioElement | null = null;
let beep2: HTMLAudioElement | null = null;
let beep3: HTMLAudioElement | null = null;

let timer1: ReturnType<typeof setTimeout> | null = null;
let timer2: ReturnType<typeof setTimeout> | null = null;

export function initAudio(): void {
  beep1 = new Audio(chrome.runtime.getURL('beep1.wav'));
  beep2 = new Audio(chrome.runtime.getURL('beep2.wav'));
  beep3 = new Audio(chrome.runtime.getURL('beep3.wav'));

  // Preload the audio files
  beep1.load();
  beep2.load();
  beep3.load();
}

export function playBeepSequence(): void {
  cancelBeepSequence();

  // Play beep1 immediately
  if (beep1) {
    beep1.currentTime = 0;
    beep1.play().catch(() => {});
  }

  // Play beep2 after 1 second
  timer1 = setTimeout(() => {
    if (beep2) {
      beep2.currentTime = 0;
      beep2.play().catch(() => {});
    }
  }, 1000);

  // Play beep3 after 2 seconds
  timer2 = setTimeout(() => {
    if (beep3) {
      beep3.currentTime = 0;
      beep3.play().catch(() => {});
    }
  }, 2000);
}

export function cancelBeepSequence(): void {
  if (timer1) {
    clearTimeout(timer1);
    timer1 = null;
  }
  if (timer2) {
    clearTimeout(timer2);
    timer2 = null;
  }
}
