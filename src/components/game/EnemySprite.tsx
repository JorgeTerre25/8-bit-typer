import { Bug, Ghost, Skull } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const enemies: { name: string; icon: LucideIcon; tone: string }[] = [
  { name: "Goblin", icon: Bug, tone: "goblin" },
  { name: "Skeleton", icon: Skull, tone: "skeleton" },
  { name: "Wraith", icon: Ghost, tone: "wraith" },
];

interface EnemySpriteProps {
  enemyIndex: number;
  word: string;
}

export function EnemySprite({ enemyIndex, word }: EnemySpriteProps) {
  const enemy = enemies[enemyIndex % enemies.length];
  const Icon = enemy.icon;

  return (
    <div className={`enemy-card enemy-${enemy.tone}`}>
      <div className="enemy-card-heading">
        <span>Enemy {String(enemyIndex + 1).padStart(2, "0")}</span>
        <span className="enemy-intent">TARGET</span>
      </div>
      <div className={`combat-portrait enemy-portrait portrait-${enemy.tone}`}>
        <span className="portrait-rune" aria-hidden="true" />
        <Icon aria-hidden="true" size={76} strokeWidth={1.35} />
      </div>
      <h2>{enemy.name}</h2>
      <p className="enemy-instruction">Defeat it by typing:</p>
      <p className="enemy-word">{word}</p>
    </div>
  );
}
