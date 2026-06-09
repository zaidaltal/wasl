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
import { Button } from '@/components/ui/Button';

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
    { label: t('totalUsers'), value: stats.total_users, icon: <Users size={20} />, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: t('freelancers'), value: stats.total_freelancers, icon: <TrendingUp size={20} />, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    { label: t('clients'), value: stats.total_clients, icon: <Shield size={20} />, color: 'text-gold-600 bg-yellow-100 dark:bg-yellow-900/30' },
    { label: t('totalJobs'), value: stats.total_jobs, icon: <Briefcase size={20} />, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { label: t('openJobs'), value: stats.open_jobs, icon: <FileText size={20} />, color: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30' },
    { label: t('totalApplications'), value: stats.total_applications, icon: <FileText size={20} />, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
  ] : [];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: t('overview') },
    { id: 'users', label: t('users') },
    { id: 'jobs', label: t('jobs') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8 w-fit">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === tb.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {statCards.map((stat, i) => (
                  <Card key={i} className="p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
                  </Card>
                ))}
              </div>
            )}

            {tab === 'users' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                      <tr>
                        {[t('name'), t('email'), t('role'), t('country'), t('joined'), ''].map((h, i) => (
                          <th key={i} className="px-5 py-3 text-start font-medium text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar src={u.avatar} name={u.name} size="sm" />
                              <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                          <td className="px-5 py-3"><Badge variant={u.role === 'admin' ? 'danger' : u.role === 'client' ? 'info' : 'success'}>{u.role}</Badge></td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{u.country || '—'}</td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            {u.role !== 'admin' && (
                              <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-600 transition-colors">
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
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                      <tr>
                        {[t('title'), t('client'), t('country'), t('status'), t('posted'), ''].map((h, i) => (
                          <th key={i} className="px-5 py-3 text-start font-medium text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900 dark:text-white max-w-xs truncate">{job.title}</td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{job.client?.name || '—'}</td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{job.country || '—'}</td>
                          <td className="px-5 py-3"><Badge variant={job.status === 'open' ? 'success' : 'default'}>{job.status}</Badge></td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{new Date(job.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3">
                            <button onClick={() => deleteJob(job.id)} className="text-red-400 hover:text-red-600 transition-colors">
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
    </div>
  );
}
