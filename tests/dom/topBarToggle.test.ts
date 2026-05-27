// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  injectTopBarToggle,
  removeTopBarToggle,
  setTopBarToggleState,
  TOGGLE_ID,
} from "../../src/content/topBarToggle";

const topbar = readFileSync(
  resolve(__dirname, "../fixtures/topbar.html"),
  "utf8",
);

describe("topBarToggle", () => {
  beforeEach(() => {
    document.body.innerHTML = topbar;
    removeTopBarToggle();
  });

  it("injects the toggle as a sibling preceding the notify bell", () => {
    const ok = injectTopBarToggle(true);
    expect(ok).toBe(true);

    const toggle = document.getElementById(TOGGLE_ID);
    const bell = document.getElementById("notify-toggle");
    expect(toggle).not.toBeNull();
    expect(toggle?.nextElementSibling).toBe(bell);
  });

  it("does not double-inject on repeated calls", () => {
    injectTopBarToggle(true);
    injectTopBarToggle(true);
    injectTopBarToggle(true);

    expect(document.querySelectorAll(`#${TOGGLE_ID}`).length).toBe(1);
  });

  it("returns false when the notify bell is not present", () => {
    document.body.innerHTML = "<header></header>";
    expect(injectTopBarToggle(true)).toBe(false);
  });

  it("reflects enabled state in textContent and color", () => {
    injectTopBarToggle(true);
    let toggle = document.getElementById(TOGGLE_ID) as HTMLElement;
    expect(toggle.textContent).toBe("🔔");

    setTopBarToggleState(false);
    toggle = document.getElementById(TOGGLE_ID) as HTMLElement;
    expect(toggle.textContent).toBe("🔕");
  });
});
