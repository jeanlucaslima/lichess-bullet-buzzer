// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  startTurnObserver,
  stopTurnObserver,
  ensureTurnObserver,
} from "../../src/content/turnDetector";

const fixture = readFileSync(
  resolve(__dirname, "../fixtures/clock.html"),
  "utf8",
);

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

describe("turnDetector", () => {
  let starts: number;
  let ends: number;

  beforeEach(() => {
    document.body.innerHTML = fixture;
    starts = 0;
    ends = 0;
  });

  afterEach(() => {
    stopTurnObserver();
  });

  it("fires onTurnStart when running class is added to player's clock", async () => {
    startTurnObserver(() => starts++, () => ends++);
    const bottom = document.querySelector(".rclock-bottom")!;

    bottom.classList.add("running");
    await flush();

    expect(starts).toBe(1);
    expect(ends).toBe(0);
  });

  it("fires onTurnEnd when running class is removed", async () => {
    const bottom = document.querySelector(".rclock-bottom")!;
    bottom.classList.add("running");
    startTurnObserver(() => starts++, () => ends++);

    expect(starts).toBe(1);

    bottom.classList.remove("running");
    await flush();

    expect(ends).toBe(1);
  });

  it("does not fire when opponent's (top) clock toggles running", async () => {
    startTurnObserver(() => starts++, () => ends++);
    const top = document.querySelector(".rclock-top")!;

    top.classList.add("running");
    await flush();

    expect(starts).toBe(0);
    expect(ends).toBe(0);
  });

  it("ensureTurnObserver re-attaches when clock element is replaced", async () => {
    startTurnObserver(() => starts++, () => ends++);

    // Lichess replaces the clock element entirely
    const oldBottom = document.querySelector(".rclock-bottom")!;
    const newBottom = document.createElement("div");
    newBottom.className = "rclock rclock-bottom running";
    oldBottom.replaceWith(newBottom);

    ensureTurnObserver();
    await flush();

    expect(starts).toBe(1);
  });

  it("ensureTurnObserver is a no-op when element unchanged", async () => {
    startTurnObserver(() => starts++, () => ends++);
    ensureTurnObserver();
    ensureTurnObserver();

    const bottom = document.querySelector(".rclock-bottom")!;
    bottom.classList.add("running");
    await flush();

    expect(starts).toBe(1);
  });
});
