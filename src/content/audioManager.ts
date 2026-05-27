import { scheduleBeeps, SchedulerHandle } from './beepScheduler';

let beep1: HTMLAudioElement | null = null;
let beep2: HTMLAudioElement | null = null;
let beep3: HTMLAudioElement | null = null;
let endSound: HTMLAudioElement | null = null;

let active: SchedulerHandle | null = null;

export function initAudio(): void {
  beep1 = new Audio(chrome.runtime.getURL('beep1.wav'));
  beep2 = new Audio(chrome.runtime.getURL('beep2.wav'));
  beep3 = new Audio(chrome.runtime.getURL('beep3.wav'));
  endSound = new Audio(chrome.runtime.getURL('end.wav'));

  beep1.load();
  beep2.load();
  beep3.load();
  endSound.load();
}

export function playEndSound(): void {
  if (endSound) {
    endSound.currentTime = 0;
    endSound.play().catch(() => {});
  }
}

function playBeep(index: 0 | 1 | 2): void {
  const audio = [beep1, beep2, beep3][index];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

export function playBeepSequence(): void {
  cancelBeepSequence();
  active = scheduleBeeps(playBeep);
}

export function cancelBeepSequence(): void {
  active?.cancel();
  active = null;
}
