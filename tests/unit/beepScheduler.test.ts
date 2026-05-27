import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { scheduleBeeps } from "../../src/content/beepScheduler";

describe("beepScheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays beep 0 immediately and beeps 1 and 2 at 1s and 2s", () => {
    const calls: number[] = [];
    scheduleBeeps((i) => calls.push(i));

    expect(calls).toEqual([0]);

    vi.advanceTimersByTime(1000);
    expect(calls).toEqual([0, 1]);

    vi.advanceTimersByTime(1000);
    expect(calls).toEqual([0, 1, 2]);
  });

  it("cancel() prevents pending beeps from firing", () => {
    const calls: number[] = [];
    const handle = scheduleBeeps((i) => calls.push(i));

    expect(calls).toEqual([0]);
    handle.cancel();

    vi.advanceTimersByTime(5000);
    expect(calls).toEqual([0]);
  });

  it("starting a new schedule after cancel restarts the sequence", () => {
    const calls: number[] = [];
    const first = scheduleBeeps((i) => calls.push(i));
    first.cancel();

    scheduleBeeps((i) => calls.push(i));
    vi.advanceTimersByTime(2000);

    expect(calls).toEqual([0, 0, 1, 2]);
  });
});
