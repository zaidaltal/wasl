'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Briefcase, Search } from 'lucide-react';
import { jobsApi, categoriesApi } from '@/lib/api';
import { Job, Category, JobFilters } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters as JobFiltersComponent } from '@/components/jobs/JobFilters';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';

const DEFAULT_FILTERS: JobFilters = { search: '', status: 'open' };
const PER_PAGE = 10;

export default function JobsPage() {
  const t = useTranslations('jobs');
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    categoriesApi.getCategories().then((r) => setCategories(r.data?.data || []));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      jobsApi.getJobs({ ...filters, page, per_page: PER_PAGE })
        .then((r) => {
          setJobs(r.data?.data || []);
          setTotal(r.data?.total || 0);
        })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, page]);

  const updateFilters = (next: JobFilters) => {
    setFilters(next);
    setPage(1);
  };

  const submitSearch = () => updateFilters({ ...filters, search: searchInput });

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="page-title">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pageSubtitle', { count: total })}</p>
      </div>

      {/* Prominent search bar */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full ps-11 pe-4 h-12 rounded-xl border border-outline-variant dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-white placeholder:text-muted text-sm shadow-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all duration-150"
          />
        </div>
        <Button size="lg" onClick={submitSearch}>
          {t('search')}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <JobFiltersComponent
          filters={filters}
          categories={categories}
          onChange={updateFilters}
          onReset={() => { setSearchInput(''); updateFilters(DEFAULT_FILTERS); }}
        />

        {/* Single-column job list */}
        <div className="flex-1 w-full min-w-0">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-night-card rounded-card border border-line dark:border-night-border">
              <Briefcase size={48} className="mx-auto text-muted mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noJobs')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {jobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} className="mt-8" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
