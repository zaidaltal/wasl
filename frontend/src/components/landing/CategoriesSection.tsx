'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  'web-development': '💻',
  'mobile-development': '📱',
  'design': '🎨',
  'writing': '✍️',
  'marketing': '📢',
  'video': '🎬',
  'translation': '🌐',
  'data': '📊',
  'accounting': '📋',
  'engineering': '⚙️',
};

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const t = useTranslations('landing.categories');
  const locale = useLocale();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/jobs?category_id=${cat.id}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200"
            >
              <span className="text-3xl">{cat.icon || CATEGORY_ICONS[cat.name_en.toLowerCase().replace(/\s+/g, '-')] || '🔧'}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {locale === 'ar' ? cat.name_ar : cat.name_en}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
