'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { freelancersApi } from '@/lib/api';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { UsersThree } from '@/components/ui/icons';
import { COUNTRIES, cn } from '@/lib/utils';

export default function FreelancersPage() {
  const t = useTranslations('freelancers');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search and country live in the URL so results can be reloaded and shared.
  const search = searchParams.get('search') || '';
  const country = searchParams.get('country') || '';

  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [searchInput, setSearchInput] = useState(search);

  const pushState = (next: { search?: string; country?: string }) => {
    const merged = { search, country, ...next };
    const qs = new URLSearchParams();
    if (merged.search) qs.set('search', merged.search);
    if (merged.country) qs.set('country', merged.country);
    const query = qs.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    freelancersApi
      .search({ search: search || undefined, country: country || undefined })
      .then((r) => !cancelled && setFreelancers(r.data?.data || []))
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [search, country, attempt]);

  const reset = () => {
    setSearchInput('');
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="container-page pb-16">
      <PageHeader title={t('pageTitle')} subtitle={t('pageSubtitle')} />

      <div className="mb-6 max-w-3xl animate-fade-up [animation-delay:150ms]">
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

      {/* Country chips: horizontal scroll on small screens */}
      <div className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 animate-fade-up [animation-delay:200ms] sm:mx-0 sm:flex-wrap sm:px-0">
        {COUNTRIES.slice(0, 9).map((c) => {
          const active = country === c.value;
          return (
            <button
              key={c.value}
              onClick={() => pushState({ country: active ? '' : c.value })}
              aria-pressed={active}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-[background-color,color,box-shadow] duration-300 ease-fluid active:scale-[0.97]',
                active ? 'bg-ink text-canvas ring-ink' : 'bg-surface text-ink-soft ring-line hover:text-ink hover:ring-ink/30'
              )}
            >
              {locale === 'ar' ? c.label_ar : c.label_en}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : failed ? (
          <EmptyState
            icon={UsersThree}
            title={t('loadError')}
            action={
              <Button variant="secondary" onClick={() => setAttempt((n) => n + 1)}>
                {t('retry')}
              </Button>
            }
          />
        ) : freelancers.length === 0 ? (
          <EmptyState
            icon={UsersThree}
            title={t('noFreelancers')}
            hint={t('noFreelancersHint')}
            action={
              <Button variant="secondary" onClick={reset}>
                {t('reset')}
              </Button>
            }
          />
        ) : (
          <>
            <p className="num mb-5 text-sm font-medium text-muted">{t('results', { count: freelancers.length })}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {freelancers.map((f, i) => (
                <div key={f.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <FreelancerCard user={f} headingLevel={2} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
