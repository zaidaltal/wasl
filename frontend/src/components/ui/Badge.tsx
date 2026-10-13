import { cn } from '@/lib/utils';

const variants = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warn-soft text-warn',
  error: 'bg-danger-soft text-danger',
  neutral: 'bg-sunken text-ink-soft',
  // aliases kept for existing call sites
  default: 'bg-sunken text-ink-soft',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-sunken text-ink-soft',
  primary: 'bg-accent-soft text-accent-strong',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
