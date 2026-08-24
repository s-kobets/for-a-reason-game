# The Missing Cake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, browser-playable detective MVP for “The Missing Cake” using interactive SVG scenes and a data-driven React state model.

**Architecture:** React/Vite/TypeScript client. Case content lives in typed data; reducer actions update investigation state; UI renders scenes, map, notebook, dialogue, theory, and reconstruction. localStorage persists the versioned state.

**Tech Stack:** React, Vite, TypeScript, CSS, inline SVG, browser localStorage, Vitest.

## Global Constraints

- English is default; Russian/English toggle translates interface and case content.
- SVG scene artwork; CSS handles interface and atmospheric decoration.
- Desktop-first responsive layout; mouse interaction; no backend or external image assets.
- One case only: Kitchen, Living Room, Garden, Corridor, Shed; four characters.
- No timer, game over, inventory, accounts, audio, 3D, or irreversible progression.
- Persist current location, opened locations, discoveries, questions, statements, deductions, character state, language, and theory.
- Invalid persistence data falls back to fresh state; unavailable localStorage does not block play.

---

### Task 1: Bootstrap the client app

**Files:**
- Modify: `package.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/global.css`
- Create: `tsconfig.json`
- Create: `vite.config.ts`

**Interfaces:**
- Produces Vite scripts `dev`, `build`, `test`, and `typecheck`.
- `App` renders the game shell and accepts no required props.

- [ ] Add React, Vite, TypeScript, Vitest, and testing-library dependencies; add scripts.
- [ ] Create Vite entry point mounting `App` into `#root`.
- [ ] Add a temporary shell with title, language toggle placeholder, and responsive page background.
- [ ] Run `npm install` and `npm run build`; expect successful production build.

### Task 2: Add case data and translation model

**Files:**
- Create: `src/case/types.ts`
- Create: `src/case/translations.ts`
- Create: `src/case/missingCake.ts`
- Test: `src/case/missingCake.test.ts`

**Interfaces:**
- `type Language = 'en' | 'ru'`
- `type EvidenceKind = 'observation' | 'statement' | 'deduction'`
- `interface CaseDefinition` contains `locations`, `hotspots`, `characters`, `deductions`, `contradiction`, `solution`, and `reconstruction`.
- `getText(text: LocalizedText, language: Language): string` returns the selected translation.
- Export `missingCakeCase: CaseDefinition`.

- [ ] Define localized text and case entity types so all visible case strings require English and Russian values.
- [ ] Encode five locations, SVG scene IDs, ten-plus observations, character dialogue, unlock conditions, three-plus deductions, contradiction, theory solution, and five reconstruction steps.
- [ ] Include a decorative hotspot and a false lead with an explainable source.
- [ ] Test that each location has a localized title and every solution field has at least one evidence source.
- [ ] Run `npm test -- --run src/case/missingCake.test.ts`; expect PASS.

### Task 3: Implement investigation state and persistence

**Files:**
- Create: `src/game/state.ts`
- Create: `src/game/reducer.ts`
- Create: `src/game/rules.ts`
- Create: `src/game/storage.ts`
- Test: `src/game/rules.test.ts`

**Interfaces:**
- `interface GameState` stores `locationId`, `openedLocationIds`, `discoveredHotspotIds`, `askedQuestionIds`, `receivedStatementIds`, `deductionIds`, `selectedEvidenceIds`, `theory`, `language`, and `reconstructionStep`.
- `type GameAction` includes `discoverHotspot`, `askQuestion`, `addStatement`, `unlockLocation`, `selectEvidence`, `makeDeduction`, `presentContradiction`, `setTheory`, `setLanguage`, `setLocation`, `setReconstructionStep`, and `reset`.
- `gameReducer(state: GameState, action: GameAction): GameState` is pure.
- `canAsk(question, state): boolean`, `availableQuestions(character, state)`, and `scoreTheory(theory, solution): 'wrong' | 'partial' | 'complete'` are pure.
- `loadGame(): GameState` and `saveGame(state): void` handle versioned localStorage.

- [ ] Write failing tests for valid/invalid deduction combinations, contradiction unlock, partial/full theory scoring, and malformed storage fallback.
- [ ] Implement initial state with Kitchen active and four starting locations open.
- [ ] Implement reducer actions without mutating prior state; keep discovery and evidence IDs deduplicated.
- [ ] Implement unlock rules from case conditions, including Shed unlock.
- [ ] Implement safe storage parsing with `localStorage` exception handling.
- [ ] Run focused tests, then `npm test -- --run`; expect PASS.

