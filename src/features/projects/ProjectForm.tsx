import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { reportWriteError } from '@/app/errors';
import { parsePositiveInt } from '@/domain/format';
import type { TechniqueInfo } from '@/domain/techniques';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { focusOnEnter } from '@/ui/focusOnEnter';
import { Screen } from '@/ui/Screen';
import { TechniqueIcon } from '@/ui/TechniqueIcon';
import { TextField } from '@/ui/TextField';
import styles from './ProjectForm.module.css';

export interface ProjectFormValues {
  name: string;
  target: number | null;
}

const NAME_EXAMPLES = {
  embroidery: 'Ej. Mantel de flores',
  crochet: 'Ej. Muñeco osito',
  knitting: 'Ej. Bufanda roja',
  other: 'Ej. Pulsera de macramé',
} as const;

interface ProjectFormProps {
  technique: TechniqueInfo;
  title: string;
  submitLabel: string;
  backTo: string;
  onBack?: () => void;
  initial?: { name: string; target: number | null };
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  extraActions?: ReactNode;
}

export function ProjectForm({
  technique,
  title,
  submitLabel,
  backTo,
  onBack,
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
        <BackLink fallback={backTo} onBack={onBack} />
      </div>
      <form id={formId} className={styles.body} onSubmit={(e) => void submit(e)} noValidate>
        <div className={styles.heading}>
          <p className={styles.technique}>
            <TechniqueIcon technique={technique.id} size={24} />
            {technique.label}
          </p>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <TextField
          label="¿Cómo se llama?"
          type="text"
          placeholder={NAME_EXAMPLES[technique.id]}
          autoComplete="off"
          enterKeyHint={technique.askStitchTarget ? 'next' : 'done'}
          onKeyDown={(e) => technique.askStitchTarget && focusOnEnter(e, targetRef)}
          value={name}
          error={error}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
        />
        {technique.askStitchTarget && (
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
        )}
      </form>
    </Screen>
  );
}
