'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Pause, Play } from '@/components/ui/icons';
import { COUNTRIES, cn } from '@/lib/utils';

/** The one marquee on the page: where Wasl's clients and freelancers are. Pausable for keyboard and touch users. */
export function CountriesMarquee() {
  const t = useTranslations('landing.countries');
  const locale = useLocale();
  const [paused, setPaused] = useState(false);
  const names = COUNTRIES.map((c) => (locale === 'ar' ? c.label_ar : c.label_en));

  return (
    <section aria-label={t('label')} className="relative border-y border-line bg-surface/60 py-6">
      <p className="sr-only">{names.join(', ')}</p>
      <div
        aria-hidden
        dir="ltr"
        className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      >
        <div
          className={cn(
            'flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]',
            paused && '[animation-play-state:paused]'
          )}
        >
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {names.map((name) => (
                <li
                  key={`${copy}-${name}`}
                  className="pe-14 text-xl font-semibold tracking-tight text-ink/35 transition-colors duration-300 hover:text-accent sm:text-2xl"
                >
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? t('play') : t('pause')}
        className="absolute end-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-ink-soft shadow-soft ring-1 ring-line transition-colors hover:text-ink motion-reduce:hidden sm:end-6"
      >
        {paused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}
      </button>
    </section>
  );
}
