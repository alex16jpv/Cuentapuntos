import type { ReactNode } from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
  children: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  width?: 'narrow' | 'wide';
  inlineFooter?: boolean;
}

export function Screen({
  children,
  footer,
  footerClassName,
  width = 'narrow',
  inlineFooter = false,
}: ScreenProps) {
  return (
    <div className={[styles.screen, width === 'wide' && styles.wide].filter(Boolean).join(' ')}>
      <div className={styles.body}>
        {children}
        {footer && inlineFooter && (
          <div className={[styles.inlineFooter, footerClassName].filter(Boolean).join(' ')}>
            {footer}
          </div>
        )}
      </div>
      {footer && !inlineFooter && (
        <div className={styles.footer}>
          <div className={[styles.footerInner, footerClassName].filter(Boolean).join(' ')}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
}
