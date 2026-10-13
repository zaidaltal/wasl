import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  const linkCls = 'text-sm text-ink-soft transition-colors duration-300 hover:text-accent';

  const groups = [
    {
      title: t('platform'),
      links: [
        { href: `/${locale}/jobs`, label: t('browseJobs') },
        { href: `/${locale}/freelancers`, label: t('findFreelancers') },
        { href: `/${locale}/register?role=client`, label: t('postJob') },
      ],
    },
    {
      title: t('support'),
      links: [
        { href: 'mailto:hello@wasl.jo', label: t('contact'), external: true },
      ],
    },
    {
      title: t('legal'),
      links: [
        { href: `/${locale}/privacy`, label: t('privacy') },
        { href: `/${locale}/terms`, label: t('terms') },
      ],
    },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-line bg-sunken/50">
      <div className="container-page grid grid-cols-1 gap-12 pb-10 pt-16 sm:grid-cols-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm sm:col-span-3 md:col-span-1">
          <Logo locale={locale} />
          <p className="mt-5 text-sm leading-relaxed text-muted">{t('description')}</p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="mb-5 text-[13px] font-semibold text-ink">{group.title}</h2>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  {'external' in link ? (
                    <a href={link.href} className={linkCls}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={linkCls}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <p>{t('madeIn')}</p>
      </div>

      {/* Oversized wordmark, cropped by the footer edge */}
      <p
        aria-hidden
        className="pointer-events-none select-none text-center font-callig text-[34vw] leading-[0.7] text-accent/[0.08] md:text-[22vw]"
      >
        وصل
      </p>
    </footer>
  );
}
