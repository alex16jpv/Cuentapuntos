import { useEffect, useState } from 'react';
import styles from './ErrorToast.module.css';
import { onWriteError } from './errors';

const VISIBLE_MS = 5000;

export function ErrorToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = onWriteError(() => {
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), VISIBLE_MS);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;
  return (
    <div className={styles.toast} role="alert">
      No se pudo guardar el cambio. Inténtalo de nuevo.
    </div>
  );
}
