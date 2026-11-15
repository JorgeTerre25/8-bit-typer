import type { TestDuration } from "../../types";

interface ModeSelectorProps {
  duration: TestDuration;
  disabled: boolean;
  onChange: (duration: TestDuration) => void;
}

const durations: TestDuration[] = [15, 30, 60];

export function ModeSelector({
  duration,
  disabled,
  onChange,
}: ModeSelectorProps) {
  return (
    <fieldset className="mode-selector" disabled={disabled}>
      <legend>Test duration</legend>
      <div className="mode-options">
        {durations.map((value) => (
          <button
            aria-pressed={duration === value}
            className={duration === value ? "mode-button selected" : "mode-button"}
            key={value}
            onClick={() => onChange(value)}
            type="button"
          >
            {value}s
          </button>
        ))}
      </div>
    </fieldset>
  );
}
