'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { freelancersApi } from '@/lib/api';
import { Application } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function FreelancerDashboard() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { router.push(`/${locale}/login`); return; }
    if (user && user.role !== 'freelancer') { router.push(`/${locale}`); return; }
    if (user) {
      freelancersApi.getMyApplications()
        .then((r) => setApplications(r.data?.data || []))
        .finally(() => setLoading(false));
    }
  }, [user, isLoading]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const statusVariant = (s: string) => (s === 'accepted' ? 'success' : s === 'rejected' ? 'error' : 'warning');

  if (!user) return null;

  const statCards = [
    { label: t('totalApps'), value: stats.total, icon: <Briefcase size={18} />, chip: 'bg-primary-600/10 text-primary-600' },
    { label: t('pending'), value: stats.pending, icon: <Clock size={18} />, chip: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: t('accepted'), value: stats.accepted, icon: <CheckCircle size={18} />, chip: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' },
    { label: t('rejected'), value: stats.rejected, icon: <XCircle size={18} />, chip: 'bg-error-container text-on-error-container dark:bg-red-900/30 dark:text-red-400' },
  ];

  const statusPill = (s: string) =>
    s === 'accepted'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      : s === 'rejected'
        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';

  // Profile completion checklist — derived from data already on the user object
  const checklist = [
    { label: t('editProfile'), done: true },
    { label: 'Avatar', done: !!user.avatar },
    { label: t('country'), done: !!(user as any).country },
    { label: t('myApplications'), done: applications.length > 0 },
  ];
  const completion = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-ink dark:text-white">{t('hello', { name: user.name })}</h1>
            <p className="text-text-muted dark:text-gray-400 text-sm capitalize">{user.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => router.push(`/${locale}/profile`)} className="gap-1.5">
            <User size={15} /> {t('editProfile')}
          </Button>
          <Button size="sm" onClick={() => router.push(`/${locale}/jobs`)} className="gap-1.5">
            <Briefcase size={15} /> {t('browseJobs')}
          </Button>
        </div>
      </div>

      {/* Stats — icon chip + big number */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-night-card rounded-xl p-5 sm:p-6 shadow-card border border-outline-variant/50 dark:border-night-border hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.chip}`}>
              {stat.icon}
            </div>
            <p className="text-xs font-medium text-text-muted">{stat.label}</p>
            <h3 className="text-3xl font-bold text-ink dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main column — applications table + promo banner */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-night-card rounded-xl shadow-card border border-outline-variant/50 dark:border-night-border overflow-hidden">
            <div className="px-6 py-5 border-b border-line dark:border-night-border flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink dark:text-white">{t('myApplications')}</h2>
            </div>
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase size={40} className="mx-auto text-muted mb-3" />
                <p className="text-text-muted dark:text-gray-400">{t('noApplications')}</p>
                <Button size="sm" className="mt-4" onClick={() => router.push(`/${locale}/jobs`)}>
                  {t('browseJobs')}
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-container-low dark:bg-night-bg/50 border-b border-line dark:border-night-border">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-start">{t('jobCompany')}</th>
                      <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-start hidden sm:table-cell">{t('date')}</th>
                      <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-end">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line dark:divide-night-border">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-surface-container/60 dark:hover:bg-night-border/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary-600/10 text-primary-600 flex items-center justify-center shrink-0">
                              <Briefcase size={18} />
                            </div>
                            <Link
                              href={`/${locale}/jobs/${app.job_id}`}
                              className="font-bold text-ink dark:text-white hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors truncate block max-w-[220px] sm:max-w-xs"
                            >
                              {app.job?.title || `Job #${app.job_id}`}
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-muted hidden sm:table-cell">
                          {formatDate(app.applied_at, locale)}
                        </td>
                        <td className="px-6 py-4 text-end">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusPill(app.status)}`}>
                            {t(app.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Promo banner — dark navy with watermark icon */}
          <div className="bg-ink dark:bg-night-card rounded-2xl p-8 relative overflow-hidden text-white">
            <div className="relative z-10 max-w-md">
              <h3 className="text-xl font-bold mb-2">{t('findNextJob')}</h3>
              <p className="text-white/80 text-sm mb-5 leading-relaxed">{t('findNextJobDesc')}</p>
              <button
                onClick={() => router.push(`/${locale}/jobs`)}
                className="bg-primary-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
              >
                {t('explorJobs')}
              </button>
            </div>
            <Briefcase
              size={200}
              className="absolute -end-10 -bottom-10 text-white/5 pointer-events-none"
              strokeWidth={1}
            />
          </div>
        </div>

        {/* Sidebar — profile completion */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-night-card rounded-xl p-6 shadow-card border border-outline-variant/50 dark:border-night-border">
            <h3 className="text-sm font-bold text-ink dark:text-white mb-4">{t('profileCompletion')}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-primary-600">{completion}%</span>
              <span className="text-xs text-text-muted">{t('almostThere')}</span>
            </div>
            <div className="w-full bg-surface-container-high dark:bg-night-border h-2.5 rounded-full mb-6 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${completion}%` }}
              />
            </div>
            <ul className="space-y-3">
              {checklist.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle size={18} className="text-success-600 shrink-0" />
                  ) : (
                    <span className="w-[18px] h-[18px] rounded-full border-2 border-outline-variant shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? 'text-ink dark:text-white' : 'text-text-muted'}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push(`/${locale}/profile`)}
              className="w-full mt-6 py-2.5 border border-primary-600 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-600/10 transition-all"
            >
              {t('updateProfile')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
