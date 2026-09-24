import { useRegisterSW } from 'virtual:pwa-register/react';
import styles from './UpdateBanner.module.css';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

function watchForUpdates(registration: ServiceWorkerRegistration): void {
  const check = () => {
    if (navigator.onLine) void registration.update().catch(() => undefined);
  };
  setInterval(check, UPDATE_CHECK_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
}

export function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_url, registration) => {
      if (registration) watchForUpdates(registration);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className={styles.banner} role="status">
      <span className={styles.text}>Hay una versión nueva de la app.</span>
      <button type="button" className={styles.dismiss} onClick={() => setNeedRefresh(false)}>
        Más tarde
      </button>
      <button
        type="button"
        className={styles.action}
        onClick={() => void updateServiceWorker(true)}
      >
        Actualizar
      </button>
    </div>
  );
}
