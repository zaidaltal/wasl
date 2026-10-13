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
    <div className="min-h-[100dvh]">
      <Header locale={locale} />
      <div className="container-page flex items-start gap-8 pb-28 pt-28 sm:pt-32 md:pb-16">
        <DashboardSidebar locale={locale} />
        <main id="main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
