# PRD 01 — Clock-Aware Buzzer Start

## Problem

The buzzer currently triggers only after the first move is made on the board. This means:

- When playing **White**, the player's first turn produces no beeps even though the clock is running.
- The buzzer's "is it my turn" signal is implicitly tied to move history, not to the actual clock state.

## Goal

Beep timing should be driven by whether the player's clock is actively counting down, not by move history.

## Requirements

- Beeps at 1s, 2s, 3s fire whenever the player's clock is running, including the opening move as White.
- Beeps stop immediately when the player's clock stops (move played, game paused, game ended).
- No beeps when it is the opponent's turn, regardless of move number.
- No beeps before the game has started (pre-game lobby, waiting for opponent).

## Trigger Definition

"Player's clock is running" = the DOM element representing the player's clock has the active/running state class that lichess applies during their turn.

Implementation should observe the clock element's class/state rather than parsing move lists or PGN.

## Non-Goals

- No beeps during pre-game countdown.
- No beeps when reviewing a finished game or analyzing.
- No beeps in correspondence games (out of scope for bullet trainer).

## Acceptance Criteria

- Playing as White, beeps fire at 1s/2s/3s on the opening move.
- Playing as Black, behavior is unchanged from today.
- Beeps cease within ~100ms of the player's clock stopping.
- No false beeps when the opponent's clock is running.

## Testing

Depends on [PRD 04](04-test-setup.md).

**Unit tests** (`tests/unit/`):
- Beep scheduler fires callbacks at 1s, 2s, 3s after start.
- Beep scheduler cancels pending callbacks when stopped before 3s.
- Restarting the scheduler resets timers cleanly.

**DOM tests** (`tests/dom/`), using a captured lichess clock fragment:
- Adding the "running" class to the player's clock element triggers the scheduler.
- Removing the "running" class stops the scheduler within ~100ms.
- Adding the "running" class to the *opponent's* clock does not trigger the scheduler.
- Class toggles on initial load (game-start as White) trigger the scheduler.

## Commit Regimen

Commit early and often so any step can be reverted independently. Suggested commit points:

1. Add clock-state observer (no behavior change yet).
2. Wire observer to the existing beep trigger; remove move-history trigger.
3. Handle stop-on-clock-stop edge cases (game end, pause).
4. Cleanup / remove dead code from the old trigger path.

Each commit should build and load as an extension without errors.
