interface TimerBarProps {
  duration: number;
  timeLeft: number;
}

export function TimerBar({ duration, timeLeft }: TimerBarProps) {
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="timer" aria-label={`${timeLeft} seconds remaining`}>
      <div
        aria-hidden="true"
        className="timer-track"
        role="presentation"
      >
        <div className="timer-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="timer-value">{timeLeft}s</span>
    </div>
  );
}
