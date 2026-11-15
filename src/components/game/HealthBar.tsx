interface HealthBarProps {
  label: string;
  current: number;
  maximum: number;
  tone: string;
}

export function HealthBar({
  label,
  current,
  maximum,
  tone,
}: HealthBarProps) {
  const percentage = maximum > 0 ? (current / maximum) * 100 : 0;

  return (
    <div className="health-status">
      <div className="health-label">
        <span>{label}</span>
        <span>
          {current}/{maximum}
        </span>
      </div>
      <div
        aria-label={`${label} health`}
        aria-valuemax={maximum}
        aria-valuemin={0}
        aria-valuenow={current}
        className={`health-track health-${tone}`}
        role="progressbar"
      >
        <div className="health-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
