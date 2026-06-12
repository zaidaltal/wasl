'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Sun, Moon, Globe, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === 'en' ? 'ar' : 'en';

  const switchLocale = () => {
    router.push(pathname.replace(`/${locale}`, `/${otherLocale}`));
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push(`/${locale}`);
  };

  const dashboardPath =
    user?.role === 'admin'
      ? `/${locale}/admin`
      : user?.role === 'client'
        ? `/${locale}/dashboard/client`
        : `/${locale}/dashboard/freelancer`;

  const navLinks = [
    { href: `/${locale}/jobs`, label: t('jobs') },
    { href: `/${locale}/freelancers`, label: t('freelancers') },
  ];

  const iconBtn =
    'p-2 rounded-lg text-gray-500 hover:text-ink dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-night-card transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-surface-white dark:bg-night-bg border-b border-outline-variant dark:border-night-border">
      <div className="max-w-container-max mx-auto h-full px-margin-desktop flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Logo locale={locale} />

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6" aria-label="Main">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-bold transition-colors py-1 text-sm',
                    active
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-text-muted hover:text-primary dark:text-gray-300 dark:hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button onClick={switchLocale} className={cn(iconBtn, 'flex items-center gap-1.5 text-sm font-medium')}>
            <Globe size={15} />
            <span className="hidden sm:inline">{otherLocale === 'ar' ? 'العربية' : 'English'}</span>
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-container dark:hover:bg-night-card transition-colors"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <span className="text-sm font-medium text-text-primary dark:text-gray-300 hidden sm:block max-w-24 truncate">
                  {user.name}
                </span>
                <ChevronDown size={14} className="text-text-muted hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div
                    role="menu"
                    className="absolute end-0 mt-2 w-52 bg-surface-white dark:bg-night-card rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] border border-outline-variant dark:border-night-border z-20 overflow-hidden animate-fade-in"
                  >
                    <Link
                      href={dashboardPath}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-night-border/40 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {t('dashboard')}
                    </Link>
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary dark:text-gray-300 hover:bg-surface-container-low dark:hover:bg-night-border/40 transition-colors"
                    >
                      <User size={16} />
                      {t('profile')}
                    </Link>
                    <hr className="border-outline-variant dark:border-night-border" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      {t('logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="text-primary font-bold text-sm hover:opacity-80 transition-all"
              >
                {t('login')}
              </button>
              <button
                onClick={() => router.push(`/${locale}/register`)}
                className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
              >
                {t('register')}
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className={cn(iconBtn, 'md:hidden')}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile slide-in panel */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 end-0 w-72 max-w-[85vw] bg-white dark:bg-night-bg shadow-card-hover animate-slide-in-end rtl:animate-fade-in flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b border-line dark:border-night-border">
              <Logo locale={locale} />
              <button className={iconBtn} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                    pathname.startsWith(link.href)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-night-card'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {!user && (
              <div className="p-4 border-t border-line dark:border-night-border space-y-2">
                <Button variant="secondary" fullWidth onClick={() => { setMenuOpen(false); router.push(`/${locale}/login`); }}>
                  {t('login')}
                </Button>
                <Button fullWidth onClick={() => { setMenuOpen(false); router.push(`/${locale}/register`); }}>
                  {t('register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
