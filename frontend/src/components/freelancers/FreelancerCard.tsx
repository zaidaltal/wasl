import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLocale } from 'next-intl';
import { User, FreelancerProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface FreelancerCardProps {
  user: User & { freelancer_profile?: FreelancerProfile };
  className?: string;
}

export function FreelancerCard({ user, className }: FreelancerCardProps) {
  const locale = useLocale();
  const profile = user.freelancer_profile;
  const skills = profile?.skills?.slice(0, 3) || [];

  return (
    <Link
      href={`/${locale}/freelancers/${user.id}`}
      className={`block bg-white dark:bg-night-card rounded-card border border-line dark:border-night-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-150 p-6 ${className || ''}`}
    >
      <div className="flex items-start gap-4">
        <Avatar src={user.avatar} name={user.name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink dark:text-white truncate">{user.name}</h3>
          {profile?.bio && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{profile.bio}</p>
          )}
          {user.country && (
            <p className="flex items-center gap-1 text-xs text-muted mt-1.5">
              <MapPin size={11} />
              {user.country}
              {user.city ? `, ${user.city}` : ''}
            </p>
          )}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {skills.map((skill, i) => (
            <Badge key={i} variant="neutral">{skill}</Badge>
          ))}
          {(profile?.skills?.length || 0) > 3 && (
            <Badge variant="neutral">+{(profile?.skills?.length || 0) - 3}</Badge>
          )}
        </div>
      )}

      {profile?.hourly_rate && (
        <p className="mt-4 pt-4 border-t border-line dark:border-night-border text-sm font-semibold text-primary-600 dark:text-primary-400">
          {formatCurrency(profile.hourly_rate, locale)}
          <span className="text-xs font-normal text-muted">/{locale === 'ar' ? 'ساعة' : 'hr'}</span>
        </p>
      )}
    </Link>
  );
}
