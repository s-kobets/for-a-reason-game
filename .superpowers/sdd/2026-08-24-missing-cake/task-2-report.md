# Task 2 Report: Case Data and Translation Model

## Files

- `src/case/types.ts`: Added bilingual text, case entity, evidence, dialogue condition, contradiction, theory solution, and reconstruction types.
- `src/case/translations.ts`: Added typed `getText` helper and shared case UI labels.
- `src/case/missingCake.ts`: Added explicit bilingual Missing Cake case data: five locations and SVG scene IDs, 13 hotspots, 20 evidence entries, four characters, ten dialogue statements, gated questions, four deductions, contradiction, five evidence-backed theory fields, and five reconstruction steps.
- `src/case/missingCake.test.ts`: Added focused invariants for localized location titles and canonical evidence sources on every solution field.

## Tests

- `rtk npm test -- --run src/case/missingCake.test.ts`: passed, 2 tests.
- `rtk npm test -- --run`: passed, 2 tests.
- `rtk npm run typecheck`: passed.
- `rtk npm run build`: passed.

## Self-Review

- All visible case strings use required English and Russian values.
- All location IDs, hotspot location IDs, dialogue speaker IDs, statement IDs, and solution evidence IDs are explicit and readable.
- Shed unlocks from Petya's admission; conditional questions use typed condition IDs.
- Decorative garden lantern has no evidence ID.
- Blue scarf thread is a false lead with an explicit explanation.
- Case data does not import React or mutate game state.
- No UI or reducer logic was added.

## Concerns

- `CaseDefinition` uses string IDs intentionally so later reducer/UI tasks can consume stable data without a large generated union type.
- Dialogue response handling and condition semantics remain for Task 3.
- Generated `dist/`, `node_modules/`, and `tsconfig.tsbuildinfo` remain untracked and are excluded from this task commit.

## Review Fix Report

### Changes

- Added typed `TheoryOption` catalogs with bilingual labels to every theory solution field; submitted values remain stable IDs.
- Added normalized `x`/`y` placements to every hotspot and `locationId` plus placement to every character.
- Added explicit `falseLeadEvidenceIds` provenance for the scarf-thread false lead.
- Added `statementId` to statement evidence and validated the relation against canonical dialogue statements.
- Expanded focused tests to cover counts, all localized fields, translation selection, placements, every cross-entity reference category, unlocks, contradiction, deductions, reconstruction, decorative hotspot, false-lead provenance, and theory option values.

### Verification

- `rtk npm test -- --run src/case/missingCake.test.ts`: passed, 6 tests.
- `rtk npm test -- --run`: passed, 6 tests.
- `rtk npm run typecheck`: passed.
- `rtk npm run build`: passed; Vite production bundle generated.

### Remaining Concerns

- Cross-reference checks are focused test invariants rather than runtime validation; later state consumers should continue treating case data as trusted static input.
- Generated `dist/`, `node_modules/`, and `tsconfig.tsbuildinfo` remain untracked and excluded from the fixes commit.
