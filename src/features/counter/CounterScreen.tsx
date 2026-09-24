import { useState } from 'react';
import { runWrite } from '@/app/errors';
import { paths, type ReturnState } from '@/app/paths';
import { addRowToTarget, completeRow, countStitch, removeStitch, selectPart } from '@/data/parts';
import { setPaused } from '@/data/preferences';
import { useWorkspace, type Workspace } from '@/data/queries';
import { formatNumber } from '@/domain/format';
import { canStepBack, currentRow, isFinished, rowsDone, type Part } from '@/domain/part';
import { percent } from '@/domain/progress';
import { summarize } from '@/domain/summary';
import type { TechniqueInfo } from '@/domain/techniques';
import type { Project } from '@/domain/types';
import { Button, ButtonLink } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { CheckIcon, LockIcon, MinusIcon, PlusIcon } from '@/ui/icons';
import { PartOption } from '@/ui/PartOption';
import { partCode, stitchesLabel } from '@/ui/partText';
import { ProgressBar } from '@/ui/ProgressBar';
import styles from './CounterScreen.module.css';
import { tapFeedback } from './haptics';
import { PartSheet } from './PartSheet';
import { useWakeLock } from './useWakeLock';

export function CounterScreen() {
  const workspace = useWorkspace();
  useWakeLock(Boolean(workspace?.activePart) && !workspace?.paused);

  if (workspace === undefined) return <div className={styles.screen} />;
  if (workspace === null) return <NoProject />;
  if (!workspace.activePart) return <NoParts workspace={workspace} />;
  return <Counter workspace={workspace} part={workspace.activePart} />;
}

