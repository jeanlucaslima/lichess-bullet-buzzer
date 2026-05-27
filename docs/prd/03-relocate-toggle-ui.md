# PRD 03 — Relocate Toggle UI to Top Bar

## Problem

The current on/off toggle (bell icon) is rendered inside the clock area and visually overlaps the last digits of the clock, harming readability of the most time-critical UI element in bullet chess.

## Goal

Move the toggle out of the clock area into the lichess top bar, alongside the existing notification bell, so it is always accessible without obscuring gameplay.

## Requirements

- Toggle is rendered as a sibling icon next to lichess's notification bell in the top navigation bar.
- Visual style matches the existing top-bar icons (size, color, hover state) as closely as practical.
- Single click toggles buzzer on/off.
- Visual state clearly distinguishes on vs. off (e.g., filled vs. outlined, or color shift).
- Toggle is visible on all lichess pages where the top bar renders, not only game pages.
- Toggle state continues to persist across page refreshes (existing `localStorage` behavior is preserved).
- The previous in-clock toggle is removed entirely.

## Injection Strategy

- Find the top-bar container that holds the notification bell.
- Insert the toggle as a sibling element.
- Use a `MutationObserver` to re-inject if lichess re-renders the top bar (SPA navigation).
- Guard against double-injection.

## Non-Goals

- No dropdown menu, no submenu, no settings panel — single-click toggle only.
- No keyboard shortcut (future enhancement).
- No per-game-type configuration.

## Acceptance Criteria

- Toggle appears next to the notification bell on lichess.org.
- Clock digits are fully visible and unobscured during gameplay.
- Clicking the toggle enables/disables beeps immediately.
- On/off state visually distinct at a glance.
- Toggle survives lichess client-side navigation (e.g., starting a new game, switching pages).
- State persists across full page reloads.

## Testing

Depends on [PRD 04](04-test-setup.md).

**Unit tests** (`tests/unit/`):
- Toggle state read/write round-trips through `localStorage`.
- Default state when `localStorage` is empty matches the documented default.

**DOM tests** (`tests/dom/`), using a captured lichess top-bar fragment:
- Injector inserts the toggle as a sibling of the notification bell exactly once.
- Calling the injector twice does not produce duplicate toggles.
- After the top bar is removed and re-added (simulating SPA navigation), the `MutationObserver` re-injects the toggle.
- Clicking the toggle flips the on/off visual state and updates `localStorage`.

## Commit Regimen

Commit early and often so any step can be reverted independently. Suggested commit points:

1. Inject a placeholder element next to the notification bell (no behavior).
2. Style the toggle to match top-bar icons and reflect on/off state.
3. Wire click handler to existing toggle state + `localStorage`.
4. Add `MutationObserver` re-injection guard for SPA navigation.
5. Remove the old in-clock toggle UI.

Each commit should build and load as an extension without errors.