### Task 4: Build scene, map, notebook, and dialogue UI

**Files:**
- Modify: `src/App.tsx`
- Create: `src/ui/GameShell.tsx`
- Create: `src/ui/SceneView.tsx`
- Create: `src/ui/SceneArtwork.tsx`
- Create: `src/ui/MapPanel.tsx`
- Create: `src/ui/NotebookPanel.tsx`
- Create: `src/ui/DialoguePanel.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- `GameShell` receives `caseData`, `state`, and `dispatch`.
- `SceneView` receives `location`, `state`, and `onAction`.
- `SceneArtwork` receives `sceneId` and `hotspots`; it renders accessible SVG buttons with stable hotspot IDs.
- `MapPanel` receives available locations and `onSelectLocation(locationId)`.
- `NotebookPanel` receives categorized evidence, selected IDs, and deduction callback.
- `DialoguePanel` receives optional character, available questions, and callbacks for ask/present contradiction.

- [ ] Replace temporary shell with a header, scene area, map control, notebook panel, and modal/panel overlays.
- [ ] Draw five inline SVG dioramas using simple paths, shapes, labels, and repeated visual motifs; do not add image files.
- [ ] Render visible hotspot markers with hover/focus labels; clicking dispatches discovery and opens evidence detail.
- [ ] Render characters as clickable SVG figures or labeled portrait cards.
- [ ] Show notebook categories, evidence selection, valid deduction feedback, and empty states.
- [ ] Show conditional questions and Petya contradiction action only when rules allow them.
- [ ] Translate every label through the typed translation/case data model.
- [ ] Run `npm run typecheck` and `npm run build`; expect PASS.

### Task 5: Add theory flow and reconstruction

**Files:**
- Create: `src/ui/TheoryPanel.tsx`
- Create: `src/ui/ReconstructionView.tsx`
- Modify: `src/ui/GameShell.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- `TheoryPanel` receives `theory`, translated solution options, `onChange`, and `onSubmit`.
- `ReconstructionView` receives `steps`, `currentStep`, `onNext`, and `onReplay`.

- [ ] Add five translated selects for person, origin, entry method, event, and motive.
- [ ] Allow submission at any time and show wrong/partial/complete result without removing evidence.
- [ ] On complete result, render one reconstruction card at a time with timestamp, text, and SVG vignette.
- [ ] Add next/replay controls and final “case understood” state.
- [ ] Persist theory and reconstruction progress through existing reducer/storage interfaces.
- [ ] Run `npm run typecheck`, `npm test -- --run`, and `npm run build`; expect PASS.

### Task 6: Finish bilingual polish and verification

**Files:**
- Modify: `src/case/translations.ts`
- Modify: `src/case/missingCake.ts`
- Modify: `src/styles/global.css`
- Modify: `README.md`

**Interfaces:**
- No new public interfaces; this task hardens the completed flow.

- [ ] Audit visible strings for English and Russian coverage, including errors, empty states, feedback, map labels, dialogue, and reconstruction.
- [ ] Add responsive breakpoints that stack the notebook below the scene on narrow screens while keeping controls usable.
- [ ] Add keyboard focus styles, button labels, dialog semantics, and no-color-only evidence distinctions.
- [ ] Add save indicator, reset confirmation, and graceful in-memory behavior when storage fails.
- [ ] Document `npm install`, `npm run dev`, `npm run typecheck`, `npm test`, and `npm run build` in `README.md`.
- [ ] Manually verify: start, inspect hotspots, move locations, unlock Shed, ask conditional question, present contradiction, make deduction, submit partial theory, submit full theory, advance reconstruction, reload, switch language, and reset.

## Plan Self-Review

- Spec coverage: exploration, map unlocks, evidence categories, dialogue gates, contradiction, deductions, theory scoring, reconstruction, bilingual content, SVG/CSS split, responsive layout, persistence, and failure handling are covered by Tasks 2 through 6.
- Placeholder scan: no deferred or unspecified implementation steps remain.
- Type consistency: `GameState`, `GameAction`, `CaseDefinition`, `gameReducer`, `scoreTheory`, `loadGame`, and `saveGame` are defined before UI tasks consume them.
- Scope: one client app and one case; no backend or asset pipeline has been added.
