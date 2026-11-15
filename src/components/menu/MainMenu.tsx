import { Play, Shield } from "lucide-react";

interface MainMenuProps {
  onPlay: () => void;
}

export function MainMenu({ onPlay }: MainMenuProps) {
  return (
    <main className="screen-shell">
      <section aria-labelledby="menu-title" className="main-menu">
        <div className="menu-brand">
          <span className="menu-brand-icon" aria-hidden="true">
            <Shield size={22} strokeWidth={1.6} />
          </span>
          <span>Medieval Typer</span>
        </div>

        <div className="menu-hero">
          <p className="menu-kicker">A typing adventure</p>
          <h1 id="menu-title">
            Words become
            <br />
            your weapon.
          </h1>
          <p className="menu-description">
            Sharpen your skills. Choose your champion. Begin your quest.
          </p>
          <button className="play-button" onClick={onPlay} type="button">
            <Play aria-hidden="true" fill="currentColor" size={17} />
            <span>Play</span>
          </button>
          <p className="menu-note">Your adventure awaits</p>
        </div>

        <footer className="menu-footer">
          <span>Train your hands</span>
          <span className="menu-footer-dot" aria-hidden="true">
            ·
          </span>
          <span>Defend the realm</span>
        </footer>
      </section>
    </main>
  );
}
