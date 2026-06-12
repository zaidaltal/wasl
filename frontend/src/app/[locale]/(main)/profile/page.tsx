'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Camera, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usersApi, freelancersApi, clientsApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { COUNTRIES } from '@/lib/utils';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const locale = useLocale();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLink, setNewLink] = useState('');

  const [form, setForm] = useState({
    name: '', country: '', city: '',
    bio: '', hourly_rate: '', skills: [] as string[], portfolio_links: [] as string[],
    company_name: '', company_description: '', website: '',
  });

  useEffect(() => {
    if (!user) { router.push(`/${locale}/login`); return; }
    const load = async () => {
      const userRes = await usersApi.getUser(user.id);
      const u = userRes.data?.data;
      if (user.role === 'freelancer') {
        const fpRes = await freelancersApi.getProfile(user.id);
        const fp = fpRes.data?.data;
        setProfile(fp);
        setForm({
          name: u?.name || '', country: u?.country || '', city: u?.city || '',
          bio: fp?.bio || '', hourly_rate: fp?.hourly_rate || '',
          skills: fp?.skills || [], portfolio_links: fp?.portfolio_links || [],
          company_name: '', company_description: '', website: '',
        });
      } else if (user.role === 'client') {
        const cpRes = await clientsApi.getProfile(user.id);
        const cp = cpRes.data?.data;
        setProfile(cp);
        setForm({
          name: u?.name || '', country: u?.country || '', city: u?.city || '',
          bio: '', hourly_rate: '', skills: [], portfolio_links: [],
          company_name: cp?.company_name || '', company_description: cp?.company_description || '',
          website: cp?.website || '',
        });
      }
    };
    load();
  }, [user]);

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
          bio: form.bio, hourly_rate: Number(form.hourly_rate),
          skills: form.skills, portfolio_links: form.portfolio_links,
        });
      } else if (user.role === 'client') {
        await clientsApi.updateProfile(user.id, {
          company_name: form.company_name, company_description: form.company_description, website: form.website,
        });
      }
      toast.success(t('saved'));
    } catch {
      toast.error(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pb-10">
      {/* Profile cover header — Stitch style */}
      <div className="relative mb-10">
        <div className="h-[180px] bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden
          />
          <span className="absolute -end-6 -top-12 text-[180px] font-extrabold text-white/5 select-none pointer-events-none font-arabic leading-none" aria-hidden>
            وصل
          </span>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-xl border-4 border-white dark:border-night-bg shadow-md bg-white dark:bg-night-card overflow-hidden flex items-center justify-center">
                <Avatar src={user.avatar} name={user.name} size="xl" />
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -end-2 w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 shadow-lg transition-colors"
                aria-label={t('photo')}
              >
                <Camera size={15} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink dark:text-white">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400 text-xs font-bold rounded-full capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-text-muted text-sm">{t('title')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">

        {/* Basic info */}
        <Card>
          <CardHeader><h3 className="font-semibold text-gray-900 dark:text-white">{t('basicInfo')}</h3></CardHeader>
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={t('name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Select
              label={t('country')}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder={t('selectCountry')}
              options={COUNTRIES.map((c) => ({ value: c.value, label: locale === 'ar' ? c.label_ar : c.label_en }))}
            />
            <Input label={t('city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="sm:col-span-2" />
          </CardBody>
        </Card>

        {/* Freelancer-specific */}
        {user.role === 'freelancer' && (
          <>
            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900 dark:text-white">{t('professional')}</h3></CardHeader>
              <CardBody className="space-y-4">
                <Textarea label={t('bio')} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
                <Input label={t('hourlyRate')} type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900 dark:text-white">{t('skills')}</h3></CardHeader>
              <CardBody className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-secondary-container dark:bg-night-border text-on-secondary-fixed-variant dark:text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium">
                      {skill}
                      <button onClick={() => setForm({ ...form, skills: form.skills.filter((_, j) => j !== i) })} className="hover:text-primary-600 transition-colors duration-150" aria-label={`Remove ${skill}`}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder={t('addSkill')} onKeyDown={(e) => { if (e.key === 'Enter' && newSkill.trim()) { setForm({ ...form, skills: [...form.skills, newSkill.trim()] }); setNewSkill(''); }}} />
                  <Button variant="outline" onClick={() => { if (newSkill.trim()) { setForm({ ...form, skills: [...form.skills, newSkill.trim()] }); setNewSkill(''); }}}><Plus size={16} /></Button>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h3 className="font-semibold text-gray-900 dark:text-white">{t('portfolio')}</h3></CardHeader>
              <CardBody className="space-y-3">
                {form.portfolio_links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-primary-600 dark:text-primary-400 flex-1 truncate">{link}</span>
                    <button onClick={() => setForm({ ...form, portfolio_links: form.portfolio_links.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="https://..." onKeyDown={(e) => { if (e.key === 'Enter' && newLink.trim()) { setForm({ ...form, portfolio_links: [...form.portfolio_links, newLink.trim()] }); setNewLink(''); }}} />
                  <Button variant="outline" onClick={() => { if (newLink.trim()) { setForm({ ...form, portfolio_links: [...form.portfolio_links, newLink.trim()] }); setNewLink(''); }}}><Plus size={16} /></Button>
                </div>
              </CardBody>
            </Card>
          </>
        )}

        {/* Client-specific */}
        {user.role === 'client' && (
          <Card>
            <CardHeader><h3 className="font-semibold text-gray-900 dark:text-white">{t('company')}</h3></CardHeader>
            <CardBody className="space-y-4">
              <Input label={t('companyName')} value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
              <Textarea label={t('companyDescription')} value={form.company_description} onChange={(e) => setForm({ ...form, company_description: e.target.value })} />
              <Input label={t('website')} type="url" placeholder="https://" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </CardBody>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={saving} size="lg">{t('save')}</Button>
        </div>
      </div>
      </div>
    </div>
  );
}
