import Link from 'next/link';
import { MapPin, Star, DollarSign } from 'lucide-react';
import { useLocale } from 'next-intl';
import { User, FreelancerProfile } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface FreelancerCardProps {
  user: User & { freelancer_profile?: FreelancerProfile };
}

export function FreelancerCard({ user }: FreelancerCardProps) {
  const locale = useLocale();
  const profile = user.freelancer_profile;
  const skills = profile?.skills?.slice(0, 3) || [];

  return (
    <Card hover className="p-5">
      <Link href={`/${locale}/freelancers/${user.id}`} className="block">
        <div className="flex items-start gap-4">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
            {user.country && (
              <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin size={11} />
                {user.country}{user.city ? `, ${user.city}` : ''}
              </p>
            )}
            {profile?.hourly_rate && (
              <p className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                <DollarSign size={13} />
                {formatCurrency(profile.hourly_rate, locale)}/hr
              </p>
            )}
          </div>
        </div>

        {profile?.bio && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3">
            {profile.bio}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.map((skill, i) => (
              <Badge key={i} variant="info">{skill}</Badge>
            ))}
            {(profile?.skills?.length || 0) > 3 && (
              <Badge variant="default">+{(profile?.skills?.length || 0) - 3}</Badge>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
}
