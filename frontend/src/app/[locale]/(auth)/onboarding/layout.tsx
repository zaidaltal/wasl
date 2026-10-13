import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'onboarding' });
  return { title: `${t('metaTitle')} | Wasl`, robots: { index: false } };
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
