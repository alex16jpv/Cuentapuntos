import type { Technique } from '@/domain/part';
import styles from './PartBadge.module.css';
import { Swatch } from './Swatch';
import { TechniqueIcon } from './TechniqueIcon';

interface PartBadgeProps {
  hex: string | null;
  technique: Technique;
  size?: number;
  radius?: number;
}

export function PartBadge({ hex, technique, size = 40, radius = size / 2 }: PartBadgeProps) {
  if (hex) return <Swatch hex={hex} size={size} radius={radius} />;
  return (
    <span
      aria-hidden="true"
      className={styles.badge}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <TechniqueIcon technique={technique} size={Math.round(size * 0.6)} />
    </span>
  );
}
