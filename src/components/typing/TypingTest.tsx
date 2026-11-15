import { useEffect, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import { ModeSelector } from "./ModeSelector";
import { TimerBar } from "./TimerBar";
import { WordDisplay } from "./WordDisplay";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { calculateStats } from "../../utils/calculateStats";

interface TypingTestProps {
  onMainMenu: () => void;
  wordBank: string[];
}

export function TypingTest({ onMainMenu, wordBank }: TypingTestProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const engine = useTypingEngine(wordBank);
  const stats = useMemo(
    () => calculateStats(engine.words, engine.elapsedMilliseconds),
    [engine.elapsedMilliseconds, engine.words],
  );

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const key = event.key;
    if (key === " " || key === "Backspace" || /^[a-z]$/i.test(key)) {
      event.preventDefault();
      engine.handleKey(key);
    }
  }

  const statusText =
    engine.status === "finished"
      ? "Test complete. Choose a duration or reset to try again."
      : engine.status === "running"
        ? "Keep going — your timer is running."
        : "Type any letter to begin. Backspace corrects the current word.";

  return (
    <main className="app-shell">
      <div className="typing-app">
        <header className="app-header">
          <div>
            <p className="eyebrow">A quiet moment at the scriptorium</p>
            <h1>Typing Test</h1>
          </div>
          <div className="battle-actions">
            <button className="menu-nav-button" onClick={onMainMenu} type="button">
              Modes
            </button>
            <button
              className="reset-button"
              onClick={() => engine.reset()}
              type="button"
            >
              Restart
            </button>
          </div>
        </header>

        <div className="test-controls">
          <ModeSelector
            disabled={engine.status !== "idle"}
            duration={engine.durationSeconds}
            onChange={engine.setDuration}
          />
          <TimerBar
            duration={engine.durationSeconds}
            timeLeft={engine.timeLeftSeconds}
          />
        </div>

        <section className="typing-panel" aria-label="Typing test">
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
          </div>

          <div
            className="typing-arena"
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            <WordDisplay
              activeCharIndex={engine.activeCharIndex}
              activeWordIndex={engine.activeWordIndex}
              inputRef={inputRef}
              status={engine.status}
              words={engine.words}
            />
            <input
              aria-label="Type the displayed words"
              autoComplete="off"
              autoCorrect="off"
              className="typing-input"
              onKeyDown={handleKeyDown}
              ref={inputRef}
              spellCheck={false}
              tabIndex={0}
              type="text"
            />
          </div>

          <p aria-live="polite" className="status-message">
            {statusText}
          </p>
        </section>

        <footer className="app-footer">
          <span>
            Use <kbd>Space</kbd> to submit a word
          </span>
          <span>
            Use <kbd>Backspace</kbd> to correct a letter
          </span>
        </footer>
      </div>
    </main>
  );
}
