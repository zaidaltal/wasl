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
    <div className="min-h-screen bg-ivory dark:bg-night-bg">
      <Header locale={locale} />
      <main>{children}</main>
    </div>
  );
}
