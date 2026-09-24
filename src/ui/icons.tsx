import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, strokeWidth = 1.8, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function HoopIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="5.5" />
      <path d="M13.5 10.5L21 3" />
      <path d="M8.5 15.5c1-2 2.5-3 5-5" />
    </Svg>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    </Svg>
  );
}

export function CountIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5v14M9 5v14M13 5v14M17 5v14" />
      <path d="M3 16L20 8" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.2} {...props}>
      <path d="M5 12h14" />
    </Svg>
  );
}

export function BackIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </Svg>
  );
}

export function PartsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h10" />
    </Svg>
  );
}

export function YarnIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="13" r="7" />
      <path d="M5.5 9.5c3 0 7 2.5 9 8M7 6.8c3.5.5 7 3.6 8 9M11 6c3 1.2 5.5 3.5 7 7" />
      <path d="M16 6l5-3" />
    </Svg>
  );
}

export function CrochetIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="15" r="5.5" />
      <path d="M5 12.5c2.5.3 5 2.2 6 6M6.5 10.3c2.5.8 4.5 2.8 5.5 5.2" />
      <path d="M13 11l7.5-7.5a1.2 1.2 0 0 0-1.7-1.7" />
    </Svg>
  );
}

export function KnittingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20L18 6M20 20L6 6" />
      <circle cx="18.5" cy="5.5" r="1.2" />
      <circle cx="5.5" cy="5.5" r="1.2" />
      <path d="M8 16c1.5-1 2.5-1 4 0s2.5 1 4 0M8 12.5c1.5-1 2.5-1 4 0s2.5 1 4 0" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.4} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M19.03 10.46 L21.41 10.70 L21.41 13.30 L19.03 13.54 L18.06 15.88 L19.57 17.73 L17.73 19.57 L15.88 18.06 L13.54 19.03 L13.30 21.41 L10.70 21.41 L10.46 19.03 L8.12 18.06 L6.27 19.57 L4.43 17.73 L5.94 15.88 L4.97 13.54 L2.59 13.30 L2.59 10.70 L4.97 10.46 L5.94 8.12 L4.43 6.27 L6.27 4.43 L8.12 5.94 L10.46 4.97 L10.70 2.59 L13.30 2.59 L13.54 4.97 L15.88 5.94 L17.73 4.43 L19.57 6.27 L18.06 8.12 Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function BrandIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="13" r="7.5" />
      <path d="M4.5 10.5c3.5-.5 8 1.5 10.5 6.5M5.8 7.8c3.8 0 7.8 2.6 9.7 7.2M9 5.8c3.3 1 6.3 3.8 7.4 7.6" />
      <path d="M16.5 7.5L21.5 2.5" />
      <circle cx="21" cy="3" r="0.6" />
    </Svg>
  );
}

export function ButtonIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9.5" cy="9.5" r="1.2" />
      <circle cx="14.5" cy="9.5" r="1.2" />
      <circle cx="9.5" cy="14.5" r="1.2" />
      <circle cx="14.5" cy="14.5" r="1.2" />
    </Svg>
  );
}
