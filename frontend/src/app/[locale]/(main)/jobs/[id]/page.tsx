'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Briefcase, Clock, Users, Send, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
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
    jobsApi.getJob(Number(params.id))
      .then((r) => setJob(r.data?.data))
      .catch(() => router.push(`/${locale}/jobs`))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleApply = async () => {
    if (!user) { router.push(`/${locale}/login`); return; }
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
      try { await navigator.share({ title: job?.title, url }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t('linkCopied'));
    }
  };

  if (loading) {
    return (
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <SkeletonText lines={6} />
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <SkeletonText lines={3} />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-text-muted text-sm mb-6 flex-wrap" aria-label="Breadcrumb">
        <button onClick={() => router.push(`/${locale}/jobs`)} className="hover:text-primary-600 transition-colors">
          {t('pageTitle')}
        </button>
        {categoryName && (
          <>
            <span aria-hidden>›</span>
            <span>{categoryName}</span>
          </>
        )}
        <span aria-hidden>›</span>
        <span className="text-ink dark:text-white font-medium truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Main content */}
        <section className="space-y-8">
          {/* Job header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-[2rem] font-bold leading-tight text-ink dark:text-white">{job.title}</h1>
              <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>{t(job.status)}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-sm">
              {clientName && (
                <span className="flex items-center gap-1.5 font-medium text-ink dark:text-white">
                  <Briefcase size={16} className="text-primary-600" />
                  {clientName}
                </span>
              )}
              {job.country && (
                <span className="flex items-center gap-1.5 text-text-muted">
                  <MapPin size={16} className="text-primary-600" />
                  {job.country}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-text-muted">
                <Clock size={16} className="text-primary-600" />
                {formatDate(job.created_at, locale)}
              </span>
              {job.applications_count !== undefined && (
                <span className="flex items-center gap-1.5 text-text-muted">
                  <Users size={16} className="text-primary-600" />
                  {t('applicants', { count: job.applications_count })}
                </span>
              )}
            </div>
          </div>

          <hr className="border-outline-variant dark:border-night-border" />

          {/* Description */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-ink dark:text-white">{t('description')}</h2>
            <p className="text-text-secondary dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
              {job.description}
            </p>
          </div>

          {/* Category chip */}
          {categoryName && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-ink dark:text-white">{t('category')}</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-secondary-container text-on-secondary-fixed-variant rounded-full text-sm font-medium">
                  {categoryName}
                </span>
              </div>
            </div>
          )}

          {/* About the client — patterned card */}
          <div className="p-8 bg-surface-container dark:bg-night-card rounded-xl border border-outline-variant dark:border-night-border relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-xl font-bold text-ink dark:text-white">{t('aboutClient')}</h2>
              <div className="flex items-center gap-4">
                <Avatar src={job.client?.avatar} name={clientName || 'C'} size="lg" />
                <div className="min-w-0">
                  <p className="font-bold text-ink dark:text-white truncate">{clientName}</p>
                  {job.client?.country && (
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={12} />
                      {job.client.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          {/* Budget + Apply card */}
          <div className="bg-white dark:bg-night-card rounded-xl shadow-card border border-outline-variant dark:border-night-border p-8 space-y-5">
            {job.budget && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('budgetLabel')}</span>
                <div className="text-2xl font-bold text-ink dark:text-white">
                  {formatCurrency(job.budget, locale)}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between py-4 border-y border-outline-variant dark:border-night-border">
              <div>
                <div className="text-xs text-text-muted">{t('postedLabel')}</div>
                <div className="font-bold text-sm text-ink dark:text-white mt-0.5">{formatDate(job.created_at, locale)}</div>
              </div>
              <div className="text-end">
                <div className="text-xs text-text-muted">{t('status')}</div>
                <div className="font-bold text-sm text-ink dark:text-white mt-0.5">{t(job.status)}</div>
              </div>
            </div>

            {job.status === 'open' && (
              user?.role === 'freelancer' ? (
                <button
                  onClick={() => setApplyOpen(true)}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {t('applyBtn')}
                  <Send size={18} />
                </button>
              ) : user?.role === 'client' ? (
                <p className="text-sm text-text-muted text-center py-2">{t('clientCannotApply')}</p>
              ) : (
                <button
                  onClick={() => router.push(`/${locale}/login`)}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  {t('loginBtn')}
                </button>
              )
            )}
            <button
              onClick={handleShare}
              className="w-full border border-ink dark:border-white text-ink dark:text-white py-3 rounded-lg font-bold text-sm hover:bg-surface-container dark:hover:bg-night-border transition-colors flex items-center justify-center gap-2"
            >
              <Share2 size={15} />
              {t('share')}
            </button>
          </div>

          {/* Posted-by card */}
          <div className="bg-white dark:bg-night-card rounded-xl shadow-card border border-outline-variant dark:border-night-border p-8 flex flex-col items-center text-center space-y-4">
            <Avatar src={job.client?.avatar} name={clientName || 'C'} size="lg" />
            <div>
              <h3 className="text-lg font-bold text-ink dark:text-white">{clientName}</h3>
              <p className="text-text-muted text-sm">{t('postedBy')}</p>
            </div>
            {job.client?.country && (
              <div className="w-full pt-3 border-t border-outline-variant dark:border-night-border flex items-center justify-center gap-1.5 text-sm text-text-muted">
                <MapPin size={14} />
                {job.client.country}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Apply modal */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title={t('applyModal')}>
        <div className="space-y-4">
          <Textarea
            label={t('coverLetter')}
            placeholder={t('coverLetterPlaceholder')}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleApply} loading={applying}>{t('submitApplication')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
