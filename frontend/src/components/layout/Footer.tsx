import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">و</span>
              </div>
              <span className="text-xl font-bold text-white">Wasl</span>
              <span className="text-primary-400 font-medium">وصل</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('platform')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}/jobs`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('browseJobs')}</Link></li>
              <li><Link href={`/${locale}/freelancers`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('findFreelancers')}</Link></li>
              <li><Link href={`/${locale}/register`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('postJob')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${locale}`} className="text-sm text-gray-400 hover:text-white transition-colors">{t('about')}</Link></li>
              <li><a href="mailto:hello@wasl.jo" className="text-sm text-gray-400 hover:text-white transition-colors">{t('contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-xs text-gray-500">Built with ❤️ for the MENA region</p>
        </div>
      </div>
    </footer>
  );
}
