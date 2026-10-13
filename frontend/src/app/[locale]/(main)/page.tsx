import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { categoriesApi, freelancersApi, jobsApi } from '@/lib/api';
import { HeroSection } from '@/components/landing/HeroSection';
import { CountriesMarquee } from '@/components/landing/CountriesMarquee';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { MeaningSection } from '@/components/landing/MeaningSection';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { JobCard } from '@/components/jobs/JobCard';
import { ArrowRight } from '@/components/ui/icons';

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-accent"
    >
      {children}
      <ArrowRight
        size={14}
        weight="bold"
        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
  );
}

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('landing');

  const [categoriesRes, freelancersRes, jobsRes] = await Promise.allSettled([
    categoriesApi.getCategories(),
    freelancersApi.getFeatured(),
    jobsApi.getJobs({ status: 'open', per_page: 5 }),
  ]);

  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data?.data || [] : [];
  const freelancersRaw = freelancersRes.status === 'fulfilled' ? freelancersRes.value.data?.data || [] : [];
  const recentJobs = jobsRes.status === 'fulfilled' ? jobsRes.value.data?.data || [] : [];

  // Lead with complete profiles (bio + skills) so the showcase never opens on an empty card
  const completeness = (f: any) =>
    (f.freelancer_profile?.bio ? 2 : 0) + ((f.freelancer_profile?.skills?.length || 0) > 0 ? 1 : 0);
  const featuredFreelancers = [...freelancersRaw].sort((a: any, b: any) => completeness(b) - completeness(a));

  return (
    <>
      <HeroSection />
      <CountriesMarquee />
      <MeaningSection />
      <CategoriesSection categories={categories} />

      {featuredFreelancers.length > 0 && (
        <section className="overflow-hidden bg-sunken/50 py-24 sm:py-32">
          <div className="container-page">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between" data-reveal>
              <div className="max-w-xl">
                <h2 className="display text-4xl text-ink sm:text-5xl">{t('featured.title')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t('featured.subtitle')}</p>
              </div>
              <SectionLink href={`/${locale}/freelancers`}>{t('featured.viewAll')}</SectionLink>
            </div>
          </div>
          {/* Scroll-snap row that bleeds to the viewport edge */}
          <div
            role="region"
            aria-label={t('featured.rowLabel')}
            tabIndex={0}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] focus-visible:ring-inset"
          >
            {featuredFreelancers.map((f: any, i: number) => (
              <div key={f.id} className="w-[19rem] shrink-0 snap-start sm:w-[21rem]" data-reveal style={{ ['--d' as string]: Math.min(i, 4) }}>
                <FreelancerCard user={f} />
              </div>
            ))}
          </div>
        </section>
      )}

      <AudienceSection />

      {recentJobs.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start" data-reveal>
              <h2 className="display text-4xl text-ink sm:text-5xl">{t('recentJobs.title')}</h2>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-ink-soft">{t('recentJobs.subtitle')}</p>
              <div className="mt-8">
                <SectionLink href={`/${locale}/jobs`}>{t('recentJobs.viewAll')}</SectionLink>
              </div>
            </div>
            <div className="space-y-3">
              {recentJobs.map((job: any, i: number) => (
                <div key={job.id} data-reveal style={{ ['--d' as string]: i }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
