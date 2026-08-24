# The Missing Cake: MVP Design

## Goal

Build one complete browser detective case that demonstrates the intended loop:

`explore -> collect information -> question characters -> connect facts -> form a theory -> understand the reconstruction`.

The interface defaults to English and supports a Russian/English toggle. The case content is translated as well as the chrome UI.

## Product Scope

The MVP contains one case, “The Missing Cake”. A cake disappears before a family celebration. The player investigates five small locations, talks to four characters, discovers evidence, resolves a contradiction, makes deductions, and reconstructs what happened.

Included:

- desktop-first responsive browser layout;
- mouse-driven SVG scene illustrations;
- Kitchen, Living Room, Garden, Corridor, and Shed locations;
- interactive hotspots and characters;
- notebook tabs for observations, statements, and deductions;
- conditional questions unlocked by discovered facts;
- contradiction interaction involving Petya;
- selectable notebook facts and valid deduction combinations;
- five-part “My Theory” form;
- incorrect, partially correct, and fully correct results;
- reconstruction sequence;
- automatic localStorage save and reset progress.

Excluded:

- backend, accounts, multiplayer, procedural cases, case editor, 3D, free movement, inventory, timers, game over, audio, and external image assets.

## Visual Design

Scene artwork uses inline SVG rather than CSS shapes or downloaded images. SVG supplies readable illustrated objects, scalable rendering, and stable coordinates for hotspot placement. HTML and CSS provide the surrounding interface, panels, buttons, map, typography, shadows, and small atmospheric effects.

Each scene is a single SVG composition with a warm illustrated-diorama style: dark ink outlines, cream paper surfaces, teal and coral accents, readable props, and restrained texture. Hotspots are real buttons positioned over the scene or represented by accessible SVG buttons. Hover and focus states show a subtle glow and label; important objects remain visibly identifiable.

The desktop screen uses a large scene area beside the notebook. On narrow screens, the scene remains first and notebook/navigation panels stack below it.

## Architecture

Use React, Vite, and TypeScript. Keep the implementation small and data-driven:

- `src/case`: typed “Missing Cake” case data, including translations, locations, hotspots, characters, deductions, contradiction, solution, and reconstruction;
- `src/game`: state transitions, derived unlock rules, theory checking, and localStorage persistence;
- `src/ui`: scene, map, notebook, dialogue, theory, reconstruction, and shared controls;
- `src/styles`: global visual language and responsive layout.

The case data must not directly mutate game state. UI dispatches small actions such as discovering a hotspot, asking a question, selecting a notebook item, making a deduction, changing language, and submitting a theory.

The game state stores current location, opened locations, discovered hotspot IDs, asked question IDs, received statement IDs, deduction IDs, selected notebook IDs, theory selections, reconstruction progress, and language. Save after each meaningful state change.

## Investigation Content

The player begins in the Kitchen with the cake missing. The map exposes Kitchen, Living Room, Garden, and Corridor; the Shed unlocks through dialogue.

The case provides roughly ten to fifteen observations, ten to twenty statements, three to five deductions, and two to three contradictions. Evidence distinguishes directly observed facts from character statements. Suspicious details have explanations rather than existing only to mislead.

Core chain:

1. Kitchen window and muddy footprints establish movement from Garden into Kitchen.
2. Garden evidence and weather timing establish that the footprints are recent.
3. Petya initially claims he was never in the Garden.
4. Petya’s scarf and the footprint chain expose that statement as false.
5. Petya admits entering through the window but says he moved the cake for a surprise.
6. Additional statements and the hidden Shed location confirm the destination and motive.

The player may inspect decorative objects for short atmospheric comments. No action can permanently block progress.

## Main Flows

### Explore

Clicking a hotspot opens a compact evidence panel. First discovery adds its observation to the notebook and may unlock questions, locations, or deductions. Reopening an inspected hotspot shows its information without duplicating the notebook entry.

### Dialogue

Clicking a character opens a dialogue panel with available questions. Questions are conditional on discovered facts or prior statements. A response can add a statement, unlock a location, or reveal a contradiction action. Asked questions remain available as history but do not duplicate evidence.

### Notebook

Notebook sections show Observations, Statements, and Deductions. The player can select multiple entries and press “Make deduction”. Valid combinations add a deduction and provide feedback. Invalid combinations explain that the connection is not strong enough without revealing the solution.

### Contradiction

When the required statement and evidence are available, Petya’s dialogue shows “Present contradiction”. The player sees both pieces of information and confirms presenting them. Petya changes his statement and unlocks the next branch.

### Theory

“My Theory” becomes available from the start but communicates that more evidence may help. The form asks: who, origin, entry method, what happened, and why. Dropdown options are translated. Submission compares selections independently and returns incorrect, partial, or complete feedback. The player can revise indefinitely.

### Reconstruction

A complete theory opens a sequential reconstruction with five timestamped cards. It reuses the case visual language and uses SVG vignettes or scene variations. A final message confirms the player understood the story and offers replay/reset.

## Language

Use a typed translation object for all visible strings, including case text, evidence, names, questions, feedback, map labels, and reconstruction. English is initial language. The toggle updates visible text without resetting progress. Language is persisted with game state.

## Persistence and Failure Handling

Use localStorage under one versioned key. Parsing failures, missing fields, or incompatible versions fall back to a fresh state rather than breaking the game. Saving is best-effort; the UI shows a small saved indicator but does not block play.

No failure state removes evidence or locks a location. Reset progress requires an explicit confirmation. The game remains usable if localStorage is unavailable by continuing in memory.

## Verification

Run TypeScript/build validation. Add one focused automated test for the state rules or theory scoring. Manually verify the critical browser flow: start case, inspect hotspots, move through map, ask unlocked question, present contradiction, make deduction, submit partial theory, submit full theory, watch reconstruction, reload, and confirm saved progress/language.

## Scope Check

This is one implementation unit: a static client app with one case. SVG scenes are self-contained and avoid an asset pipeline. The data boundary supports future cases without requiring a case editor or backend now.
