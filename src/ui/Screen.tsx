import type { ReactNode } from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  width?: 'narrow' | 'wide';
}

export function Screen({ children, footer, footerClassName, width = 'narrow' }: ScreenProps) {
  return (
    <div className={[styles.screen, width === 'wide' && styles.wide].filter(Boolean).join(' ')}>
      <div className={styles.body}>{children}</div>
      {footer && (
        <div className={styles.footer}>
          <div className={[styles.footerInner, footerClassName].filter(Boolean).join(' ')}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
