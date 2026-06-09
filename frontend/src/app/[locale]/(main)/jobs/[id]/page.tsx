'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, DollarSign, Briefcase, Clock, Users, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-2/3" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!job) return null;

  const categoryName = locale === 'ar' ? job.category?.name_ar : job.category?.name_en;
  const clientName = job.client?.client_profile?.company_name || job.client?.name || '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <Badge variant={job.status === 'open' ? 'success' : 'default'}>{t(job.status)}</Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
              {categoryName && <span className="flex items-center gap-1"><Briefcase size={14} />{categoryName}</span>}
              {job.country && <span className="flex items-center gap-1"><MapPin size={14} />{job.country}</span>}
              {job.budget && <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"><DollarSign size={14} />{formatCurrency(job.budget, locale)}</span>}
              <span className="flex items-center gap-1"><Clock size={14} />{formatDate(job.created_at, locale)}</span>
              {job.applications_count !== undefined && (
                <span className="flex items-center gap-1"><Users size={14} />{t('applicants', { count: job.applications_count })}</span>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{t('description')}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client info */}
          <Card className="p-5">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('postedBy')}</h4>
            <div className="flex items-center gap-3">
              <Avatar src={job.client?.avatar} name={clientName || 'C'} size="md" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{clientName}</p>
                {job.client?.country && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />{job.client.country}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Apply */}
          {job.status === 'open' && (
            <Card className="p-5">
              {user?.role === 'freelancer' ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('applyPrompt')}</p>
                  <Button className="w-full" onClick={() => setApplyOpen(true)}>
                    <Send size={16} />
                    {t('applyBtn')}
                  </Button>
                </>
              ) : user?.role === 'client' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t('clientCannotApply')}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('loginToApply')}</p>
                  <Button className="w-full" onClick={() => router.push(`/${locale}/login`)}>
                    {t('loginBtn')}
                  </Button>
                </>
              )}
            </Card>
          )}
        </div>
      </div>

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
