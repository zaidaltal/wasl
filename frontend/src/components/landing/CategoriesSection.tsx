'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/types';

// Maps API category name_en keywords → Material Symbols icon names.
// NOTE: we deliberately ignore the DB `icon` column (it stores emoji),
// because emoji cannot render inside a Material Symbols font span.
const CATEGORY_SYMBOL: Array<[string, string]> = [
  ['web',          'code'],
  ['software',     'terminal'],
  ['mobile',       'smartphone'],
  ['ui',           'design_services'],
  ['ux',           'design_services'],
  ['graphic',      'brush'],
  ['design',       'palette'],
  ['content',      'edit_note'],
  ['writing',      'edit_note'],
  ['translation',  'translate'],
  ['marketing',    'campaign'],
  ['seo',          'travel_explore'],
  ['video',        'movie'],
  ['photo',        'photo_camera'],
  ['voice',        'mic'],
  ['audio',        'graphic_eq'],
  ['data',         'analytics'],
  ['analysis',     'analytics'],
  ['account',      'account_balance'],
  ['finance',      'payments'],
  ['legal',        'balance'],
  ['consult',      'support_agent'],
  ['engineering',  'engineering'],
];

function getSymbol(nameEn = ''): string {
  const lower = nameEn.toLowerCase();
  for (const [key, icon] of CATEGORY_SYMBOL) {
    if (lower.includes(key)) return icon;
  }
  return 'work';
}

// Fallback static categories shown if API returns fewer than 4
const STATIC_CATEGORIES = [
  { id: 's1', name_en: 'Development',       name_ar: 'التطوير',        desc: 'Software engineers, app developers, and QA specialists.' },
  { id: 's2', name_en: 'Design & Creative', name_ar: 'التصميم',        desc: 'Graphic, UI/UX, and brand designers.' },
  { id: 's3', name_en: 'Marketing',         name_ar: 'التسويق',        desc: 'SEO, content strategy, and social media experts.' },
  { id: 's4', name_en: 'Writing',           name_ar: 'الكتابة',        desc: 'Technical writers, translators, and copy editors.' },
  { id: 's5', name_en: 'Data Analysis',     name_ar: 'تحليل البيانات', desc: 'Analysts, ML engineers, and database admins.' },
  { id: 's6', name_en: 'Video & Audio',     name_ar: 'الفيديو والصوت', desc: 'Editors, motion graphics, and sound designers.' },
  { id: 's7', name_en: 'Accounting',        name_ar: 'المحاسبة',       desc: 'Accountants, financial planners, and auditors.' },
  { id: 's8', name_en: 'Consulting',        name_ar: 'الاستشارات',     desc: 'Business, strategy, and management advisors.' },
];

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const t = useTranslations('landing.categories');
  const locale = useLocale();

  const displayCats = categories.length >= 4 ? categories.slice(0, 8) : STATIC_CATEGORIES;

  return (
    <section className="bg-surface-white dark:bg-night-bg py-section-gap px-margin-desktop">
      <div className="max-w-container-max mx-auto">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12 reveal">
          <div>
            <span className="inline-block text-accent font-bold text-sm uppercase tracking-widest mb-2">
              {locale === 'ar' ? 'تصفّح حسب المجال' : 'Browse by expertise'}
            </span>
            <h2 className="text-3xl sm:text-[2rem] font-bold text-text-primary dark:text-white">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/jobs`}
            className="group inline-flex items-center gap-1.5 text-primary-container font-bold hover:gap-2.5 transition-all whitespace-nowrap"
          >
            {t('viewAll')}
            <span className="material-symbols-outlined select-none" style={{ fontSize: '18px' }}>
              {locale === 'ar' ? 'arrow_back' : 'arrow_forward'}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {displayCats.map((cat: any, i: number) => {
            const symbol = getSymbol(cat.name_en);
            const href = cat.id.toString().startsWith('s')
              ? `/${locale}/jobs`
              : `/${locale}/jobs?category_id=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                style={{ transitionDelay: `${(i % 4) * 0.08}s` }}
                className="group relative cursor-pointer bg-surface-white dark:bg-night-card p-7 rounded-2xl border border-outline-variant/60 dark:border-night-border hover:border-accent/40 hover:shadow-[0_20px_45px_rgba(99,102,241,0.12)] hover:-translate-y-1.5 transition-all duration-300 reveal overflow-hidden"
              >
                {/* Corner glow on hover */}
                <div className="absolute -top-8 -end-8 w-24 h-24 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-secondary-container to-accent-soft dark:from-primary-900/50 dark:to-accent/10 flex items-center justify-center mb-5 group-hover:from-primary-container group-hover:to-accent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/30">
                  <span
                    className="material-symbols-outlined text-primary-container group-hover:text-white transition-colors duration-300 select-none"
                    style={{ fontSize: '26px' }}
                  >
                    {symbol}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-text-primary dark:text-white mb-1.5 group-hover:text-accent transition-colors duration-300">
                  {locale === 'ar' ? cat.name_ar : cat.name_en}
                </h4>
                <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
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
