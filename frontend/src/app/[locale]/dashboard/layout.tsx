import { Header } from '@/components/layout/Header';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default async function DashboardLayout({
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
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8 items-start pb-24 md:pb-8">
        <DashboardSidebar locale={locale} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
