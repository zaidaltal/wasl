'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Clock, CheckCircle, XCircle, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { freelancersApi } from '@/lib/api';
import { Application } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
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
    if (user?.role !== 'freelancer') { router.push(`/${locale}`); return; }
    freelancersApi.getMyApplications()
      .then((r) => setApplications(r.data?.data || []))
      .finally(() => setLoading(false));
  }, [user, isLoading]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const statusVariant = (s: string) => s === 'accepted' ? 'success' : s === 'rejected' ? 'danger' : 'warning';

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('hello', { name: user.name })}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm capitalize">{user.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/profile`)}>
            <User size={15} /> {t('editProfile')}
          </Button>
          <Button size="sm" onClick={() => router.push(`/${locale}/jobs`)}>
            <Briefcase size={15} /> {t('browseJobs')}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('totalApps'), value: stats.total, icon: <Briefcase size={18} />, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: t('pending'), value: stats.pending, icon: <Clock size={18} />, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
          { label: t('accepted'), value: stats.accepted, icon: <CheckCircle size={18} />, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
          { label: t('rejected'), value: stats.rejected, icon: <XCircle size={18} />, color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
        ].map((stat, i) => (
          <Card key={i} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Applications list */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('myApplications')}</h2>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse bg-gray-50 dark:bg-gray-700/20" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('noApplications')}</p>
              <Button size="sm" className="mt-4" onClick={() => router.push(`/${locale}/jobs`)}>{t('browseJobs')}</Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {applications.map((app) => (
                <li key={app.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link href={`/${locale}/jobs/${app.job_id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 text-sm truncate block">
                      {app.job?.title || `Job #${app.job_id}`}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatDate(app.applied_at, locale)}</p>
                  </div>
                  <Badge variant={statusVariant(app.status)}>{t(app.status)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
