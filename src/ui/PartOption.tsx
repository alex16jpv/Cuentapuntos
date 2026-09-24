import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Technique } from '@/domain/part';
import { PartBadge } from './PartBadge';
import styles from './PartOption.module.css';

interface PartOptionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  hex: string | null;
  technique: Technique;
  name: string;
  detail: ReactNode;
  action?: ReactNode;
  tone?: 'default' | 'selected' | 'strong';
}

export function PartOption({
  hex,
  technique,
  name,
  detail,
  action,
  tone = 'default',
  className,
  ...rest
}: PartOptionProps) {
  const toneClass = tone === 'default' ? undefined : styles[tone];
  return (
    <button
      type="button"
      className={[styles.option, toneClass, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <PartBadge hex={hex} technique={technique} size={40} />
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        {detail && <span className={styles.detail}>{detail}</span>}
      </span>
      {action && <span className={styles.action}>{action}</span>}
    </button>
  );
}
