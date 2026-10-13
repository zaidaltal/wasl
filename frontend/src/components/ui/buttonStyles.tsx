// Server-safe button styling helpers. Kept out of Button.tsx ('use client') so
// server components can style <Link> elements as buttons.
import { cn } from '@/lib/utils';
import { ArrowUpRight } from './icons';

const variantStyles = {
  primary: 'bg-accent text-accent-on hover:bg-accent-strong shadow-[0_8px_24px_-10px_rgb(var(--accent)/0.6)]',
  ink: 'bg-ink text-canvas hover:bg-ink/90',
  secondary: 'bg-surface text-ink ring-1 ring-inset ring-line hover:ring-ink/30 hover:bg-sunken/60',
  ghost: 'bg-transparent text-ink-soft hover:bg-sunken hover:text-ink',
  danger: 'bg-transparent text-danger ring-1 ring-inset ring-danger/40 hover:bg-danger-soft',
  // alias kept for existing call sites
  outline: 'bg-surface text-ink ring-1 ring-inset ring-line hover:ring-ink/30 hover:bg-sunken/60',
};

const sizeStyles = {
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'min-h-[3.25rem] px-6 text-[15px] gap-2.5',
};

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = keyof typeof sizeStyles;

/** Shared class builder so <Link> elements can look exactly like buttons. */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(
    'group/btn relative inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold',
    'transition-[background-color,box-shadow,transform,color] duration-300 ease-fluid active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );
}

/** Nested icon "island" that sits flush inside a pill button and nudges on hover. */
export function ButtonArrow({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span
      aria-hidden
      className={cn(
        '-me-2.5 ms-1 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-500 ease-fluid',
        'group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105 rtl:group-hover/btn:-translate-x-0.5',
        tone === 'light' ? 'bg-white/15' : 'bg-ink/[0.06]'
      )}
    >
      <ArrowUpRight size={15} weight="bold" className="rtl:-scale-x-100" />
    </span>
  );
}
