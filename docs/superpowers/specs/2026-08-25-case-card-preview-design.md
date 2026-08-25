# Case Card Preview Design

## Goal

Add a real visual preview to the playable Missing Cake card in the landing page's Choose a case section.

## Design

- Reuse existing `renderMissingCakeScene('kitchen-diorama')` SVG artwork from `src/case/missingCakeArtwork.tsx`.
- Render artwork in the upper half of the playable card, with existing case number, title, resume status, and action semantics below it.
- Keep teaser cards text-only because they are not playable and have no existing scene artwork.
- Keep the entire playable card as one accessible button. Preview SVG must use `aria-hidden="true"` and must not create nested controls.
- Preserve existing light/dark themes. Use card-level background/frame styling; reuse scene colors without adding new image assets.
- Preserve mobile card stacking and existing reduced-motion behavior.

## Implementation

- Import `renderMissingCakeScene` into `LandingPage.tsx`.
- Add an `svg` preview wrapper inside the playable card with the same `viewBox` dimensions used by scene artwork.
- Add only focused `.case-card-preview` styling to `global.css`; no image dependency or asset pipeline.
- Keep teaser markup and landing navigation unchanged.

## Verification

- Add a component test asserting the playable card contains the kitchen preview SVG.
- Assert teaser cards do not render scene SVGs.
- Run focused landing tests, full test suite, typecheck, and production build.
