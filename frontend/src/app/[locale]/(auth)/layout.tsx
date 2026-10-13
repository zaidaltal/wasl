import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/layout/Logo';
import { ArrowLeft } from '@/components/ui/icons';

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
    <div className="flex min-h-[100dvh] bg-canvas p-2 sm:p-3">
      {/* Form side */}
      <div className="flex flex-1 flex-col px-4 py-5 sm:px-10">
        <header className="flex items-center justify-between">
          <Logo locale={locale} />
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
          >
            <ArrowLeft size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5" />
            {t('backHome')}
          </Link>
        </header>
        <main id="main" className="flex flex-1 items-center justify-center py-10">
          {children}
        </main>
      </div>

      {/* Photo panel */}
      <aside className="relative isolate hidden w-[46%] max-w-[720px] overflow-hidden rounded-shell bg-night lg:block">
        <div aria-hidden className="pattern-girih absolute inset-0 -z-10 text-white/[0.07]" />
        <div aria-hidden className="absolute -top-32 start-[-20%] -z-10 h-[560px] w-[560px] rounded-full bg-accent/35 blur-[140px]" />
        <p
          lang="ar"
          aria-hidden
          className="absolute start-12 top-16 select-none font-callig text-[10rem] leading-none text-accent"
        >
          وصل
        </p>
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="display max-w-md text-4xl text-white">{t('panelTitle')}</p>
          <p className="mt-4 max-w-sm text-base text-white/70">{t('panelBody')}</p>
        </div>
      </aside>
    </div>
  );
}
