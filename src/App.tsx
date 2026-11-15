import { useEffect, useState } from "react";
import { HeroBattle } from "./components/game/HeroBattle";
import { CharacterSelect } from "./components/menu/CharacterSelect";
import { MainMenu } from "./components/menu/MainMenu";
import { ModeSelect } from "./components/menu/ModeSelect";
import { TypingTest } from "./components/typing/TypingTest";
import type { ChampionId } from "./types";

interface WordLists {
  common: string[];
  hard: string[];
}

function isWordLists(value: unknown): value is WordLists {
  if (
    typeof value !== "object" ||
    value === null ||
    !("common" in value) ||
    !("hard" in value)
  ) {
    return false;
  }

  const common = value.common;
  const hard = value.hard;
  if (
    !Array.isArray(common) ||
    common.length < 200 ||
    common.length > 500 ||
    !common.every(
      (word) => typeof word === "string" && /^[a-z]+$/.test(word),
    ) ||
    !Array.isArray(hard) ||
    hard.length === 0 ||
    !hard.every((word) => typeof word === "string" && /^[a-z]+$/.test(word))
  ) {
    return false;
  }

  return (
    common.some((word) => word.length >= 4 && word.length <= 6) &&
    common.some((word) => word.length >= 7 && word.length <= 10)
  );
}

type Screen = "menu" | "modes" | "classes" | "hero" | "typing";

function App() {
  const [wordLists, setWordLists] = useState<WordLists | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("menu");
  const [selectedChampion, setSelectedChampion] =
    useState<ChampionId | null>(null);

  useEffect(() => {
    let active = true;

    async function loadWordBank() {
      try {
        const response = await fetch("/data/wordlists.json");
        if (!response.ok) {
          throw new Error(`Could not load the word list (${response.status}).`);
        }

        const data: unknown = await response.json();
        if (!isWordLists(data)) {
          throw new Error(
            "The word lists must include 200–500 lowercase common words with 4–6 and 7–10 letter entries, plus lowercase hard words.",
          );
        }

        if (active) {
          setWordLists(data);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load the word list.",
          );
        }
      }
    }

    void loadWordBank();
    return () => {
      active = false;
    };
  }, []);

  if (loadError) {
    return (
      <main className="app-shell">
        <section className="loading-panel error-panel" role="alert">
          <p className="eyebrow">The scribe needs a moment</p>
          <h1>Word list unavailable</h1>
          <p>{loadError}</p>
        </section>
      </main>
    );
  }

  if (!wordLists) {
    return (
      <main className="app-shell">
        <section className="loading-panel" role="status">
          <p className="eyebrow">Preparing the practice scroll</p>
          <h1>Medieval Typer</h1>
          <p>Loading the word list…</p>
        </section>
      </main>
    );
  }

  if (screen === "menu") {
    return <MainMenu onPlay={() => setScreen("modes")} />;
  }

  if (screen === "modes") {
    return (
      <ModeSelect
        onBack={() => setScreen("menu")}
        onHeroMode={() => setScreen("classes")}
        onTypingTest={() => setScreen("typing")}
      />
    );
  }

  if (screen === "classes") {
    return (
      <CharacterSelect
        onBack={() => setScreen("modes")}
        onSelect={(champion) => {
          setSelectedChampion(champion);
          setScreen("hero");
        }}
      />
    );
  }

  if (screen === "typing") {
    return (
      <TypingTest
        onMainMenu={() => setScreen("modes")}
        wordBank={wordLists.common}
      />
    );
  }

  if (screen === "hero" && selectedChampion) {
    return (
      <HeroBattle
        championId={selectedChampion}
        onMainMenu={() => setScreen("modes")}
        wordBank={wordLists.common}
        bossWordBank={wordLists.hard}
      />
    );
  }

  return <ModeSelect
    onBack={() => setScreen("menu")}
    onHeroMode={() => setScreen("classes")}
    onTypingTest={() => setScreen("typing")}
  />;
}

export default App;
