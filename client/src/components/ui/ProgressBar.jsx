import './ProgressBar.css';

export default function ProgressBar({ value = 0, max = 100, size, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const sizeClass = size ? `progress-bar-${size}` : '';

  return (
    <div
      className={`progress-bar ${sizeClass} ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
