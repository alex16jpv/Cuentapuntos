import { useState } from 'react';
import { runWrite } from '@/app/errors';
import { paths, type ReturnState } from '@/app/paths';
import { setPaused } from '@/data/preferences';
import { useWorkspace, type Workspace } from '@/data/queries';
import { bumpThread, selectThread } from '@/data/threads';
import { formatNumber } from '@/domain/format';
import { percent, projectProgress } from '@/domain/progress';
import type { Project, Thread } from '@/domain/types';
import { Button, ButtonLink } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { LockIcon, MinusIcon, PlusIcon } from '@/ui/icons';
import { ProgressBar } from '@/ui/ProgressBar';
import { ThreadOption } from '@/ui/ThreadOption';
import { threadCode } from '@/ui/threadText';
import { ColorSheet } from './ColorSheet';
import styles from './CounterScreen.module.css';
import { tapFeedback } from './haptics';
import { useWakeLock } from './useWakeLock';

export function CounterScreen() {
  const workspace = useWorkspace();
  useWakeLock(Boolean(workspace?.activeThread) && !workspace?.paused);

  if (workspace === undefined) return <div className={styles.screen} />;
  if (workspace === null) return <NoProject />;
  if (!workspace.activeThread) return <NoThreads project={workspace.project} />;
  return <Counter workspace={workspace} thread={workspace.activeThread} />;
}

function Counter({ workspace, thread }: { workspace: Workspace; thread: Thread }) {
  const { project, threads, paused } = workspace;
  const [sheetOpen, setSheetOpen] = useState(false);

  const increment = () => {
    if (paused) return;
    tapFeedback();
    runWrite(bumpThread(thread.id, 1));
  };

  const pick = (picked: Thread) => {
    setSheetOpen(false);
    runWrite(selectThread(picked.id));
  };

  return (
    <div className={[styles.screen, styles.counter].join(' ')}>
      <div className={styles.info}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Estás bordando</p>
          <h1 className={styles.projectName}>{project.name}</h1>
        </header>

        <div className={styles.current}>
          <ThreadOption
            hex={thread.hex}
            name={thread.name}
            detail={threadCode(thread)}
            action="Cambiar"
            tone="strong"
            aria-haspopup="dialog"
            onClick={() => setSheetOpen(true)}
          />
        </div>

        <Tally project={project} threads={threads} thread={thread} />
      </div>

      <div className={styles.action}>
        <div className={styles.tapArea}>
          <button
            type="button"
            className={styles.tap}
            aria-label={paused ? 'Contador en pausa' : 'Sumar un punto'}
            aria-disabled={paused}
            onClick={increment}
          >
            {paused ? (
              <>
                <LockIcon size={40} />
                <span className={styles.pausedTitle}>En pausa</span>
                <span className={styles.pausedHint}>Toca «Seguir contando» abajo</span>
              </>
            ) : (
              <>
                <span className={styles.plus} aria-hidden="true">
                  +1
                </span>
                <span className={styles.tapHint}>Toca aquí por cada punto</span>
              </>
            )}
          </button>
        </div>

        <div className={styles.controls}>
          <Button
            variant="secondary"
            size="control"
            disabled={paused || thread.count === 0}
            onClick={() => runWrite(bumpThread(thread.id, -1))}
          >
            <MinusIcon size={22} />
            Quitar uno
          </Button>
          <Button
            variant="secondary"
            size="control"
            className={styles.lock}
            aria-pressed={paused}
            onClick={() => runWrite(setPaused(!paused))}
          >
            {paused ? 'Seguir contando' : 'Pausar'}
          </Button>
        </div>
      </div>

      <ColorSheet
        open={sheetOpen}
        projectId={project.id}
        threads={threads}
        activeId={thread.id}
        onPick={pick}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

function Tally({
  project,
  threads,
  thread,
}: {
  project: Project;
  threads: Thread[];
  thread: Thread;
}) {
  const threadPercent = percent(thread.count, thread.target);
  const overall = projectProgress(project, threads);

  return (
    <div className={styles.tally}>
      <div className={styles.count} role="status" aria-atomic="true">
        {formatNumber(thread.count)}
        <span className="visually-hidden"> puntos de {thread.name}</span>
      </div>
      {thread.target && threadPercent !== null ? (
        <>
          <p className={styles.caption}>de {formatNumber(thread.target)} puntos</p>
          <ProgressBar
            className={styles.bar}
            value={threadPercent}
            height={14}
            label={`Progreso de ${thread.name}`}
          />
        </>
      ) : (
        <>
          <p className={styles.caption}>puntos con este color</p>
          {overall.percent !== null && (
            <>
              <ProgressBar
                className={styles.bar}
                value={overall.percent}
                height={14}
                label="Progreso del proyecto"
              />
              <p className={styles.barNote}>{overall.percent}% del proyecto</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

function NoProject() {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.projectName}>Contar</h1>
      </header>
      <div className={styles.empty}>
        <EmptyState title="No hay ningún proyecto abierto">
          Crea un proyecto para empezar a contar tus puntos.
        </EmptyState>
        <ButtonLink to={paths.newProject} variant="primary" size="lg">
          <PlusIcon size={24} />
          Nuevo proyecto
        </ButtonLink>
      </div>
    </div>
  );
}

function NoThreads({ project }: { project: Project }) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Estás bordando</p>
        <h1 className={styles.projectName}>{project.name}</h1>
      </header>
      <div className={styles.empty}>
        <EmptyState title="Aún no hay colores">
          Añade el primer color que vas a usar y empieza a contar.
        </EmptyState>
        <ButtonLink
          to={paths.newThread(project.id)}
          state={{ from: paths.count } satisfies ReturnState}
          variant="primary"
          size="lg"
        >
          <PlusIcon size={24} />
          Añadir un color
        </ButtonLink>
      </div>
    </div>
  );
}
