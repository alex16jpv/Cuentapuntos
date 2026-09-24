import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Swatch } from './Swatch';
import styles from './ThreadOption.module.css';

interface ThreadOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hex: string;
  name: string;
  detail: ReactNode;
  action?: ReactNode;
  tone?: 'default' | 'selected' | 'strong';
}

export function ThreadOption({
  hex,
  name,
  detail,
  action,
  tone = 'default',
  className,
  ...rest
}: ThreadOptionProps) {
  const toneClass = tone === 'default' ? undefined : styles[tone];
  return (
    <button
      type="button"
      className={[styles.option, toneClass, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Swatch hex={hex} size={40} />
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.detail}>{detail}</span>
      </span>
      {action && <span className={styles.action}>{action}</span>}
    </button>
  );
}
