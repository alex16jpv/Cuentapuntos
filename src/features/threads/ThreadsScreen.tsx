import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths, type ReturnState } from '@/app/paths';
import { useWorkspace } from '@/data/queries';
import { selectThread } from '@/data/threads';
import type { Thread } from '@/domain/types';
import { ButtonLink } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { PencilIcon, PlusIcon } from '@/ui/icons';
import { Screen } from '@/ui/Screen';
import { Swatch } from '@/ui/Swatch';
import { threadSummary } from '@/ui/threadText';
import styles from './ThreadsScreen.module.css';

export function ThreadsScreen() {
  const workspace = useWorkspace();

  if (workspace === undefined) return <Screen>{null}</Screen>;

  if (workspace === null) {
    return (
      <Screen>
        <header className={styles.header}>
          <h1 className={styles.title}>Hilos</h1>
        </header>
        <div className={styles.empty}>
          <EmptyState title="No hay ningún proyecto abierto">
            Los hilos se guardan dentro de cada proyecto. Crea uno para empezar.
          </EmptyState>
          <ButtonLink to={paths.newProject} variant="primary" size="lg">
            <PlusIcon size={24} />
            Nuevo proyecto
          </ButtonLink>
        </div>
      </Screen>
    );
  }

  const { project, threads, activeThread } = workspace;

  return (
    <Screen>
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
        <h1 className={styles.title}>Hilos</h1>
      </header>
      <div className={styles.list}>
        {threads.length > 0 ? (
          <ul className={styles.items}>
            {threads.map((thread) => (
              <li key={thread.id}>
                <ThreadCard thread={thread} active={thread.id === activeThread?.id} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Aún no hay colores">
            Añade los colores de hilo que vas a usar en este proyecto.
          </EmptyState>
        )}
        <ButtonLink
          to={paths.newThread(project.id)}
          state={{ from: paths.threads } satisfies ReturnState}
          variant="dashed"
          size="md"
        >
          <PlusIcon size={22} />
          Añadir un color
        </ButtonLink>
      </div>
    </Screen>
  );
}

function ThreadCard({ thread, active }: { thread: Thread; active: boolean }) {
  const navigate = useNavigate();
  const busy = useRef(false);
  const countWithThread = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await selectThread(thread.id);
      await navigate(paths.count);
    } catch (error) {
      reportWriteError(error);
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className={[styles.card, active && styles.active].filter(Boolean).join(' ')}>
      <button type="button" className={styles.select} onClick={() => void countWithThread()}>
        <Swatch hex={thread.hex} size={56} radius={14} />
        <span className={styles.text}>
          <span className={styles.nameRow}>
            <span className={styles.name}>{thread.name}</span>
            {active && <span className={styles.inUse}>En uso</span>}
          </span>
          <span className={styles.detail}>{threadSummary(thread, { notStartedLabel: true })}</span>
        </span>
      </button>
      <Link
        to={paths.editThread(thread.id)}
        className={styles.edit}
        aria-label={`Editar ${thread.name}`}
      >
        <PencilIcon size={22} />
      </Link>
    </div>
  );
}
