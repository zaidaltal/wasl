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

      {/* Featured Freelancers */}
      {featuredFreelancers.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('featured.title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('featured.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredFreelancers.slice(0, 6).map((f: any) => (
                <FreelancerCard key={f.id} user={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      <HowItWorksSection />

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('recentJobs.title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('recentJobs.subtitle')}</p>
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
