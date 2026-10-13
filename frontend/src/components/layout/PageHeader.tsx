import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/** Top-of-page heading used by inner pages. Leaves room for the floating nav. */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-6 pb-10 pt-32 sm:flex-row sm:items-end sm:justify-between sm:pt-36', className)}>
      <div className="max-w-2xl animate-fade-up">
        <h1 className="display text-4xl text-ink sm:text-[3.25rem]">{title}</h1>
        {subtitle && <div className="mt-4 text-lg leading-relaxed text-ink-soft">{subtitle}</div>}
      </div>
      {actions && <div className="shrink-0 animate-fade-up [animation-delay:100ms]">{actions}</div>}
    </div>
  );
}
