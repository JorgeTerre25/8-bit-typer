import { ArrowLeft, ChevronRight, Keyboard, Swords } from "lucide-react";

interface ModeSelectProps {
  onBack: () => void;
  onHeroMode: () => void;
  onTypingTest: () => void;
}

export function ModeSelect({
  onBack,
  onHeroMode,
  onTypingTest,
}: ModeSelectProps) {
  return (
    <main className="screen-shell">
      <section aria-labelledby="mode-title" className="class-screen">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={17} />
          <span>Main menu</span>
        </button>

        <header className="class-heading">
          <p className="menu-kicker">Choose your adventure</p>
          <h1 id="mode-title">How will you play?</h1>
          <p>Fight for the realm or focus on your typing.</p>
        </header>

        <div className="mode-card-grid">
          <button
            className="mode-card hero-mode-card"
            onClick={onHeroMode}
            type="button"
          >
            <span className="mode-card-icon" aria-hidden="true">
              <Swords size={36} strokeWidth={1.5} />
            </span>
            <span className="mode-card-title">Hero Mode</span>
            <span className="mode-card-description">
              Choose a champion, defeat enemies, and survive their attacks.
            </span>
            <span className="mode-card-action">
              Choose a hero <ChevronRight aria-hidden="true" size={17} />
            </span>
          </button>

          <button
            className="mode-card typing-mode-card"
            onClick={onTypingTest}
            type="button"
          >
            <span className="mode-card-icon" aria-hidden="true">
              <Keyboard size={36} strokeWidth={1.5} />
            </span>
            <span className="mode-card-title">Typing Test</span>
            <span className="mode-card-description">
              Practice at your own pace with 15, 30, or 60 second tests.
            </span>
            <span className="mode-card-action">
              Start typing <ChevronRight aria-hidden="true" size={17} />
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
