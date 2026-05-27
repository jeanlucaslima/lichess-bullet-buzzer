// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";

describe("toggleState", () => {
  beforeEach(() => {
    localStorage.clear();
    // Force module re-evaluation so the initial state is read fresh.
    delete (globalThis as any).__buzzerToggleStateLoaded;
  });

  it("defaults to false when localStorage is empty", async () => {
    const mod = await import("../../src/content/toggleState?fresh1");
    expect(mod.getToggleEnabled()).toBe(false);
  });

  it("persists set value to localStorage and notifies subscribers", async () => {
    const mod = await import("../../src/content/toggleState?fresh2");
    const seen: boolean[] = [];
    mod.subscribeToggle((v) => seen.push(v));

    mod.setToggleEnabled(true);
    expect(mod.getToggleEnabled()).toBe(true);
    expect(localStorage.getItem("lichess-buzzer-enabled")).toBe("true");
    expect(seen).toEqual([true]);

    mod.setToggleEnabled(false);
    expect(seen).toEqual([true, false]);
  });

  it("setToggleEnabled is a no-op when value unchanged", async () => {
    const mod = await import("../../src/content/toggleState?fresh3");
    const seen: boolean[] = [];
    mod.subscribeToggle((v) => seen.push(v));

    mod.setToggleEnabled(false);
    expect(seen).toEqual([]);
  });
});
