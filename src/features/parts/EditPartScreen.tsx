import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths } from '@/app/paths';
import { deletePart, updatePart } from '@/data/parts';
import { usePart } from '@/data/queries';
import { techniqueOf } from '@/domain/techniques';
import { Button } from '@/ui/Button';
import { ConfirmSheet } from '@/ui/ConfirmSheet';
import { useGoBack } from '@/ui/useGoBack';
import { PartForm } from './PartForm';

export function EditPartScreen() {
  const { partId } = useParams();
  const found = usePart(partId);
  const goBack = useGoBack(paths.parts);
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (found === undefined) return null;
  if (found === null) return leaving ? null : <Navigate to={paths.parts} replace />;

  const { part, project } = found;
  const technique = techniqueOf(project.technique);
  const isPiece = technique.mode === 'rows';

  return (
    <>
      <PartForm
        key={part.id}
        project={project}
        technique={technique}
        title={technique.part.edit}
        subtitle={isPiece ? 'Cambia el nombre o las vueltas.' : 'Cambia lo que necesites.'}
        backTo={paths.parts}
        initial={part}
        submitLabel={() => 'Guardar cambios'}
        onSubmit={async (values) => {
          await updatePart(part.id, {
            name: values.names[0] ?? part.name,
            hex: values.hex,
            code: values.code,
            target: values.target,
            rowTarget: values.rowTarget,
            ...(isPiece ? { rowsDone: values.rowsDone } : { count: values.count }),
          });
          goBack();
        }}
        extraActions={
          <Button variant="danger" size="md" onClick={() => setConfirming(true)}>
            {technique.part.remove}
          </Button>
        }
      />
      <ConfirmSheet
        open={confirming}
        title={`¿Borrar ${part.name}?`}
        message="Se borrará también lo que llevas contado. No se puede deshacer."
        confirmLabel="Sí, borrar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setLeaving(true);
          deletePart(part.id)
            .then(goBack)
            .catch((error: unknown) => {
              setLeaving(false);
              reportWriteError(error);
            });
        }}
      />
    </>
  );
}
