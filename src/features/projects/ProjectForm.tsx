import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { reportWriteError } from '@/app/errors';
import type { ProjectInput } from '@/data/projects';
import { parsePositiveInt } from '@/domain/format';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { focusOnEnter } from '@/ui/focusOnEnter';
import { Screen } from '@/ui/Screen';
import { TextField } from '@/ui/TextField';
import styles from './ProjectForm.module.css';

interface ProjectFormProps {
  title: string;
  submitLabel: string;
  backTo: string;
  initial?: { name: string; target: number | null };
  onSubmit: (input: ProjectInput) => Promise<void>;
  extraActions?: ReactNode;
}

export function ProjectForm({
  title,
  submitLabel,
  backTo,
  initial,
  onSubmit,
  extraActions,
}: ProjectFormProps) {
  const formId = useId();
  const [name, setName] = useState(initial?.name ?? '');
  const [target, setTarget] = useState(initial?.target ? String(initial.target) : '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const targetRef = useRef<HTMLInputElement>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Escribe un nombre para tu proyecto.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ name, target: parsePositiveInt(target) });
    } catch (error) {
      reportWriteError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen
      footerClassName={styles.footer}
      footer={
        <>
          <Button type="submit" form={formId} variant="primary" size="xl" disabled={saving}>
            {submitLabel}
          </Button>
          {extraActions}
        </>
      }
    >
      <div className={styles.top}>
        <BackLink fallback={backTo} />
      </div>
      <form id={formId} className={styles.body} onSubmit={(e) => void submit(e)} noValidate>
        <h1 className={styles.title}>{title}</h1>
        <TextField
          label="¿Cómo se llama?"
          type="text"
          placeholder="Ej. Mantel de flores"
          autoComplete="off"
          enterKeyHint="next"
          onKeyDown={(e) => focusOnEnter(e, targetRef)}
          value={name}
          error={error}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
        />
        <TextField
          label="¿Cuántos puntos tiene?"
          type="text"
          inputMode="numeric"
          placeholder="Ej. 2400"
          autoComplete="off"
          enterKeyHint="done"
          ref={targetRef}
          value={target}
          onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
          hint="Si no lo sabes, déjalo en blanco. Puedes cambiarlo después."
        />
      </form>
    </Screen>
  );
}
