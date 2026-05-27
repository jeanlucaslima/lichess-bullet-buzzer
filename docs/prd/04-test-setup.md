# PRD 04 — Test Setup

## Problem

The project has no automated tests. Behavior is only verified by loading the unpacked extension in Chrome and playing on lichess.org, which is slow and easy to skip.

## Goal

Add a lightweight test setup so feature PRDs can specify and verify their own behavior automatically.

## Scope

This PRD covers the framework and conventions only. Per-feature test cases live inside each feature PRD's **Testing** section.

## Stack

- **Vitest** as the test runner (aligns with the existing Vite build).
- **happy-dom** (or **jsdom**) for DOM simulation in tests that need it. Prefer happy-dom for speed unless a gap forces jsdom.
- No E2E framework for now. Real-browser verification stays manual.

## Layout

```
tests/
  unit/          # pure-logic tests, no DOM
  dom/           # tests that mount fragments of lichess DOM
  fixtures/      # captured HTML snippets from lichess (clock, top bar, end-of-game banner)
```

## Conventions

- Test files are named `*.test.ts` and colocated under `tests/` mirroring `src/` structure where useful.
- DOM fixtures are plain `.html` files in `tests/fixtures/`, loaded via `fs.readFileSync` in tests.
- Pure logic should be extracted from `src/content/index.ts` into small modules so it can be unit-tested without a DOM.
- Each test should be independent — no shared mutable state between tests.

## Scripts

Add to `package.json`:

- `test` — run the full Vitest suite once.
- `test:watch` — Vitest in watch mode for development.

## Non-Goals

- No E2E / Playwright setup.
- No coverage gating in CI (no CI yet).
- No snapshot testing for DOM output (brittle, low value here).

## Acceptance Criteria

- `npm test` runs and exits 0 on a fresh clone after `npm install`.
- At least one example unit test and one example DOM test exist and pass.
- `vitest.config.ts` is committed and configures happy-dom for the `tests/dom/` directory.
- README has a short "Testing" section pointing at `npm test`.

## Commit Regimen

Commit early and often so any step can be reverted independently. Suggested commit points:

1. Add Vitest + happy-dom devDependencies and `vitest.config.ts`.
2. Add `tests/` layout with one trivial passing unit test.
3. Add one trivial passing DOM test using a fixture.
4. Add `test` / `test:watch` scripts to `package.json` and update the README.

Each commit should leave `npm test` green.
