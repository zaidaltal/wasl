import { useTranslations } from 'next-intl';

/** Brand story told as a dictionary entry for the word وصل. */
export function MeaningSection() {
  const t = useTranslations('landing.meaning');
  const defs = [t('def1'), t('def2'), t('def3')];

  return (
    <section aria-labelledby="meaning-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-page">
        <div className="shell" data-reveal>
          <div className="core relative overflow-hidden px-6 py-14 sm:px-14 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_left,black,transparent_70%)] rtl:[mask-image:linear-gradient(to_right,black,transparent_70%)]"
            >
              <div className="pattern-girih h-full w-full text-accent/[0.1]" />
            </div>

            <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div className="text-center lg:text-start">
                <p
                  lang="ar"
                  aria-hidden
                  className="font-callig text-[7.5rem] leading-[1.15] text-accent sm:text-[10rem] lg:text-[12rem]"
                >
                  وصل
                </p>
                <h2 id="meaning-title" className="mt-2 text-lg font-semibold text-ink">
                  <span translate="no">{t('word')}</span>
                  <span className="ms-3 font-normal italic text-muted">{t('partOfSpeech')}</span>
                </h2>
              </div>

              <ol className="space-y-8">
                {defs.map((d, i) => (
                  <li key={i} className="flex gap-5" data-reveal style={{ ['--d' as string]: i + 1 }}>
                    <span className="num font-display text-3xl font-semibold leading-none text-accent/40">{i + 1}</span>
                    <p
                      className={
                        i === defs.length - 1
                          ? 'display text-2xl text-ink sm:text-[2rem] sm:leading-[1.15]'
                          : 'text-lg leading-relaxed text-ink-soft sm:text-xl'
                      }
                    >
                      {d}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
