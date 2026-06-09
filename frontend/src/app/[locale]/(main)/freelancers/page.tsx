'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Users, Search } from 'lucide-react';
import { freelancersApi } from '@/lib/api';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { Input, Select } from '@/components/ui/Input';
import { COUNTRIES } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function FreelancersPage() {
  const t = useTranslations('freelancers');
  const locale = useLocale();

  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  const load = (s = search, c = country) => {
    setLoading(true);
    freelancersApi.getFeatured()
      .then((r) => {
        let data = r.data?.data || [];
        if (s) data = data.filter((f: any) => f.name.toLowerCase().includes(s.toLowerCase()) || f.freelancer_profile?.bio?.toLowerCase().includes(s.toLowerCase()));
        if (c) data = data.filter((f: any) => f.country === c);
        setFreelancers(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('pageTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{t('pageSubtitle')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 mb-8 flex flex-col sm:flex-row gap-3">
        <Input
          className="flex-1"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
        />
        <Select
          className="sm:w-44"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder={t('allCountries')}
          options={COUNTRIES.map((c) => ({ value: c.value, label: locale === 'ar' ? c.label_ar : c.label_en }))}
        />
        <Button onClick={() => load()} className="flex-shrink-0">{t('search')}</Button>
        <Button variant="outline" onClick={() => { setSearch(''); setCountry(''); load('', ''); }} className="flex-shrink-0">{t('reset')}</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-44 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noFreelancers')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f) => <FreelancerCard key={f.id} user={f} />)}
        </div>
      )}
    </div>
  );
}
