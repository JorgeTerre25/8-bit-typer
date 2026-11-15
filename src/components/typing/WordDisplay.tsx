import { useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { TestStatus, WordData } from "../../types";

interface WordDisplayProps {
  words: WordData[];
  activeWordIndex: number;
  activeCharIndex: number;
  status: TestStatus;
  inputRef: RefObject<HTMLInputElement | null>;
}

interface CaretPosition {
  left: number;
  top: number;
}

export function WordDisplay({
  words,
  activeWordIndex,
  activeCharIndex,
  status,
  inputRef,
}: WordDisplayProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeCharacterRef = useRef<HTMLSpanElement>(null);
  const [caretPosition, setCaretPosition] = useState<CaretPosition>({
    left: 0,
    top: 0,
  });

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const activeCharacter = activeCharacterRef.current;
    if (!viewport || !track || !activeCharacter) {
      return;
    }

    const updateCaret = () => {
      const trackStyle = window.getComputedStyle(track);
      const lineHeight = Number.parseFloat(trackStyle.lineHeight);
      const viewportRect = viewport.getBoundingClientRect();
      const targetRect = activeCharacter.getBoundingClientRect();
      const lineIndex = Math.max(
        0,
        Math.floor(
          (targetRect.top - viewportRect.top + viewport.scrollTop) / lineHeight,
        ),
      );
      const nextScrollTop = Math.max(0, (lineIndex - 1) * lineHeight);

      if (Math.abs(viewport.scrollTop - nextScrollTop) > 1) {
        viewport.scrollTop = nextScrollTop;
      }

      const visibleViewportRect = viewport.getBoundingClientRect();
      const visibleTargetRect = activeCharacter.getBoundingClientRect();
      setCaretPosition({
        left: visibleTargetRect.left - visibleViewportRect.left,
        top:
          visibleTargetRect.top -
          visibleViewportRect.top +
          (visibleTargetRect.height - 30) / 2,
      });
    };

    updateCaret();
    window.addEventListener("resize", updateCaret);
    return () => window.removeEventListener("resize", updateCaret);
  }, [activeWordIndex, activeCharIndex, status, words]);

  return (
    <div
      aria-label="Typing text"
      className="word-viewport"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      ref={viewportRef}
    >
      <div className="word-track" ref={trackRef}>
        {words.map((word, wordIndex) => (
          <span
            className={`typing-word${word.hasError ? " has-error" : ""}`}
            data-word-index={wordIndex}
            key={word.id}
          >
            {word.characters.map((character, characterIndex) => (
              <span
                aria-hidden="true"
                className={`typed-character char-${character.status}${character.missed ? " char-missed" : ""}`}
                key={`${word.id}-${characterIndex}`}
                ref={
                  wordIndex === activeWordIndex &&
                  characterIndex === activeCharIndex
                    ? activeCharacterRef
                    : undefined
                }
              >
                {character.char}
              </span>
            ))}
            <span
              aria-hidden="true"
              className="word-end"
              ref={
                wordIndex === activeWordIndex &&
                activeCharIndex === word.characters.length
                  ? activeCharacterRef
                  : undefined
              }
            />
          </span>
        ))}
      </div>
      {status !== "finished" && (
        <span
          aria-hidden="true"
          className="typing-caret"
          style={{
            transform: `translate3d(${caretPosition.left}px, ${caretPosition.top}px, 0)`,
          }}
        />
      )}
    </div>
  );
}
