// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  startGameEndObserver,
  stopGameEndObserver,
} from "../../src/content/gameEndDetector";

const endBanner = readFileSync(
  resolve(__dirname, "../fixtures/game-end-banner.html"),
  "utf8",
);

function flush(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

describe("gameEndDetector", () => {
  let fires: number;

  beforeEach(() => {
    document.body.innerHTML = '<div class="round"></div>';
    fires = 0;
  });

  afterEach(() => {
    stopGameEndObserver();
  });

  it("fires when end-of-game banner is added to the DOM", async () => {
    startGameEndObserver(() => fires++);

    document.querySelector(".round")!.insertAdjacentHTML("beforeend", endBanner);
    await flush();

    expect(fires).toBe(1);
  });

  it("fires immediately if banner is already present when observer starts", () => {
    document.querySelector(".round")!.insertAdjacentHTML("beforeend", endBanner);
    startGameEndObserver(() => fires++);

    expect(fires).toBe(1);
  });

  it("does not fire on unrelated DOM mutations", async () => {
    startGameEndObserver(() => fires++);

    const round = document.querySelector(".round")!;
    round.insertAdjacentHTML("beforeend", '<div class="move">e4</div>');
    round.insertAdjacentHTML("beforeend", '<div class="time">01:55</div>');
    await flush();

    expect(fires).toBe(0);
  });
});
