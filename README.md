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
2. Choose a 15, 30, or 60 second test, then click the words and type to start.
3. Type each word and press Space to advance. Backspace corrects the current word; up to 10 extra characters are tracked.
4. Try an incorrect letter or skip a word to see error feedback, then let the timer finish or press **Reset test** to start over.

The test can also be started by typing letters while the page is focused. The word list contains 286 common words; more words are appended as you approach the end of the queue.

## Project structure

- `public/assets/` — fonts, sounds, and sprites
- `public/data/` — static game data and word lists
- `src/components/typing/` — typing test interface
- `src/components/results/` — post-test analytics
- `src/components/game/` — RPG battle interface
- `src/hooks/` — application and typing hooks
- `src/utils/` — shared calculations and helpers
- `src/types/` — shared TypeScript types
