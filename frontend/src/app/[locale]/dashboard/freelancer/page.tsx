'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { freelancersApi } from '@/lib/api';
import { Application } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ButtonArrow, buttonClasses } from '@/components/ui/buttonStyles';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Briefcase, CheckCircle, HourglassMedium, User, XCircle } from '@/components/ui/icons';
import { DashboardHeader, StatTile } from '@/components/dashboard/DashboardHeader';
import { cn, formatDate } from '@/lib/utils';

export default function FreelancerDashboard() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }
    if (user && user.role !== 'freelancer') {
      router.push(`/${locale}`);
      return;
    }
    if (user) {
      freelancersApi
        .getMyApplications()
        .then((r) => setApplications(r.data?.data || []))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  if (!user) return null;

  const count = (s: string) => applications.filter((a) => a.status === s).length;
  const stats = [
    { label: t('totalApps'), value: applications.length, icon: <Briefcase size={18} /> },
    { label: t('pending'), value: count('pending'), icon: <HourglassMedium size={18} /> },
    { label: t('accepted'), value: count('accepted'), icon: <CheckCircle size={18} /> },
    { label: t('rejected'), value: count('rejected'), icon: <XCircle size={18} /> },
  ];

  const statusVariant = (s: string) => (s === 'accepted' ? 'success' : s === 'rejected' ? 'error' : 'warning');

  const checklist = [
    { label: t('editProfile'), done: true },
    { label: t('avatar'), done: !!user.avatar },
    { label: t('country'), done: !!user.country },
    { label: t('firstApplication'), done: applications.length > 0 },
  ];
  const completion = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <div className="space-y-8">
      <DashboardHeader
        name={user.name}
        avatar={user.avatar}
        title={t('hello', { name: user.name })}
        subtitle={t('overview')}
        actions={
          <>
            <Button variant="secondary" onClick={() => router.push(`/${locale}/profile`)}>
              <User size={16} aria-hidden />
              {t('editProfile')}
            </Button>
            <Button arrow onClick={() => router.push(`/${locale}/jobs`)} className="pe-3">
              {t('browseJobs')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s, i) => (
          <StatTile key={s.label} {...s} emphasis={i === 0} delay={i + 1} />
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
        <section className="shell animate-fade-up [animation-delay:280ms]">
          <div className="core overflow-hidden">
            <h2 className="px-6 pb-4 pt-6 text-lg font-semibold tracking-tight text-ink">{t('myApplications')}</h2>
            {loading ? (
              <div className="space-y-3 px-6 pb-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="px-6 pb-6">
                <EmptyState
                  icon={Briefcase}
                  title={t('noApplications')}
                  action={
                    <Link href={`/${locale}/jobs`} className={buttonClasses({ size: 'sm' })}>
                      {t('browseJobs')}
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul className="divide-y divide-line border-t border-line">
                {applications.map((app) => (
                  <li key={app.id} className="flex items-center gap-4 px-6 py-4 transition-colors duration-200 hover:bg-sunken/50">
                    <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunken text-ink-soft sm:flex">
                      <Briefcase size={18} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/${locale}/jobs/${app.job_id}`}
                        className="block truncate font-semibold text-ink transition-colors hover:text-accent"
                      >
                        {app.job?.title || `#${app.job_id}`}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">{formatDate(app.applied_at, locale)}</p>
                    </div>
                    <Badge variant={statusVariant(app.status)}>{t(app.status)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="shell animate-fade-up [animation-delay:340ms]">
            <div className="core p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-ink">{t('profileCompletion')}</h3>
                <span className="num text-2xl font-semibold text-accent">{completion}%</span>
              </div>
              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-sunken"
                role="progressbar"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('profileCompletion')}
              >
                <div
                  className="h-full origin-left rounded-full bg-accent transition-transform duration-1000 ease-out rtl:origin-right"
                  style={{ transform: `scaleX(${completion / 100})` }}
                />
              </div>
              <ul className="mt-6 space-y-3">
                {checklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    {item.done ? (
                      <CheckCircle size={20} weight="fill" className="shrink-0 text-accent" aria-hidden />
                    ) : (
                      <span className="h-5 w-5 shrink-0 rounded-full border-2 border-line" aria-hidden />
                    )}
                    <span className={cn(item.done ? 'text-ink' : 'text-muted')}>{item.label}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/profile`}
                className={buttonClasses({ variant: 'secondary', fullWidth: true, className: 'mt-6' })}
              >
                {t('updateProfile')}
              </Link>
            </div>
          </div>

          <div className="animate-fade-up rounded-shell bg-accent-soft p-6 [animation-delay:400ms]">
            <h3 className="text-lg font-semibold tracking-tight text-ink">{t('findNextJob')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('findNextJobDesc')}</p>
            <Link href={`/${locale}/jobs`} className={buttonClasses({ variant: 'ink', size: 'sm', className: 'mt-5 pe-2' })}>
              {t('explorJobs')}
              <ButtonArrow />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
