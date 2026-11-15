# Medieval Typer
A medieval typing game built with React and TypeScript, with a classic timed test and a separate hero-combat mode.

## Getting started

```sh
npm install
npm run dev
```

Run `npm run build` to type-check the project and create a production build.

## Play

1. Run `npm run dev` and open the local URL printed by Vite.
2. Select **Play**, then choose **Hero Mode** or **Typing Test**.
3. In Typing Test, choose a 15, 30, or 60 second round. The timer begins with your first letter.
4. In Hero Mode, choose a champion and type the enemy's word before its per-word timer expires. Press Space to submit; Backspace corrects a typo.

Hero Mode rules:

- Knight starts with 150 HP, deals 25 damage, and gets average-length words.
- Wizard starts with 80 HP, deals 40 damage, and gets longer words.
- Archer starts with 120 HP, deals 15 damage, and has a 10% chance to hit twice; its words mix both lengths.
- Correct words damage the enemy. Failed or expired words let the same enemy attack; a typo can be corrected before submission.
- Regular enemies allow 5 seconds per word.
- Goblins have 45–70 HP and deal 8–14 damage; skeletons have 65–95 HP and deal 12–18; wraiths have 85–120 HP and deal 16–24.
- Every 10th encounter is an Ogre Warlord mini-boss with 180–240 HP, 20–30 damage, extra-difficult words from the hard word list, and 3 seconds per word.

The common word list contains 286 words and is queued dynamically during typing tests.

## Project structure

- `public/assets/` — fonts, sounds, and sprites
- `public/data/` — static game data and word lists
- `src/components/menu/` — main menu, mode selection, and champion selection
- `src/components/typing/` — typing test interface
- `src/components/results/` — post-test analytics
- `src/components/game/` — RPG battle interface
- `src/hooks/` — application and typing hooks
- `src/utils/` — shared calculations and helpers
- `src/types/` — shared TypeScript types
