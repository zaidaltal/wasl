'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Briefcase, User, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  locale: string;
}

export function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user } = useAuth();

  const dashboardPath =
    user?.role === 'client' ? `/${locale}/dashboard/client` : `/${locale}/dashboard/freelancer`;

  const items = [
    { href: dashboardPath, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/jobs`, label: t('jobs'), icon: Briefcase },
    { href: `/${locale}/freelancers`, label: t('freelancers'), icon: Users },
    { href: `/${locale}/profile`, label: t('profile'), icon: User },
  ];

  const linkCls = (active: boolean) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
      active
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-card'
    );

  return (
    <>
      {/* Desktop sidebar — 240px */}
      <aside className="hidden md:block w-60 flex-shrink-0">
        <nav
          className="sticky top-24 bg-white dark:bg-night-card rounded-card border border-line dark:border-night-border shadow-card p-3 space-y-1"
          aria-label="Dashboard"
        >
          {items.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkCls(pathname === href)}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-night-bg border-t border-line dark:border-night-border flex"
        aria-label="Dashboard"
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150',
                active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
