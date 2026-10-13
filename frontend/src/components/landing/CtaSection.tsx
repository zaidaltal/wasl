import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ButtonArrow, buttonClasses } from '@/components/ui/buttonStyles';

export function CtaSection() {
  const t = useTranslations('landing.cta');
  const locale = useLocale();

  return (
    <section className="pb-8 pt-16 sm:pt-24">
      <div className="container-page">
        <div className="shell p-2" data-reveal>
          <div className="relative isolate overflow-hidden rounded-[1.25rem] bg-night px-6 py-20 sm:px-14 sm:py-28">
            {/* Lattice + oversized calligraphy instead of stock photography */}
            <div aria-hidden className="pattern-girih absolute inset-0 -z-10 text-white/[0.06]" />
            <div
              aria-hidden
              className="absolute -bottom-40 end-[-6rem] -z-10 h-[520px] w-[520px] rounded-full bg-accent/30 blur-[140px]"
            />
            <p
              lang="ar"
              aria-hidden
              className="pointer-events-none absolute -bottom-16 end-[-1rem] -z-10 select-none font-callig text-[16rem] leading-none text-white/[0.07] sm:text-[22rem]"
            >
              وصل
            </p>

            <div className="max-w-xl">
              <h2 className="display text-4xl text-white sm:text-5xl">{t('title')}</h2>
              <p className="mt-5 text-lg text-white/70">{t('subtitle')}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/${locale}/register?role=client`}
                  className={buttonClasses({ variant: 'primary', size: 'lg', className: 'pe-3' })}
                >
                  {t('clientBtn')}
                  <ButtonArrow />
                </Link>
                <Link
                  href={`/${locale}/register?role=freelancer`}
                  className={buttonClasses({
                    variant: 'secondary',
                    size: 'lg',
                    className: 'bg-white/10 text-white ring-white/25 hover:bg-white/15 hover:ring-white/40',
                  })}
                >
                  {t('freelancerBtn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
