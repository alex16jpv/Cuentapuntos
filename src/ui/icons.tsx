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
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M9.5 9.5l5 5M14.5 9.5l-5 5" />
    </Svg>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 8l8 8M16 8l-8 8" />
    </Svg>
  );
}

export function CountIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
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
