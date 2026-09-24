import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { paths } from '@/app/paths';
import { addParts } from '@/data/parts';
import { useProject } from '@/data/queries';
import { listInSpanish } from '@/domain/names';
import { techniqueOf, type TechniqueInfo } from '@/domain/techniques';
import type { Project } from '@/domain/types';
import { Button } from '@/ui/Button';
import { PartBadge } from '@/ui/PartBadge';
import { useReturnTo } from '@/ui/useReturnTo';
import styles from './AddPartScreen.module.css';
import { PartForm, type PartFormValues } from './PartForm';

export function AddPartScreen() {
  const { projectId } = useParams();
  const project = useProject(projectId);
  const [added, setAdded] = useState<PartFormValues | null>(null);

  if (project === undefined) return null;
  if (project === null) return <Navigate to={paths.projects} replace />;

  const technique = techniqueOf(project.technique);

  if (added) return <Added project={project} technique={technique} values={added} />;

  return (
    <PartForm
      project={project}
      technique={technique}
      title={technique.part.add}
      subtitle={technique.part.addHint}
      backTo={paths.parts}
      submitLabel={(names) =>
        names.length > 1 ? `Añadir ${names.length} ${technique.part.many}` : `Añadir ${names[0]}`
      }
      onSubmit={async (values) => {
        await addParts(
          project.id,
          values.names.map((name) => ({
            name,
            hex: values.hex,
            code: values.code,
            target: values.target,
            rowTarget: values.rowTarget,
          })),
        );
        setAdded(values);
      }}
    />
  );
}

function Added({
  project,
  technique,
  values,
}: {
  project: Project;
  technique: TechniqueInfo;
  values: PartFormValues;
}) {
  const returnTo = useReturnTo();
  const code = values.code ? ` (DMC ${values.code})` : '';
  return (
    <div className={styles.done}>
      <PartBadge hex={values.hex} technique={project.technique} size={120} />
      <h1 className={styles.title}>¡Listo!</h1>
      <p className={styles.message}>
        Añadiste <strong>{listInSpanish(values.names)}</strong>
        {code} a {project.name}.
      </p>
      <div className={styles.spacer} />
      <Button variant="primary" size="xl" onClick={() => returnTo(paths.count)}>
        Empezar a contar
      </Button>
      <Button variant="secondary" size="md" onClick={() => returnTo(paths.parts)}>
        Ver mis {technique.part.many}
      </Button>
    </div>
  );
}
