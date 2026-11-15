import { useCallback, useEffect, useRef, useState } from "react";
import type { TestDuration, TypingTestState, WordData } from "../types";
import {
  APPEND_WHEN_REMAINING,
  INITIAL_WORD_COUNT,
  MAX_EXTRA_CHARACTERS,
  WORD_BATCH_SIZE,
  shuffleWords,
  takeWordBatch,
} from "../utils/wordGenerator";

interface EngineState extends TypingTestState {
  wordPool: string[];
  wordCursor: number;
  nextWordId: number;
}

function createInitialState(
  durationSeconds: TestDuration,
  sourceWords: string[],
): EngineState {
  const wordPool = shuffleWords(sourceWords);
  const initialBatch = takeWordBatch(
    wordPool,
    0,
    INITIAL_WORD_COUNT,
    0,
    sourceWords,
  );

  return {
    status: "idle",
    durationSeconds,
    timeLeftSeconds: durationSeconds,
    elapsedMilliseconds: 0,
    words: initialBatch.words,
    activeWordIndex: 0,
    activeCharIndex: 0,
    startedAt: null,
    wordPool: initialBatch.wordPool,
    wordCursor: initialBatch.wordCursor,
    nextWordId: initialBatch.nextWordId,
  };
}

function appendWordsIfNeeded(
  state: EngineState,
  sourceWords: string[],
): EngineState {
  const remainingWords = state.words.length - state.activeWordIndex;
  if (remainingWords > APPEND_WHEN_REMAINING) {
    return state;
  }

  const batch = takeWordBatch(
    state.wordPool,
    state.wordCursor,
    WORD_BATCH_SIZE,
    state.nextWordId,
    sourceWords,
  );

  return {
    ...state,
    words: [...state.words, ...batch.words],
    wordPool: batch.wordPool,
    wordCursor: batch.wordCursor,
    nextWordId: batch.nextWordId,
  };
}

function updateWord(
  words: WordData[],
  wordIndex: number,
  updatedWord: WordData,
): WordData[] {
  const nextWords = [...words];
  nextWords[wordIndex] = updatedWord;
  return nextWords;
}

export function useTypingEngine(sourceWords: string[]) {
  const [game, setGame] = useState<EngineState>(() =>
    createInitialState(30, sourceWords),
  );
  const gameRef = useRef(game);

  const commit = useCallback((nextGame: EngineState) => {
    gameRef.current = nextGame;
    setGame(nextGame);
  }, []);

  const reset = useCallback(
    (durationSeconds: TestDuration = gameRef.current.durationSeconds) => {
      commit(createInitialState(durationSeconds, sourceWords));
    },
    [commit, sourceWords],
  );

  const handleKey = useCallback(
    (key: string) => {
      const current = gameRef.current;
      if (current.status === "finished") {
        return;
      }

      const isLetter = /^[a-z]$/i.test(key);
      if (key !== " " && key !== "Backspace" && !isLetter) {
        return;
      }

      if (current.status === "idle" && !isLetter) {
        return;
      }

      const startedAt =
        current.status === "idle" ? performance.now() : current.startedAt;
      let nextGame: EngineState = {
        ...current,
        status: "running",
        startedAt,
      };

      if (key === "Backspace") {
        const activeWord = nextGame.words[nextGame.activeWordIndex];
        if (nextGame.activeCharIndex === 0 || !activeWord) {
          return;
        }

        const characters = activeWord.characters.map((character) => ({
          ...character,
        }));
        const expectedLength = characters.filter(
          (character) => character.status !== "extra",
        ).length;

        if (nextGame.activeCharIndex > expectedLength) {
          characters.pop();
        } else {
          const previousCharacter = characters[nextGame.activeCharIndex - 1];
          previousCharacter.status = "pending";
          delete previousCharacter.missed;
        }

        const updatedWord = {
          ...activeWord,
          characters,
          hasError: characters.some(
            (character) =>
              character.status === "incorrect" ||
              character.status === "extra",
          ),
        };
        nextGame = {
          ...nextGame,
          words: updateWord(
            nextGame.words,
            nextGame.activeWordIndex,
            updatedWord,
          ),
          activeCharIndex: nextGame.activeCharIndex - 1,
        };
        commit(nextGame);
        return;
      }

      if (key === " ") {
        const activeWord = nextGame.words[nextGame.activeWordIndex];
        if (!activeWord) {
          return;
        }

        const characters = activeWord.characters.map((character) => {
          if (character.status !== "pending") {
            return character;
          }

          return { ...character, status: "incorrect" as const, missed: true };
        });
        const completedWord = {
          ...activeWord,
          characters,
          isCompleted: true,
          hasError: characters.some(
            (character) =>
              character.status === "incorrect" ||
              character.status === "extra",
          ),
        };
        nextGame = {
          ...nextGame,
          words: updateWord(
            nextGame.words,
            nextGame.activeWordIndex,
            completedWord,
          ),
          activeWordIndex: nextGame.activeWordIndex + 1,
          activeCharIndex: 0,
        };
        commit(appendWordsIfNeeded(nextGame, sourceWords));
        return;
      }

      const activeWord = nextGame.words[nextGame.activeWordIndex];
      if (!activeWord) {
        return;
      }

      const characters = activeWord.characters.map((character) => ({
        ...character,
      }));
      const expectedLength = characters.filter(
        (character) => character.status !== "extra",
      ).length;
      const normalizedKey = key.toLowerCase();

      if (nextGame.activeCharIndex < expectedLength) {
        const targetCharacter = characters[nextGame.activeCharIndex];
        targetCharacter.status =
          targetCharacter.char === normalizedKey ? "correct" : "incorrect";
      } else if (
        characters.filter((character) => character.status === "extra").length <
        MAX_EXTRA_CHARACTERS
      ) {
        characters.push({ char: normalizedKey, status: "extra" });
      } else {
        return;
      }

      const updatedWord = {
        ...activeWord,
        characters,
        hasError: characters.some(
          (character) =>
            character.status === "incorrect" || character.status === "extra",
        ),
      };
      nextGame = {
        ...nextGame,
        words: updateWord(
          nextGame.words,
          nextGame.activeWordIndex,
          updatedWord,
        ),
        activeCharIndex: nextGame.activeCharIndex + 1,
      };
      commit(nextGame);
    },
    [commit, sourceWords],
  );

  const setDuration = useCallback(
    (durationSeconds: TestDuration) => reset(durationSeconds),
    [reset],
  );

  useEffect(() => {
    if (game.status !== "running" || game.startedAt === null) {
      return;
    }

    const updateClock = () => {
      const elapsedMilliseconds = Math.min(
        game.durationSeconds * 1000,
        performance.now() - game.startedAt!,
      );
      const remainingMilliseconds = Math.max(
        0,
        game.durationSeconds * 1000 - elapsedMilliseconds,
      );
      const timeLeftSeconds = Math.ceil(remainingMilliseconds / 1000);
      const isFinished = remainingMilliseconds === 0;

      commit({
        ...gameRef.current,
        elapsedMilliseconds,
        timeLeftSeconds,
        status: isFinished ? "finished" : "running",
      });
    };

    const timerId = window.setInterval(updateClock, 100);
    updateClock();
    return () => window.clearInterval(timerId);
  }, [commit, game.durationSeconds, game.startedAt, game.status]);

  return {
    ...game,
    handleKey,
    reset,
    setDuration,
  };
}
