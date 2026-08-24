# Three-Column Investigation Layout

## Goal

Make desktop investigation screen easier to scan by separating navigation, active scene, theory, and collected evidence.

## Layout

At desktop widths, `.game-layout` becomes a three-column grid:

- left column: Map;
- center column: current Scene;
- right column: My Theory.

Notebook moves below this grid as a full-width panel. It remains the main evidence workspace and keeps existing selection, deduction, and feedback behavior.

The scene remains the visual focal point and receives the widest column. Map and theory use equal narrow columns with readable controls. Cards keep independent borders, padding, and vertical gaps.

## Responsive Behavior

At widths below the existing responsive breakpoint, the layout becomes one column in this order:

1. Scene;
2. My Theory;
3. Map;
4. Notebook.

Existing mobile Map and Notebook overlay controls remain available from the header. No state or evidence behavior changes.

## Component Changes

`GameShell` renders Map and Theory in a side region around the Scene, then renders Notebook as a separate full-width region. `MapPanel`, `TheoryPanel`, and `NotebookPanel` keep their current props and actions. CSS owns grid placement, widths, spacing, and responsive stacking.

## Verification

- Existing unit and UI tests continue to pass.
- Add a DOM-order test proving desktop source order is Map, Scene, Theory, Notebook where practical.
- Run typecheck and production build.
- Visually inspect desktop and narrow layouts if browser tooling is available.

## Scope

Only layout structure and styling change. Investigation state, case data, translations, persistence, deductions, theory scoring, and reconstruction remain unchanged.
