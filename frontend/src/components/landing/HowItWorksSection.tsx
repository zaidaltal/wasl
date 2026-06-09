import { useTranslations } from 'next-intl';
import { UserPlus, Search, CheckCircle } from 'lucide-react';

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks');

  const steps = [
    {
      icon: <UserPlus size={28} />,
      title: t('step1Title'),
      desc: t('step1Desc'),
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: <Search size={28} />,
      title: t('step2Title'),
      desc: t('step2Desc'),
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      icon: <CheckCircle size={28} />,
      title: t('step3Title'),
      desc: t('step3Desc'),
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 start-1/4 end-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 dark:from-blue-700 dark:via-purple-700 dark:to-green-700" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 ${step.color} shadow-sm`}>
                {step.icon}
              </div>
              <div className="absolute top-5 start-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 hidden md:flex" style={{ top: '56px' }}>
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
