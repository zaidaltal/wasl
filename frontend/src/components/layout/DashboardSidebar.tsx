'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, SquaresFour, User, UsersThree } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  locale: string;
}

export function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user } = useAuth();

  const dashboardPath = user?.role === 'client' ? `/${locale}/dashboard/client` : `/${locale}/dashboard/freelancer`;

  const items = [
    { href: dashboardPath, label: t('dashboard'), icon: SquaresFour },
    { href: `/${locale}/jobs`, label: t('jobs'), icon: Briefcase },
    { href: `/${locale}/freelancers`, label: t('freelancers'), icon: UsersThree },
    { href: `/${locale}/profile`, label: t('profile'), icon: User },
  ];

  return (
    <>
      {/* Desktop: sticky rail with labels */}
      <aside className="hidden w-60 shrink-0 md:block">
        <nav className="shell sticky top-28" aria-label="Dashboard">
          <div className="core space-y-1 p-2">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-colors duration-300 ease-fluid',
                    active ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-sunken hover:text-ink'
                  )}
                >
                  <Icon size={19} weight={active ? 'fill' : 'regular'} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Mobile: floating bottom pill bar */}
      <nav
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex rounded-full bg-surface/85 p-1.5 shadow-lift ring-1 ring-ink/[0.07] backdrop-blur-xl md:hidden"
        aria-label="Dashboard"
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[10px] font-semibold transition-colors duration-300',
                active ? 'bg-ink text-canvas' : 'text-muted'
              )}
            >
              <Icon size={19} weight={active ? 'fill' : 'regular'} />
              <span className="max-w-full truncate px-1">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
