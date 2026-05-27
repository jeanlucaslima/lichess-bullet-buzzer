export type BeepFn = (index: 0 | 1 | 2) => void;

export interface SchedulerHandle {
  cancel(): void;
}

export function scheduleBeeps(play: BeepFn): SchedulerHandle {
  play(0);
  const t1 = setTimeout(() => play(1), 1000);
  const t2 = setTimeout(() => play(2), 2000);
  return {
    cancel() {
      clearTimeout(t1);
      clearTimeout(t2);
    },
  };
}
