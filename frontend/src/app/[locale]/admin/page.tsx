'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/lib/api';
import { AdminStats, User, Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/dashboard/DashboardHeader';
import { useConfirm } from '@/components/ui/useConfirm';
import { Briefcase, FileText, ShieldCheck, Trash, TrendUp, Users, UsersThree } from '@/components/ui/icons';

type Tab = 'overview' | 'users' | 'jobs';

export default function AdminPage() {
  const t = useTranslations('admin');
  const tJobs = useTranslations('jobs');
  const tRoles = useTranslations('roles');
  const tDash = useTranslations('dashboard');
  const [confirm, confirmDialog] = useConfirm();
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }
    if (user && user.role !== 'admin') {
      router.push(`/${locale}`);
      return;
    }
    if (user) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const loadData = async () => {
    setLoading(true);
    const [statsRes, usersRes, jobsRes] = await Promise.allSettled([adminApi.getStats(), adminApi.getUsers(), adminApi.getJobs()]);
    if (statsRes.status === 'fulfilled') setStats(statsRes.value.data?.data);
    if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data?.data || []);
    if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data?.data || []);
    setLoading(false);
  };

  const deleteUser = async (id: number) => {
    if (!(await confirm(t('confirmDelete')))) return;
    try {
      await adminApi.deleteUser(id);
      toast.success(t('userDeleted'));
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      toast.error(e.response?.data?.error || tDash('actionError'));
    }
  };

  const deleteJob = async (id: number) => {
    if (!(await confirm(t('confirmDelete')))) return;
    try {
      await adminApi.deleteJob(id);
      toast.success(t('jobDeleted'));
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e: any) {
      toast.error(e.response?.data?.error || tDash('actionError'));
    }
  };

  if (!user || user.role !== 'admin') return null;

  const statCards = stats
    ? [
        { label: t('totalUsers'), value: stats.total_users, icon: <Users size={18} /> },
        { label: t('freelancers'), value: stats.total_freelancers, icon: <TrendUp size={18} /> },
        { label: t('clients'), value: stats.total_clients, icon: <ShieldCheck size={18} /> },
        { label: t('totalJobs'), value: stats.total_jobs, icon: <Briefcase size={18} /> },
        { label: t('openJobs'), value: stats.open_jobs, icon: <FileText size={18} /> },
        { label: t('totalApplications'), value: stats.total_applications, icon: <UsersThree size={18} /> },
      ]
    : [];

  const date = (d: string) => new Date(d).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US');
  const th = 'px-5 py-3 text-start text-xs font-semibold text-muted';
  const td = 'px-5 py-3.5';
  const roleBadge = (role: string) => (role === 'admin' ? 'error' : role === 'client' ? 'neutral' : 'success');
  const deleteBtn =
    'flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger';

  return (
    <div className="container-page pb-16">
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

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
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-shell" />
          ))}
        </div>
      ) : (
        <>
          {tab === 'overview' && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {statCards.map((s, i) => (
                <StatTile key={s.label} {...s} emphasis={i === 0} delay={i} />
              ))}
            </div>
          )}

          {tab !== 'overview' && (
            <div className="shell animate-fade-up">
              <div className="core overflow-hidden">
                <div className="overflow-x-auto">
                  {tab === 'users' ? (
                    <table className="w-full text-sm">
                      <thead className="border-b border-line bg-sunken/50">
                        <tr>
                          {[t('name'), t('email'), t('role'), t('country'), t('joined')].map((h) => (
                            <th key={h} className={th}>
                              {h}
                            </th>
                          ))}
                          <th className={th}>
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {users.map((u) => (
                          <tr key={u.id} className="transition-colors duration-200 hover:bg-sunken/40">
                            <td className={td}>
                              <div className="flex items-center gap-3">
                                <Avatar src={u.avatar} name={u.name} size="sm" />
                                <span className="font-semibold text-ink">{u.name}</span>
                              </div>
                            </td>
                            <td className={`${td} text-ink-soft`}>{u.email}</td>
                            <td className={td}>
                              <Badge variant={roleBadge(u.role)}>
                                {tRoles(u.role)}
                              </Badge>
                            </td>
                            <td className={`${td} text-ink-soft`}>{u.country || '-'}</td>
                            <td className={`num ${td} text-muted`}>{date(u.created_at)}</td>
                            <td className={`${td} text-end`}>
                              {u.role !== 'admin' && (
                                <button onClick={() => deleteUser(u.id)} aria-label={`Delete ${u.name}`} className={deleteBtn}>
                                  <Trash size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="border-b border-line bg-sunken/50">
                        <tr>
                          {[t('title2'), t('client'), t('country'), t('status'), t('posted')].map((h) => (
                            <th key={h} className={th}>
                              {h}
                            </th>
                          ))}
                          <th className={th}>
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {jobs.map((job) => (
                          <tr key={job.id} className="transition-colors duration-200 hover:bg-sunken/40">
                            <td className={`${td} max-w-xs truncate font-semibold text-ink`}>{job.title}</td>
                            <td className={`${td} text-ink-soft`}>{job.client?.name || '-'}</td>
                            <td className={`${td} text-ink-soft`}>{job.country || '-'}</td>
                            <td className={td}>
                              <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>
                                {tJobs(job.status)}
                              </Badge>
                            </td>
                            <td className={`num ${td} text-muted`}>{date(job.created_at)}</td>
                            <td className={`${td} text-end`}>
                              <button onClick={() => deleteJob(job.id)} aria-label={`Delete ${job.title}`} className={deleteBtn}>
                                <Trash size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {confirmDialog}
    </div>
  );
}
