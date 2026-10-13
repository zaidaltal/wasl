import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'auth' });
  return {
    title: `${t('metaRegisterTitle')} | Wasl`,
    description: t('metaRegisterDescription'),
  };
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
