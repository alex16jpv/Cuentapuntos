import { useNavigate, useSearchParams } from 'react-router';
import { paths } from '@/app/paths';
import { requestPersistentStorage } from '@/data/db';
import { createProject } from '@/data/projects';
import type { Technique } from '@/domain/part';
import { TECHNIQUE_ORDER, TECHNIQUES } from '@/domain/techniques';
import { ProjectForm } from './ProjectForm';
import { TechniquePicker } from './TechniquePicker';

const START_LABEL: Record<Technique, string> = {
  embroidery: 'Empezar a bordar',
  crochet: 'Empezar a tejer',
  knitting: 'Empezar a tejer',
  other: 'Empezar a contar',
};

function isTechnique(value: string | null): value is Technique {
  return TECHNIQUE_ORDER.some((t) => t === value);
}

export function NewProjectScreen() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const chosen = params.get('tecnica');

  if (!isTechnique(chosen)) {
    return (
      <TechniquePicker
        onPick={(technique) => setParams({ tecnica: technique }, { replace: true })}
      />
    );
  }

  const technique = TECHNIQUES[chosen];

  return (
    <ProjectForm
      key={chosen}
      technique={technique}
      title="Nuevo proyecto"
      submitLabel={START_LABEL[chosen]}
      backTo={paths.newProject}
      onBack={() => setParams({}, { replace: true })}
      onSubmit={async (values) => {
        const projectId = await createProject({ ...values, technique: chosen });
        void requestPersistentStorage().catch(() => false);
        if (chosen === 'other') {
          await navigate(paths.count, { replace: true });
        } else {
          await navigate(paths.newPart(projectId), { replace: true });
        }
      }}
    />
  );
}
