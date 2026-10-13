import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from '@/components/ui/icons';
import { iconFor } from '@/lib/categoryIcons';

// Shown only if the API returns too few categories to fill the grid
const STATIC_CATEGORIES: Category[] = [
  { id: -1, name_en: 'Graphic Design', name_ar: 'التصميم الجرافيكي' },
  { id: -2, name_en: 'Web Development', name_ar: 'تطوير الويب' },
  { id: -3, name_en: 'Digital Marketing', name_ar: 'التسويق الرقمي' },
  { id: -4, name_en: 'Content Writing', name_ar: 'كتابة المحتوى' },
  { id: -5, name_en: 'Data Analysis', name_ar: 'تحليل البيانات' },
  { id: -6, name_en: 'Translation', name_ar: 'الترجمة' },
  { id: -7, name_en: 'Accounting', name_ar: 'المحاسبة والمالية' },
  { id: -8, name_en: 'Consulting', name_ar: 'الاستشارات' },
];

export function CategoriesSection({ categories }: { categories: Category[] }) {
  const t = useTranslations('landing.categories');
  const locale = useLocale();

  const source = categories.length >= 4 ? categories : STATIC_CATEGORIES;
  // Lead with a design category so it pairs with the workspace photograph
  const leadIndex = Math.max(0, source.findIndex((c) => /design/i.test(c.name_en)));
  const ordered = [source[leadIndex], ...source.filter((_, i) => i !== leadIndex)].slice(0, 8);
  const [lead, ...rest] = ordered;

  // Lead tile fills 2x2 on a 4-col grid; stretch the last tile so the final row has no hole.
  const filled = (4 + rest.length) % 4;
  const lastSpan = filled === 0 ? 1 : 4 - filled + 1;

  const LG_SPAN: Record<number, string> = { 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4' };

  const href = (c: Category) => (c.id > 0 ? `/${locale}/jobs?category_id=${c.id}` : `/${locale}/jobs`);
  const name = (c: Category) => (locale === 'ar' ? c.name_ar : c.name_en);
  const LeadIcon = iconFor(lead.name_en);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-page">
        <div className="mb-12 max-w-2xl" data-reveal>
          <h2 className="display text-4xl text-ink sm:text-5xl">{t('title')}</h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:auto-rows-[minmax(11rem,auto)] lg:grid-cols-4">
          {/* Lead tile with photograph */}
          <Link
            href={href(lead)}
            data-reveal
            className="group relative min-h-[22rem] overflow-hidden rounded-shell sm:col-span-2 lg:row-span-2"
          >
            <Image
              src="/images/workspace-design.jpg"
              alt={t('imageAlt')}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.2s] ease-fluid group-hover:scale-[1.04]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 sm:p-8">
              <div>
                <LeadIcon size={30} weight="light" className="mb-4 text-white/90" aria-hidden />
                <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{name(lead)}</h3>
                <p className="mt-2 text-sm font-medium text-white/75">{t('openJobs')}</p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-md transition-transform duration-500 ease-fluid group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <ArrowUpRight size={18} weight="bold" className="rtl:-scale-x-100" />
              </span>
            </div>
          </Link>

          {rest.map((cat, i) => {
            const CatIcon = iconFor(cat.name_en);
            const isLast = i === rest.length - 1;
            const tinted = isLast;
            return (
              <Link
                key={cat.id}
                href={href(cat)}
                data-reveal
                style={{ ['--d' as string]: (i % 4) + 1 }}
                className={cn(
                  'group relative flex min-h-[11rem] flex-col justify-between rounded-shell p-6 ring-1 ring-inset transition-[transform,box-shadow,background-color] duration-500 ease-fluid hover:-translate-y-1 hover:shadow-lift',
                  isLast && rest.length % 2 === 1 && 'sm:col-span-2 lg:col-span-1',
                  isLast && LG_SPAN[lastSpan],
                  tinted ? 'bg-accent-soft ring-accent/15' : 'bg-surface ring-line'
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-500 ease-fluid',
                      tinted ? 'bg-accent text-accent-on' : 'bg-sunken text-ink group-hover:bg-accent group-hover:text-accent-on'
                    )}
                  >
                    <CatIcon size={22} aria-hidden />
                  </span>
                  <ArrowUpRight
                    size={18}
                    weight="bold"
                    aria-hidden
                    className="text-muted opacity-0 transition-[opacity,transform] duration-500 ease-fluid group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                  />
                </div>
                <h3 className="mt-8 text-lg font-semibold tracking-tight text-ink">{name(cat)}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
