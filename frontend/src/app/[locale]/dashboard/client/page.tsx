'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Job, Application } from '@/types';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { formatDate, formatCurrency } from '@/lib/utils';

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('hello', { name: user.name })}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('clientDashboard')}</p>
          </div>
        </div>
        <Button onClick={() => setPostOpen(true)}>
          <PlusCircle size={16} /> {t('postJob')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: t('totalJobs'), value: jobs.length, icon: <Briefcase size={18} />, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: t('openJobs'), value: jobs.filter((j) => j.status === 'open').length, icon: <PlusCircle size={18} />, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
          { label: t('totalApplicants'), value: jobs.reduce((s, j) => s + (j.applications_count || 0), 0), icon: <Users size={18} />, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
        ].map((stat, i) => (
          <Card key={i} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Jobs */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">{t('myJobs')}</h2>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...Array(3)].map((_, i) => <div key={i} className="h-16 animate-pulse bg-gray-50 dark:bg-gray-700/20" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">{t('noJobs')}</p>
              <Button size="sm" className="mt-4" onClick={() => setPostOpen(true)}>{t('postJob')}</Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {jobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/${locale}/jobs/${job.id}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 text-sm truncate">
                        {job.title}
                      </Link>
                      <Badge variant={job.status === 'open' ? 'success' : 'default'}>{tJobs(job.status)}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDate(job.created_at, locale)} · {job.applications_count || 0} {t('applicants')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => viewApplicants(job)} className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      {/* Post Job Modal */}
      <Modal open={postOpen} onClose={() => setPostOpen(false)} title={t('postJobTitle')} size="lg">
        <div className="space-y-4">
          <Input label={t('jobTitle')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label={t('jobDescription')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} />
          <div className="grid grid-cols-2 gap-4">
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
              <li key={app.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Avatar src={app.freelancer?.avatar} name={app.freelancer?.name || 'F'} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{app.freelancer?.name}</p>
                    {app.cover_letter && <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{app.cover_letter}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>{t(app.status)}</Badge>
                  {app.status === 'pending' && (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => handleApplicationStatus(app.id, 'accepted')}>{t('accept')}</Button>
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
