'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SocialSignIn } from '@/components/auth/SocialButtons';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success(t('loginSuccess'));
      router.push(`/${locale}`);
    } catch (e: any) {
      toast.error(e.response?.data?.error || t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] p-8 sm:p-10 animate-slide-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink dark:text-white">{t('loginTitle')}</h1>
        <p className="text-muted dark:text-gray-400 mt-2 text-sm">
          {t('newToWasl')}{' '}
          <Link href={`/${locale}/register`} className="text-brand-blue dark:text-primary-300 font-bold hover:underline">
            {t('registerLink')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('email')}
          type="email"
          placeholder="name@company.com"
          icon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="block text-sm font-medium text-ink dark:text-gray-200">{t('password')}</span>
            <button type="button" className="text-xs font-bold text-brand-blue dark:text-primary-300 hover:underline">
              {t('forgotPassword')}
            </button>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            icon={<Lock size={16} />}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" fullWidth className="mt-2" loading={loading} size="lg">
          {t('loginBtn')}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-line dark:bg-night-border" />
        <span className="px-4 text-sm text-muted">{t('orDivider')}</span>
        <div className="flex-1 h-px bg-line dark:bg-night-border" />
      </div>

      <SocialSignIn />
    </Card>
  );
}
