import { Bug, Ghost, Skull, Swords } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BattleEnemy } from "../../types";
import { HealthBar } from "./HealthBar";

const enemyIcons: Record<BattleEnemy["kind"], LucideIcon> = {
  goblin: Bug,
  skeleton: Skull,
  wraith: Ghost,
  miniBoss: Swords,
};

interface EnemySpriteProps {
  enemy: BattleEnemy;
  word: string;
}

export function EnemySprite({ enemy, word }: EnemySpriteProps) {
  const Icon = enemyIcons[enemy.kind];

  return (
    <div className={`enemy-card enemy-${enemy.kind}`}>
      <div className="enemy-card-heading">
        <span>
          {enemy.kind === "miniBoss" ? "Mini-boss" : "Enemy"}{" "}
          {String(enemy.encounter).padStart(2, "0")}
        </span>
        <span className="enemy-intent">ATK {enemy.damage}</span>
      </div>
      <div
        className={`combat-portrait enemy-portrait portrait-${enemy.kind}`}
        role="img"
        aria-label={enemy.name}
      >
        <span className="portrait-rune" aria-hidden="true" />
        <Icon aria-hidden="true" size={76} strokeWidth={1.35} />
      </div>
      <h2>{enemy.name}</h2>
      <HealthBar
        current={enemy.health}
        label="Enemy HP"
        maximum={enemy.maxHealth}
        tone={enemy.kind}
      />
      <p className="enemy-instruction">Type the assigned word:</p>
      <p className="enemy-word" aria-label={`Word: ${word}`}>
        {word}
      </p>
    </div>
  );
}
