import type { Technique } from '@/domain/part';
import { TECHNIQUE_ORDER, techniqueOf } from '@/domain/techniques';
import { BackLink } from '@/ui/BackLink';
import { Screen } from '@/ui/Screen';
import { TechniqueIcon } from '@/ui/TechniqueIcon';
import { paths } from '@/app/paths';
import styles from './TechniquePicker.module.css';

export function TechniquePicker({ onPick }: { onPick: (technique: Technique) => void }) {
  return (
    <Screen>
      <div className={styles.top}>
        <BackLink fallback={paths.projects} />
      </div>
      <div className={styles.body}>
        <h1 className={styles.title}>¿Qué vas a hacer?</h1>
        <ul className={styles.options}>
          {TECHNIQUE_ORDER.map((id) => {
            const technique = techniqueOf(id);
            return (
              <li key={id}>
                <button type="button" className={styles.option} onClick={() => onPick(id)}>
                  <span className={styles.icon} aria-hidden="true">
                    <TechniqueIcon technique={id} size={36} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.label}>{technique.label}</span>
                    <span className={styles.description}>{technique.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Screen>
  );
}
