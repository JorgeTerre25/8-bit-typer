import type { BattleEnemy, ChampionId, EnemyKind } from "../types";

const enemyStats: Record<
  EnemyKind,
  { name: string; minHealth: number; maxHealth: number; minDamage: number; maxDamage: number }
> = {
  goblin: {
    name: "Goblin",
    minHealth: 45,
    maxHealth: 70,
    minDamage: 8,
    maxDamage: 14,
  },
  skeleton: {
    name: "Skeleton",
    minHealth: 65,
    maxHealth: 95,
    minDamage: 12,
    maxDamage: 18,
  },
  wraith: {
    name: "Wraith",
    minHealth: 85,
    maxHealth: 120,
    minDamage: 16,
    maxDamage: 24,
  },
  miniBoss: {
    name: "Ogre Warlord",
    minHealth: 180,
    maxHealth: 240,
    minDamage: 20,
    maxDamage: 30,
  },
};

const regularEnemyKinds: EnemyKind[] = ["goblin", "skeleton", "wraith"];

function randomBetween(minimum: number, maximum: number): number {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

export function createEnemy(encounter: number): BattleEnemy {
  const kind =
    encounter % 10 === 0
      ? "miniBoss"
      : regularEnemyKinds[randomBetween(0, regularEnemyKinds.length - 1)];
  const stats = enemyStats[kind];
  const maxHealth = randomBetween(stats.minHealth, stats.maxHealth);

  return {
    encounter,
    kind,
    name: stats.name,
    health: maxHealth,
    maxHealth,
    damage: randomBetween(stats.minDamage, stats.maxDamage),
  };
}

export function getChampionWordBank(
  words: string[],
  championId: ChampionId,
): string[] {
  const averageWords = words.filter(
    (word) => word.length >= 4 && word.length <= 6,
  );
  const lengthyWords = words.filter(
    (word) => word.length >= 7 && word.length <= 10,
  );

  if (averageWords.length === 0 || lengthyWords.length === 0) {
    throw new Error("The word list needs both 4–6 and 7–10 letter words.");
  }

  if (championId === "knight") {
    return averageWords;
  }
  if (championId === "wizard") {
    return lengthyWords;
  }

  const wordsPerLength = Math.min(averageWords.length, lengthyWords.length);
  return [
    ...averageWords.slice(0, wordsPerLength),
    ...lengthyWords.slice(0, wordsPerLength),
  ];
}

export function getWordTimerDuration(isMiniBoss = false): number {
  return isMiniBoss ? 3_000 : 5_000;
}
