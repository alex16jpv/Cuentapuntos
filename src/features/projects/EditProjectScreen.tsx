import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths } from '@/app/paths';
import { deleteProject, updateProject } from '@/data/projects';
import { useProject } from '@/data/queries';
import { techniqueOf } from '@/domain/techniques';
import { Button } from '@/ui/Button';
import { ConfirmSheet } from '@/ui/ConfirmSheet';
import { useGoBack } from '@/ui/useGoBack';
import { ProjectForm } from './ProjectForm';

export function EditProjectScreen() {
  const { projectId } = useParams();
  const project = useProject(projectId);
  const navigate = useNavigate();
  const goBack = useGoBack(paths.parts);
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (project === undefined) return null;
  if (project === null) return leaving ? null : <Navigate to={paths.projects} replace />;

  return (
    <>
      <ProjectForm
        key={project.id}
        technique={techniqueOf(project.technique)}
        title="Editar proyecto"
        submitLabel="Guardar cambios"
        backTo={paths.parts}
        initial={{ name: project.name, target: project.target }}
        onSubmit={async (input) => {
          await updateProject(project.id, input);
          goBack();
        }}
        extraActions={
          <Button variant="danger" size="md" onClick={() => setConfirming(true)}>
            Borrar proyecto
          </Button>
        }
      />
      <ConfirmSheet
        open={confirming}
        title={`¿Borrar «${project.name}»?`}
        message={`Se borrará también todo lo que llevas contado en sus ${techniqueOf(project.technique).part.many}. No se puede deshacer.`}
        confirmLabel="Sí, borrar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setLeaving(true);
          deleteProject(project.id)
            .then(() => navigate(paths.projects, { replace: true }))
            .catch((error: unknown) => {
              setLeaving(false);
              reportWriteError(error);
            });
        }}
      />
    </>
  );
}
