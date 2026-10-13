'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SlidersHorizontal, X } from '@/components/ui/icons';
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
  const active = !!(filters.category_id || filters.country || filters.search);

  return (
    <div className="space-y-5">
      <Select
        label={t('category')}
        value={filters.category_id || ''}
        onChange={(e) => onChange({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined })}
        placeholder={t('allCategories')}
        options={categories.map((c) => ({ value: c.id, label: locale === 'ar' ? c.name_ar : c.name_en }))}
      />

      <Select
        label={t('country')}
        value={filters.country || ''}
        onChange={(e) => onChange({ ...filters, country: e.target.value || undefined })}
        placeholder={t('allCountries')}
        options={COUNTRIES.map((c) => ({ value: c.value, label: locale === 'ar' ? c.label_ar : c.label_en }))}
      />

      <Button variant="ghost" size="sm" fullWidth onClick={onReset} disabled={!active}>
        {t('clearAll')}
      </Button>
    </div>
  );
}

export function JobFilters(props: JobFiltersProps) {
  const t = useTranslations('jobs');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = [props.filters.category_id, props.filters.country].filter(Boolean).length;

  return (
    <>
      {/* Mobile: filter pill + bottom sheet */}
      <div className="lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen}>
          <SlidersHorizontal size={15} aria-hidden />
          {t('filters')}
          {activeCount > 0 && (
            <span className="num ms-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] text-accent-on">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t('filters')}>
          <div className="absolute inset-0 animate-fade-in bg-night/50 backdrop-blur-md" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-x-2 bottom-2 animate-sheet-in">
            <div className="shell bg-surface/60 backdrop-blur-xl">
              <div className="core max-h-[80dvh] overflow-y-auto overscroll-contain p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-ink">{t('filters')}</h2>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close filters"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sunken text-ink-soft transition-colors hover:text-ink"
                  >
                    <X size={16} weight="bold" />
                  </button>
                </div>
                <FilterFields {...props} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: sticky sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="shell sticky top-28">
          <div className="core p-5">
            <h2 className="mb-5 text-sm font-semibold text-ink">{t('filters')}</h2>
            <FilterFields {...props} />
          </div>
        </div>
      </aside>
    </>
  );
}
