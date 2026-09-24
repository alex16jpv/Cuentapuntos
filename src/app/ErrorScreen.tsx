import { useRouteError } from 'react-router';
import { Button } from '@/ui/Button';
import { paths } from './paths';
import styles from './ErrorScreen.module.css';

export function ErrorScreen() {
  console.error(useRouteError());
  return (
    <div className={styles.screen} role="alert">
      <h1 className={styles.title}>Algo salió mal</h1>
      <p className={styles.text}>
        Tus puntos están guardados en este dispositivo. Vuelve a abrir la app para seguir.
      </p>
      <Button variant="primary" size="xl" onClick={() => window.location.assign(paths.projects)}>
        Volver a abrir
      </Button>
    </div>
  );
}
