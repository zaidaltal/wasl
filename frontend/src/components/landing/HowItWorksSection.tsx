import { useTranslations, useLocale } from 'next-intl';

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks');
  const locale = useLocale();

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc'), symbol: 'post_add',  num: '01' },
    { title: t('step2Title'), desc: t('step2Desc'), symbol: 'group',      num: '02' },
    { title: t('step3Title'), desc: t('step3Desc'), symbol: 'handshake',  num: '03' },
  ];

  return (
    <section className="bg-[#F7F8FA] dark:bg-night-bg py-section-gap px-margin-desktop overflow-hidden">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-20 reveal">
          <span className="inline-block text-accent font-bold text-sm uppercase tracking-widest mb-2">
            {locale === 'ar' ? 'كيف نعمل' : 'The Process'}
          </span>
          <h2 className="text-3xl sm:text-[2rem] font-bold text-text-primary dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-text-muted dark:text-gray-400 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Dashed connector line (desktop) */}
          <div
            className="hidden md:block absolute top-24 left-[15%] right-[15%] h-px border-t-2 border-dashed border-outline-variant dark:border-night-border"
            aria-hidden
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{ transitionDelay: `${i * 0.2}s` }}
              className="relative flex flex-col items-center text-center reveal"
            >
              <span
                className="absolute -top-12 text-9xl font-extrabold text-outline-variant/20 dark:text-night-border/30 -z-10 select-none"
                aria-hidden
              >
                {step.num}
              </span>
              <div className="relative mb-8 z-10">
                <div className="w-20 h-20 bg-brand-gradient shadow-xl shadow-accent/20 rounded-2xl rotate-3 flex items-center justify-center group-hover:rotate-0 transition-transform duration-300">
                  <span
                    className="material-symbols-outlined text-white select-none"
                    style={{ fontSize: '36px' }}
                  >
                    {step.symbol}
                  </span>
                </div>
                <span className="absolute -top-2 -end-2 w-7 h-7 rounded-full bg-success text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-white dark:border-night-bg">
                  {step.num.replace('0', '')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-text-primary dark:text-white mb-4 relative z-10">
                {step.title}
              </h4>
              <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed max-w-xs relative z-10">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
