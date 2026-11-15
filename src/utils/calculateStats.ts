import type { LiveStats, WordData } from "../types";

export function calculateStats(
  words: WordData[],
  elapsedMilliseconds: number,
): LiveStats {
  let correctChars = 0;
  let incorrectChars = 0;
  let extraChars = 0;
  let missedChars = 0;

  for (const word of words) {
    for (const character of word.characters) {
      if (character.status === "correct") {
        correctChars += 1;
      } else if (character.status === "extra") {
        extraChars += 1;
      } else if (character.status === "incorrect") {
        if (character.missed) {
          missedChars += 1;
        } else {
          incorrectChars += 1;
        }
      }
    }
  }

  const elapsedMinutes = elapsedMilliseconds / 60_000;
  const typedChars = correctChars + incorrectChars + extraChars;
  const netChars = Math.max(0, correctChars - incorrectChars - extraChars);
  const accuracyDenominator =
    correctChars + incorrectChars + extraChars + missedChars;

  return {
    wpm:
      elapsedMinutes > 0
        ? Math.round(netChars / 5 / elapsedMinutes)
        : 0,
    rawWpm:
      elapsedMinutes > 0 ? Math.round(typedChars / 5 / elapsedMinutes) : 0,
    accuracy:
      accuracyDenominator > 0
        ? Math.round((correctChars / accuracyDenominator) * 100)
        : 100,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
  };
}
