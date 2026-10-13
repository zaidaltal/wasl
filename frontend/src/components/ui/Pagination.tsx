'use client';

import { useLocale } from 'next-intl';
import { CaretLeft, CaretRight } from './icons';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function pageRange(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'gap', totalPages];
  if (page >= totalPages - 3) return [1, 'gap', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, 'gap', page - 1, page, page + 1, 'gap', totalPages];
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  const locale = useLocale();
  if (totalPages <= 1) return null;

  const isRtl = locale === 'ar';
  const PrevIcon = isRtl ? CaretRight : CaretLeft;
  const NextIcon = isRtl ? CaretLeft : CaretRight;

  const base =
    'num inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors duration-300 ease-fluid';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center', className)}>
      <div className="inline-flex items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-line">
        <button
          className={cn(base, 'text-ink-soft hover:bg-sunken disabled:pointer-events-none disabled:opacity-35')}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <PrevIcon size={14} weight="bold" />
        </button>

        {pageRange(page, totalPages).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-1 text-sm text-muted" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(base, p === page ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-sunken')}
            >
              {p}
            </button>
          )
        )}

        <button
          className={cn(base, 'text-ink-soft hover:bg-sunken disabled:pointer-events-none disabled:opacity-35')}
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <NextIcon size={14} weight="bold" />
        </button>
      </div>
    </nav>
  );
}
