import { useId } from 'react';
import { runWrite } from '@/app/errors';
import { paths } from '@/app/paths';
import { TEXT_SCALES } from '@/app/textScale';
import { setTextScale } from '@/data/preferences';
import { usePreferences } from '@/data/queries';
import { BackLink } from '@/ui/BackLink';
import { CheckIcon } from '@/ui/icons';
import { Screen } from '@/ui/Screen';
import styles from './SettingsScreen.module.css';

const SAMPLE_SIZES = { normal: '24px', large: '28px', extra: '31px' } as const;

export function SettingsScreen() {
  const prefs = usePreferences();
  const labelId = useId();
  const current = prefs?.textScale ?? 'normal';

  return (
    <Screen>
      <div className={styles.top}>
        <BackLink fallback={paths.projects} />
      </div>
      <div className={styles.body}>
        <h1 className={styles.title}>Ajustes</h1>

        <section className={styles.section}>
          <h2 id={labelId} className={styles.sectionTitle}>
            Tamaño de la letra
          </h2>
          <div className={styles.options} role="radiogroup" aria-labelledby={labelId}>
            {TEXT_SCALES.map((scale) => (
              <button
                key={scale.id}
                type="button"
                role="radio"
                aria-checked={current === scale.id}
                className={styles.option}
                onClick={() => runWrite(setTextScale(scale.id))}
              >
                <span
                  className={styles.sample}
                  style={{ fontSize: SAMPLE_SIZES[scale.id] }}
                  aria-hidden="true"
                >
                  Aa
                </span>
                <span className={styles.optionLabel}>{scale.label}</span>
                {current === scale.id && (
                  <span className={styles.check}>
                    <CheckIcon size={28} />
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className={styles.note}>El cambio se ve al momento en toda la app.</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tus labores</h2>
          <p className={styles.note}>
            Todo lo que cuentas se guarda solo en este aparato. No hace falta internet ni crear una
            cuenta.
          </p>
        </section>
      </div>
    </Screen>
  );
}
