import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths } from '@/app/paths';
import { openProject } from '@/data/projects';
import { useProjectSummaries, type ProjectSummary } from '@/data/queries';
import { formatNumber } from '@/domain/format';
import { ButtonLink } from '@/ui/Button';
import { EmptyState } from '@/ui/EmptyState';
import { HoopIcon, PlusIcon } from '@/ui/icons';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { useMediaQuery, WIDE_SCREEN } from '@/ui/useMediaQuery';
import styles from './ProjectsScreen.module.css';

export function ProjectsScreen() {
  const summaries = useProjectSummaries();
  const wide = useMediaQuery(WIDE_SCREEN);
  const newProject = (
    <ButtonLink to={paths.newProject} variant="primary" size="lg" className={styles.newProject}>
      <PlusIcon size={24} />
      Nuevo proyecto
    </ButtonLink>
  );

  return (
    <Screen width="wide" footerClassName={styles.footer} footer={!wide && newProject}>
      <header className={styles.header}>
        <div className={styles.headline}>
          <div className={styles.brand}>
            <HoopIcon size={28} />
            Mi Bastidor
          </div>
          <h1 className={styles.title}>¿Qué bordamos hoy?</h1>
        </div>
        {wide && newProject}
      </header>
      {summaries &&
        (summaries.length === 0 ? (
          <div className={styles.empty}>
            <EmptyState title="Aún no tienes proyectos">
              Crea el primero con el botón «Nuevo proyecto» y empieza a contar tus puntos.
            </EmptyState>
          </div>
        ) : (
          <ul className={styles.list}>
            {summaries.map((summary) => (
              <li key={summary.project.id}>
                <ProjectCard summary={summary} />
              </li>
            ))}
          </ul>
        ))}
    </Screen>
  );
}

function ProjectCard({ summary: { project, progress } }: { summary: ProjectSummary }) {
  const navigate = useNavigate();
  const busy = useRef(false);
  const resume = async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      await openProject(project.id);
      await navigate(paths.count);
    } catch (error) {
      reportWriteError(error);
    } finally {
      busy.current = false;
    }
  };

  return (
    <button type="button" className={styles.card} onClick={() => void resume()}>
      <span className={styles.row}>
        <span className={styles.name}>{project.name}</span>
        {progress.percent !== null && <span className={styles.percent}>{progress.percent}%</span>}
      </span>
      {progress.percent !== null && (
        <ProgressBar value={progress.percent} label={`Progreso de ${project.name}`} />
      )}
      <span className={styles.row}>
        <span className={styles.count}>{formatNumber(progress.count)} puntos</span>
        <span className={styles.cta}>Seguir</span>
      </span>
    </button>
  );
}
