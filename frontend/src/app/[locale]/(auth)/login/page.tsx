'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Envelope, Info, WarningCircle } from '@/components/ui/icons';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { homeFor, safeNext } from '@/lib/authRedirect';

// Login only checks that fields are filled in. Length rules belong to sign-up, not sign-in.
const makeSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().email(t('errEmail')),
    password: z.string().min(1, t('errPasswordRequired')),
  });

type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const justLoggedIn = useRef(false);

  const next = safeNext(searchParams.get('next'), locale);
  const sessionExpired = searchParams.get('expired') === '1';

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(makeSchema(t)), shouldFocusError: true });

  // Already signed in: there is nothing to do here, go where the user was headed.
  useEffect(() => {
    if (!isLoading && user && !justLoggedIn.current) router.replace(next || homeFor(user, locale));
  }, [isLoading, user, next, locale, router]);

  // Focus the email field on devices with a precise pointer only, so phones don't pop the keyboard.
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setFocus('email');
  }, [setFocus]);

  const clearFormError = () => setFormError(null);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setFormError(null);
    try {
      justLoggedIn.current = true;
      const signedIn = await login(data.email.trim(), data.password);
      toast.success(t('loginSuccess'));
      router.replace(next || homeFor(signedIn, locale));
    } catch (e: any) {
      justLoggedIn.current = false;
      const status = e.response?.status;
      if (status === 401) {
        setFormError(t('errInvalid'));
        setValue('password', '');
        setFocus('password');
      } else if (status === 429) {
        const seconds = Number(e.response?.data?.retry_after) || 900;
        setFormError(t('errThrottled', { minutes: Math.max(1, Math.ceil(seconds / 60)) }));
      } else if (!e.response) {
        setFormError(t('errNetwork'));
      } else {
        setFormError(t('errServer'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] animate-fade-up">
      <h1 className="display text-4xl text-ink">{t('loginTitle')}</h1>
      <p className="mt-3 text-[15px] text-muted">{t('loginSubtitle')}</p>

      {sessionExpired && !formError && (
        <div role="status" className="mt-8 flex gap-3 rounded-2xl bg-sunken p-4 text-sm leading-relaxed text-ink-soft">
          <Info size={18} className="mt-0.5 shrink-0 text-ink" aria-hidden />
          {t('sessionExpired')}
        </div>
      )}

      {/* Persistent, announced error for problems with the whole submission */}
      <div aria-live="assertive" aria-atomic="true">
        {formError && (
          <div
            role="alert"
            className="mt-8 flex animate-fade-in gap-3 rounded-2xl bg-danger-soft p-4 text-sm font-medium leading-relaxed text-danger"
          >
            <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
            {formError}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate method="post">
        <Input
          label={t('email')}
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="name@company.com"
          icon={<Envelope size={17} />}
          error={errors.email?.message}
          {...register('email', { onChange: clearFormError })}
        />
        <div>
          <PasswordInput
            label={t('password')}
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', { onChange: clearFormError })}
          />
          <div className="mt-2 flex justify-end">
            <a
              href="mailto:hello@wasl.jo?subject=Password%20reset"
              className="rounded text-[13px] font-semibold text-muted transition-colors hover:text-accent"
            >
              {t('forgotPassword')}
            </a>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading} variant="ink">
          {loading ? t('loggingIn') : t('loginBtn')}
        </Button>
      </form>

      <p className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">
        {t('newToWasl')}{' '}
        <Link
          href={next ? `/${locale}/register?next=${encodeURIComponent(next)}` : `/${locale}/register`}
          className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {t('registerLink')}
        </Link>
      </p>
    </div>
  );
}
