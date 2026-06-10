import { Header } from '@/components/layout/Header';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = params instanceof Promise ? await params : params;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header locale={locale} />
      <main>{children}</main>
    </div>
  );
}
