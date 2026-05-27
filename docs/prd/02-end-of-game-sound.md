# PRD 02 — End-of-Game Sound

## Problem

When a game ends (checkmate, resignation, timeout, draw, etc.), the extension goes silent. The player has no audio confirmation that the game is over and the buzzer cycle has ended.

## Goal

Play a single, distinct audio cue when the game ends, regardless of result.

## Requirements

- One universal end-of-game sound. No win/loss/draw differentiation.
- Plays once per game, when the game transitions from "in progress" to "ended".
- Distinct from the 1s/2s/3s beeps so the player immediately recognizes it as end-of-game.
- Respects the global on/off toggle — if the buzzer is off, the end-of-game sound is also off.

## Trigger Definition

Game end is detected from lichess's existing end-of-game DOM signal (e.g., the result banner / game-over modal appearing). Implementation should observe a stable indicator rather than inferring from clock or move state.

## Asset

- One new audio file in `public/` (e.g., `end.wav`).
- Added to `web_accessible_resources` in `manifest.json`.

## Non-Goals

- No per-result variants (win/loss/draw all use the same sound).
- No volume control (future enhancement).
- No sound on game abort before first moves (out of scope; treat as a non-event).

## Acceptance Criteria

- Sound plays exactly once when a game ends by any means (mate, resign, flag, draw, stalemate).
- No sound plays on game start or mid-game.
- No sound plays if the toggle is off.
- No duplicate sound if the player navigates back to the finished game.

## Testing

Depends on [PRD 04](04-test-setup.md).

**Unit tests** (`tests/unit/`):
- Once-per-game guard: calling the play function twice in the same game session triggers playback only once.
- Toggle off short-circuits playback (the audio function is not invoked).
- New game resets the guard so the sound can play again.

**DOM tests** (`tests/dom/`), using a captured lichess end-of-game banner fragment:
- Observer fires when the end-of-game banner is added to the DOM.
- Observer does not fire on mid-game DOM mutations (move list updates, clock ticks).
- Observer fires for each game-end variant present in fixtures (checkmate, resign, flag, draw).

## Commit Regimen

Commit early and often so any step can be reverted independently. Suggested commit points:

1. Add the end-of-game audio asset and register it in `manifest.json`.
2. Add the game-end DOM observer (logs only, no sound yet).
3. Wire the observer to play the sound, guarded by the global toggle.
4. Add the once-per-game guard to prevent duplicate playback.

Each commit should build and load as an extension without errors.
