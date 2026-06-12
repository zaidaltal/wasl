import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = params instanceof Promise ? await params : params;
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex bg-ivory dark:bg-night-bg">
      {/* Brand panel — dark */}
      <div className="hidden lg:flex w-1/2 bg-ink text-white relative overflow-hidden flex-col justify-between p-10">
        {/* وصل watermark */}
        <span
          className="absolute top-1/2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 text-[24rem] font-bold text-white/5 select-none pointer-events-none font-arabic leading-none"
          aria-hidden
        >
          وصل
        </span>

        <Link href={`/${locale}`} className="relative w-fit" aria-label="Wasl — وصل">
          <Image src="/wasl-logo-dark.png" alt="Wasl وصل" width={73} height={60} className="h-14 w-auto" priority />
        </Link>

        <div className="relative">
          <p className="text-2xl font-semibold leading-snug max-w-sm">{t('tagline')}</p>
          <div className="w-12 h-1 bg-primary-600 rounded-full mt-6" />
        </div>

        <p className="relative text-sm text-gray-400">© {new Date().getFullYear()} Wasl — وصل</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link href={`/${locale}`} className="inline-block" aria-label="Wasl — وصل">
            <Image src="/wasl-logo.png" alt="Wasl وصل" width={49} height={40} className="h-10 w-auto dark:hidden" priority />
            <Image src="/wasl-logo-dark.png" alt="Wasl وصل" width={49} height={40} className="h-10 w-auto hidden dark:block" priority />
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
