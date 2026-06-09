import Link from 'next/link';
import { MapPin, DollarSign, Briefcase, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, formatCurrency } from '@/lib/utils';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const t = useTranslations('jobs');
  const locale = useLocale();
  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';

  return (
    <Card hover className="p-5">
      <Link href={`/${locale}/jobs/${job.id}`} className="block">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={job.client?.avatar} name={clientName || 'C'} size="sm" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{clientName}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>
          <Badge variant={job.status === 'open' ? 'success' : 'default'} className="flex-shrink-0">
            {t(job.status)}
          </Badge>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
          {categoryName && (
            <span className="flex items-center gap-1">
              <Briefcase size={12} />
              {categoryName}
            </span>
          )}
          {job.country && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.country}
            </span>
          )}
          {job.budget && (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
              <DollarSign size={12} />
              {formatCurrency(job.budget, locale)}
            </span>
          )}
          <span className="flex items-center gap-1 ms-auto">
            <Clock size={12} />
            {formatDate(job.created_at, locale)}
          </span>
        </div>
      </Link>
    </Card>
  );
}
