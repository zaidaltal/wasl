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
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('registerTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{t('registerSubtitle')}</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(['freelancer', 'client'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setValue('role', r)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
              role === r
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            {r === 'freelancer' ? <Briefcase size={22} /> : <Building size={22} />}
            <span className="text-sm font-medium">{t(r)}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="you@example.com"
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

        <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
          {t('registerBtn')}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/login`} className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
          {t('loginLink')}
        </Link>
      </p>
    </Card>
  );
}
