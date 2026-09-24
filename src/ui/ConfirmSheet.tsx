import type { ReactNode } from 'react';
import { Button } from './Button';
import styles from './ConfirmSheet.module.css';
import { Sheet } from './Sheet';

interface ConfirmSheetProps {
  open: boolean;
  title: ReactNode;
  message: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <Sheet open={open} onClose={onCancel} title={title}>
      <p className={styles.message}>{message}</p>
      <Button variant="dangerSolid" onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="ghost" size="md" onClick={onCancel} autoFocus>
        Cancelar
      </Button>
    </Sheet>
  );
}
