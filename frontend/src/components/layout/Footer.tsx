import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  const linkCls =
    'text-on-tertiary-container opacity-80 hover:text-on-primary hover:opacity-100 transition-opacity text-sm';

  return (
    <footer className="bg-text-primary dark:bg-inverse-surface border-t-4 border-primary">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-section-gap w-full max-w-container-max mx-auto">

        {/* Brand */}
        <div className="col-span-1">
          <div className="mb-6">
            <Logo locale={locale} variant="dark" />
          </div>
          <p className="text-on-tertiary-container opacity-80 text-sm leading-relaxed max-w-xs">
            {t('description')}
          </p>
        </div>

        {/* Platform */}
        <div>
          <h5 className="text-on-primary font-bold mb-6">{t('platform')}</h5>
          <ul className="space-y-4">
            <li><Link href={`/${locale}`}           className={linkCls}>{t('about')}</Link></li>
            <li><Link href={`/${locale}/jobs`}       className={linkCls}>{t('browseJobs')}</Link></li>
            <li><Link href={`/${locale}/freelancers`}className={linkCls}>{t('findFreelancers')}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="text-on-primary font-bold mb-6">{t('support')}</h5>
          <ul className="space-y-4">
            <li><a href={`mailto:hello@wasl.jo`}    className={linkCls}>{t('contact')}</a></li>
            <li><Link href={`/${locale}`}            className={linkCls}>{t('privacy')}</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="text-on-primary font-bold mb-6">{t('legal')}</h5>
          <ul className="space-y-4">
            <li><Link href={`/${locale}`} className={linkCls}>{t('terms')}</Link></li>
            <li className="text-on-tertiary-container opacity-50 text-xs mt-8">
              {t('copyright', { year: new Date().getFullYear() })}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
