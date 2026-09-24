import styles from './Swatch.module.css';

interface SwatchProps {
  hex: string;
  size?: number;
  radius?: number;
  className?: string;
}

export function Swatch({ hex, size = 40, radius = size / 2, className }: SwatchProps) {
  return (
    <span
      aria-hidden="true"
      className={[styles.swatch, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, borderRadius: radius, background: hex }}
    />
  );
}
