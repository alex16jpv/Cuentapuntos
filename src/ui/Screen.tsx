import type { ReactNode } from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
}

export function Screen({ children, footer, footerClassName }: ScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.body}>{children}</div>
      {footer && (
        <div className={[styles.footer, footerClassName].filter(Boolean).join(' ')}>{footer}</div>
      )}
    </div>
  );
}
