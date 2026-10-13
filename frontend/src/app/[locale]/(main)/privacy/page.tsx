import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { getLegalDoc } from '@/content/legal';

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  const doc = getLegalDoc('privacy', locale);
  return { title: `${doc.title} | Wasl`, description: doc.intro };
}

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  return <LegalPage kind="privacy" locale={locale} />;
}
