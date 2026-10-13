import { Header } from '@/components/layout/Header';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = params instanceof Promise ? await params : params;

  return (
    <div className="min-h-[100dvh]">
      <Header locale={locale} />
      <main id="main">{children}</main>
    </div>
  );
}
