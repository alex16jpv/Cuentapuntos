import { Outlet } from 'react-router';
import { UpdateBanner } from '@/pwa/UpdateBanner';
import styles from './AppShell.module.css';
import { BottomNav } from './BottomNav';
import { ErrorToast } from './ErrorToast';
import { useTextScaleSync } from './textScale';

export function AppShell() {
  useTextScaleSync();
  return (
    <div className={styles.shell}>
      <UpdateBanner />
      <Outlet />
    </div>
  );
}

export function TabLayout() {
  return (
    <div className={styles.tabs}>
      <main className={styles.main}>
        <Outlet />
        <ErrorToast />
      </main>
      <BottomNav />
    </div>
  );
}

export function PlainLayout() {
  return (
    <main className={[styles.main, styles.plain].join(' ')}>
      <Outlet />
      <ErrorToast />
    </main>
  );
}
