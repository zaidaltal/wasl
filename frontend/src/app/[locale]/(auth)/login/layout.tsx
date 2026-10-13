import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth' });
  return {
    title: `${t('metaLoginTitle')} | Wasl`,
    description: t('metaLoginDescription'),
    robots: { index: false },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
