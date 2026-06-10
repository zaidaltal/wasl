import Link from 'next/link';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = params instanceof Promise ? await params : params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex flex-col">
      <div className="p-6">
        <Link href={`/${locale}`} className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">و</span>
          </div>
          <span className="text-xl font-bold text-white">Wasl</span>
          <span className="text-primary-300 font-medium">وصل</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
