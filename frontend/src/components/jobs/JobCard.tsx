import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ArrowUpRight, Clock, MapPin, Users } from '@/components/ui/icons';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  className?: string;
  /** Heading level for the title: 2 on listing pages, 3 under a section heading */
  headingLevel?: 2 | 3;
}

export function JobCard({ job, className, headingLevel = 3 }: JobCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const t = useTranslations('jobs');
  const locale = useLocale();
  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';
  const budget = Number(job.budget);

  return (
    <article
      className={cn(
        'group relative rounded-shell bg-surface p-6 ring-1 ring-inset ring-line sm:p-7',
        'transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink/15',
        'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent',
        className
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
            {clientName && <span className="font-semibold text-ink-soft">{clientName}</span>}
            {job.country && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} aria-hidden />
                {job.country}
              </span>
            )}
            {job.status !== 'open' && <Badge variant="neutral">{t(job.status)}</Badge>}
          </div>

          <Heading className="text-lg font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-xl">
            <Link href={`/${locale}/jobs/${job.id}`} className="focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0">
              <span className="absolute inset-0 rounded-shell" aria-hidden />
              {job.title}
            </Link>
          </Heading>

          <p className="mt-2.5 line-clamp-2 max-w-[68ch] text-[15px] leading-relaxed text-ink-soft">{job.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {budget > 0 && (
              <span className="num text-base font-semibold text-ink">{formatCurrency(budget, locale)}</span>
            )}
            {categoryName && <Badge variant="neutral">{categoryName}</Badge>}
            {job.applications_count !== undefined && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                <Users size={14} aria-hidden />
                {t('applicants', { count: job.applications_count })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
              <Clock size={14} aria-hidden />
              {formatDate(job.created_at, locale)}
            </span>
          </div>
        </div>

        <span
          aria-hidden
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sunken text-ink transition-[background-color,color,transform] duration-500 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-accent group-hover:text-accent-on rtl:group-hover:-translate-x-0.5 sm:flex"
        >
          <ArrowUpRight size={17} weight="bold" className="rtl:-scale-x-100" />
        </span>
      </div>
    </article>
  );
}
