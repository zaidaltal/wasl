'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ButtonArrow } from '@/components/ui/buttonStyles';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowRight, Briefcase, MagnifyingGlass, MapPin } from '@/components/ui/icons';
import { cn, formatCurrency } from '@/lib/utils';
import { HERO_MATCHES, type HeroMatch } from '@/content/heroMatches';

type Loc = 'en' | 'ar';

// Built-in example pair (see content/heroMatches.ts), so the hero works without the API
const MATCH: HeroMatch = HERO_MATCHES[0];

function FreelancerMini({ l, locale, rateSuffix }: { l: Loc; locale: string; rateSuffix: string }) {
  const f = MATCH.freelancer;
  return (
    <div className="shell bg-surface/50 shadow-lift backdrop-blur-sm">
      <div className="core p-5">
        <div className="flex items-center gap-3">
          <Avatar name={f.name.en} size="md" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">{f.name[l]}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} aria-hidden />
              {f.city[l]}, {f.country[l]}
            </p>
          </div>
          <p className="num ms-auto shrink-0 text-sm font-semibold text-ink">
            {formatCurrency(f.rate, locale)}
            <span className="text-xs font-medium text-muted">{rateSuffix}</span>
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {f.skills.map((s) => (
            <span key={s} className="rounded-full bg-sunken px-2.5 py-1 text-[11px] font-medium text-ink-soft">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function JobMini({ l, locale }: { l: Loc; locale: string }) {
  const job = MATCH.job;
  return (
    <div className="shell bg-surface/50 shadow-lift backdrop-blur-sm">
      <div className="core p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent-strong">
            <Briefcase size={14} aria-hidden />
          </span>
          <span className="truncate font-semibold text-ink-soft">{job.company[l]}</span>
          <span className="truncate">{job.country[l]}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{job.title[l]}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="num text-sm font-semibold text-ink">{formatCurrency(job.budget, locale)}</span>
          <span className="truncate rounded-full bg-sunken px-2.5 py-1 text-[11px] font-medium text-ink-soft">{job.category[l]}</span>
        </div>
      </div>
    </div>
  );
}

/** The brand mark node: "wasl" literally means connection. */
function WaslNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'node-in absolute flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-on shadow-[0_0_0_10px_rgb(var(--accent)/0.12),0_18px_40px_-12px_rgb(var(--accent)/0.6)]',
        className
      )}
    >
      <span lang="ar" className="font-callig text-[1.9rem] leading-none" style={{ marginTop: '-0.1em' }}>
        وصل
      </span>
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const tCta = useTranslations('landing.cta');
  const tF = useTranslations('freelancers');
  const locale = useLocale();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/${locale}/jobs?search=${encodeURIComponent(q)}` : `/${locale}/jobs`);
  };

  const l: Loc = locale === 'ar' ? 'ar' : 'en';

  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24">
      {/* Geometric lattice, fading out from the visual side */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 end-0 w-full [mask-image:radial-gradient(ellipse_70%_70%_at_60%_45%,black,transparent_75%)] rtl:[mask-image:radial-gradient(ellipse_70%_70%_at_40%_45%,black,transparent_75%)] lg:w-[60%]"
      >
        <div className="pattern-girih h-full w-full text-ink/[0.08]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 end-[-10%] h-[620px] w-[620px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="container-page relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="max-w-2xl">
          <span className="eyebrow animate-fade-up">{t('eyebrow')}</span>

          <h1 className="display mt-6 animate-fade-up text-[2.75rem] text-ink [animation-delay:80ms] sm:text-6xl lg:text-[4rem] xl:text-[4.6rem]">
            {t('title')} <span className="text-accent">{t('titleAccent')}</span>
          </h1>

          <p className="mt-6 max-w-[34rem] animate-fade-up text-lg leading-relaxed text-ink-soft [animation-delay:160ms]">
            {t('subtitle')}
          </p>

          <form onSubmit={submit} role="search" className="mt-9 max-w-xl animate-fade-up [animation-delay:240ms]">
            <div className="shell">
              <div className="core flex items-center gap-2 p-1.5 ps-5 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent">
                <MagnifyingGlass size={20} className="shrink-0 text-muted" aria-hidden />
                <label htmlFor="hero-search" className="sr-only">
                  {t('searchLabel')}
                </label>
                <input
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="group/btn inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-accent pe-2 ps-5 text-sm font-semibold text-accent-on transition-colors duration-300 hover:bg-accent-strong active:scale-[0.98]"
                >
                  {t('searchBtn')}
                  <ButtonArrow />
                </button>
              </div>
            </div>
          </form>

          <p className="mt-6 animate-fade-up text-sm text-muted [animation-delay:320ms]">
            {t('orJoin')}{' '}
            <Link
              href={`/${locale}/register?role=freelancer`}
              className="group inline-flex items-center gap-1 font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
            >
              {tCta('freelancerBtn')}
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </p>
        </div>

        {/* Signature visual: an example freelancer and job, joined by the wasl node */}
        <figure className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <figcaption className="sr-only">{t('figure')}</figcaption>

          {/* sm and up: diagonal composition with a drawn connector */}
          <div className="relative hidden aspect-[1/1] sm:block lg:aspect-[5/6]">
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible rtl:-scale-x-100"
            >
              <path
                id="wasl-path"
                d="M 34 18 C 34 55, 66 45, 66 82"
                pathLength={1}
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0.012 0.018"
                vectorEffect="non-scaling-stroke"
                className="opacity-30"
              />
              <path
                d="M 34 18 C 34 55, 66 45, 66 82"
                pathLength={1}
                fill="none"
                stroke="rgb(var(--accent))"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className="draw-line"
              />
              <circle r="1.1" fill="rgb(var(--accent))" className="motion-reduce:hidden">
                <animateMotion dur="3.2s" begin="2.2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#wasl-path" />
                </animateMotion>
              </circle>
            </svg>

            <div className="absolute start-0 top-[4%] w-[68%] animate-fade-up [animation-delay:200ms] lg:-rotate-2 rtl:lg:rotate-2">
              <FreelancerMini l={l} locale={locale} rateSuffix={tF('perHour')} />
            </div>
            <div className="absolute bottom-[4%] end-0 w-[72%] animate-fade-up [animation-delay:400ms] lg:rotate-2 rtl:lg:-rotate-2">
              <JobMini l={l} locale={locale} />
            </div>
            <WaslNode className="left-1/2 top-1/2" />
          </div>

          {/* Mobile: vertical stack joined by a straight connector */}
          <div className="flex flex-col items-stretch sm:hidden">
            <div className="animate-fade-up [animation-delay:200ms]">
              <FreelancerMini l={l} locale={locale} rateSuffix={tF('perHour')} />
            </div>
            <div className="relative mx-auto h-28 w-px bg-gradient-to-b from-accent/20 via-accent to-accent/20">
              <WaslNode className="left-1/2 top-1/2 h-16 w-16" />
            </div>
            <div className="animate-fade-up [animation-delay:400ms]">
              <JobMini l={l} locale={locale} />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
