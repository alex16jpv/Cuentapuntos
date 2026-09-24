import styles from './BackLink.module.css';
import { BackIcon } from './icons';
import { useGoBack } from './useGoBack';

interface BackLinkProps {
  fallback: string;
  onBack?: () => void;
}

export function BackLink({ fallback, onBack }: BackLinkProps) {
  const goBack = useGoBack(fallback);
  return (
    <button type="button" className={styles.back} onClick={onBack ?? goBack}>
      <BackIcon size={24} />
      Volver
    </button>
  );
}
