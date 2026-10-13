'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { ArrowLeft, Clock, MapPin, ShareNetwork, Users } from '@/components/ui/icons';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function JobDetailPage({ params }: { params: { id: string; locale: string } }) {
  const t = useTranslations('jobs');
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    jobsApi
      .getJob(Number(params.id))
      .then((r) => setJob(r.data?.data))
      .catch(() => router.push(`/${locale}/jobs`))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleApply = async () => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    setApplying(true);
    try {
      await jobsApi.applyToJob(Number(params.id), { cover_letter: coverLetter });
      toast.success(t('applySuccess'));
      setApplyOpen(false);
      setCoverLetter('');
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('applyError'));
    } finally {
      setApplying(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: job?.title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t('linkCopied'));
    }
  };

  const backLink = (
    <Link
      href={`/${locale}/jobs`}
      className="group inline-flex items-center gap-2 rounded-full bg-surface py-2 pe-4 ps-2 text-sm font-semibold text-ink-soft ring-1 ring-line transition-colors duration-300 hover:text-ink hover:ring-ink/25"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sunken transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5">
        <ArrowLeft size={14} weight="bold" className="rtl:-scale-x-100" />
      </span>
      {t('back')}
    </Link>
  );

  if (loading) {
    return (
      <div className="container-page pb-16 pt-32 sm:pt-36" aria-busy>
        <Skeleton className="mb-8 h-11 w-32 rounded-full" />
        <Skeleton className="mb-4 h-4 w-48" />
        <Skeleton className="mb-12 h-12 w-3/4" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="shell">
            <div className="core p-8">
              <SkeletonText lines={8} />
            </div>
          </div>
          <div className="shell">
            <div className="core p-8">
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';
  const budget = Number(job.budget);

  const meta = [
    job.country && { icon: MapPin, label: job.country },
    { icon: Clock, label: formatDate(job.created_at, locale) },
    job.applications_count !== undefined && { icon: Users, label: t('applicants', { count: job.applications_count }) },
  ].filter(Boolean) as { icon: typeof MapPin; label: string }[];

  return (
    <div className="container-page pb-16 pt-32 sm:pt-36">
      <div className="animate-fade-up">{backLink}</div>

      <header className="mt-10 max-w-4xl animate-fade-up [animation-delay:80ms]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{t(job.status)}</Badge>
          {categoryName && <Badge variant="neutral">{categoryName}</Badge>}
        </div>
        <h1 className="display mt-5 text-4xl text-ink sm:text-5xl">{job.title}</h1>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {clientName && <li className="font-semibold text-ink-soft">{clientName}</li>}
          {meta.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon size={15} aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-10">
        <div className="space-y-6 animate-fade-up [animation-delay:160ms]">
          <section className="shell">
            <div className="core p-7 sm:p-10">
              <h2 className="text-xl font-semibold tracking-tight text-ink">{t('description')}</h2>
              <p className="mt-5 whitespace-pre-wrap text-base leading-[1.8] text-ink-soft">{job.description}</p>
            </div>
          </section>

          <section className="rounded-shell bg-sunken/70 p-7 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight text-ink">{t('aboutClient')}</h2>
            <div className="mt-6 flex items-center gap-4">
              <Avatar src={job.client?.avatar} name={clientName || 'C'} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{clientName}</p>
                {job.client?.country && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <MapPin size={13} aria-hidden />
                    {job.client.country}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="shell animate-fade-up [animation-delay:240ms] lg:sticky lg:top-28">
          <div className="core p-7">
            <p className="text-[13px] font-semibold text-muted">{t('budgetLabel')}</p>
            <p className="num display mt-2 text-4xl text-ink">{budget > 0 ? formatCurrency(budget, locale) : '-'}</p>
            {budget > 0 && <p className="mt-1 text-sm text-muted">{t('budgetFixed')}</p>}

            <dl className="mt-7 grid grid-cols-2 gap-4 rounded-2xl bg-sunken/70 p-4">
              <div>
                <dt className="text-xs text-muted">{t('postedLabel')}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{formatDate(job.created_at, locale)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">{t('status')}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{t(job.status)}</dd>
              </div>
            </dl>

            <div className="mt-7 space-y-3">
              {job.status === 'open' &&
                (user?.role === 'freelancer' ? (
                  <Button size="lg" fullWidth arrow onClick={() => setApplyOpen(true)} className="pe-3">
                    {t('applyBtn')}
                  </Button>
                ) : user?.role === 'client' ? (
                  <p className="rounded-2xl bg-sunken/70 px-4 py-3 text-center text-sm text-muted">{t('clientCannotApply')}</p>
                ) : (
                  <Button size="lg" fullWidth arrow onClick={() => router.push(`/${locale}/login`)} className="pe-3">
                    {t('loginBtn')}
                  </Button>
                ))}
              <Button variant="secondary" size="lg" fullWidth onClick={handleShare}>
                <ShareNetwork size={17} aria-hidden />
                {t('share')}
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={t('applyModal')}>
        <div className="space-y-5">
          <p className="text-sm text-muted">{job.title}</p>
          <Textarea
            label={t('coverLetter')}
            placeholder={t('coverLetterPlaceholder')}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleApply} loading={applying}>
              {t('submitApplication')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
