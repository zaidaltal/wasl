import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonArrow, buttonClasses } from '@/components/ui/buttonStyles';
import { Buildings, Briefcase, CheckCircle } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

/** Two side-by-side paths: hiring vs. working. Replaces the generic 3-step row. */
export function AudienceSection() {
  const t = useTranslations('landing.audience');
  const tCta = useTranslations('landing.cta');
  const locale = useLocale();

  const panels = [
    {
      key: 'clients',
      icon: Buildings,
      title: t('clientsTitle'),
      body: t('clientsBody'),
      steps: [t('client1'), t('client2'), t('client3')],
      cta: tCta('clientBtn'),
      href: `/${locale}/register?role=client`,
      dark: false,
    },
    {
      key: 'freelancers',
      icon: Briefcase,
      title: t('freelancersTitle'),
      body: t('freelancersBody'),
      steps: [t('freelancer1'), t('freelancer2'), t('freelancer3')],
      cta: tCta('freelancerBtn'),
      href: `/${locale}/register?role=freelancer`,
      dark: true,
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-page">
        <div className="mx-auto mb-14 max-w-2xl text-center" data-reveal>
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="display mt-5 text-4xl text-ink sm:text-5xl">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {panels.map((p, idx) => (
            <div key={p.key} className="shell" data-reveal style={{ ['--d' as string]: idx * 2 }}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-core p-8 sm:p-10',
                  p.dark ? 'bg-ink text-canvas' : 'core'
                )}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-2xl',
                      p.dark ? 'bg-canvas/10 text-canvas' : 'bg-accent-soft text-accent-strong'
                    )}
                  >
                    <p.icon size={26} weight="light" aria-hidden />
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight">{p.title}</h3>
                </div>

                <p className={cn('mt-6 max-w-[40ch] text-lg leading-relaxed', p.dark ? 'text-canvas/70' : 'text-ink-soft')}>
                  {p.body}
                </p>

                <ol className="mt-8 space-y-4">
                  {p.steps.map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <CheckCircle
                        size={22}
                        weight="fill"
                        aria-hidden
                        className={cn('mt-0.5 shrink-0', p.dark ? 'text-accent' : 'text-accent')}
                      />
                      <span className={cn('text-[15px] leading-relaxed', p.dark ? 'text-canvas/90' : 'text-ink')}>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto pt-10">
                  <Link
                    href={p.href}
                    className={buttonClasses({
                      variant: p.dark ? 'secondary' : 'ink',
                      size: 'lg',
                      className: cn('pe-3', p.dark && 'bg-canvas text-ink ring-0 hover:bg-canvas/90'),
                    })}
                  >
                    {p.cta}
                    <ButtonArrow tone={p.dark ? 'dark' : 'light'} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
