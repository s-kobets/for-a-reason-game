# Task 4 Report: Scene, Map, Notebook, and Dialogue UI

## Implemented

- Replaced temporary `App` shell with reducer-backed `GameShell` using `loadGame` and `saveGame`.
- Added responsive scene layout with five data-selected inline SVG diorama variants and no image assets.
- Added accessible SVG hotspot buttons with stable case hotspot IDs, hover/focus labels, discovery dispatch, and evidence detail overlay.
- Added clickable character cards and dialogue overlay using `availableQuestions`, reducer question actions, and contradiction gating.
- Added map panel using only currently opened locations and real `setLocation` actions.
- Added categorized notebook for acquired observations/statements, evidence selection, deduction actions, and empty states.
- Added bilingual UI labels through typed localized text and existing case translations.
- Added focused `GameShell` render test.

## Verification

- `rtk npm test -- --run`: PASS, 33 tests across 3 files.
- `rtk npm run typecheck`: PASS.
- `rtk npm run build`: PASS.

## Concerns

- Theory and reconstruction remain intentionally deferred to Task 5.
- Deduction feedback currently comes from reducer state and notebook styling; dedicated theory/result panels remain outside Task 4.
- Generated `dist/`, `node_modules/`, and `tsconfig.tsbuildinfo` remain untracked.
