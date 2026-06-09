'use client';

import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function CtaSection() {
  const t = useTranslations('landing.cta');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('title')}</h2>
        <p className="text-primary-200 text-lg mb-10 max-w-2xl mx-auto">{t('subtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-primary-700 hover:bg-gray-50 font-semibold gap-2"
            onClick={() => router.push(`/${locale}/register?role=freelancer`)}
          >
            {t('freelancerBtn')}
            <ArrowIcon size={18} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10"
            onClick={() => router.push(`/${locale}/register?role=client`)}
          >
            {t('clientBtn')}
          </Button>
        </div>
      </div>
    </section>
  );
}
