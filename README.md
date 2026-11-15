# 8-bit-typer
A cozy medieval typing test built with React and TypeScript—featuring typing analytics and spell-to-slay fantasy combat.

## Getting started

```sh
npm install
npm run dev
```

Run `npm run build` to type-check the project and create a production build.

## Try the typing test

1. Run `npm run dev` and open the local URL printed by Vite.
2. Select **Play**, then choose Knight (150 HP), Wizard (80 HP), or Archer (120 HP).
3. Choose a 15, 30, or 60 second battle.
4. Type the word assigned to the enemy and press Space to defeat it. Each wrong or skipped letter costs 10 HP.
5. Try an incorrect letter or skip a word to see the health bar change. Survive until the timer ends, or lose when health reaches zero.

Each class starts with its listed maximum health. The word list contains 286 common words; more words are appended as you approach the end of the queue.

## Project structure

- `public/assets/` — fonts, sounds, and sprites
- `public/data/` — static game data and word lists
- `src/components/menu/` — main menu and champion selection
- `src/components/typing/` — typing test interface
- `src/components/results/` — post-test analytics
- `src/components/game/` — RPG battle interface
- `src/hooks/` — application and typing hooks
- `src/utils/` — shared calculations and helpers
- `src/types/` — shared TypeScript types
