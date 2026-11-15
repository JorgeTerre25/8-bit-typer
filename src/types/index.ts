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
  description: string;
  detail: string;
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
  mistakeCount: number;
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
