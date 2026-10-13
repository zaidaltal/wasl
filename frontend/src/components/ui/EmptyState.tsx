import { cn } from '@/lib/utils';
import type { Icon } from './icons';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: IconCmp, title, hint, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-shell border border-dashed border-line px-6 py-16 text-center sm:py-20',
        className
      )}
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-sunken text-ink-soft">
        <IconCmp size={28} weight="light" aria-hidden />
      </span>
      <p className="mt-5 text-lg font-semibold tracking-tight text-ink">{title}</p>
      {hint && <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
