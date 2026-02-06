import './ProgressBar.css';

function ProgressBar({ value, max, color }) {
  const ratio = value / max;
  const pct = Math.min(ratio * 100, 100);

  let barColor = color || 'var(--forest)';
  if (ratio < 0.25) barColor = 'var(--red)';
  else if (ratio < 0.5) barColor = 'var(--saffron)';

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${pct}%`, background: barColor }}
      />
    </div>
  );
}

export default ProgressBar;
