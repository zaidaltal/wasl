'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { usersApi, freelancersApi, clientsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { CountrySelect } from '@/components/ui/CountrySelect';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Camera, Link as LinkIcon, Plus, X } from '@/components/ui/icons';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="shell animate-fade-up">
      <div className="core p-6 sm:p-8">
        <h2 className="mb-6 text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tDash = useTranslations('dashboard');
  const tRoles = useTranslations('roles');
  const locale = useLocale();
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLink, setNewLink] = useState('');

  const [form, setForm] = useState({
    name: '',
    country: '',
    city: '',
    bio: '',
    hourly_rate: '',
    skills: [] as string[],
    portfolio_links: [] as string[],
    company_name: '',
    company_description: '',
    website: '',
  });

  useEffect(() => {
    // Wait for the stored session to load before deciding the user is signed out
    if (isLoading) return;
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    const load = async () => {
      const userRes = await usersApi.getUser(user.id);
      const u = userRes.data?.data;
      if (user.role === 'freelancer') {
        const fpRes = await freelancersApi.getProfile(user.id);
        const fp = fpRes.data?.data;
        setForm({
          name: u?.name || '',
          country: u?.country || '',
          city: u?.city || '',
          bio: fp?.bio || '',
          hourly_rate: fp?.hourly_rate || '',
          skills: fp?.skills || [],
          portfolio_links: fp?.portfolio_links || [],
          company_name: '',
          company_description: '',
          website: '',
        });
      } else if (user.role === 'client') {
        const cpRes = await clientsApi.getProfile(user.id);
        const cp = cpRes.data?.data;
        setForm({
          name: u?.name || '',
          country: u?.country || '',
          city: u?.city || '',
          bio: '',
          hourly_rate: '',
          skills: [],
          portfolio_links: [],
          company_name: cp?.company_name || '',
          company_description: cp?.company_description || '',
          website: cp?.website || '',
        });
      }
    };
    load().catch(() => toast.error(tDash('actionError')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await usersApi.uploadAvatar(user.id, fd);
      updateUser({ ...user, avatar: res.data?.data?.avatar });
      toast.success(t('avatarUpdated'));
    } catch {
      toast.error(t('avatarError'));
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const userPayload = { name: form.name, country: form.country, city: form.city };
      await usersApi.updateUser(user.id, userPayload as any);
      updateUser({ ...user, ...userPayload });

      if (user.role === 'freelancer') {
        await freelancersApi.updateProfile(user.id, {
          bio: form.bio,
          hourly_rate: Number(form.hourly_rate),
          skills: form.skills,
          portfolio_links: form.portfolio_links,
        });
      } else if (user.role === 'client') {
        await clientsApi.updateProfile(user.id, {
          company_name: form.company_name,
          company_description: form.company_description,
          website: form.website,
        });
      }
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s] });
    setNewSkill('');
  };

  const addLink = () => {
    const l = newLink.trim();
    if (l) setForm({ ...form, portfolio_links: [...form.portfolio_links, l] });
    setNewLink('');
  };

  if (!user) return null;

  return (
    <div className="container-page max-w-4xl pb-16 pt-32 sm:pt-36">
      {/* Identity header */}
      <div className="flex animate-fade-up flex-col gap-6 sm:flex-row sm:items-end">
        <div className="relative w-fit">
          <div className="shell p-1.5">
            <Avatar src={user.avatar} name={user.name} size="xl" className="rounded-[1.375rem]" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -end-1 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-canvas shadow-lift ring-4 ring-canvas transition-transform duration-300 ease-fluid hover:scale-105 active:scale-95"
            aria-label={t('photo')}
          >
            <Camera size={17} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div className="pb-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="display text-4xl text-ink">{user.name}</h1>
            <Badge variant="success">
              {tRoles(user.role)}
            </Badge>
          </div>
          <p className="mt-2 text-[15px] text-muted">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <Section title={t('basicInfo')}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label={t('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <CountrySelect
              label={t('country')}
              value={form.country}
              onChange={(country) => setForm({ ...form, country })}
              placeholder={t('selectCountry')}
            />
            <div className="sm:col-span-2">
              <Input label={t('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
        </Section>

        {user.role === 'freelancer' && (
          <>
            <Section title={t('professional')}>
              <div className="space-y-5">
                <Textarea label={t('bio')} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
                <div className="sm:max-w-xs">
                  <Input
                    label={t('hourlyRate')}
                    type="number"
                    inputMode="decimal"
                    value={form.hourly_rate}
                    onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
                  />
                </div>
              </div>
            </Section>

            <Section title={t('skills')}>
              {form.skills.length > 0 ? (
                <ul className="mb-5 flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => (
                    <li
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-accent-soft py-1.5 pe-1.5 ps-3.5 text-sm font-medium text-accent-strong"
                    >
                      {skill}
                      <button
                        onClick={() => setForm({ ...form, skills: form.skills.filter((_, j) => j !== i) })}
                        className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-accent/15"
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={12} weight="bold" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-5 text-sm text-muted">{t('noSkills')}</p>
              )}
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t('addSkill')}
                  aria-label={t('addSkill')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button variant="secondary" onClick={addSkill} className="h-12 shrink-0">
                  <Plus size={16} weight="bold" aria-hidden />
                  {t('add')}
                </Button>
              </div>
            </Section>

            <Section title={t('portfolio')}>
              {form.portfolio_links.length > 0 ? (
                <ul className="mb-5 space-y-2">
                  {form.portfolio_links.map((link, i) => (
                    <li key={`${link}-${i}`} className="flex items-center gap-3 rounded-xl bg-sunken/60 px-4 py-3">
                      <LinkIcon size={16} className="shrink-0 text-muted" aria-hidden />
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 truncate text-sm font-medium text-ink hover:text-accent"
                        dir="ltr"
                      >
                        {link}
                      </a>
                      <button
                        onClick={() => setForm({ ...form, portfolio_links: form.portfolio_links.filter((_, j) => j !== i) })}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger"
                        aria-label={`Remove ${link}`}
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-5 text-sm text-muted">{t('noLinks')}</p>
              )}
              <div className="flex gap-2">
                <Input
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://"
                  aria-label={t('portfolio')}
                  dir="ltr"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addLink();
                    }
                  }}
                />
                <Button variant="secondary" onClick={addLink} className="h-12 shrink-0">
                  <Plus size={16} weight="bold" aria-hidden />
                  {t('add')}
                </Button>
              </div>
            </Section>
          </>
        )}

        {user.role === 'client' && (
          <Section title={t('company')}>
            <div className="space-y-5">
              <Input label={t('companyName')} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              <Textarea
                label={t('companyDescription')}
                value={form.company_description}
                onChange={(e) => setForm({ ...form, company_description: e.target.value })}
              />
              <Input
                label={t('website')}
                type="url"
                placeholder="https://"
                dir="ltr"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
          </Section>
        )}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-20 mt-8 flex justify-end">
        <div className="flex items-center gap-2 rounded-full bg-surface/80 p-1.5 shadow-lift ring-1 ring-ink/[0.07] backdrop-blur-xl">
          <Button variant="ghost" onClick={() => router.back()}>
            {tDash('cancel')}
          </Button>
          <Button onClick={handleSave} loading={saving} variant="ink">
            {t('save')}
          </Button>
        </div>
      </div>
    </div>
  );
}
