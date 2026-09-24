import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({ title, children, className }: EmptyStateProps) {
  return (
    <div className={[styles.empty, className].filter(Boolean).join(' ')}>
      <p className={styles.title}>{title}</p>
      {children && <p className={styles.text}>{children}</p>}
    </div>
  );
}
