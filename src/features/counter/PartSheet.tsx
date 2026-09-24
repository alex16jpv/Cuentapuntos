import { paths, type ReturnState } from '@/app/paths';
import type { Workspace } from '@/data/queries';
import type { Part } from '@/domain/part';
import { Button, ButtonLink } from '@/ui/Button';
import { PlusIcon } from '@/ui/icons';
import { PartOption } from '@/ui/PartOption';
import { partSummary } from '@/ui/partText';
import { Sheet } from '@/ui/Sheet';

interface PartSheetProps {
  open: boolean;
  workspace: Workspace;
  activeId: string;
  onPick: (part: Part) => void;
  onClose: () => void;
}

export function PartSheet({ open, workspace, activeId, onPick, onClose }: PartSheetProps) {
  const { project, technique, parts } = workspace;
  return (
    <Sheet open={open} onClose={onClose} title={technique.part.pick}>
      {parts.map((part) => (
        <PartOption
          key={part.id}
          hex={part.hex}
          technique={project.technique}
          name={part.name}
          detail={partSummary(part, technique)}
          tone={part.id === activeId ? 'selected' : 'default'}
          aria-pressed={part.id === activeId}
          onClick={() => onPick(part)}
        />
      ))}
      <ButtonLink
        to={paths.newPart(project.id)}
        state={{ from: paths.count } satisfies ReturnState}
        variant="dashed"
        size="md"
      >
        <PlusIcon size={22} />
        {technique.part.add}
      </ButtonLink>
      <Button variant="ghost" size="md" onClick={onClose}>
        Cerrar
      </Button>
    </Sheet>
  );
}
