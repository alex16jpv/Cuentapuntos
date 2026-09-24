import { NavLink } from 'react-router';
import { paths } from '@/app/paths';
import { useWorkspace } from '@/data/queries';
import { CountIcon, PartsIcon, ProjectsIcon } from '@/ui/icons';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const workspace = useWorkspace();
  const tabs = [
    { to: paths.projects, label: 'Proyectos', Icon: ProjectsIcon, end: true },
    { to: paths.count, label: 'Contar', Icon: CountIcon, end: false },
    {
      to: paths.parts,
      label: workspace?.technique.part.tab ?? 'Piezas',
      Icon: PartsIcon,
      end: true,
    },
  ];
  return (
    <nav className={styles.nav} aria-label="Principal">
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={styles.link}>
          <Icon size={26} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
