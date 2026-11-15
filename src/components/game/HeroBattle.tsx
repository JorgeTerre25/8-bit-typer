import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTypingEngine } from "../../hooks/useTypingEngine";
import { WordDisplay } from "../typing/WordDisplay";
import type { BattleEnemy, ChampionId } from "../../types";
import { CHAMPIONS } from "../../utils/champions";
import {
  createEnemy,
  getChampionWordBank,
  getWordTimerDuration,
} from "../../utils/heroBattle";
import { BattleArena } from "./BattleArena";

interface HeroBattleProps {
  championId: ChampionId;
  onMainMenu: () => void;
  wordBank: string[];
  bossWordBank: string[];
}

type BattleStatus = "playing" | "defeat";

export function HeroBattle({
  championId,
  onMainMenu,
  wordBank,
  bossWordBank,
}: HeroBattleProps) {
  const champion = CHAMPIONS[championId];
  const [enemy, setEnemy] = useState<BattleEnemy>(() => createEnemy(1));
  const battleWordBank = useMemo(
    () =>
      enemy.kind === "miniBoss"
        ? bossWordBank
        : getChampionWordBank(wordBank, championId),
    [bossWordBank, championId, enemy.kind, wordBank],
  );
  const engine = useTypingEngine(battleWordBank, false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef(0);
  const resolvingRef = useRef(false);
  const [playerHealth, setPlayerHealth] = useState(champion.maxHealth);
  const [defeatedCount, setDefeatedCount] = useState(0);
  const [battleStatus, setBattleStatus] = useState<BattleStatus>("playing");
  const [wordTimeLeft, setWordTimeLeft] = useState(0);
  const [roundKey, setRoundKey] = useState(0);
  const [lastResult, setLastResult] = useState("");

  const currentWord = engine.words[engine.activeWordIndex];
  const word = currentWord?.characters
    .filter((character) => character.status !== "extra")
    .map((character) => character.char)
    .join("") ?? "";
  const wordDuration = getWordTimerDuration(enemy.kind === "miniBoss");

  const resolveWord = useCallback(() => {
    if (battleStatus !== "playing" || resolvingRef.current) {
      return;
    }

    resolvingRef.current = true;
    const succeeded = engine.submitWord(true);
    if (succeeded === null) {
      resolvingRef.current = false;
      return;
    }

    if (succeeded) {
      const hitCount =
        champion.doubleHitChance > 0 &&
        Math.random() < champion.doubleHitChance
          ? 2
          : 1;
      const damage = champion.attackDamage * hitCount;
      const remainingEnemyHealth = Math.max(0, enemy.health - damage);

      if (remainingEnemyHealth === 0) {
        setDefeatedCount((count) => count + 1);
        setEnemy(createEnemy(enemy.encounter + 1));
        setLastResult(
          `${enemy.name} defeated${hitCount === 2 ? " with a double hit" : ""}!`,
        );
      } else {
        setEnemy({ ...enemy, health: remainingEnemyHealth });
        setLastResult(
          `${hitCount === 2 ? "Double hit! " : ""}${damage} damage dealt.`,
        );
      }
      return;
    }

    const remainingPlayerHealth = Math.max(0, playerHealth - enemy.damage);
    setPlayerHealth(remainingPlayerHealth);
    setLastResult(
      `${enemy.name} struck for ${enemy.damage} damage. The same enemy remains.`,
    );
    if (remainingPlayerHealth === 0) {
      setBattleStatus("defeat");
      engine.finish();
    }
  }, [battleStatus, champion, enemy, engine, playerHealth]);

  const resolveWordRef = useRef(resolveWord);
  useEffect(() => {
    resolveWordRef.current = resolveWord;
  }, [resolveWord]);

  useEffect(() => {
    if (enemy.encounter === 1) {
      return;
    }

    engine.reset();
    resolvingRef.current = false;
    setRoundKey((key) => key + 1);
    setLastResult(
      enemy.kind === "miniBoss"
        ? "Mini-boss! Very difficult words; 3 seconds per word."
        : "",
    );
  }, [enemy.encounter, enemy.kind, engine.reset]);

  useEffect(() => {
    if (battleStatus !== "playing" || !currentWord) {
      return;
    }

    deadlineRef.current = performance.now() + wordDuration;
    setWordTimeLeft(wordDuration);
    resolvingRef.current = false;

    const timerId = window.setInterval(() => {
      const remaining = Math.max(0, deadlineRef.current - performance.now());
      setWordTimeLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timerId);
        resolveWordRef.current();
      }
    }, 50);

    return () => window.clearInterval(timerId);
  }, [
    battleStatus,
    currentWord?.id,
    engine.activeWordIndex,
    roundKey,
    wordDuration,
  ]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [battleStatus, roundKey]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const key = event.key;
    if (key === " " || key === "Backspace" || /^[a-z]$/i.test(key)) {
      event.preventDefault();
      if (key === " ") {
        resolveWord();
      } else {
        engine.handleKey(key);
      }
    }
  }

  function restartBattle() {
    engine.reset();
    setPlayerHealth(champion.maxHealth);
    setEnemy(createEnemy(1));
    setDefeatedCount(0);
    setBattleStatus("playing");
    setLastResult("");
    resolvingRef.current = false;
    setRoundKey((key) => key + 1);
  }

  const progress = wordDuration > 0 ? (wordTimeLeft / wordDuration) * 100 : 0;

  return (
    <main className="app-shell">
      <div className="typing-app hero-battle-app">
        <header className="app-header battle-header">
          <div>
            <p className="eyebrow">Hero mode · encounter {enemy.encounter}</p>
            <h1>{champion.name}&apos;s Quest</h1>
          </div>
          <div className="battle-actions">
            <button
              className="menu-nav-button"
              onClick={onMainMenu}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={15} />
              Modes
            </button>
            <button
              className="reset-button"
              onClick={restartBattle}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={15} />
              Restart
            </button>
          </div>
        </header>

        <BattleArena
          champion={champion}
          defeatedCount={defeatedCount}
          enemy={enemy}
          enemyWord={word}
          health={playerHealth}
        />

        {battleStatus === "playing" ? (
          <section
            aria-label="Type the enemy's word"
            className="typing-panel battle-typing-panel"
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
          >
            <div className="battle-word-timer">
              <div
                aria-label={`${(wordTimeLeft / 1000).toFixed(1)} seconds left for this word`}
                className="timer-track"
                role="presentation"
              >
                <div
                  className="timer-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="timer-value">
                {(wordTimeLeft / 1000).toFixed(1)}s
              </span>
            </div>
            <div className="typing-arena">
              {currentWord && (
                <WordDisplay
                  activeCharIndex={engine.activeCharIndex}
                  activeWordIndex={0}
                  inputRef={inputRef}
                  status={engine.status}
                  words={[currentWord]}
                />
              )}
              <input
                aria-label="Type the word assigned to the enemy"
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
              {lastResult ||
                "Type the word, then press Space. Correctable typos do not cost health."}
            </p>
          </section>
        ) : (
          <section className="battle-result result-defeat" role="status">
            <strong>Defeated</strong>
            <span>
              You defeated {defeatedCount}{" "}
              {defeatedCount === 1 ? "enemy" : "enemies"} before falling.
            </span>
          </section>
        )}

        <footer className="app-footer">
          <span>
            <kbd>Space</kbd> submits the word
          </span>
          <span>
            Every 10th enemy is a mini-boss
          </span>
          <span>
            <kbd>Backspace</kbd> corrects a letter
          </span>
        </footer>
      </div>
    </main>
  );
}
