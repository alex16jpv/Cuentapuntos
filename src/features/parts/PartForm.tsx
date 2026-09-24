import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { reportWriteError } from '@/app/errors';
import { normalizeCode, parseCount, parsePositiveInt } from '@/domain/format';
import { listInSpanish, numberedNames } from '@/domain/names';
import { findByCode, findByHex, PALETTE } from '@/domain/palette';
import { rowsDone, type Part } from '@/domain/part';
import type { TechniqueInfo } from '@/domain/techniques';
import type { Project } from '@/domain/types';
import { BackLink } from '@/ui/BackLink';
import { Button } from '@/ui/Button';
import { focusOnEnter } from '@/ui/focusOnEnter';
import { PartBadge } from '@/ui/PartBadge';
import { Screen } from '@/ui/Screen';
import { Stepper } from '@/ui/Stepper';
import { Swatch } from '@/ui/Swatch';
import { TextField } from '@/ui/TextField';
import styles from './PartForm.module.css';

export interface PartFormValues {
  names: string[];
  hex: string | null;
  code: string | null;
  target: number | null;
  rowTarget: number | null;
  count: number;
  rowsDone: number;
}

interface PartFormProps {
  project: Project;
  technique: TechniqueInfo;
  title: string;
  subtitle: string;
  backTo: string;
  initial?: Part;
  submitLabel: (names: readonly string[]) => string;
  onSubmit: (values: PartFormValues) => Promise<void>;
  extraActions?: ReactNode;
}

