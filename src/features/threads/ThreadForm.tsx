import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { reportWriteError } from '@/app/errors';
import type { ThreadInput } from '@/data/threads';
import { normalizeCode, parseCount, parsePositiveInt } from '@/domain/format';
import { findByCode, findByHex, PALETTE } from '@/domain/palette';
import type { Thread } from '@/domain/types';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { focusOnEnter } from '@/ui/focusOnEnter';
import { Screen } from '@/ui/Screen';
import { Swatch } from '@/ui/Swatch';
import { TextField } from '@/ui/TextField';
import styles from './ThreadForm.module.css';

export interface ThreadFormValues extends ThreadInput {
  count: number;
}

interface ThreadFormProps {
  title: string;
  subtitle: string;
  backTo: string;
  initial?: Thread;
  submitLabel: (colorName: string) => string;
  onSubmit: (values: ThreadFormValues) => Promise<void>;
  extraActions?: ReactNode;
}

interface Color {
  name: string;
  hex: string;
}

export function ThreadForm({
  title,
  subtitle,
  backTo,
  initial,
  submitLabel,
  onSubmit,
  extraActions,
}: ThreadFormProps) {
  const formId = useId();
  const [picked, setPicked] = useState(() => (initial ? findByHex(initial.hex) : -1));
  const [code, setCode] = useState(initial?.code ?? '');
  const [target, setTarget] = useState(initial?.target ? String(initial.target) : '');
  const [count, setCount] = useState(initial ? String(initial.count) : '0');
  const [countError, setCountError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const targetRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);

  const color: Color | null = PALETTE[picked] ?? initial ?? null;

  const pick = (index: number) => {
    setPicked(index);
    setCode(PALETTE[index]?.dmc ?? '');
  };

  const changeCode = (value: string) => {
    setCode(value);
    const match = findByCode(value);
    if (match >= 0) setPicked(match);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!color) return;
    const parsedCount = parseCount(count);
    if (parsedCount === null) {
      setCountError('Escribe cuántos puntos llevas. Puede ser 0.');
      countRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name: color.name,
        hex: color.hex,
        code: normalizeCode(code),
        target: parsePositiveInt(target),
        count: parsedCount,
      });
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
          {color ? (
            <Button type="submit" form={formId} variant="primary" size="xl" disabled={saving}>
              <Swatch hex={color.hex} size={28} className={styles.submitSwatch} />
              {submitLabel(color.name)}
            </Button>
          ) : (
            <div className={styles.placeholder}>Primero elige un color</div>
          )}
          {extraActions}
        </>
      }
    >
      <div className={styles.top}>
        <BackLink fallback={backTo} />
      </div>
      <div className={styles.intro}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <form id={formId} onSubmit={(e) => void submit(e)} noValidate>
        <div className={styles.palette} role="group" aria-label="Colores">
          {PALETTE.map((option, index) => (
            <button
              key={option.hex}
              type="button"
              className={styles.swatchButton}
              aria-pressed={index === picked}
              onClick={() => pick(index)}
            >
              <Swatch hex={option.hex} size={40} />
              {option.name}
            </button>
          ))}
        </div>
        <div className={styles.fields}>
          <TextField
            compact
            label="¿Tienes el número del hilo?"
            optional
            type="text"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="next"
            placeholder="Ej. 321"
            onKeyDown={(e) => focusOnEnter(e, targetRef)}
            value={code}
            onChange={(e) => changeCode(e.target.value)}
            hint="Viene en la etiqueta de la madeja."
          />
          <TextField
            compact
            label="¿Cuántos puntos de este color?"
            optional
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej. 560"
            enterKeyHint={initial ? 'next' : 'done'}
            ref={targetRef}
            onKeyDown={(e) => initial && focusOnEnter(e, countRef)}
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
            hint="Si no lo sabes, déjalo en blanco."
          />
          {initial && (
            <TextField
              compact
              label="Puntos contados"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="done"
              ref={countRef}
              value={count}
              error={countError}
              onChange={(e) => {
                setCount(e.target.value.replace(/\D/g, ''));
                if (countError) setCountError(null);
              }}
              hint="Corrígelo si te equivocaste al contar."
            />
          )}
        </div>
      </form>
    </Screen>
  );
}
