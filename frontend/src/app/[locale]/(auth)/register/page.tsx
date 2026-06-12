'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Building } from 'lucide-react';
import { authApi } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SocialRegister } from '@/components/auth/SocialButtons';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['freelancer', 'client']),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const defaultRole = (searchParams.get('role') as 'freelancer' | 'client') || 'freelancer';

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const { token, user } = res.data;
      setAuth(token, user);
      updateUser(user);
      toast.success(t('registerSuccess'));
      router.push(user.role === 'client' ? `/${locale}/dashboard/client` : `/${locale}/dashboard/freelancer`);
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 sm:p-10 animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ink dark:text-white">{t('registerTitle')}</h1>
        <p className="text-muted dark:text-gray-400 mt-2 text-sm">{t('registerSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role selector cards */}
        <div className="space-y-3">
          <span className="text-sm font-bold text-ink dark:text-gray-200 block">{t('roleQuestion')}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label={t('roleQuestion')}>
            {(['client', 'freelancer'] as const).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={role === r}
                onClick={() => setValue('role', r)}
                className={cn(
                  'group relative flex flex-col items-center text-center gap-3 p-5 rounded-xl border transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 hover:-translate-y-0.5',
                  role === r
                    ? 'border-brand-blue ring-1 ring-brand-blue bg-chip-blue/40 dark:bg-primary-900/20'
                    : 'border-line dark:border-night-border hover:border-muted bg-white dark:bg-night-card'
                )}
              >
                <span
                  className={cn(
                    'absolute top-3 end-3 w-4 h-4 rounded-full border-2 transition-colors',
                    role === r ? 'bg-brand-blue border-brand-blue' : 'border-line'
                  )}
                  aria-hidden
                />
                <span className="w-11 h-11 rounded-full bg-chip-blue dark:bg-primary-900/40 flex items-center justify-center text-brand-blue dark:text-primary-300 group-hover:scale-110 transition-transform">
                  {r === 'client' ? <Building size={20} /> : <Briefcase size={20} />}
                </span>
                <span className="text-sm font-bold text-ink dark:text-white leading-tight">
                  {t(r)}
                  <span className="block text-xs font-medium text-muted mt-0.5">
                    {r === 'client' ? t('clientDesc') : t('freelancerDesc')}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label={t('name')}
          placeholder={t('namePlaceholder')}
          icon={<User size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label={t('email')}
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label={t('password')}
          type="password"
          placeholder={t('passwordPlaceholder')}
          icon={<Lock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <label className="flex items-start gap-3 text-sm text-muted dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line text-brand-blue focus:ring-brand-blue/40"
          />
          <span>{t('termsAgree')}</span>
        </label>

        <Button type="submit" fullWidth disabled={!agreed} loading={loading} size="lg">
          {t('registerBtn')}
        </Button>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-line dark:bg-night-border" />
          <span className="px-4 text-sm text-muted">{t('orRegisterWith')}</span>
          <div className="flex-1 h-px bg-line dark:bg-night-border" />
        </div>

        <SocialRegister />
      </form>

      <p className="text-center text-sm text-muted dark:text-gray-400 mt-6">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/login`} className="text-brand-blue dark:text-primary-300 font-bold hover:underline">
          {t('loginLink')}
        </Link>
      </p>
    </Card>
  );
}
