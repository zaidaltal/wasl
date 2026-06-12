'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, PlusCircle, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Job, Application } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function ClientDashboard() {
  const t = useTranslations('dashboard');
  const tJobs = useTranslations('jobs');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [postOpen, setPostOpen] = useState(false);
  const [viewApplicantsJob, setViewApplicantsJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: '', description: '', budget: '', country: '', category_id: '' });

  useEffect(() => {
    if (!isLoading && !user) { router.push(`/${locale}/login`); return; }
    if (user && user.role !== 'client') { router.push(`/${locale}`); return; }
    if (user) loadJobs();
  }, [user, isLoading]);

  const loadJobs = () => {
    setLoading(true);
    jobsApi.getJobs({ client_id: user?.id })
      .then((r) => setJobs(r.data?.data || []))
      .finally(() => setLoading(false));
  };

  const handlePost = async () => {
    setSaving(true);
    try {
      await jobsApi.createJob({
        title: form.title, description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
        country: form.country,
      });
      toast.success(t('jobPosted'));
      setPostOpen(false);
      setForm({ title: '', description: '', budget: '', country: '', category_id: '' });
      loadJobs();
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('jobPostError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    await jobsApi.deleteJob(id);
    toast.success(t('jobDeleted'));
    loadJobs();
  };

  const viewApplicants = async (job: Job) => {
    setViewApplicantsJob(job);
    const res = await jobsApi.getApplicants(job.id);
    setApplicants(res.data?.data || []);
  };

  const handleApplicationStatus = async (appId: number, status: string) => {
    await applicationsApi.updateStatus(appId, status);
    toast.success(status === 'accepted' ? t('appAccepted') : t('appRejected'));
    if (viewApplicantsJob) viewApplicants(viewApplicantsJob);
  };

  if (!user) return null;

  const statCards = [
    { label: t('totalJobs'), value: jobs.length, icon: <Briefcase size={18} />, accent: 'border-primary-600', iconColor: 'text-primary-600', caption: t('clientDashboard') },
    { label: t('openJobs'), value: jobs.filter((j) => j.status === 'open').length, icon: <PlusCircle size={18} />, accent: 'border-success-600', iconColor: 'text-success-600', caption: t('myJobs') },
    { label: t('totalApplicants'), value: jobs.reduce((s, j) => s + (j.applications_count || 0), 0), icon: <Users size={18} />, accent: 'border-ink dark:border-white', iconColor: 'text-ink dark:text-white', caption: t('applicants') },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-ink dark:text-white">{t('hello', { name: user.name })}</h1>
            <p className="text-text-muted dark:text-gray-400 text-sm">{t('clientDashboard')}</p>
          </div>
        </div>
        <button
          onClick={() => setPostOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg active:scale-95 transition-all"
        >
          <PlusCircle size={16} /> {t('postJob')}
        </button>
      </div>

      {/* Stats — bento cards with colored bottom borders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-night-card p-6 rounded-xl shadow-card border-b-4 ${stat.accent} hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              <span className={stat.iconColor}>{stat.icon}</span>
            </div>
            <p className="text-5xl font-bold tracking-tight text-ink dark:text-white leading-none mt-3">{stat.value}</p>
            <p className="text-xs text-text-muted mt-3">{stat.caption}</p>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="bg-white dark:bg-night-card rounded-xl shadow-card border border-outline-variant/50 dark:border-night-border overflow-hidden">
        <div className="px-6 py-5 border-b border-line dark:border-night-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink dark:text-white">{t('myJobs')}</h2>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={40} className="mx-auto text-muted mb-3" />
            <p className="text-text-muted dark:text-gray-400">{t('noJobs')}</p>
            <Button size="sm" className="mt-4" onClick={() => setPostOpen(true)}>{t('postJob')}</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-surface-container-low dark:bg-night-bg/50">
                <tr className="text-start">
                  <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-start">{t('jobTitle')}</th>
                  <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">{t('status')}</th>
                  <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-center">{t('applicants')}</th>
                  <th className="px-6 py-3 text-xs font-bold text-text-muted uppercase tracking-wider text-end" aria-label="actions"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-night-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-container/60 dark:hover:bg-night-border/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/jobs/${job.id}`}
                        className="font-bold text-ink dark:text-white hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors block truncate max-w-xs"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">{formatDate(job.created_at, locale)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{tJobs(job.status)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-ink dark:text-white text-sm">
                      {job.applications_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => viewApplicants(job)}
                          aria-label={t('noApplicants')}
                          className="p-2 text-text-muted hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          aria-label={t('jobDeleted')}
                          className="p-2 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error-container/40 dark:hover:bg-error/10"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <Modal open={postOpen} onClose={() => setPostOpen(false)} title={t('postJobTitle')} size="lg">
        <div className="space-y-4">
          <Input label={t('jobTitle')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label={t('jobDescription')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('budget')} type="number" placeholder="USD" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            <Input label={t('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" onClick={() => setPostOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handlePost} loading={saving}>{t('postJobBtn')}</Button>
          </div>
        </div>
      </Modal>

      {/* Applicants Modal */}
      <Modal open={!!viewApplicantsJob} onClose={() => setViewApplicantsJob(null)} title={viewApplicantsJob?.title} size="lg">
        {applicants.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">{t('noApplicants')}</div>
        ) : (
          <ul className="space-y-3">
            {applicants.map((app) => (
              <li key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-ivory dark:bg-night-bg rounded-card border border-line dark:border-night-border">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={app.freelancer?.avatar} name={app.freelancer?.name || 'F'} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-white truncate">{app.freelancer?.name}</p>
                    {app.cover_letter && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{app.cover_letter}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'error' : 'warning'}>
                    {t(app.status)}
                  </Badge>
                  {app.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleApplicationStatus(app.id, 'accepted')}>{t('accept')}</Button>
                      <Button size="sm" variant="danger" onClick={() => handleApplicationStatus(app.id, 'rejected')}>{t('reject')}</Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
