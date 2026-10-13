'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { jobsApi, applicationsApi } from '@/lib/api';
import { Job, Application } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Briefcase, Eye, Plus, Trash, Users } from '@/components/ui/icons';
import { DashboardHeader, StatTile } from '@/components/dashboard/DashboardHeader';
import { useConfirm } from '@/components/ui/useConfirm';
import { formatDate } from '@/lib/utils';

export default function ClientDashboard() {
  const t = useTranslations('dashboard');
  const tJobs = useTranslations('jobs');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [postOpen, setPostOpen] = useState(false);
  const [viewApplicantsJob, setViewApplicantsJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [confirm, confirmDialog] = useConfirm();

  const [form, setForm] = useState({ title: '', description: '', budget: '', country: '', category_id: '' });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${locale}/login`);
      return;
    }
    if (user && user.role !== 'client') {
      router.push(`/${locale}`);
      return;
    }
    if (user) loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Arriving from onboarding's "Post your first job" opens the job form straight away
  useEffect(() => {
    if (user?.role === 'client' && searchParams.get('post') === '1') {
      setPostOpen(true);
      router.replace(pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadJobs = () => {
    setLoading(true);
    jobsApi
      .getJobs({ client_id: user?.id })
      .then((r) => setJobs(r.data?.data || []))
      .catch(() => toast.error(t('actionError')))
      .finally(() => setLoading(false));
  };

  const handlePost = async () => {
    setSaving(true);
    try {
      await jobsApi.createJob({
        title: form.title,
        description: form.description,
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
    if (!(await confirm(t('confirmDelete')))) return;
    try {
      await jobsApi.deleteJob(id);
      toast.success(t('jobDeleted'));
      loadJobs();
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('actionError'));
    }
  };

  const viewApplicants = async (job: Job) => {
    setViewApplicantsJob(job);
    setApplicantsLoading(true);
    try {
      const res = await jobsApi.getApplicants(job.id);
      setApplicants(res.data?.data || []);
    } catch {
      toast.error(t('actionError'));
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleApplicationStatus = async (appId: number, status: string) => {
    try {
      await applicationsApi.updateStatus(appId, status);
      toast.success(status === 'accepted' ? t('appAccepted') : t('appRejected'));
      if (viewApplicantsJob) viewApplicants(viewApplicantsJob);
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('actionError'));
    }
  };

  if (!user) return null;

  const stats = [
    { label: t('totalJobs'), value: jobs.length, icon: <Briefcase size={18} /> },
    { label: t('openJobs'), value: jobs.filter((j) => j.status === 'open').length, icon: <Plus size={18} /> },
    { label: t('totalApplicants'), value: jobs.reduce((s, j) => s + (j.applications_count || 0), 0), icon: <Users size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        name={user.name}
        avatar={user.avatar}
        title={t('hello', { name: user.name })}
        subtitle={t('clientDashboard')}
        actions={
          <Button arrow onClick={() => setPostOpen(true)} className="pe-3">
            {t('postJob')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s, i) => (
          <StatTile key={s.label} {...s} emphasis={i === 0} delay={i + 1} />
        ))}
      </div>

      <section className="shell animate-fade-up [animation-delay:240ms]">
        <div className="core overflow-hidden">
          <div className="flex items-center justify-between px-6 pb-4 pt-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink">{t('myJobs')}</h2>
            {jobs.length > 0 && <span className="num text-sm text-muted">{jobs.length}</span>}
          </div>

          {loading ? (
            <div className="space-y-3 px-6 pb-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Briefcase}
                title={t('noJobs')}
                action={
                  <Button size="sm" onClick={() => setPostOpen(true)}>
                    {t('postJob')}
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-line border-t border-line">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="flex flex-col gap-3 px-6 py-4 transition-colors duration-200 hover:bg-sunken/50 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/${locale}/jobs/${job.id}`}
                      className="block truncate font-semibold text-ink transition-colors hover:text-accent"
                    >
                      {job.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{formatDate(job.created_at, locale)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{tJobs(job.status)}</Badge>
                    <span className="num inline-flex min-w-[4.5rem] items-center gap-1.5 text-sm text-ink-soft">
                      <Users size={15} aria-hidden />
                      {job.applications_count || 0}
                    </span>
                    <div className="ms-auto flex items-center gap-1 sm:ms-0">
                      <button
                        onClick={() => viewApplicants(job)}
                        aria-label={`${t('applicants')}: ${job.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-accent-strong"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        aria-label={`Delete ${job.title}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                      >
                        <Trash size={17} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Modal open={postOpen} onClose={() => setPostOpen(false)} title={t('postJobTitle')} size="lg">
        <div className="space-y-5">
          <Input label={t('jobTitle')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea
            label={t('jobDescription')}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label={t('budget')}
              type="number"
              inputMode="numeric"
              placeholder="USD"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
            <Input label={t('country')} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setPostOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handlePost} loading={saving}>
              {t('postJobBtn')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewApplicantsJob} onClose={() => setViewApplicantsJob(null)} title={viewApplicantsJob?.title} size="lg">
        {applicantsLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <EmptyState icon={Users} title={t('noApplicants')} className="py-10" />
        ) : (
          <ul className="space-y-2">
            {applicants.map((app) => (
              <li
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl bg-sunken/60 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar src={app.freelancer?.avatar} name={app.freelancer?.name || 'F'} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{app.freelancer?.name}</p>
                    {app.cover_letter && <p className="line-clamp-2 max-w-sm text-xs text-muted">{app.cover_letter}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'error' : 'warning'}>
                    {t(app.status)}
                  </Badge>
                  {app.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => handleApplicationStatus(app.id, 'accepted')}>
                        {t('accept')}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleApplicationStatus(app.id, 'rejected')}>
                        {t('reject')}
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
      {confirmDialog}
    </div>
  );
}
