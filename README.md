# Missing Cake

Small bilingual reasoning game built with React, TypeScript, and Vite.

## Commands

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

Open local Vite URL after `npm run dev`. Progress saves to browser `localStorage`; if storage is unavailable, gameplay continues in memory for current session.

## Adding a case

Create one typed `CaseDefinition` containing bilingual content, initial locations, investigation rules, theory fields, contradictions, reconstruction, and SVG renderers. Pass it to `createGameRuntime`; runtime creates isolated state and a case-scoped save key. Generic files under `src/game` and `src/ui` must not import a specific case.
