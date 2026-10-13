'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/** Segmented progress bar for multi-step flows, announced as "Step x of y". */
export function StepProgress({ current, total, className }: { current: number; total: number; className?: string }) {
  const t = useTranslations('signup');
  const label = t('stepOf', { current, total });

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={label}
        aria-label={label}
        className="flex flex-1 gap-1.5"
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
            <span
              className={cn(
                'absolute inset-0 origin-left rounded-full bg-accent transition-transform duration-700 ease-fluid rtl:origin-right',
                i < current ? 'scale-x-100' : 'scale-x-0'
              )}
            />
          </span>
        ))}
      </div>
      <span className="num shrink-0 text-xs font-semibold text-muted">{label}</span>
    </div>
  );
}
