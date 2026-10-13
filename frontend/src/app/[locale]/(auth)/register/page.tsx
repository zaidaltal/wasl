'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { setAuth } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { ArrowLeft, Briefcase, Buildings, Envelope, User, WarningCircle } from '@/components/ui/icons';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { StepProgress } from '@/components/auth/StepProgress';
import { ONBOARDING_STEPS } from '@/lib/onboarding';
import { cn } from '@/lib/utils';
import { homeFor, safeNext } from '@/lib/authRedirect';

type Role = 'client' | 'freelancer';

const makeSchema = (t: (key: string, values?: Record<string, number>) => string) =>
  z.object({
    name: z.string().trim().min(2, t('errName', { min: 2 })),
    email: z.string().trim().email(t('errEmail')),
    password: z.string().min(8, t('errPassword', { min: 8 })),
    country: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: t('termsRequired') }) }),
  });

type FormData = z.infer<ReturnType<typeof makeSchema>>;

const linkCls =
  'font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:decoration-accent';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const ts = useTranslations('signup');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, updateUser } = useAuth();
  const justRegistered = useRef(false);

  const roleParam = searchParams.get('role');
  const role: Role | null = roleParam === 'client' || roleParam === 'freelancer' ? roleParam : null;
  const step = role && searchParams.get('step') === 'account' ? 'account' : 'role';
  const next = safeNext(searchParams.get('next'), locale);
  const [picked, setPicked] = useState<Role | null>(role);

  // Whole journey: choose role + account details, then that role's onboarding questions
  const total = 2 + (picked ? ONBOARDING_STEPS[picked] : ONBOARDING_STEPS.freelancer);

  const go = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params);
    if (next) qs.set('next', next);
    router.push(`/${locale}/register?${qs.toString()}`);
  };

  // Signed-in users have nothing to do here
  useEffect(() => {
    if (!isLoading && user && !justRegistered.current) router.replace(homeFor(user, locale));
  }, [isLoading, user, locale, router]);

  // Warm up the next page while the user types, so the hand-off after "Create" is instant
  useEffect(() => {
    if (step === 'account') router.prefetch(`/${locale}/onboarding`);
  }, [step, locale, router]);

  if (step === 'role') {
    const roles = [
      { id: 'client' as const, icon: Buildings, title: ts('clientCard') },
      { id: 'freelancer' as const, icon: Briefcase, title: ts('freelancerCard') },
    ];
    const cta = picked === 'client' ? ts('continueClient') : picked === 'freelancer' ? ts('continueFreelancer') : ts('chooseRole');

    return (
      <div className="w-full max-w-[480px] animate-fade-up">
        <StepProgress current={1} total={total} />
        <h1 className="display mt-10 text-4xl text-ink">{ts('roleTitle')}</h1>
        <p className="mt-3 text-[15px] text-muted">{ts('roleSubtitle')}</p>

        <div role="radiogroup" aria-label={ts('roleTitle')} className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {roles.map((r) => {
            const selected = picked === r.id;
            return (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPicked(r.id)}
                className={cn(
                  'group relative flex min-h-[11rem] flex-col justify-between rounded-shell p-6 text-start ring-1 ring-inset transition-[background-color,box-shadow,transform] duration-300 ease-fluid active:scale-[0.98]',
                  selected ? 'bg-accent-soft ring-2 ring-accent' : 'bg-surface ring-line hover:ring-ink/30'
                )}
              >
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300',
                    selected ? 'bg-accent text-accent-on' : 'bg-sunken text-ink-soft group-hover:text-ink'
                  )}
                >
                  <r.icon size={24} weight="light" aria-hidden />
                </span>
                <span className="mt-6 block pe-6 text-lg font-semibold leading-snug tracking-tight text-ink">{r.title}</span>
                <span
                  aria-hidden
                  className={cn(
                    'absolute end-5 top-5 flex h-6 w-6 items-center justify-center rounded-full ring-2 transition-colors duration-300',
                    selected ? 'bg-accent ring-accent' : 'ring-line'
                  )}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-accent-on" />}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          size="lg"
          variant="ink"
          fullWidth
          arrow={!!picked}
          disabled={!picked}
          onClick={() => picked && go({ role: picked, step: 'account' })}
          className="mt-8"
        >
          {cta}
        </Button>

        <p className="mt-8 text-center text-sm text-muted">
          {t('hasAccount')}{' '}
          <Link href={`/${locale}/login`} className={linkCls}>
            {t('loginLink')}
          </Link>
        </p>
      </div>
    );
  }

  return <AccountStep role={role!} total={2 + ONBOARDING_STEPS[role!]} next={next} justRegistered={justRegistered} onChangeRole={() => go({ role: role! })} updateUser={updateUser} />;
}

