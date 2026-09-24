import { useNavigate } from 'react-router';
import { requestPersistentStorage } from '@/data/db';
import { createProject } from '@/data/projects';
import { paths } from '@/app/paths';
import { ProjectForm } from './ProjectForm';

export function NewProjectScreen() {
  const navigate = useNavigate();
  return (
    <ProjectForm
      title="Nuevo proyecto"
      submitLabel="Empezar a bordar"
      backTo={paths.projects}
      onSubmit={async (input) => {
        await createProject(input);
        void requestPersistentStorage().catch(() => false);
        await navigate(paths.count, { replace: true });
      }}
    />
  );
}
