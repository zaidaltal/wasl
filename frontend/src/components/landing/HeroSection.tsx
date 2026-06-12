'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useReveal } from '@/hooks/useReveal';

const FLOATING_CARDS = [
  {
    name: 'Layla Mansour',
    role: 'Senior UI/UX Designer',
    rate: '$45/hr',
    skills: ['Figma', 'User Research'],
    cls: 'absolute top-10 left-10 z-30 -rotate-3 hover:rotate-0',
    delay: '0s',
    initials: 'LM',
  },
  {
    name: 'Omar Al-Fayez',
    role: 'Full-Stack Engineer',
    rate: '$60/hr',
    skills: ['React', 'Node.js'],
    cls: 'absolute bottom-10 right-0 z-20 rotate-6 hover:rotate-0',
    delay: '-2s',
    initials: 'OA',
  },
  {
    name: 'Sara Haddad',
    role: 'Creative Director',
    rate: '$75/hr',
    skills: ['Branding', 'Strategy'],
    cls: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 -rotate-12 hover:rotate-0',
    delay: '-4s',
    initials: 'SH',
  },
];

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();
  const router = useRouter();
  useReveal();

  const stats = [
    { count: 5000, label: t('stat1') },
    { count: 1200, label: t('stat2') },
    { count: 800,  label: t('stat4') },
    { count: 15,   label: t('stat3') },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-section-gap pb-section-gap px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] items-center gap-12">

          {/* Left Content */}
          <div className="reveal">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-primary text-sm font-bold mb-6">
              <span className="text-lg" aria-hidden>🌍</span> {t('badge')}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight text-text-primary dark:text-white mb-6">
              {t('title')}{' '}
              <span className="text-primary-container">{t('titleHighlight')}</span>
            </h1>

            <p className="text-text-muted dark:text-gray-300 text-lg mb-10 max-w-lg leading-relaxed">
              {t('subtitle')}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl group">
              <div className="flex items-center bg-surface-white dark:bg-night-card rounded-full p-2 border border-outline-variant dark:border-night-border focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all shadow-lg">
                <span className="material-symbols-outlined ml-4 text-text-muted select-none" style={{ fontSize: '20px' }}>
                  search
                </span>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  aria-label={t('searchPlaceholder')}
                  className="w-full border-none focus:ring-0 bg-transparent px-4 text-sm text-text-primary dark:text-white placeholder:text-text-muted outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      router.push(`/${locale}/jobs?search=${encodeURIComponent(val)}`);
                    }
                  }}
                />
                <button
                  onClick={() => router.push(`/${locale}/jobs`)}
                  className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:bg-primary active:scale-95 transition-all whitespace-nowrap"
                >
                  {t('searchBtn')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Visual: Floating Cards */}
          <div className="relative h-[500px] hidden lg:block" aria-hidden>
            {FLOATING_CARDS.map((card) => (
              <div
                key={card.name}
                style={{ animationDelay: card.delay } as React.CSSProperties}
                className={`${card.cls} w-72 p-6 bg-surface-white dark:bg-night-card rounded-xl shadow-[0_20px_40px_rgba(15,23,42,0.08)] transition-transform duration-500 animate-float`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-secondary-container dark:bg-primary-900/40 border-2 border-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {card.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface dark:text-white text-sm">{card.name}</h3>
                    <p className="text-text-muted text-xs">{card.role}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-primary font-bold">{card.rate}</span>
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.skills.map((s) => (
                    <span key={s} className="bg-surface-container dark:bg-night-border text-on-surface-variant dark:text-gray-300 px-2 py-1 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-text-primary dark:bg-night-card border-t-[3px] border-primary px-margin-desktop py-12">
        <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div
                className="text-3xl sm:text-4xl font-extrabold text-white mb-1"
                data-count={stat.count}
              >
                {stat.count.toLocaleString()}+
              </div>
              <div className="text-text-muted uppercase tracking-widest text-[10px] font-bold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
