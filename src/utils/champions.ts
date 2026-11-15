import type { Champion, ChampionId } from "../types";

export const CHAMPIONS: Record<ChampionId, Champion> = {
  knight: {
    id: "knight",
    name: "Knight",
    maxHealth: 150,
    attackDamage: 25,
    doubleHitChance: 0,
    wordProfile: "average",
    description: "Steadfast and brave",
    detail: "Average words · 25 damage per word",
  },
  wizard: {
    id: "wizard",
    name: "Wizard",
    maxHealth: 80,
    attackDamage: 40,
    doubleHitChance: 0,
    wordProfile: "lengthy",
    description: "Wise and curious",
    detail: "Lengthy words · 40 damage per word",
  },
  archer: {
    id: "archer",
    name: "Archer",
    maxHealth: 120,
    attackDamage: 15,
    doubleHitChance: 0.1,
    wordProfile: "mixed",
    description: "Keen-eyed and swift",
    detail: "Mixed words · 15 damage · 10% double hit",
  },
};

export const CHAMPION_LIST = [
  CHAMPIONS.knight,
  CHAMPIONS.wizard,
  CHAMPIONS.archer,
];
