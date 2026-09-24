import { paths, type ReturnState } from '@/app/paths';
import type { Id, Thread } from '@/domain/types';
import { Button, ButtonLink } from '@/ui/Button';
import { PlusIcon } from '@/ui/icons';
import { Sheet } from '@/ui/Sheet';
import { ThreadOption } from '@/ui/ThreadOption';
import { threadSummary } from '@/ui/threadText';

interface ColorSheetProps {
  open: boolean;
  projectId: Id;
  threads: readonly Thread[];
  activeId: string;
  onPick: (thread: Thread) => void;
  onClose: () => void;
}

export function ColorSheet({
  open,
  projectId,
  threads,
  activeId,
  onPick,
  onClose,
}: ColorSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title="¿Qué color vas a usar?">
      {threads.map((thread) => (
        <ThreadOption
          key={thread.id}
          hex={thread.hex}
          name={thread.name}
          detail={threadSummary(thread)}
          tone={thread.id === activeId ? 'selected' : 'default'}
          aria-pressed={thread.id === activeId}
          onClick={() => onPick(thread)}
        />
      ))}
      <ButtonLink
        to={paths.newThread(projectId)}
        state={{ from: paths.count } satisfies ReturnState}
        variant="dashed"
        size="md"
      >
        <PlusIcon size={22} />
        Añadir un color
      </ButtonLink>
      <Button variant="ghost" size="md" onClick={onClose}>
        Cerrar
      </Button>
    </Sheet>
  );
}
