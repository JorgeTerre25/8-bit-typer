import { Shield, Sparkles, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Champion } from "../../types";

const championIcons: Record<Champion["id"], LucideIcon> = {
  knight: Shield,
  wizard: Sparkles,
  archer: Target,
};

export function HeroSprite({ champion }: { champion: Champion }) {
  const Icon = championIcons[champion.id];

  return (
    <div
      aria-label={champion.name}
      className={`combat-portrait hero-portrait portrait-${champion.id}`}
      role="img"
    >
      <span className="portrait-rune" aria-hidden="true" />
      <Icon aria-hidden="true" size={76} strokeWidth={1.35} />
    </div>
  );
}
