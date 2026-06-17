'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

export function CtaSection() {
  const t = useTranslations('landing.cta');
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-night-bg">
      <div className="max-w-content mx-auto bg-brand-gradient rounded-[32px] p-10 sm:p-20 relative overflow-hidden reveal shadow-2xl shadow-accent/20">
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />
        {/* وصل watermark */}
        <span
          className="absolute -end-[5%] -top-[15%] text-[16rem] sm:text-[20rem] font-extrabold text-white/5 select-none pointer-events-none font-arabic leading-none"
          aria-hidden
        >
          وصل
        </span>

        <div className="relative z-10 text-center">
          <h2 className="text-3xl sm:text-[2.75rem] font-extrabold leading-tight text-white mb-6 max-w-2xl mx-auto">
            {t('title')}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">{t('subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push(`/${locale}/register?role=client`)}
              className="bg-white text-cta px-10 py-4 rounded-full font-bold hover:bg-opacity-90 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg"
            >
              {t('clientBtn')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/register?role=freelancer`)}
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-cta hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              {t('freelancerBtn')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
