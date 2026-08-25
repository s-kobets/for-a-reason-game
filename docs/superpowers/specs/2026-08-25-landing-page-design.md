# Landing Page Design

## Goal

Add a polished bilingual showcase before the existing game so visitors can understand the product, preview its tone, choose a case, and resume saved progress.

## Visual Direction

- Use a playful illustrated storybook style aligned with the game's cozy family audience.
- Keep rounded shapes, tactile cards, warm cream and green surfaces, and orange primary actions.
- Support coordinated light and dark themes. Dark mode must feel like the same illustrated world rather than a separate noir identity.
- Use an animated game mockup in the hero instead of a video, screenshot, or playable demo.
- Limit animation to subtle CSS movement and disable it under `prefers-reduced-motion`.

## Page Structure

1. Compact header with product name, English/Russian toggle, and light/dark toggle.
2. Hero with the core promise, primary Start or Resume action, and layered scene artwork with animated clue markers.
3. Case library with one playable featured case and two disabled coming-soon teasers.
4. Three-step explanation: explore scenes, connect clues, and tell the full story.
5. Minimal footer emphasizing no timers and no dead ends.

The playable card is `The Missing Cake`. The teaser cards are `The Midnight Greenhouse` and `The Vanishing Violin`; their Russian titles and supporting copy must be provided alongside English copy.

## Navigation And State

- Keep one React application with no router dependency.
- `App` owns whether the landing page or game is visible.
- The hero action and playable case card both open the existing Missing Cake game.
- Add a Home action to the game header that returns to the landing page without resetting or losing progress.
- Existing game runtime, reducer, case definition, and save behavior remain unchanged.
- If `runtime.storageKey` contains a valid saved game, landing actions say Resume and the case card indicates progress. Otherwise, they say Start.
- Storage access or parsing failures must fall back to Start and must not prevent landing or gameplay from rendering.

## Language

- Translate all landing copy into English and Russian.
- Landing language defaults to the language in valid saved game state when available, otherwise English.
- Changing language on the landing page updates the game language when the player opens the case.
- Existing in-game language behavior remains available.

## Theme

- On first visit, use `prefers-color-scheme`.
- A visible theme toggle allows manual override.
- Persist the explicit choice in `localStorage`; stored choice wins over system preference on later visits.
- If storage is unavailable, keep the preference in current React state.
- Apply theme before or during initial rendering so no avoidable light-theme flash appears.

## Responsive And Accessible Behavior

- On mobile, stack hero artwork below its copy and show case cards in one column.
- Use semantic page landmarks, one page heading, and real buttons for all actions.
- Coming-soon cards must be visibly unavailable and excluded from interactive tab order.
- Preserve visible keyboard focus and readable contrast in both themes.
- Theme and language controls require accessible labels that describe their resulting action or current state.

## Components

- `App`: owns screen selection, initializes runtime state, and passes navigation callbacks.
- `LandingPage`: renders landing content and receives language, theme, saved-progress status, and case-opening callbacks.
- `GameShell`: receives one Home callback and renders the corresponding header action.

No case registry, routing layer, animation library, or generalized catalog model is required for one playable case and two static teasers.

## Verification

Add one focused landing integration test covering:

- Start state when no valid save exists;
- Resume state when valid saved progress exists;
- opening the game from the hero or featured card;
- returning Home without losing progress;
- English/Russian landing copy;
- system theme default, manual theme override, and persisted override;
- storage failure fallback.

Also run the existing test suite, TypeScript typecheck, and production build.
