'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { jobsApi, categoriesApi } from '@/lib/api';
import { Job, Category, JobFilters } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters as JobFiltersComponent } from '@/components/jobs/JobFilters';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { SearchField } from '@/components/ui/SearchField';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Briefcase } from '@/components/ui/icons';

const PER_PAGE = 10;

export default function JobsPage() {
  const t = useTranslations('jobs');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the source of truth for search, filters, and page, so they survive reloads and can be shared.
  const filters = useMemo<JobFilters>(
    () => ({
      status: 'open',
      search: searchParams.get('search') || '',
      category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
      country: searchParams.get('country') || undefined,
    }),
    [searchParams]
  );
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [total, setTotal] = useState<number | null>(null);

  const pushState = (next: Partial<JobFilters>, nextPage = 1) => {
    const merged = { ...filters, ...next };
    const qs = new URLSearchParams();
    if (merged.search) qs.set('search', merged.search);
    if (merged.category_id) qs.set('category_id', String(merged.category_id));
    if (merged.country) qs.set('country', merged.country);
    if (nextPage > 1) qs.set('page', String(nextPage));
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    categoriesApi.getCategories().then((r) => setCategories(r.data?.data || [])).catch(() => {});
  }, []);

  // Keep the input in sync when the URL changes (back/forward)
  useEffect(() => setSearchInput(filters.search || ''), [filters.search]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setFailed(false);
      jobsApi
        .getJobs({ ...filters, page, per_page: PER_PAGE })
        .then((r) => {
          if (cancelled) return;
          setJobs(r.data?.data || []);
          setTotal(r.data?.total || 0);
        })
        .catch(() => !cancelled && setFailed(true))
        .finally(() => !cancelled && setLoading(false));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters, page, attempt]);

  const reset = () => {
    setSearchInput('');
    router.replace(pathname, { scroll: false });
  };

  const totalPages = Math.max(1, Math.ceil((total || 0) / PER_PAGE));

  return (
    <div className="container-page pb-16">
      <PageHeader
        title={t('pageTitle')}
        subtitle={
          total === null ? <Skeleton className="mt-1 h-5 w-48" /> : <span className="num">{t('pageSubtitle', { count: total })}</span>
        }
      />

      <div className="mb-10 max-w-3xl animate-fade-up [animation-delay:150ms]">
        <SearchField
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => pushState({ search: searchInput.trim() })}
          onClear={() => {
            setSearchInput('');
            pushState({ search: '' });
          }}
          placeholder={t('searchPlaceholder')}
          buttonLabel={t('search')}
        />
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-10">
        <JobFiltersComponent filters={filters} categories={categories} onChange={(next) => pushState(next)} onReset={reset} />

        <div className="w-full min-w-0 flex-1" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : failed ? (
            <EmptyState
              icon={Briefcase}
              title={t('loadError')}
              action={
                <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
                  {t('retry')}
                </Button>
              }
            />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={t('noJobs')}
              hint={t('noJobsHint')}
              action={
                <Button variant="secondary" onClick={reset}>
                  {t('clearAll')}
                </Button>
              }
            />
          ) : (
            <>
              <div className="space-y-3">
                {jobs.map((job, i) => (
                  <div key={job.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <JobCard job={job} headingLevel={2} />
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  pushState({}, p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
