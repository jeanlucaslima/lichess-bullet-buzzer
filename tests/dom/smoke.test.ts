// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const fixture = readFileSync(
  resolve(__dirname, "../fixtures/smoke.html"),
  "utf8",
);

describe("DOM test harness", () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it("mounts fixture and queries elements", () => {
    const label = document.querySelector(".label");
    expect(label?.textContent).toBe("hello");
  });
});
