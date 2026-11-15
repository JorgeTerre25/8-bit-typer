import type { CharacterData, WordData } from "../types";

export const INITIAL_WORD_COUNT = 50;
export const WORD_BATCH_SIZE = 25;
export const APPEND_WHEN_REMAINING = 15;
export const MAX_EXTRA_CHARACTERS = 10;

export function shuffleWords(words: string[]): string[] {
  const shuffled = [...words];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function createWordData(text: string, id: number): WordData {
  const characters: CharacterData[] = Array.from(text, (char) => ({
    char,
    status: "pending",
  }));

  return {
    id: `word-${id}`,
    characters,
    isCompleted: false,
    hasError: false,
  };
}

export interface WordBatch {
  words: WordData[];
  wordPool: string[];
  wordCursor: number;
  nextWordId: number;
}

export function takeWordBatch(
  wordPool: string[],
  wordCursor: number,
  count: number,
  nextWordId: number,
  sourceWords: string[],
): WordBatch {
  const words: WordData[] = [];
  let pool = wordPool;
  let cursor = wordCursor;

  while (words.length < count) {
    if (cursor >= pool.length) {
      pool = shuffleWords(sourceWords);
      cursor = 0;
    }

    const availableCount = Math.min(count - words.length, pool.length - cursor);
    const nextWords = pool.slice(cursor, cursor + availableCount);
    const batchStartId = nextWordId + words.length;

    nextWords.forEach((word, index) => {
      words.push(createWordData(word, batchStartId + index));
    });

    cursor += availableCount;
  }

  return {
    words,
    wordPool: pool,
    wordCursor: cursor,
    nextWordId: nextWordId + count,
  };
}
