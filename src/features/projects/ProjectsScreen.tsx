import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { APP_NAME } from '@/app/brand';
import { reportWriteError } from '@/app/errors';
import { paths } from '@/app/paths';
import { openProject } from '@/data/projects';
import { useProjectSummaries, type ProjectSummary } from '@/data/queries';
import { techniqueOf } from '@/domain/techniques';
import { ButtonLink } from '@/ui/Button';
import { BrandIcon, PlusIcon, SettingsIcon } from '@/ui/icons';
import { projectLine } from '@/ui/partText';
import { ProgressBar } from '@/ui/ProgressBar';
import { Screen } from '@/ui/Screen';
import { TechniqueIcon } from '@/ui/TechniqueIcon';
import { useMediaQuery, WIDE_SCREEN } from '@/ui/useMediaQuery';
import styles from './ProjectsScreen.module.css';

export function ProjectsScreen() {
  const summaries = useProjectSummaries();
  const wide = useMediaQuery(WIDE_SCREEN);
  const empty = summaries?.length === 0;
  const newProject = (
    <ButtonLink to={paths.newProject} variant="primary" size="lg" className={styles.newProject}>
      <PlusIcon size={24} />
      Nuevo proyecto
    </ButtonLink>
  );

  return (
    <Screen
      width="wide"
      footerClassName={styles.footer}
      footer={!wide && summaries && !empty && newProject}
    >
      <header className={styles.header}>
        <div className={styles.headline}>
          <div className={styles.brandRow}>
            <div className={styles.brand}>
              <BrandIcon size={28} />
              {APP_NAME}
            </div>
            <Link to={paths.settings} className={styles.settings}>
              <SettingsIcon size={24} />
              Ajustes
            </Link>
          </div>
          <h1 className={styles.title}>¿Qué hacemos hoy?</h1>
        </div>
        {wide && summaries && !empty && newProject}
      </header>
      {summaries &&
        (empty ? (
          <Welcome />
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

function Welcome() {
  return (
    <div className={styles.welcome}>
      <p className={styles.welcomeTitle}>¡Hola!</p>
      <p className={styles.welcomeText}>
        Aquí puedes llevar la cuenta de tus labores: puntos, vueltas y colores.
      </p>
      <p className={styles.welcomeText}>Todo se guarda en este aparato y funciona sin internet.</p>
      <ButtonLink to={paths.newProject} variant="primary" size="xl">
        <PlusIcon size={24} />
        Crear mi primer proyecto
      </ButtonLink>
    </div>
  );
}

function ProjectCard({ summary: { project, summary } }: { summary: ProjectSummary }) {
  const navigate = useNavigate();
  const busy = useRef(false);
  const technique = techniqueOf(project.technique);

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
      <span className={styles.technique}>
        <TechniqueIcon technique={project.technique} size={22} />
        {technique.label}
      </span>
      <span className={styles.row}>
        <span className={styles.name}>{project.name}</span>
        {summary.percent !== null && <span className={styles.percent}>{summary.percent}%</span>}
      </span>
      {summary.percent !== null && (
        <ProgressBar value={summary.percent} label={`Progreso de ${project.name}`} />
      )}
      <span className={styles.row}>
        <span className={styles.count}>{projectLine(summary, technique)}</span>
        <span className={styles.cta}>Seguir</span>
      </span>
    </button>
  );
}
