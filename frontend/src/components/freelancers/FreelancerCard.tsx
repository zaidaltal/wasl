import { useLocale, useTranslations } from 'next-intl';
import { User, FreelancerProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { MapPin } from '@/components/ui/icons';
import { cn, formatCurrency } from '@/lib/utils';

interface FreelancerCardProps {
  user: User & { freelancer_profile?: FreelancerProfile };
  className?: string;
  /** Heading level for the name: 2 on listing pages, 3 under a section heading */
  headingLevel?: 2 | 3;
}

export function FreelancerCard({ user, className, headingLevel = 3 }: FreelancerCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const t = useTranslations('freelancers');
  const locale = useLocale();
  const profile = user.freelancer_profile;
  const skills = profile?.skills?.slice(0, 3) || [];
  const extraSkills = (profile?.skills?.length || 0) - skills.length;
  const rate = Number(profile?.hourly_rate) || 0;

  return (
    <article
      className={cn(
        'shell h-full transition-[transform,box-shadow] duration-500 ease-fluid hover:-translate-y-1 hover:shadow-lift',
        className
      )}
    >
      <div className="core flex h-full flex-col p-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div className="min-w-0">
            <Heading className="truncate text-base font-semibold tracking-tight text-ink">{user.name}</Heading>
            {user.country && (
              <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                <MapPin size={13} aria-hidden />
                <span className="truncate">
                  {user.city ? `${user.city}, ` : ''}
                  {user.country}
                </span>
              </p>
            )}
          </div>
        </div>

        <p
          className={cn(
            'mt-5 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed',
            profile?.bio ? 'text-ink-soft' : 'italic text-muted'
          )}
        >
          {profile?.bio || t('noBio')}
        </p>

        {skills.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Skills">
            {skills.map((skill) => (
              <li key={skill} className="rounded-full bg-sunken px-3 py-1 text-xs font-medium text-ink-soft">
                {skill}
              </li>
            ))}
            {extraSkills > 0 && (
              <li className="num rounded-full px-2 py-1 text-xs font-medium text-muted">+{extraSkills}</li>
            )}
          </ul>
        )}

        <div aria-hidden className="min-h-5 flex-1" />
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="text-[13px] text-muted">{t('rateLabel')}</span>
          {rate > 0 ? (
            <span className="num text-base font-semibold text-ink">
              {formatCurrency(rate, locale)}
              <span className="ms-0.5 text-xs font-medium text-muted">{t('perHour')}</span>
            </span>
          ) : (
            <span className="text-[13px] font-medium text-ink-soft">{t('rateOnRequest')}</span>
          )}
        </div>
      </div>
    </article>
  );
}
