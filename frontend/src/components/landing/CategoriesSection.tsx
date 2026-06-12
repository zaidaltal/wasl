'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/types';

// Maps API category slugs/name_en keywords → Material Symbols icon names
const CATEGORY_SYMBOL: Record<string, string> = {
  'development':    'code',
  'web':            'code',
  'mobile':         'code',
  'software':       'code',
  'design':         'palette',
  'creative':       'palette',
  'marketing':      'trending_up',
  'seo':            'trending_up',
  'writing':        'edit_note',
  'content':        'edit_note',
  'translation':    'edit_note',
  'data':           'monitoring',
  'analytics':      'monitoring',
  'video':          'videocam',
  'audio':          'videocam',
  'legal':          'balance',
  'law':            'balance',
  'finance':        'payments',
  'accounting':     'payments',
  'engineering':    'engineering',
  'default':        'work',
};

function getSymbol(nameEn: string): string {
  const lower = nameEn.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_SYMBOL)) {
    if (key !== 'default' && lower.includes(key)) return icon;
  }
  return CATEGORY_SYMBOL['default'];
}

// Fallback static categories shown if API returns fewer than 4
const STATIC_CATEGORIES = [
  { id: 's1', name_en: 'Development',    name_ar: 'التطوير',       icon: 'code',       desc: 'Software engineers, app developers, and QA specialists.' },
  { id: 's2', name_en: 'Design & Creative', name_ar: 'التصميم',    icon: 'palette',    desc: 'Graphic, UI/UX, and architectural designers.' },
  { id: 's3', name_en: 'Marketing',      name_ar: 'التسويق',       icon: 'trending_up', desc: 'SEO, Content Strategy, and Social Media experts.' },
  { id: 's4', name_en: 'Writing',        name_ar: 'الكتابة',       icon: 'edit_note',  desc: 'Technical writers, translators, and copy editors.' },
  { id: 's5', name_en: 'Data Science',   name_ar: 'علم البيانات',  icon: 'monitoring', desc: 'Analysts, ML engineers, and database admins.' },
  { id: 's6', name_en: 'Video & Audio',  name_ar: 'الفيديو والصوت', icon: 'videocam',   desc: 'Editors, motion graphics, and sound designers.' },
  { id: 's7', name_en: 'Legal',          name_ar: 'القانون',       icon: 'balance',    desc: 'Contract law, corporate affairs, and IP protection.' },
  { id: 's8', name_en: 'Finance',        name_ar: 'المالية',       icon: 'payments',   desc: 'Accountants, financial planners, and auditors.' },
];

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const t = useTranslations('landing.categories');
  const locale = useLocale();

  // Use API categories if available (up to 8), otherwise show static
  const displayCats = categories.length >= 4
    ? categories.slice(0, 8)
    : STATIC_CATEGORIES;

  return (
    <section className="bg-[#F7F8FA] dark:bg-night-bg py-section-gap px-margin-desktop">
      <div className="max-w-container-max mx-auto">

        <div className="flex justify-between items-end mb-12 reveal">
          <h2 className="text-3xl sm:text-[2rem] font-bold text-text-primary dark:text-white">
            {t('title')}
          </h2>
          <Link
            href={`/${locale}/jobs`}
            className="text-primary font-bold hover:underline whitespace-nowrap"
          >
            {t('viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {displayCats.map((cat: any, i: number) => {
            const symbol = cat.icon || getSymbol(cat.name_en);
            const href = cat.id.toString().startsWith('s')
              ? `/${locale}/jobs`
              : `/${locale}/jobs?category_id=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                style={{ transitionDelay: `${(i % 4) * 0.1}s` }}
                className="group bg-surface-white dark:bg-night-card p-8 rounded-xl hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 reveal"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container dark:bg-primary-900/50 flex items-center justify-center mb-6 group-hover:bg-primary-container transition-colors duration-300">
                  <span
                    className="material-symbols-outlined text-primary group-hover:text-on-primary select-none"
                    style={{ fontSize: '22px' }}
                  >
                    {symbol}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-text-primary dark:text-white mb-2">
                  {locale === 'ar' ? cat.name_ar : cat.name_en}
                </h4>
                <p className="text-text-muted text-sm leading-relaxed">
                  {cat.desc || (locale === 'ar' ? cat.name_en : cat.name_ar)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
