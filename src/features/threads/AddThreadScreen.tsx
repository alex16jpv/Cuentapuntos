import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { paths } from '@/app/paths';
import { useProject } from '@/data/queries';
import { addThread } from '@/data/threads';
import type { Project } from '@/domain/types';
import { Button } from '@/ui/Button';
import { Swatch } from '@/ui/Swatch';
import { useReturnTo } from '@/ui/useReturnTo';
import styles from './AddThreadScreen.module.css';
import { ThreadForm, type ThreadFormValues } from './ThreadForm';

export function AddThreadScreen() {
  const { projectId } = useParams();
  const project = useProject(projectId);
  const [added, setAdded] = useState<ThreadFormValues | null>(null);

  if (project === undefined) return null;
  if (project === null) return <Navigate to={paths.projects} replace />;

  if (added) return <Added project={project} thread={added} />;

  return (
    <ThreadForm
      title="Añadir un color"
      subtitle="Toca el color que más se parece a tu hilo."
      backTo={paths.threads}
      submitLabel={(name) => `Añadir ${name}`}
      onSubmit={async ({ name, hex, code, target }) => {
        const values = { name, hex, code, target };
        await addThread(project.id, values);
        setAdded({ ...values, count: 0 });
      }}
    />
  );
}

function Added({ project, thread }: { project: Project; thread: ThreadFormValues }) {
  const returnTo = useReturnTo();
  return (
    <div className={styles.done}>
      <Swatch hex={thread.hex} size={120} />
      <h1 className={styles.title}>¡Listo!</h1>
      <p className={styles.message}>
        Añadiste <strong>{thread.name}</strong>
        {thread.code && ` (DMC ${thread.code})`} a {project.name}.
      </p>
      <div className={styles.spacer} />
      <Button variant="primary" size="xl" onClick={() => returnTo(paths.count)}>
        Contar con este color
      </Button>
      <Button variant="secondary" size="md" onClick={() => returnTo(paths.threads)}>
        Volver a mis hilos
      </Button>
    </div>
  );
}
