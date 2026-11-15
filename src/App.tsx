import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { ModeSelector } from "./components/typing/ModeSelector";
import { TimerBar } from "./components/typing/TimerBar";
import { WordDisplay } from "./components/typing/WordDisplay";
import { useTypingEngine } from "./hooks/useTypingEngine";
import type { TestDuration } from "./types";
import { calculateStats } from "./utils/calculateStats";

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

  return <TypingTest wordBank={wordBank} />;
}

function TypingTest({ wordBank }: { wordBank: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const engine = useTypingEngine(wordBank);
  const stats = calculateStats(engine.words, engine.elapsedMilliseconds);
  const errorCount =
    stats.incorrectChars + stats.extraChars + stats.missedChars;

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
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
      ? "Click the words below or start typing to begin."
      : engine.status === "running"
        ? "Keep going — the clock is running."
        : "Test complete. Reset to begin another round.";

  return (
    <main className="app-shell">
      <div className="typing-app">
        <header className="app-header">
          <div>
            <p className="eyebrow">A typing adventure</p>
            <h1>Medieval Typer</h1>
          </div>
          <button
            className="reset-button"
            onClick={() => {
              engine.reset();
              inputRef.current?.focus({ preventScroll: true });
            }}
            type="button"
          >
            Reset test
          </button>
        </header>

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

        <section aria-label="Typing test" className="typing-panel">
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
          </div>

          <div className="typing-arena">
            <WordDisplay
              activeCharIndex={engine.activeCharIndex}
              activeWordIndex={engine.activeWordIndex}
              inputRef={inputRef}
              status={engine.status}
              words={engine.words}
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
        </section>

        <footer className="app-footer">
          <span>
            Type the word, then press <kbd>Space</kbd> to move on.
          </span>
          <span>
            <kbd>Backspace</kbd> corrects the current word.
          </span>
        </footer>
      </div>
    </main>
  );
}

export default App;