function AccountStep({
  role,
  total,
  next,
  justRegistered,
  onChangeRole,
  updateUser,
}: {
  role: Role;
  total: number;
  next: string | null;
  justRegistered: React.MutableRefObject<boolean>;
  onChangeRole: () => void;
  updateUser: (u: any) => void;
}) {
  const t = useTranslations('auth');
  const ts = useTranslations('signup');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<React.ReactNode>(null);

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(makeSchema(t)),
    shouldFocusError: true,
    defaultValues: { country: '', terms: false as unknown as true },
  });

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setFocus('name');
  }, [setFocus]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setFormError(null);
    try {
      justRegistered.current = true;
      const res = await authApi.register({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role,
        country: data.country || undefined,
      });
      const { token, user } = res.data.data;
      setAuth(token, user);
      updateUser(user);
      router.replace(`/${locale}/onboarding${next ? `?next=${encodeURIComponent(next)}` : ''}`);
    } catch (e: any) {
      justRegistered.current = false;
      const code = e.response?.data?.code;
      if (code === 'email_taken') {
        setFormError(
          <>
            {t('errEmailTaken')}{' '}
            <Link href={`/${locale}/login`} className="underline underline-offset-4">
              {t('logInInstead')}
            </Link>
          </>
        );
        setFocus('email');
      } else if (!e.response) {
        setFormError(t('errNetwork'));
      } else {
        setFormError(t('errServer'));
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] animate-fade-up">
      <StepProgress current={2} total={total} />

      <button
        type="button"
        onClick={onChangeRole}
        className="group mt-8 inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          weight="bold"
          aria-hidden
          className="transition-transform duration-300 group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5"
        />
        {ts('changeRole')}
      </button>

      <h1 className="display mt-4 text-4xl text-ink">
        {role === 'client' ? ts('accountTitleClient') : ts('accountTitleFreelancer')}
      </h1>

      <div aria-live="assertive" aria-atomic="true">
        {formError && (
          <div role="alert" className="mt-8 flex animate-fade-in gap-3 rounded-2xl bg-danger-soft p-4 text-sm font-medium leading-relaxed text-danger">
            <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
            <span>{formError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate method="post">
        <Input
          label={t('name')}
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          icon={<User size={17} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label={t('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="name@company.com"
          icon={<Envelope size={17} />}
          error={errors.email?.message}
          {...register('email', { onChange: () => setFormError(null) })}
        />
        <PasswordInput
          label={t('password')}
          autoComplete="new-password"
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          {...register('password')}
        />
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <CountrySelect
              label={ts('country')}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={ts('countryPlaceholder')}
              helperText={ts('countryHint')}
            />
          )}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
            <input
              type="checkbox"
              aria-invalid={!!errors.terms || undefined}
              aria-describedby={errors.terms ? 'terms-msg' : undefined}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded-md border-line accent-[rgb(var(--accent))]"
              {...register('terms')}
            />
            <span>
              {t.rich('termsAgree', {
                terms: (chunks) => (
                  <Link href={`/${locale}/terms`} target="_blank" className={linkCls}>
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link href={`/${locale}/privacy`} target="_blank" className={linkCls}>
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
          {errors.terms && (
            <p id="terms-msg" role="alert" className="mt-2 text-[13px] font-medium text-danger">
              {errors.terms.message}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth size="lg" variant="ink" loading={loading}>
          {loading ? ts('creating') : ts('createAccount')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/login`} className={linkCls}>
          {t('loginLink')}
        </Link>
      </p>
    </div>
  );
}
