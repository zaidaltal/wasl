'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Users, Briefcase, FileText, TrendingUp, Trash2, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/api';
import { AdminStats, User, Job } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'users' | 'jobs';

export default function AdminPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { router.push(`/${locale}/login`); return; }
    if (user && user.role !== 'admin') { router.push(`/${locale}`); return; }
    if (user) loadData();
  }, [user, isLoading]);

  const loadData = async () => {
    setLoading(true);
    const [statsRes, usersRes, jobsRes] = await Promise.allSettled([
      adminApi.getStats(), adminApi.getUsers(), adminApi.getJobs(),
    ]);
    if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data);
    if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data?.data || []);
    if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data?.data || []);
    setLoading(false);
  };

  const deleteUser = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await adminApi.deleteUser(id);
    toast.success(t('userDeleted'));
    setUsers(users.filter((u) => u.id !== id));
  };

  const deleteJob = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await adminApi.deleteJob(id);
    toast.success(t('jobDeleted'));
    setJobs(jobs.filter((j) => j.id !== id));
  };

  if (!user || user.role !== 'admin') return null;

  const statCards = stats ? [
    { label: t('totalUsers'), value: stats.total_users, icon: <Users size={18} /> },
    { label: t('freelancers'), value: stats.total_freelancers, icon: <TrendingUp size={18} /> },
    { label: t('clients'), value: stats.total_clients, icon: <Shield size={18} /> },
    { label: t('totalJobs'), value: stats.total_jobs, icon: <Briefcase size={18} /> },
    { label: t('openJobs'), value: stats.open_jobs, icon: <FileText size={18} /> },
    { label: t('totalApplications'), value: stats.total_applications, icon: <FileText size={18} /> },
  ] : [];

  const thCls = 'px-5 py-3 text-start font-medium text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400';
  const tdCls = 'px-5 py-3';
  const rowCls = (i: number) =>
    cn(
      'transition-colors duration-150 hover:bg-primary-50/40 dark:hover:bg-night-border/30',
      i % 2 === 1 && 'bg-[#FAFAFA] dark:bg-night-bg/50'
    );

  const roleBadge = (role: string) =>
    role === 'admin' ? 'error' : role === 'client' ? 'neutral' : 'success';

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-ink dark:bg-night-card rounded-lg flex items-center justify-center border border-transparent dark:border-night-border">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-white">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: t('overview') },
          { id: 'users', label: t('users') },
          { id: 'jobs', label: t('jobs') },
        ]}
        active={tab}
        onChange={(id) => setTab(id as Tab)}
        className="mb-8"
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      ) : (
        <>
          {tab === 'overview' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statCards.map((stat, i) => (
                <Card key={i} className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-night-border text-ink dark:text-white flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-ink dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                </Card>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-line dark:border-night-border">
                    <tr>
                      {[t('name'), t('email'), t('role'), t('country'), t('joined'), ''].map((h, i) => (
                        <th key={i} className={thCls}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line dark:divide-night-border">
                    {users.map((u, i) => (
                      <tr key={u.id} className={rowCls(i)}>
                        <td className={tdCls}>
                          <div className="flex items-center gap-2">
                            <Avatar src={u.avatar} name={u.name} size="sm" />
                            <span className="font-medium text-ink dark:text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{u.email}</td>
                        <td className={tdCls}><Badge variant={roleBadge(u.role)}>{u.role}</Badge></td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{u.country || '—'}</td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{new Date(u.created_at).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}</td>
                        <td className={tdCls}>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              aria-label={t('userDeleted')}
                              className="p-1.5 rounded-lg text-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-150"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {tab === 'jobs' && (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-line dark:border-night-border">
                    <tr>
                      {[t('title2'), t('client'), t('country'), t('status'), t('posted'), ''].map((h, i) => (
                        <th key={i} className={thCls}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line dark:divide-night-border">
                    {jobs.map((job, i) => (
                      <tr key={job.id} className={rowCls(i)}>
                        <td className={cn(tdCls, 'font-medium text-ink dark:text-white max-w-xs truncate')}>{job.title}</td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{job.client?.name || '—'}</td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{job.country || '—'}</td>
                        <td className={tdCls}><Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{job.status}</Badge></td>
                        <td className={cn(tdCls, 'text-gray-500 dark:text-gray-400')}>{new Date(job.created_at).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}</td>
                        <td className={tdCls}>
                          <button
                            onClick={() => deleteJob(job.id)}
                            aria-label={t('jobDeleted')}
                            className="p-1.5 rounded-lg text-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-150"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
