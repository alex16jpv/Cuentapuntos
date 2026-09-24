import type { Technique } from '@/domain/part';
import { ButtonIcon, CrochetIcon, HoopIcon, KnittingIcon } from './icons';

const ICONS = {
  embroidery: HoopIcon,
  crochet: CrochetIcon,
  knitting: KnittingIcon,
  other: ButtonIcon,
} as const;

export function TechniqueIcon({ technique, size = 24 }: { technique: Technique; size?: number }) {
  const Icon = ICONS[technique];
  return <Icon size={size} />;
}
