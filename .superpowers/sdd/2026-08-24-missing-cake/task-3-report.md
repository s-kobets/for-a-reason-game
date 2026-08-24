# Task 3 Report: Investigation State and Persistence

## Implemented

- `src/game/state.ts`
  - Added `GameState` with location, opened locations, hotspot discoveries, questions, statements, deductions, evidence selection, theory, language, and reconstruction progress.
  - Added `Theory`, `initialGameState`, and `freshGameState()`.
  - Initial state starts in `kitchen` with `kitchen`, `living-room`, `garden`, and `corridor` open.
- `src/game/rules.ts`
  - Added typed condition evaluation for hotspots, statements, questions, and deductions.
  - Added `canAsk` and `availableQuestions`.
  - Added evidence-combination validation through `canMakeDeduction`.
  - Added contradiction gating from Petya's initial statement plus canonical contradiction evidence.
  - Added `scoreTheory` with `wrong`, `partial`, and `complete` results.
- `src/game/reducer.ts`
  - Added all Task 3 `GameAction` variants.
  - Reducer remains pure and returns copied state/arrays for changes.
  - Discovery adds hotspot observations, question responses add statements, and case conditions unlock locations including Shed.
  - Duplicate discovery, evidence, statement, location, and deduction IDs are ignored.
  - Invalid questions, deductions, locations, evidence, and reconstruction steps leave state unchanged.
- `src/game/storage.ts`
  - Added versioned `localStorage` envelope under `missing-cake-game-v1`.
  - JSON errors, schema mismatches, invalid location/language/theory data, and storage exceptions fall back to fresh state or remain in-memory for saves.
- `src/game/rules.test.ts`
  - Added 8 focused tests covering deduction gates, question gates, contradiction unlock, Shed unlock, theory scoring, immutability, deduplication, storage round-trip, malformed storage, and blocked storage.

## Verification

- `rtk npm test -- --run src/game/rules.test.ts`: PASS, 8 tests.
- `rtk npm test -- --run`: PASS, 14 tests across 2 files.
- `rtk npm run typecheck`: PASS.
- `rtk npm run build`: PASS.

## Concerns

- State IDs remain strings, matching Task 2's intentionally stable string-based case model.
- `selectedEvidenceIds` is populated when an observation hotspot is discovered, allowing UI to use it immediately for deduction selection; later UI can remove/toggle selections without changing rule semantics.
- Storage validates state shape and location/language/theory primitives, but trusts individual persisted ID membership as static case data. UI/reducer paths validate IDs before adding them.
- Generated `dist/`, `node_modules/`, and `tsconfig.tsbuildinfo` were not included in the Task 3 commit.
