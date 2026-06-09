import { Header } from '@/components/layout/Header';

export default function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header locale={locale} />
      <main>{children}</main>
    </div>
  );
}
