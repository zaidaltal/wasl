'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category, JobFilters as JobFiltersType } from '@/types';
import { COUNTRIES } from '@/lib/utils';

interface JobFiltersProps {
  filters: JobFiltersType;
  categories: Category[];
  onChange: (filters: JobFiltersType) => void;
  onReset: () => void;
}

export function JobFilters({ filters, categories, onChange, onReset }: JobFiltersProps) {
  const t = useTranslations('jobs');
  const locale = useLocale();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder={t('searchPlaceholder')}
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            icon={<Search size={16} />}
          />
        </div>

        <Select
          className="sm:w-44"
          value={filters.category_id || ''}
          onChange={(e) => onChange({ ...filters, category_id: e.target.value ? Number(e.target.value) : undefined })}
          placeholder={t('allCategories')}
          options={categories.map((c) => ({
            value: c.id,
            label: locale === 'ar' ? c.name_ar : c.name_en,
          }))}
        />

        <Select
          className="sm:w-44"
          value={filters.country || ''}
          onChange={(e) => onChange({ ...filters, country: e.target.value || undefined })}
          placeholder={t('allCountries')}
          options={COUNTRIES.map((c) => ({
            value: c.value,
            label: locale === 'ar' ? c.label_ar : c.label_en,
          }))}
        />

        <Button variant="outline" size="md" onClick={onReset} className="flex-shrink-0">
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}
