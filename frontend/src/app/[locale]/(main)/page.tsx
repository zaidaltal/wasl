import { categoriesApi, freelancersApi, jobsApi } from '@/lib/api';
import { HeroSection } from '@/components/landing/HeroSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { JobCard } from '@/components/jobs/JobCard';
import { getTranslations } from 'next-intl/server';

export default async function LandingPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('landing');

  const [categoriesRes, freelancersRes, jobsRes] = await Promise.allSettled([
    categoriesApi.getCategories(),
    freelancersApi.getFeatured(),
    jobsApi.getJobs({ status: 'open', per_page: 6 }),
  ]);

  const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.data?.data || [] : [];
  const featuredFreelancers = freelancersRes.status === 'fulfilled' ? freelancersRes.value.data?.data || [] : [];
  const recentJobs = jobsRes.status === 'fulfilled' ? jobsRes.value.data?.data || [] : [];

  return (
    <>
      <HeroSection />

      <CategoriesSection categories={categories} />

      {/* Featured Freelancers — horizontal scroll row */}
      {featuredFreelancers.length > 0 && (
        <section className="py-16 sm:py-20 bg-white dark:bg-night-bg">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-[2rem] font-bold text-ink dark:text-white">{t('featured.title')}</h2>
              <p className="text-muted dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('featured.subtitle')}</p>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x reveal">
              {featuredFreelancers.map((f: any) => (
                <FreelancerCard key={f.id} user={f} className="w-80 flex-shrink-0 snap-start" />
              ))}
            </div>
          </div>
        </section>
      )}

      <HowItWorksSection />

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section className="py-16 sm:py-20 bg-white dark:bg-night-bg">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-[2rem] font-bold text-ink dark:text-white">{t('recentJobs.title')}</h2>
              <p className="text-muted dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('recentJobs.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
