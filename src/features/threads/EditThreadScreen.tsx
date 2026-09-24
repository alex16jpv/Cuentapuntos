import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { reportWriteError } from '@/app/errors';
import { paths } from '@/app/paths';
import { useThread } from '@/data/queries';
import { deleteThread, updateThread } from '@/data/threads';
import { Button } from '@/ui/Button';
import { ConfirmSheet } from '@/ui/ConfirmSheet';
import { useGoBack } from '@/ui/useGoBack';
import { ThreadForm } from './ThreadForm';

export function EditThreadScreen() {
  const { threadId } = useParams();
  const thread = useThread(threadId);
  const goBack = useGoBack(paths.threads);
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  if (thread === undefined) return null;
  if (thread === null) return leaving ? null : <Navigate to={paths.threads} replace />;

  return (
    <>
      <ThreadForm
        key={thread.id}
        title="Editar color"
        subtitle="Cambia el color, su número o sus puntos."
        backTo={paths.threads}
        initial={thread}
        submitLabel={() => 'Guardar cambios'}
        onSubmit={async (values) => {
          await updateThread(thread.id, values);
          goBack();
        }}
        extraActions={
          <Button variant="danger" size="md" onClick={() => setConfirming(true)}>
            Borrar este color
          </Button>
        }
      />
      <ConfirmSheet
        open={confirming}
        title={`¿Borrar ${thread.name}?`}
        message="Se borrarán también los puntos contados con este color. No se puede deshacer."
        confirmLabel="Sí, borrar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setLeaving(true);
          deleteThread(thread.id)
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
