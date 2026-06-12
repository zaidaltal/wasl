import Link from 'next/link';
import { MapPin, Briefcase, Clock, Users } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className }: JobCardProps) {
  const t = useTranslations('jobs');
  const locale = useLocale();
  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';

  return (
    <article
      className={cn(
        'group bg-white dark:bg-night-card p-6 rounded-xl border border-outline-variant/60 dark:border-night-border shadow-sm',
        'hover:shadow-[0_12px_28px_rgba(15,23,42,0.10)] hover:-translate-y-0.5 hover:border-primary-600/30 transition-all duration-300 relative overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex-1 min-w-0">
          {/* Title + company chip */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h2 className="font-bold text-lg text-ink dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
              <Link href={`/${locale}/jobs/${job.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden />
                {job.title}
              </Link>
            </h2>
            {clientName && (
              <span className="bg-secondary-container text-on-secondary-fixed-variant px-3 py-0.5 rounded-full text-xs font-medium">
                {clientName}
                {job.country ? ` • ${job.country}` : ''}
              </span>
            )}
            {job.status !== 'open' && (
              <Badge variant="neutral" className="shrink-0">{t(job.status)}</Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-text-muted dark:text-gray-400 text-sm line-clamp-2 mb-4 max-w-2xl leading-relaxed">
            {job.description}
          </p>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2 mb-4 empty:hidden">
            {categoryName && (
              <span className="inline-flex items-center gap-1 bg-surface-container dark:bg-night-border text-text-secondary dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                <Briefcase size={11} />
                {categoryName}
              </span>
            )}
            {job.country && (
              <span className="inline-flex items-center gap-1 bg-surface-container dark:bg-night-border text-text-secondary dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                <MapPin size={11} />
                {job.country}
              </span>
            )}
          </div>

          {/* Budget + meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {job.budget && (
              <span className="text-success-700 dark:text-success-400 font-bold text-base">
                {formatCurrency(job.budget, locale)}
              </span>
            )}
            {job.applications_count !== undefined && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Users size={12} />
                {t('applicants', { count: job.applications_count })}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock size={12} />
              {formatDate(job.created_at, locale)}
            </span>
          </div>
        </div>

        {/* View Job CTA */}
        <span
          className="relative z-10 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all group-hover:brightness-110 group-active:scale-95 shrink-0 self-end md:self-center pointer-events-none"
          aria-hidden
        >
          {t('viewJob')}
        </span>
      </div>
    </article>
  );
}