function Counter({ workspace, part }: { workspace: Workspace; part: Part }) {
  const { project, technique, parts, paused } = workspace;
  const [sheetOpen, setSheetOpen] = useState(false);
  const finished = technique.mode === 'rows' && isFinished(part);

  const increment = () => {
    if (paused) return;
    tapFeedback();
    runWrite(countStitch(part.id));
  };

  const pick = (picked: Part) => {
    setSheetOpen(false);
    runWrite(selectPart(picked.id));
  };

  return (
    <div className={[styles.screen, styles.counter].join(' ')}>
      <div className={styles.info}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{technique.doing}</p>
          <h1 className={styles.projectName}>{project.name}</h1>
        </header>

        <div className={styles.current}>
          <PartOption
            hex={part.hex}
            technique={project.technique}
            name={part.name}
            detail={technique.usesPalette ? partCode(part) : null}
            action="Cambiar"
            tone="strong"
            aria-haspopup="dialog"
            aria-label={`${part.name}. Cambiar de ${technique.part.one}`}
            onClick={() => setSheetOpen(true)}
          />
        </div>

        {technique.row ? (
          <RowTally part={part} technique={technique} />
        ) : (
          <StitchTally project={project} parts={parts} part={part} technique={technique} />
        )}
      </div>

      <div className={styles.action}>
        <div className={styles.tapArea}>
          {finished ? (
            <FinishedPanel workspace={workspace} part={part} onPick={pick} />
          ) : (
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
          )}
        </div>

        {technique.row && !finished && (
          <div className={styles.finishRow}>
            <Button
              variant="accent"
              size="control"
              disabled={paused}
              onClick={() => runWrite(completeRow(part.id))}
            >
              <CheckIcon size={24} />
              {technique.row.finish} {formatNumber(currentRow(part))}
            </Button>
          </div>
        )}

        <div className={styles.controls}>
          <Button
            variant="secondary"
            size="control"
            disabled={paused || !canStepBack(part, technique.mode)}
            onClick={() => runWrite(removeStitch(part.id))}
          >
            <MinusIcon size={22} />
            Quitar uno
          </Button>
          <Button
            variant="secondary"
            size="control"
            className={styles.lock}
            aria-pressed={paused}
            disabled={finished}
            onClick={() => runWrite(setPaused(!paused))}
          >
            {paused ? 'Seguir contando' : 'Pausar'}
          </Button>
        </div>
      </div>

      <PartSheet
        open={sheetOpen}
        workspace={workspace}
        activeId={part.id}
        onPick={pick}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}

function StitchTally({
  project,
  parts,
  part,
  technique,
}: {
  project: Project;
  parts: Part[];
  part: Part;
  technique: TechniqueInfo;
}) {
  const partPercent = percent(part.count, part.target);
  const overall = summarize(project, parts);

  return (
    <div className={styles.tally}>
      <div className={styles.count} role="status" aria-atomic="true">
        {formatNumber(part.count)}
        <span className="visually-hidden"> puntos de {part.name}</span>
      </div>
      {part.target && partPercent !== null ? (
        <>
          <p className={styles.caption}>de {formatNumber(part.target)} puntos</p>
          <ProgressBar
            className={styles.bar}
            value={partPercent}
            height={14}
            label={`Progreso de ${part.name}`}
          />
        </>
      ) : (
        <>
          <p className={styles.caption}>
            {technique.usesPalette ? 'puntos con este color' : 'puntos'}
          </p>
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

function RowTally({ part, technique }: { part: Part; technique: TechniqueInfo }) {
  const row = technique.row;
  if (!row) return null;
  const finished = isFinished(part);
  const rowPercent = percent(rowsDone(part), part.rowTarget);
  const shownRow = finished ? rowsDone(part) : currentRow(part);

  return (
    <div className={styles.tally}>
      <div className={styles.rowLine} role="status" aria-atomic="true">
        <span className={styles.rowLabel}>{row.oneCapital}</span>
        <span className={styles.count}>{formatNumber(shownRow)}</span>
        {part.rowTarget && <span className={styles.rowOf}>de {formatNumber(part.rowTarget)}</span>}
        <span className="visually-hidden">
          {finished
            ? `, ${part.name} terminada`
            : `, ${stitchesLabel(part.count)} en esta ${row.one}`}
        </span>
      </div>
      {rowPercent !== null && (
        <ProgressBar
          className={styles.bar}
          value={rowPercent}
          height={14}
          label={`${row.many} de ${part.name}`}
        />
      )}
      {!finished && (
        <p className={styles.rowStitches} aria-hidden="true">
          <strong>{stitchesLabel(part.count)}</strong> en esta {row.one}
        </p>
      )}
    </div>
  );
}

function FinishedPanel({
  workspace,
  part,
  onPick,
}: {
  workspace: Workspace;
  part: Part;
  onPick: (part: Part) => void;
}) {
  const { parts, technique } = workspace;
  const index = parts.findIndex((p) => p.id === part.id);
  const next =
    [...parts.slice(index + 1), ...parts.slice(0, index)].find((p) => !isFinished(p)) ?? null;
  const row = technique.row;

  return (
    <div className={styles.finished}>
      <span className={styles.finishedIcon}>
        <CheckIcon size={44} />
      </span>
      <p className={styles.finishedTitle}>¡{part.name} terminada!</p>
      {next ? (
        <Button variant="onDark" size="control" onClick={() => onPick(next)}>
          Seguir con {next.name}
        </Button>
      ) : (
        <ButtonLink to={paths.parts} variant="onDark" size="control">
          Ver mis {technique.part.many}
        </ButtonLink>
      )}
      {row && (
        <button
          type="button"
          className={styles.moreRows}
          onClick={() => runWrite(addRowToTarget(part.id))}
        >
          Me falta otra {row.one}
        </button>
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
          Crea un proyecto para empezar a contar.
        </EmptyState>
        <ButtonLink to={paths.newProject} variant="primary" size="lg">
          <PlusIcon size={24} />
          Nuevo proyecto
        </ButtonLink>
      </div>
    </div>
  );
}

function NoParts({ workspace: { project, technique } }: { workspace: Workspace }) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{technique.doing}</p>
        <h1 className={styles.projectName}>{project.name}</h1>
      </header>
      <div className={styles.empty}>
        <EmptyState title={technique.part.empty}>{technique.part.emptyHint}</EmptyState>
        <ButtonLink
          to={paths.newPart(project.id)}
          state={{ from: paths.count } satisfies ReturnState}
          variant="primary"
          size="lg"
        >
          <PlusIcon size={24} />
          {technique.part.add}
        </ButtonLink>
      </div>
    </div>
  );
}
