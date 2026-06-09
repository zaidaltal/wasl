'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Briefcase } from 'lucide-react';
import { jobsApi, categoriesApi } from '@/lib/api';
import { Job, Category, JobFilters } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters as JobFiltersComponent } from '@/components/jobs/JobFilters';

const DEFAULT_FILTERS: JobFilters = { search: '', status: 'open' };

export default function JobsPage() {
  const t = useTranslations('jobs');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    categoriesApi.getCategories().then((r) => setCategories(r.data?.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      jobsApi.getJobs(filters)
        .then((r) => {
          setJobs(r.data?.data || []);
          setTotal(r.data?.total || 0);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pageSubtitle', { count: total })}</p>
      </div>

      <div className="mb-6">
        <JobFiltersComponent
          filters={filters}
          categories={categories}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noJobs')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}
