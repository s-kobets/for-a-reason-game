# Three-Column Investigation Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Notebook below a clear three-column desktop investigation layout while preserving all gameplay behavior.

**Architecture:** Keep existing React components and props. Change `GameShell` source structure so Map, Scene, and Theory occupy the upper grid, with Notebook as a full-width panel below; CSS handles desktop sizing and mobile stacking.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Desktop upper layout: left Map, center Scene, right My Theory.
- Notebook occupies full width below upper layout.
- Mobile order: Scene, My Theory, Map, Notebook.
- No state, case data, translation, persistence, deduction, theory, or reconstruction behavior changes.
- Preserve existing mobile Map and Notebook overlays.

---

### Task 1: Restructure Investigation Layout

**Files:**
- Modify: `src/ui/GameShell.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/ui/GameShell.test.tsx`

**Interfaces:**
- Existing `MapPanel`, `SceneView`, `TheoryPanel`, and `NotebookPanel` props remain unchanged.
- `GameShell` keeps all existing action dispatches and overlay rendering.

- [ ] Add a failing DOM-order test asserting desktop source order: Map, Scene, Theory, Notebook.
- [ ] Run `rtk npm test -- --run src/ui/GameShell.test.tsx`; confirm failure because current order is Scene, Theory/Map/Notebook nested in sidebar.
- [ ] Render a top layout wrapper with Map, Scene, and Theory as separate children, then render Notebook in a full-width wrapper below it.
- [ ] Change desktop CSS to a three-column grid with a wider center column and readable side columns; add explicit gaps and card spacing.
- [ ] Add responsive CSS that stacks Scene, Theory, Map, Notebook in that order below `900px` while retaining header-triggered overlays.
- [ ] Run `rtk npm test -- --run`, `rtk npm run typecheck`, and `rtk npm run build`; expect all checks to pass.

## Plan Self-Review

- Spec coverage: desktop columns, full-width Notebook, mobile order, component reuse, and verification are covered by Task 1.
- Placeholder scan: no deferred implementation steps remain.
- Type consistency: no new interfaces are introduced; existing component contracts remain unchanged.
