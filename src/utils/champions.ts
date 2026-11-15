import type { Champion, ChampionId } from "../types";

export const CHAMPIONS: Record<ChampionId, Champion> = {
  knight: {
    id: "knight",
    name: "Knight",
    maxHealth: 150,
    description: "Steadfast and brave",
    detail: "Hold the line and meet every challenge.",
  },
  wizard: {
    id: "wizard",
    name: "Wizard",
    maxHealth: 80,
    description: "Wise and curious",
    detail: "Turn focus and knowledge into power.",
  },
  archer: {
    id: "archer",
    name: "Archer",
    maxHealth: 120,
    description: "Keen-eyed and swift",
    detail: "Take aim, stay calm, and strike true.",
  },
};

export const CHAMPION_LIST = [
  CHAMPIONS.knight,
  CHAMPIONS.wizard,
  CHAMPIONS.archer,
];
