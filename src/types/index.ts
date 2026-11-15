export type CharStatus = "pending" | "correct" | "incorrect" | "extra";

export interface CharacterData {
  char: string;
  status: CharStatus;
  missed?: boolean;
}

export interface WordData {
  id: string;
  characters: CharacterData[];
  isCompleted: boolean;
  hasError: boolean;
}

export type TestStatus = "idle" | "running" | "finished";
export type TestDuration = 15 | 30 | 60;
export type ChampionId = "knight" | "wizard" | "archer";

export interface Champion {
  id: ChampionId;
  name: string;
  maxHealth: number;
  attackDamage: number;
  doubleHitChance: number;
  wordProfile: "average" | "lengthy" | "mixed";
  description: string;
  detail: string;
}

export type EnemyKind = "goblin" | "skeleton" | "wraith" | "miniBoss";

export interface BattleEnemy {
  encounter: number;
  kind: EnemyKind;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
}

export interface TypingTestState {
  status: TestStatus;
  durationSeconds: TestDuration;
  timeLeftSeconds: number;
  elapsedMilliseconds: number;
  words: WordData[];
  activeWordIndex: number;
  activeCharIndex: number;
  startedAt: number | null;
}

export interface LiveStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
}
