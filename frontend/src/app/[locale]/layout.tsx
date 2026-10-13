import type { Metadata, Viewport } from 'next';
import { Aref_Ruqaa, Bricolage_Grotesque, Plus_Jakarta_Sans, Readex_Pro } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { RevealRoot } from '@/components/motion/RevealRoot';
import '../globals.css';

const locales = ['en', 'ar'];

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

// Display face for Latin headlines (optical size axis gives tight, characterful large type)
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
});

// Calligraphic face, reserved for the وصل brand mark moments
const ruqaa = Aref_Ruqaa({
  subsets: ['arabic'],
  weight: ['700'],
  variable: '--font-callig',
  display: 'swap',
});

const readex = Readex_Pro({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wasl | وصل - Freelance marketplace for the Arab world',
  description: 'Hire vetted freelancers or find your next project across Jordan and the MENA region.',
  icons: {
    icon: '/wasl-icon.png',
    apple: '/wasl-icon.png',
  },
  openGraph: {
    title: 'Wasl | وصل',
    description: 'Hire vetted freelancers or find your next project across Jordan and the MENA region.',
    images: ['/images/hero-work.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F6F8' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0E13' },
  ],
};

// Applies the saved theme before first paint so dark mode never flashes light.
const themeScript = `(function(){try{var t=localStorage.getItem('wasl_theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = params instanceof Promise ? await params : params;

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <html
      lang={locale}
      dir={isArabic ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${jakarta.variable} ${readex.variable} ${bricolage.variable} ${ruqaa.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
        >
          {isArabic ? 'انتقل إلى المحتوى' : 'Skip to content'}
        </a>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <AuthProvider>
              <RevealRoot />
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  className:
                    '!rounded-full !bg-ink !text-canvas !px-5 !py-3 !text-sm !font-medium !shadow-lift',
                  success: { iconTheme: { primary: 'rgb(var(--accent))', secondary: 'rgb(var(--ink))' } },
                }}
              />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
