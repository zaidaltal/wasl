import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CONTACT_EMAIL, LEGAL_UPDATED, getLegalDoc } from '@/content/legal';
import { ArrowRight, Envelope } from '@/components/ui/icons';

interface LegalPageProps {
  kind: 'privacy' | 'terms';
  locale: string;
}

export async function LegalPage({ kind, locale }: LegalPageProps) {
  const t = await getTranslations('legal');
  const doc = getLegalDoc(kind, locale);
  const other = kind === 'privacy' ? 'terms' : 'privacy';
  const otherDoc = getLegalDoc(other, locale);
  const updated = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-JO' : 'en-US', { dateStyle: 'long' }).format(
    new Date(`${LEGAL_UPDATED}T00:00:00`)
  );

  return (
    <div className="container-page pb-16">
      <header className="max-w-3xl animate-fade-up pb-12 pt-32 sm:pt-36">
        <p className="eyebrow">{t('updated', { date: updated })}</p>
        <h1 className="display mt-5 text-4xl text-ink sm:text-[3.25rem]">{doc.title}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-soft">{doc.intro}</p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
        {/* Table of contents */}
        <nav aria-label={t('onThisPage')} className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-4 text-[13px] font-semibold text-ink">{t('onThisPage')}</p>
            <ol className="space-y-1 border-s border-line">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ms-px block border-s border-transparent py-1.5 ps-4 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="shell animate-fade-up [animation-delay:120ms]">
          <div className="core px-6 py-8 sm:px-12 sm:py-12">
            <div className="max-w-[68ch] space-y-12">
              {doc.sections.map((s, i) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <h2 id={s.id} className="scroll-mt-32 text-xl font-semibold tracking-tight text-ink">
                    <span className="num me-3 text-accent">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-[15px] leading-[1.8] text-ink-soft">
                    {s.body.map((block, j) =>
                      typeof block === 'string' ? (
                        <p key={j}>{block}</p>
                      ) : (
                        <ul key={j} className="space-y-2.5">
                          {block.list.map((item) => (
                            <li key={item} className="relative ps-5">
                              <span aria-hidden className="absolute start-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Contact + the other document */}
      <div className="mt-6 grid grid-cols-1 gap-3 lg:ms-[calc(240px+4rem)] lg:grid-cols-2">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="group flex items-center gap-4 rounded-shell bg-accent-soft p-6 transition-transform duration-500 ease-fluid hover:-translate-y-0.5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-on">
            <Envelope size={20} aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-ink">{t('questions')}</span>
            <span className="mt-0.5 block text-sm text-ink-soft" dir="ltr" translate="no">
              {CONTACT_EMAIL}
            </span>
          </span>
        </a>
        <Link
          href={`/${locale}/${other}`}
          className="group flex items-center justify-between gap-4 rounded-shell bg-surface p-6 ring-1 ring-inset ring-line transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-0.5 hover:shadow-lift"
        >
          <span>
            <span className="block text-sm text-muted">{t('alsoRead')}</span>
            <span className="mt-0.5 block text-base font-semibold text-ink">{otherDoc.title}</span>
          </span>
          <ArrowRight
            size={18}
            weight="bold"
            aria-hidden
            className="text-ink-soft transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
