import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  height?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, height = 12, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={[styles.track, className].filter(Boolean).join(' ')}
      style={{ height, borderRadius: height / 2 }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${clamped}%`, borderRadius: height / 2 }} />
    </div>
  );
}
