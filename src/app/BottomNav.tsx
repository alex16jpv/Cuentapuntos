import { NavLink } from 'react-router';
import { paths } from '@/app/paths';
import { CountIcon, ProjectsIcon, ThreadsIcon } from '@/ui/icons';
import styles from './BottomNav.module.css';

const TABS = [
  { to: paths.projects, label: 'Proyectos', Icon: ProjectsIcon, end: true },
  { to: paths.count, label: 'Contar', Icon: CountIcon, end: false },
  { to: paths.threads, label: 'Hilos', Icon: ThreadsIcon, end: true },
] as const;

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Principal">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={styles.link}>
          <Icon size={26} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