export function PartForm(props: PartFormProps) {
  const { technique, initial } = props;
  const formId = useId();
  const quantityLabelId = useId();
  const [picked, setPicked] = useState(() => (initial?.hex ? findByHex(initial.hex) : -1));
  const [name, setName] = useState(initial?.name ?? '');
  const [quantity, setQuantity] = useState(1);
  const [code, setCode] = useState(initial?.code ?? '');
  const [target, setTarget] = useState(initial?.target ? String(initial.target) : '');
  const [rowTarget, setRowTarget] = useState(initial?.rowTarget ? String(initial.rowTarget) : '');
  const [count, setCount] = useState(initial ? String(initial.count) : '0');
  const [rows, setRows] = useState(initial ? String(rowsDone(initial)) : '0');
  const [fieldError, setFieldError] = useState<{ field: 'count' | 'rows'; text: string } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const nextRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef<HTMLInputElement>(null);

  const isColor = technique.usesPalette;
  const isPiece = technique.mode === 'rows';
  const fallback = initial?.hex ? { name: initial.name, hex: initial.hex } : null;
  const color = isColor ? (PALETTE[picked] ?? fallback) : null;
  const chosenName = isColor ? (color?.name ?? '') : name.trim();
  const names = chosenName ? numberedNames(chosenName, isPiece && !initial ? quantity : 1) : [];

  const values = (): PartFormValues | null => {
    const parsedCount = parseCount(count);
    const parsedRows = parseCount(rows);
    if (initial && parsedCount === null && !isPiece) {
      setFieldError({ field: 'count', text: 'Escribe cuántos puntos llevas. Puede ser 0.' });
      return null;
    }
    if (initial && parsedRows === null && isPiece) {
      setFieldError({
        field: 'rows',
        text: `Escribe cuántas ${technique.row?.many} llevas. Puede ser 0.`,
      });
      return null;
    }
    return {
      names,
      hex: color?.hex ?? null,
      code: isColor ? normalizeCode(code) : null,
      target: isPiece ? null : parsePositiveInt(target),
      rowTarget: isPiece ? parsePositiveInt(rowTarget) : null,
      count: parsedCount ?? 0,
      rowsDone: parsedRows ?? 0,
    };
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (names.length === 0) return;
    const result = values();
    if (!result) {
      lastRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      await props.onSubmit(result);
    } catch (error) {
      reportWriteError(error);
    } finally {
      setSaving(false);
    }
  };

  const pickColor = (index: number) => {
    setPicked(index);
    setCode(PALETTE[index]?.dmc ?? '');
  };

  const changeCode = (value: string) => {
    setCode(value);
    const match = findByCode(value);
    if (match >= 0) setPicked(match);
  };

  return (
    <Screen
      footerClassName={styles.footer}
      footer={
        <>
          {names.length > 0 ? (
            <Button type="submit" form={formId} variant="primary" size="xl" disabled={saving}>
              {color ? (
                <Swatch hex={color.hex} size={28} className={styles.submitSwatch} />
              ) : (
                <PartBadge hex={null} technique={props.project.technique} size={32} />
              )}
              {props.submitLabel(names)}
            </Button>
          ) : (
            <div className={styles.placeholder}>
              {isColor ? 'Primero elige un color' : 'Primero escribe un nombre'}
            </div>
          )}
          {props.extraActions}
        </>
      }
    >
      <div className={styles.top}>
        <BackLink fallback={props.backTo} />
      </div>
      <div className={styles.intro}>
        <h1 className={styles.title}>{props.title}</h1>
        <p className={styles.subtitle}>{props.subtitle}</p>
      </div>
      <form id={formId} onSubmit={(e) => void submit(e)} noValidate>
        {isColor && (
          <div className={styles.palette} role="group" aria-label="Colores">
            {PALETTE.map((option, index) => (
              <button
                key={option.hex}
                type="button"
                className={styles.swatchButton}
                aria-pressed={index === picked}
                onClick={() => pickColor(index)}
              >
                <Swatch hex={option.hex} size={40} />
                {option.name}
              </button>
            ))}
          </div>
        )}

        {!isColor && technique.namePresets.length > 0 && (
          <div className={styles.presets} role="group" aria-label="Nombres habituales">
            <button
              type="button"
              className={styles.preset}
              aria-pressed={name === props.project.name}
              onClick={() => setName(props.project.name)}
            >
              Todo es una pieza
            </button>
            {technique.namePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={styles.preset}
                aria-pressed={name === preset}
                onClick={() => setName(preset)}
              >
                {preset}
              </button>
            ))}
          </div>
        )}

        <div className={styles.fields}>
          {!isColor && (
            <TextField
              compact
              label={technique.namePresets.length > 0 ? 'O escribe otro nombre' : '¿Cómo se llama?'}
              type="text"
              autoComplete="off"
              enterKeyHint="next"
              placeholder={isPiece ? 'Ej. Cabeza' : 'Ej. Vueltas de la manga'}
              value={name}
              onKeyDown={(e) => focusOnEnter(e, nextRef)}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {isPiece && !initial && (
            <div className={styles.quantity}>
              <span id={quantityLabelId} className={styles.quantityLabel}>
                ¿Cuántas iguales?
              </span>
              <Stepper value={quantity} onChange={setQuantity} labelledBy={quantityLabelId} />
              <span className={styles.hint}>
                {names.length > 1
                  ? `Se añadirán: ${listInSpanish(names)}.`
                  : 'Por ejemplo, 2 si son dos brazos.'}
              </span>
            </div>
          )}

          {isColor && (
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
              onKeyDown={(e) => focusOnEnter(e, nextRef)}
              value={code}
              onChange={(e) => changeCode(e.target.value)}
              hint="Viene en la etiqueta de la madeja."
            />
          )}

          {isPiece ? (
            <TextField
              compact
              label={`¿Cuántas ${technique.row?.many} tiene?`}
              optional
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 20"
              enterKeyHint={initial ? 'next' : 'done'}
              ref={nextRef}
              onKeyDown={(e) => initial && focusOnEnter(e, lastRef)}
              value={rowTarget}
              onChange={(e) => setRowTarget(e.target.value.replace(/\D/g, ''))}
              hint="Viene en el patrón. Si no lo sabes, déjalo en blanco."
            />
          ) : (
            <TextField
              compact
              label={isColor ? '¿Cuántos puntos de este color?' : '¿Hasta cuánto quieres contar?'}
              optional
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Ej. 560"
              enterKeyHint={initial ? 'next' : 'done'}
              ref={nextRef}
              onKeyDown={(e) => initial && focusOnEnter(e, lastRef)}
              value={target}
              onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
              hint="Si no lo sabes, déjalo en blanco."
            />
          )}

          {initial &&
            (isPiece ? (
              <TextField
                compact
                label={`${capitalize(technique.row?.many ?? '')} terminadas`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                enterKeyHint="done"
                ref={lastRef}
                value={rows}
                error={fieldError?.field === 'rows' ? fieldError.text : null}
                onChange={(e) => {
                  setRows(e.target.value.replace(/\D/g, ''));
                  setFieldError(null);
                }}
                hint="Corrígelo si te equivocaste al contar."
              />
            ) : (
              <TextField
                compact
                label="Puntos contados"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                enterKeyHint="done"
                ref={lastRef}
                value={count}
                error={fieldError?.field === 'count' ? fieldError.text : null}
                onChange={(e) => {
                  setCount(e.target.value.replace(/\D/g, ''));
                  setFieldError(null);
                }}
                hint="Corrígelo si te equivocaste al contar."
              />
            ))}
        </div>
      </form>
    </Screen>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
