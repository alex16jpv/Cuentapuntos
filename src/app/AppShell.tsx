import { Outlet } from 'react-router';
import { UpdateBanner } from '@/pwa/UpdateBanner';
import styles from './AppShell.module.css';
import { ErrorToast } from './ErrorToast';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className={styles.shell}>
      <UpdateBanner />
      <Outlet />
      <ErrorToast />
    </div>
  );
}

export function TabLayout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
