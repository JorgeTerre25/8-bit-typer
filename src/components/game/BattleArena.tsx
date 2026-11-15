import { Swords } from "lucide-react";
import type { BattleEnemy, Champion } from "../../types";
import { EnemySprite } from "./EnemySprite";
import { HealthBar } from "./HealthBar";
import { HeroSprite } from "./HeroSprite";

interface BattleArenaProps {
  champion: Champion;
  health: number;
  enemy: BattleEnemy;
  enemyWord: string;
  defeatedCount: number;
}

export function BattleArena({
  champion,
  health,
  enemy,
  enemyWord,
  defeatedCount,
}: BattleArenaProps) {
  return (
    <section aria-label="Battle arena" className="battle-arena">
      <div className="battlefield-grid" aria-hidden="true" />
      <div className="battle-side hero-side">
        <HeroSprite champion={champion} />
        <div className="combatant-name">{champion.name}</div>
        <HealthBar
          current={health}
          label="Health"
          maximum={champion.maxHealth}
          tone={champion.id}
        />
      </div>

      <div aria-hidden="true" className="battle-clash">
        <span className="clash-line" />
        <span className="clash-icon">
          <Swords size={23} strokeWidth={1.5} />
        </span>
        <span className="clash-line" />
      </div>

      <div className="battle-side enemy-side">
        <EnemySprite enemy={enemy} word={enemyWord} />
      </div>

      <div className="defeated-counter" aria-live="polite">
        <strong>{defeatedCount}</strong>
        <span>enemies defeated</span>
      </div>
    </section>
  );
}
