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

## Review Fixes

- Added reducer-backed `toggleEvidence` selection and an explicit `Make deduction` action. `GameShell` derives validity with `canMakeDeduction`, dispatches only valid deductions, and shows generic invalid feedback without revealing deduction text.
- Added mobile map/notebook dialog wrappers with translated close buttons, backdrop dismissal, Escape handling, unique title IDs, focus entry, and focus restoration.
- Added stable hotspot and character DOM IDs plus `data-*` identifiers. Decorative hotspots open atmospheric detail only and never dispatch discovery.
- Replaced generic artwork with scene-specific SVG props for kitchen window/cake stand, living-room sofa/table/umbrella, garden path/lantern, corridor door, and shed/latch/cake.
- Added dialogue response status, contradiction prompt, required evidence list, and post-contradiction response feedback.
- Positioned character cards from normalized case placement data.
- Added focused UI coverage for hotspot behavior, evidence/deduction transitions, dialogue/contradiction flow, localization, stable IDs, mobile dismissal, dialog semantics, and focus restoration.

## Review-Fix Verification

- `rtk npm test -- --run`: PASS, 38 tests across 3 files.
- `rtk npm run typecheck`: PASS.
- `rtk npm run build`: PASS.

## Remaining Concerns

- Theory and reconstruction remain deferred to Task 5; no Task 5 interfaces were added or preempted.
- `toggleEvidence` extends reducer action surface while preserving persisted `selectedEvidenceIds` shape and existing deduction rules.

## Re-review Fixes

- Aligned case hotspot placements with visible SVG props across kitchen, living room, garden, corridor, and shed. Added visible secondary props for footprints, pantry residue, invitation, broken stem, scarf thread, and the covered cake.
- Added exported normalized `sceneHotspotBounds` contract and a test invariant covering every case hotspot coordinate.
- Prevented repeated completed deductions from dispatching or reporting success; UI now reports that deduction was already made.
- Preserved normalized character centering during hover/focus with `translate(-50%, calc(-50% - 2px))`.
- Expanded focused UI tests for coordinate alignment, duplicate deduction feedback, map close button, and map backdrop dismissal.

## Re-review Fix Verification

- `rtk npm test -- --run`: PASS, 41 tests across 3 files.
- `rtk npm run typecheck`: PASS.
- `rtk npm run build`: PASS.

## Remaining Concerns

- Responsive behavior is exercised through DOM panel close paths; actual CSS media-query layout remains a visual/manual concern rather than a browser automation dependency.
