import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'dashed' | 'ghost' | 'danger' | 'dangerSolid';
type Size = 'md' | 'control' | 'lg' | 'xl';

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

function classes({ variant = 'primary', size = 'lg' }: StyleProps, extra?: string) {
  return [styles.button, styles[variant], styles[size], extra].filter(Boolean).join(' ');
}

export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return <button type={type} className={classes({ variant, size }, className)} {...rest} />;
}

export function ButtonLink({ variant, size, className, ...rest }: LinkProps & StyleProps) {
  return <Link className={classes({ variant, size }, className)} {...rest} />;
}
