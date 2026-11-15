import { ArrowLeft, ChevronRight, Shield, Sparkles, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChampionId } from "../../types";
import { CHAMPION_LIST } from "../../utils/champions";

interface CharacterSelectProps {
  onBack: () => void;
  onSelect: (champion: ChampionId) => void;
}

const championIcons: Record<ChampionId, LucideIcon> = {
  knight: Shield,
  wizard: Sparkles,
  archer: Target,
};

export function CharacterSelect({ onBack, onSelect }: CharacterSelectProps) {
  return (
    <main className="screen-shell">
      <section aria-labelledby="class-title" className="class-screen">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={17} />
          <span>Back to modes</span>
        </button>

        <header className="class-heading">
          <p className="menu-kicker">Choose your champion</p>
          <h1 id="class-title">Who will you become?</h1>
          <p>Every great quest begins with a choice.</p>
        </header>

        <div className="champion-grid">
          {CHAMPION_LIST.map((champion) => {
            const Icon = championIcons[champion.id];

            return (
              <button
                className={`champion-card champion-${champion.id}`}
                key={champion.id}
                onClick={() => onSelect(champion.id)}
                type="button"
              >
                <span className="champion-icon" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.5} />
                </span>
                <span className="champion-name">{champion.name}</span>
                <span className="champion-description">
                  {champion.description}
                </span>
                <span className="champion-health">
                  {champion.maxHealth} HP
                </span>
                <span className="champion-detail">{champion.detail}</span>
                <span className="champion-action">
                  Choose {champion.name}
                  <ChevronRight aria-hidden="true" size={16} />
                </span>
              </button>
            );
          })}
        </div>

        <p className="class-note">
          Your class determines your health, attack strength, and word length.
          Every 10th encounter is a mini-boss.
        </p>
      </section>
    </main>
  );
}
