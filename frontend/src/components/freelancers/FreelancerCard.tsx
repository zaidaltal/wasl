import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLocale } from 'next-intl';
import { User, FreelancerProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatCurrency } from '@/lib/utils';

interface FreelancerCardProps {
  user: User & { freelancer_profile?: FreelancerProfile };
  className?: string;
}

export function FreelancerCard({ user, className }: FreelancerCardProps) {
  const locale = useLocale();
  const profile = user.freelancer_profile;
  const skills = profile?.skills?.slice(0, 3) || [];
  const extraSkills = (profile?.skills?.length || 0) - 3;

  return (
    <Link
      href={`/${locale}/freelancers/${user.id}`}
      className={`group cursor-pointer block bg-white dark:bg-night-card rounded-xl border border-outline-variant/60 dark:border-night-border shadow-sm hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 overflow-hidden ${className || ''}`}
    >
      {/* Accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-primary to-primary-container group-hover:opacity-100 opacity-60 transition-opacity duration-300" />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={user.avatar} name={user.name} size="lg" />
              <span className="absolute bottom-0 end-0 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-night-card" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-ink dark:text-white truncate group-hover:text-primary-container transition-colors duration-200">
                {user.name}
              </h3>
              {profile?.bio && (
                <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{profile.bio}</p>
              )}
              {user.country && (
                <p className="flex items-center gap-1 text-xs text-text-muted mt-1">
                  <MapPin size={10} />
                  {user.country}{user.city ? `, ${user.city}` : ''}
                </p>
              )}
            </div>
          </div>
          <span className="shrink-0 bg-success/10 text-success px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
            {locale === 'ar' ? 'متاح' : 'Available'}
          </span>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-1 mb-4">
          {[1,2,3,4,5].map((i) => (
            <span
              key={i}
              className="material-symbols-outlined text-amber-400 select-none"
              style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
            >
              star
            </span>
          ))}
          <span className="text-xs text-text-muted ms-1.5">5.0</span>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-surface-container dark:bg-night-border text-text-secondary dark:text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="bg-surface-container dark:bg-night-border text-text-muted px-3 py-1 rounded-full text-xs">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* Hourly rate */}
        {profile?.hourly_rate && (
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/60 dark:border-night-border">
            <span className="text-xs text-text-muted">{locale === 'ar' ? 'سعر الساعة' : 'Hourly Rate'}</span>
            <span className="text-primary-container font-bold text-base">
              {formatCurrency(profile.hourly_rate, locale)}
              <span className="text-xs font-normal text-text-muted ms-0.5">
                /{locale === 'ar' ? 'ساعة' : 'hr'}
              </span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
