import { MinusIcon, PlusIcon } from './icons';
import styles from './Stepper.module.css';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  labelledBy: string;
}

export function Stepper({ value, min = 1, max = 20, onChange, labelledBy }: StepperProps) {
  return (
    <div className={styles.stepper} role="group" aria-labelledby={labelledBy}>
      <button
        type="button"
        className={styles.button}
        aria-label="Una menos"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon size={28} />
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={styles.button}
        aria-label="Una más"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon size={28} />
      </button>
    </div>
  );
}
