'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function pageRange(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
  if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '…', page - 1, page, page + 1, '…', totalPages];
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  const locale = useLocale();
  if (totalPages <= 1) return null;

  const isRtl = locale === 'ar';
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  const navBtn =
    'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-150 ' +
    'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-card ' +
    'disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <button className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <PrevIcon size={16} />
      </button>

      {pageRange(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="w-9 h-9 inline-flex items-center justify-center text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30',
              p === page
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-night-card'
            )}
          >
            {p}
          </button>
        )
      )}

      <button className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <NextIcon size={16} />
      </button>
    </nav>
  );
}
