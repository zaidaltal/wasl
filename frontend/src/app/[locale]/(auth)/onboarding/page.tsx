'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { categoriesApi, clientsApi, freelancersApi } from '@/lib/api';
import { iconFor } from '@/lib/categoryIcons';
import { suggestSkills } from '@/lib/skillSuggestions';
import { ONBOARDING_STEPS } from '@/lib/onboarding';
import { homeFor, safeNext } from '@/lib/authRedirect';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ButtonArrow, buttonClasses } from '@/components/ui/buttonStyles';
import { ArrowLeft, Check, Plus, WarningCircle } from '@/components/ui/icons';
import { StepProgress } from '@/components/auth/StepProgress';
import { FreelancerCard } from '@/components/freelancers/FreelancerCard';
import { cn } from '@/lib/utils';

const MAX_SKILLS = 15;
const MAX_BIO = 600;
const RATE_PRESETS = [15, 25, 40, 60];

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const tF = useTranslations('freelancers');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const role = user?.role === 'client' ? 'client' : 'freelancer';
  const totalQuestions = ONBOARDING_STEPS[role];
  const qParam = searchParams.get('q');
  const done = qParam === 'done';
  const q = done ? totalQuestions : Math.min(Math.max(0, Number(qParam) || 0), totalQuestions - 1);
  const next = safeNext(searchParams.get('next'), locale);

  // Answers
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [rate, setRate] = useState('');
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [solo, setSolo] = useState(false);
  const [about, setAbout] = useState('');
  const [website, setWebsite] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gate: signed-in clients and freelancers only
  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace(`/${locale}/login?next=${encodeURIComponent(`/${locale}/onboarding`)}`);
    else if (user.role === 'admin') router.replace(homeFor(user, locale));
  }, [isLoading, user, locale, router]);

  // Prefill from anything already saved, so returning to onboarding never wipes answers
  useEffect(() => {
    if (!user) return;
    if (user.role === 'freelancer') {
      categoriesApi.getCategories().then((r) => setCategories(r.data?.data || [])).catch(() => setCategories([]));
      freelancersApi
        .getProfile(user.id)
        .then((r) => {
          const p = r.data?.data;
          if (p?.skills?.length) setSkills(p.skills);
          if (Number(p?.hourly_rate) > 0) setRate(String(Number(p.hourly_rate)));
          if (p?.bio) setBio(p.bio);
        })
        .catch(() => {});
    } else if (user.role === 'client') {
      clientsApi
        .getProfile(user.id)
        .then((r) => {
          const p = r.data?.data;
          if (p?.company_name) setCompany(p.company_name);
          if (p?.company_description) setAbout(p.company_description);
          if (p?.website) setWebsite(p.website);
        })
        .catch(() => {});
    }
  }, [user]);

  // Move focus to each new question so screen readers announce it
  useEffect(() => {
    headingRef.current?.focus();
    setError(null);
  }, [q, done]);

  const suggestions = useMemo(() => {
    const base = suggestSkills(category?.name_en);
    return [...base, ...skills.filter((s) => !base.includes(s))];
  }, [category, skills]);

  const goTo = (step: number | 'done') => {
    const qs = new URLSearchParams();
    qs.set('q', String(step));
    if (next) qs.set('next', next);
    router.push(`${pathname}?${qs.toString()}`, { scroll: false });
  };

  const save = async (data: object) => {
    if (!user) return false;
    setSaving(true);
    setError(null);
    try {
      if (user.role === 'freelancer') await freelancersApi.updateProfile(user.id, data);
      else await clientsApi.updateProfile(user.id, data);
      return true;
    } catch {
      setError(t('saveError'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const advance = () => goTo(q + 1 >= totalQuestions ? 'done' : q + 1);

  // Each "Next" saves only that question's answer
  const onNext = async () => {
    let ok = true;
    if (role === 'freelancer') {
      if (q === 1) ok = await save({ skills });
      if (q === 2) ok = await save({ hourly_rate: rate ? Number(rate) : null });
      if (q === 3) ok = await save({ bio: bio.trim() });
    } else {
      if (q === 0) ok = await save({ company_name: solo ? user?.name || '' : company.trim() });
      if (q === 1) ok = await save({ company_description: about.trim(), website: website.trim() });
    }
    if (ok) advance();
  };

  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : cur.length >= MAX_SKILLS ? cur : [...cur, s]));

  const addCustom = () => {
    const s = customSkill.trim();
    if (s && !skills.includes(s) && skills.length < MAX_SKILLS) setSkills([...skills, s]);
    setCustomSkill('');
  };

  if (!user || user.role === 'admin') {
    return (
      <div className="w-full max-w-[520px] space-y-4">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const current = 2 + (done ? totalQuestions : q + 1);
  const total = 2 + totalQuestions;
  const firstName = user.name.split(' ')[0];

  // ---------- Finish screen ----------
  if (done) {
    const previewUser = {
      ...user,
      freelancer_profile: { id: 0, user_id: user.id, skills, bio, hourly_rate: Number(rate) || undefined },
    };
    return (
      <div className="w-full max-w-[520px] animate-fade-up">
        <StepProgress current={total} total={total} />
        <h1 ref={headingRef} tabIndex={-1} className="display mt-10 text-4xl text-ink focus:outline-none">
          {role === 'freelancer' ? t('fDoneTitle', { name: firstName }) : t('cDoneTitle', { name: firstName })}
        </h1>
        <p className="mt-3 text-[15px] text-muted">{role === 'freelancer' ? t('fDoneBody') : t('cDoneBody')}</p>

        {role === 'freelancer' && (
          <div className="mt-8">
            <FreelancerCard user={previewUser as any} />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row">
          <Link
            href={
              next ||
              (role === 'freelancer' ? `/${locale}/jobs` : `/${locale}/dashboard/client?post=1`)
            }
            className={buttonClasses({ variant: 'ink', size: 'lg', className: 'flex-1 pe-3' })}
          >
            {role === 'freelancer' ? t('fDoneCta') : t('cDoneCta')}
            <ButtonArrow />
          </Link>
          <Link href={homeFor(user, locale)} className={buttonClasses({ variant: 'secondary', size: 'lg', className: 'flex-1' })}>
            {t('goDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Questions ----------
  const questions =
    role === 'freelancer'
      ? [
          { title: t('fCategoryTitle'), hint: t('fCategoryHint') },
          { title: t('fSkillsTitle'), hint: t('fSkillsHint', { max: MAX_SKILLS }) },
          { title: t('fRateTitle'), hint: t('fRateHint') },
          { title: t('fBioTitle'), hint: t('fBioHint') },
        ]
      : [
          { title: t('cCompanyTitle'), hint: t('cCompanyHint') },
          { title: t('cAboutTitle'), hint: t('cAboutHint') },
        ];

  const canContinue =
    role === 'freelancer'
      ? q === 0
        ? !!category
        : q === 1
          ? skills.length > 0
          : q === 2
            ? Number(rate) > 0
            : bio.trim().length > 0
      : q === 0
        ? solo || company.trim().length > 0
        : about.trim().length > 0 || website.trim().length > 0;

  return (
    <div className="w-full max-w-[560px]">
      <StepProgress current={current} total={total} />

      <form
        key={q}
        className="animate-fade-up"
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue && !saving) onNext();
        }}
      >
        <h1 ref={headingRef} tabIndex={-1} className="display mt-10 text-4xl text-ink focus:outline-none">
          {questions[q].title}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{questions[q].hint}</p>

        <div className="mt-8">
          {/* Freelancer: category */}
          {role === 'freelancer' && q === 0 && (
            <div role="radiogroup" aria-label={questions[0].title} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories === null
                ? [...Array(9)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                : categories.map((c) => {
                    const Icon = iconFor(c.name_en);
                    const selected = category?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setCategory(c)}
                        className={cn(
                          'flex flex-col items-start gap-3 rounded-2xl p-4 text-start ring-1 ring-inset transition-[background-color,box-shadow,transform] duration-300 ease-fluid active:scale-[0.98]',
                          selected ? 'bg-accent-soft ring-2 ring-accent' : 'bg-surface ring-line hover:ring-ink/30'
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                            selected ? 'bg-accent text-accent-on' : 'bg-sunken text-ink-soft'
                          )}
                        >
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="text-sm font-semibold leading-snug text-ink">{locale === 'ar' ? c.name_ar : c.name_en}</span>
                      </button>
                    );
                  })}
            </div>
          )}

          {/* Freelancer: skills */}
          {role === 'freelancer' && q === 1 && (
            <div>
              <ul className="flex flex-wrap gap-2" aria-label={questions[1].title}>
                {suggestions.map((s) => {
                  const on = skills.includes(s);
                  const full = !on && skills.length >= MAX_SKILLS;
                  return (
                    <li key={s}>
                      <button
                        type="button"
                        aria-pressed={on}
                        disabled={full}
                        onClick={() => toggleSkill(s)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-[background-color,color,box-shadow] duration-200 active:scale-[0.97] disabled:opacity-40',
                          on ? 'bg-ink text-canvas ring-ink' : 'bg-surface text-ink-soft ring-line hover:text-ink hover:ring-ink/30'
                        )}
                      >
                        {on ? <Check size={14} weight="bold" aria-hidden /> : <Plus size={14} aria-hidden />}
                        {s}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 flex gap-2">
                <Input
                  aria-label={t('fAddSkill')}
                  placeholder={t('fAddSkillPlaceholder')}
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustom();
                    }
                  }}
                  maxLength={40}
                />
                <Button type="button" variant="secondary" onClick={addCustom} className="h-12 shrink-0" aria-label={t('fAddSkill')}>
                  <Plus size={16} weight="bold" aria-hidden />
                </Button>
              </div>
              <p className="num mt-3 text-[13px] text-muted" aria-live="polite">
                {t('fSelected', { count: skills.length, max: MAX_SKILLS })}
              </p>
            </div>
          )}

          {/* Freelancer: rate */}
          {role === 'freelancer' && q === 2 && (
            <div>
              <label htmlFor="rate" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                {t('fRateLabel')}
              </label>
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-2 ps-5 ring-1 ring-inset ring-line focus-within:ring-2 focus-within:ring-accent">
                <span className="display text-3xl text-muted">$</span>
                <input
                  id="rate"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={999}
                  step="1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="num display h-16 w-full min-w-0 bg-transparent text-4xl text-ink placeholder:text-muted/50 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  autoComplete="off"
                />
                <span className="shrink-0 pe-3 text-lg font-medium text-muted">{tF('perHour')}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {RATE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={Number(rate) === p}
                    onClick={() => setRate(String(p))}
                    className={cn(
                      'num rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors',
                      Number(rate) === p ? 'bg-ink text-canvas ring-ink' : 'bg-surface text-ink-soft ring-line hover:text-ink'
                    )}
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Freelancer: bio */}
          {role === 'freelancer' && q === 3 && (
            <div>
              <Textarea
                label={t('fBioLabel')}
                placeholder={t('fBioPlaceholder')}
                rows={6}
                maxLength={MAX_BIO}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="num mt-2 text-end text-[13px] text-muted">{t('chars', { count: bio.length, max: MAX_BIO })}</p>
            </div>
          )}

          {/* Client: company */}
          {role === 'client' && q === 0 && (
            <div className="space-y-5">
              <Input
                label={t('cCompanyLabel')}
                value={solo ? '' : company}
                disabled={solo}
                autoComplete="organization"
                onChange={(e) => setCompany(e.target.value)}
              />
              <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={solo}
                  onChange={(e) => setSolo(e.target.checked)}
                  className="h-[18px] w-[18px] cursor-pointer rounded-md accent-[rgb(var(--accent))]"
                />
                {t('cSolo')}
              </label>
            </div>
          )}

          {/* Client: about */}
          {role === 'client' && q === 1 && (
            <div className="space-y-5">
              <Textarea label={t('cAboutLabel')} rows={5} maxLength={MAX_BIO} value={about} onChange={(e) => setAbout(e.target.value)} />
              <Input
                label={t('cWebsite')}
                type="url"
                inputMode="url"
                placeholder="https://"
                autoComplete="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          )}
        </div>

        <div aria-live="assertive">
          {error && (
            <div role="alert" className="mt-6 flex gap-3 rounded-2xl bg-danger-soft p-4 text-sm font-medium text-danger">
              <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden />
              {error}
            </div>
          )}
        </div>

        {/* Footer: back, skip, next */}
        <div className="mt-10 flex items-center gap-3 border-t border-line pt-6">
          {q > 0 && (
            <button
              type="button"
              onClick={() => goTo(q - 1)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
            >
              <ArrowLeft size={14} weight="bold" aria-hidden className="rtl:-scale-x-100" />
              {t('back')}
            </button>
          )}
          <button
            type="button"
            onClick={advance}
            className="ms-auto inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-muted transition-colors hover:bg-sunken hover:text-ink"
          >
            {t('skip')}
          </button>
          <Button type="submit" variant="ink" disabled={!canContinue} loading={saving} arrow={!saving} className="pe-3">
            {saving ? t('saving') : q + 1 === totalQuestions ? t('finish') : t('next')}
          </Button>
        </div>
      </form>
    </div>
  );
}
