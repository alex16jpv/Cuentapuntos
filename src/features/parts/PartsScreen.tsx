import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths, type ReturnState } from '@/app/paths';
import { selectPart } from '@/data/parts';
import { useWorkspace, type Workspace } from '@/data/queries';
import { isFinished, type Part } from '@/domain/part';
import { ButtonLink } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { CheckIcon, PencilIcon, PlusIcon } from '@/ui/icons';
import { PartBadge } from '@/ui/PartBadge';
import { partSummary } from '@/ui/partText';
import { Screen } from '@/ui/Screen';
import styles from './PartsScreen.module.css';

export function PartsScreen() {
  const workspace = useWorkspace();

  if (workspace === undefined) return <Screen width="wide">{null}</Screen>;

  if (workspace === null) {
    return (
      <Screen width="wide">
        <header className={styles.header}>
          <h1 className={styles.title}>Piezas y colores</h1>
        </header>
        <div className={styles.empty}>
          <EmptyState title="No hay ningún proyecto abierto">
            Los colores y las piezas se guardan dentro de cada proyecto. Crea uno para empezar.
          </EmptyState>
          <ButtonLink to={paths.newProject} variant="primary" size="lg">
            <PlusIcon size={24} />
            Nuevo proyecto
          </ButtonLink>
        </div>
      </Screen>
    );
  }

  const { project, technique, parts, activePart } = workspace;

  return (
    <Screen width="wide">
      <header className={styles.header}>
        <div className={styles.projectLine}>
          <p className={styles.projectName}>{project.name}</p>
          <Link
            to={paths.editProject(project.id)}
            className={styles.editProject}
            aria-label={`Editar proyecto ${project.name}`}
          >
            Editar
          </Link>
        </div>
        <h1 className={styles.title}>{technique.part.tab}</h1>
      </header>
      <div className={styles.list}>
        {parts.length > 0 ? (
          <ul className={styles.items}>
            {parts.map((part) => (
              <li key={part.id}>
                <PartCard workspace={workspace} part={part} active={part.id === activePart?.id} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title={technique.part.empty} className={styles.noParts}>
            {technique.part.emptyHint}
          </EmptyState>
        )}
        <ButtonLink
          to={paths.newPart(project.id)}
          state={{ from: paths.parts } satisfies ReturnState}
          variant="dashed"
          size="md"
        >
          <PlusIcon size={22} />
          {technique.part.add}
        </ButtonLink>
      </div>
    </Screen>
  );
}

function PartCard({
  workspace,
  part,
  active,
}: {
  workspace: Workspace;
  part: Part;
  active: boolean;
}) {
  const { project, technique } = workspace;
  const navigate = useNavigate();
  const busy = useRef(false);
  const finished = technique.mode === 'rows' && isFinished(part);

  const countWithPart = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await selectPart(part.id);
      await navigate(paths.count);
    } catch (error) {
      reportWriteError(error);
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className={[styles.card, active && styles.active].filter(Boolean).join(' ')}>
      <button type="button" className={styles.select} onClick={() => void countWithPart()}>
        <PartBadge hex={part.hex} technique={project.technique} size={56} radius={14} />
        <span className={styles.text}>
          <span className={styles.nameRow}>
            <span className={styles.name}>{part.name}</span>
            {active && !finished && <span className={styles.inUse}>{technique.part.inUse}</span>}
            {finished && (
              <span className={styles.done}>
                <CheckIcon size={18} />
                Terminada
              </span>
            )}
          </span>
          {!finished && (
            <span className={styles.detail}>
              {partSummary(part, technique, { notStartedLabel: true })}
            </span>
          )}
        </span>
      </button>
      <Link to={paths.editPart(part.id)} className={styles.edit} aria-label={`Editar ${part.name}`}>
        <PencilIcon size={22} />
      </Link>
    </div>
  );
}
