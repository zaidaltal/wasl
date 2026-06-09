'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -end-40 w-96 h-96 rounded-full bg-primary-700/30 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 w-72 h-72 rounded-full bg-gold-500/20 blur-3xl" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-800/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">{t('badge')}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
            {t('title')}
            <span className="block text-gold-400 mt-2">{t('titleHighlight')}</span>
          </h1>

          <p className="text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full ps-10 pe-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    router.push(`/${locale}/jobs?search=${encodeURIComponent(val)}`);
                  }
                }}
              />
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="flex-shrink-0"
              onClick={() => router.push(`/${locale}/jobs`)}
            >
              {t('searchBtn')}
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-900 gap-2"
              onClick={() => router.push(`/${locale}/register?role=freelancer`)}
            >
              {t('ctaFreelancer')}
              <ArrowIcon size={18} />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push(`/${locale}/register?role=client`)}
            >
              {t('ctaClient')}
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { number: '500+', label: t('stat1') },
              { number: '1,200+', label: t('stat2') },
              { number: '15+', label: t('stat3') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.number}</div>
                <div className="text-xs sm:text-sm text-primary-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
