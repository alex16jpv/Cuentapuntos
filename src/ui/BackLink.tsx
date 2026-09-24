import styles from './BackLink.module.css';
import { BackIcon } from './icons';
import { useGoBack } from './useGoBack';

export function BackLink({ fallback }: { fallback: string }) {
  const goBack = useGoBack(fallback);
  return (
    <button type="button" className={styles.back} onClick={goBack}>
      <BackIcon size={24} />
      Volver
    </button>
  );
}
