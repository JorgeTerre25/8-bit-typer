import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { CharacterSelect } from "./components/menu/CharacterSelect";
import { MainMenu } from "./components/menu/MainMenu";
import { BattleArena } from "./components/game/BattleArena";
import { ModeSelector } from "./components/typing/ModeSelector";
import { TimerBar } from "./components/typing/TimerBar";
import { WordDisplay } from "./components/typing/WordDisplay";
import { useTypingEngine } from "./hooks/useTypingEngine";
import type { ChampionId, TestDuration } from "./types";
import { calculateStats } from "./utils/calculateStats";
import { CHAMPIONS } from "./utils/champions";

interface WordLists {
  common: string[];
}

function isWordLists(value: unknown): value is WordLists {
  if (typeof value !== "object" || value === null || !("common" in value)) {
    return false;
  }

  const common = value.common;
  return (
    Array.isArray(common) &&
    common.length >= 200 &&
    common.length <= 500 &&
    common.every(
      (word) => typeof word === "string" && /^[a-z]+$/.test(word),
    )
  );
}

function App() {
  const [wordBank, setWordBank] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [screen, setScreen] = useState<"menu" | "classes" | "typing">("menu");
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
            "The common word list must contain 200–500 lowercase words.",
          );
        }

        if (active) {
          setWordBank(data.common);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load the word list.",
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

  if (!wordBank) {
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
    return <MainMenu onPlay={() => setScreen("classes")} />;
  }

  if (screen === "classes") {
    return (
      <CharacterSelect
        onBack={() => setScreen("menu")}
        onSelect={(champion) => {
          setSelectedChampion(champion);
          setScreen("typing");
        }}
      />
    );
  }

  if (screen === "typing" && selectedChampion) {
    return (
      <TypingTest
        championId={selectedChampion}
        onMainMenu={() => setScreen("menu")}
        wordBank={wordBank}
      />
    );
  }

  return <MainMenu onPlay={() => setScreen("classes")} />;
}

interface TypingTestProps {
  championId: ChampionId;
  onMainMenu: () => void;
  wordBank: string[];
}

function TypingTest({
  championId,
  onMainMenu,
  wordBank,
}: TypingTestProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const champion = CHAMPIONS[championId];
  const engine = useTypingEngine(wordBank, champion.maxHealth / 10);
  const stats = calculateStats(engine.words, engine.elapsedMilliseconds);
  const errorCount =
    stats.incorrectChars + stats.extraChars + stats.missedChars;
  const health = Math.max(
    0,
    champion.maxHealth - engine.mistakeCount * 10,
  );
  const activeWord = engine.words[engine.activeWordIndex];
  const enemyWord =
    activeWord?.characters
      .filter((character) => character.status !== "extra")
      .map((character) => character.char)
      .join("") ?? "";

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && event.repeat) {
        event.preventDefault();
        return;
      }

      if (
        event.target === inputRef.current ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("button, select, input, textarea, [contenteditable='true']")
      ) {
        return;
      }

      if (
        /^[a-z]$/i.test(event.key) ||
        event.key === " " ||
        event.key === "Backspace"
      ) {
        event.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
        engine.handleKey(event.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [engine.handleKey]);

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === " " && event.repeat) {
      event.preventDefault();
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey || event.key === "Tab") {
      return;
    }

    event.preventDefault();
    engine.handleKey(event.key);
  }

  function handleDurationChange(duration: TestDuration) {
    engine.setDuration(duration);
    inputRef.current?.focus({ preventScroll: true });
  }

  const statusMessage =
    engine.status === "idle"
      ? "Type the enemy's word. Each mistake costs 10 health."
      : engine.status === "running"
        ? "Keep typing to defeat this enemy."
        : health === 0
          ? "Your hero has fallen. Reset to fight again."
          : "Time is up. The battle is over.";

  return (
    <main className="app-shell">
      <div className="typing-app">
        <header className="app-header battle-header">
          <div>
            <p className="eyebrow">Battle underway · {champion.name}</p>
            <h1>Medieval Typer</h1>
          </div>
          <div className="battle-actions">
            <button className="menu-nav-button" onClick={onMainMenu} type="button">
              Main menu
            </button>
            <button
              className="reset-button"
              onClick={() => {
                engine.reset();
                inputRef.current?.focus({ preventScroll: true });
              }}
              type="button"
            >
              Reset battle
            </button>
          </div>
        </header>

        <BattleArena
          champion={champion}
          defeatedCount={engine.activeWordIndex}
          enemyIndex={engine.activeWordIndex}
          enemyWord={enemyWord}
          health={health}
        />

        <section aria-label="Typing test controls" className="test-controls">
          <ModeSelector
            disabled={engine.status === "running"}
            duration={engine.durationSeconds}
            onChange={handleDurationChange}
          />
          <TimerBar
            duration={engine.durationSeconds}
            timeLeft={engine.timeLeftSeconds}
          />
        </section>

        <section
          aria-label="Typing battle controls"
          className="typing-panel battle-typing-panel"
        >
          <div className="stats-row" aria-live="polite">
            <div className="stat">
              <span className="stat-label">WPM</span>
              <strong>{stats.wpm}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Raw</span>
              <strong>{stats.rawWpm}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy</span>
              <strong>{stats.accuracy}%</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Errors</span>
              <strong>{errorCount}</strong>
            </div>
            <div className="stat">
              <span className="stat-label">Damage taken</span>
              <strong>{engine.mistakeCount * 10}</strong>
            </div>
          </div>

          <div className="typing-arena">
            <WordDisplay
              activeCharIndex={activeWord ? engine.activeCharIndex : 0}
              activeWordIndex={0}
              inputRef={inputRef}
              status={engine.status}
              words={activeWord ? [activeWord] : []}
            />
            <input
              aria-label="Typing input"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="typing-input"
              onKeyDown={handleInputKeyDown}
              ref={inputRef}
              spellCheck={false}
              tabIndex={-1}
              type="text"
            />
          </div>
          <p className="status-message" role="status">
            {statusMessage}
          </p>
          {engine.status === "finished" && (
            <div
              aria-live="polite"
              className={`battle-result${health === 0 ? " result-defeat" : " result-victory"}`}
            >
              <strong>{health === 0 ? "Defeated" : "Victory"}</strong>
              <span>
                {engine.activeWordIndex}{" "}
                {engine.activeWordIndex === 1 ? "enemy" : "enemies"} defeated
              </span>
            </div>
          )}
        </section>

        <footer className="app-footer">
          <span>
            Type the enemy's word, then press <kbd>Space</kbd> to strike.
          </span>
          <span>
            Every wrong or skipped letter costs 10 health.
          </span>
        </footer>
      </div>
    </main>
  );
}

export default App;
