'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SlidersHorizontal, X } from 'lucide-react';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category, JobFilters as JobFiltersType } from '@/types';
import { COUNTRIES } from '@/lib/utils';

interface JobFiltersProps {
  filters: JobFiltersType;
  categories: Category[];
  onChange: (filters: JobFiltersType) => void;
  onReset: () => void;
}

function FilterFields({ filters, categories, onChange, onReset }: JobFiltersProps) {
  const t = useTranslations('jobs');
  const locale = useLocale();

  return (
    <div className="space-y-5">
      <Select
        label={t('category')}
        value={filters.category_id || ''}
        onChange={(e) => onChange({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined })}
        placeholder={t('allCategories')}
        options={categories.map((c) => ({
          value: c.id,
          label: locale === 'ar' ? c.name_ar : c.name_en,
        }))}
      />

      <Select
        label={t('country')}
        value={filters.country || ''}
        onChange={(e) => onChange({ ...filters, country: e.target.value || undefined })}
        placeholder={t('allCountries')}
        options={COUNTRIES.map((c) => ({
          value: c.value,
          label: locale === 'ar' ? c.label_ar : c.label_en,
        }))}
      />

      <Button variant="ghost" size="sm" fullWidth onClick={onReset}>
        {t('reset')}
      </Button>
    </div>
  );
}

export function JobFilters(props: JobFiltersProps) {
  const t = useTranslations('jobs');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile: filter button + slide-in drawer */}
      <div className="lg:hidden mb-4">
        <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)} className="gap-2">
          <SlidersHorizontal size={15} />
          {t('filters')}
        </Button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 max-w-[85vw] bg-white dark:bg-night-bg shadow-card-hover p-5 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-ink dark:text-white">{t('filters')}</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="p-1.5 rounded-lg text-muted hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-night-card transition-colors duration-150"
              >
                <X size={18} />
              </button>
            </div>
            <FilterFields {...props} />
          </div>
        </div>
      )}

      {/* Desktop: 240px sticky sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="sticky top-24 bg-white dark:bg-night-card rounded-card border border-line dark:border-night-border shadow-card p-5">
          <h3 className="text-sm font-semibold text-ink dark:text-white mb-4">{t('filters')}</h3>
          <FilterFields {...props} />
        </div>
      </aside>
    </>
  );
}
