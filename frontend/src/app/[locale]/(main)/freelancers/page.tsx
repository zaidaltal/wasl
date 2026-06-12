'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Users, Search } from 'lucide-react';
import { freelancersApi } from '@/lib/api';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { Button } from '@/components/ui/Button';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { COUNTRIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function FreelancersPage() {
  const t = useTranslations('freelancers');
  const locale = useLocale();

  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  const load = (s = search, c = country) => {
    setLoading(true);
    freelancersApi.getFeatured()
      .then((r) => {
        let data = r.data?.data || [];
        if (s) data = data.filter((f: any) => f.name.toLowerCase().includes(s.toLowerCase()) || f.freelancer_profile?.bio?.toLowerCase().includes(s.toLowerCase()));
        if (c) data = data.filter((f: any) => f.country === c);
        setFreelancers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleCountry = (value: string) => {
    const next = country === value ? '' : value;
    setCountry(next);
    load(search, next);
  };

  // Show the most relevant MENA countries as pills
  const pillCountries = COUNTRIES.slice(0, 8);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="page-title">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pageSubtitle')}</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="w-full ps-11 pe-4 h-12 rounded-lg border border-line dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-white placeholder:text-muted text-sm focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/30 transition-colors duration-150"
          />
        </div>
        <Button size="lg" onClick={() => load()}>{t('search')}</Button>
      </div>

      {/* Pill-style country filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {pillCountries.map((c) => (
          <button
            key={c.value}
            onClick={() => toggleCountry(c.value)}
            aria-pressed={country === c.value}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30',
              country === c.value
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white dark:bg-night-card border-line dark:border-night-border text-gray-600 dark:text-gray-300 hover:border-muted'
            )}
          >
            {locale === 'ar' ? c.label_ar : c.label_en}
          </button>
        ))}
        {(search || country) && (
          <button
            onClick={() => { setSearch(''); setCountry(''); load('', ''); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-150"
          >
            {t('reset')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-night-card rounded-card border border-line dark:border-night-border">
          <Users size={48} className="mx-auto text-muted mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noFreelancers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f) => <FreelancerCard key={f.id} user={f} />)}
        </div>
      )}
    </div>
  );
}
