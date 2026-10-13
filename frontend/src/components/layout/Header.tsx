'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { categoriesApi } from '@/lib/api';
import { iconFor } from '@/lib/categoryIcons';
import { Category } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { ButtonArrow, buttonClasses } from '@/components/ui/buttonStyles';
import { ArrowRight, CaretDown, Moon, Plus, SignOut, SquaresFour, Sun, User } from '@/components/ui/icons';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
}

/** Categories are shared by the desktop mega menu and the mobile sheet, fetched once on first open. */
function useCategories(enabled: boolean) {
  const [categories, setCategories] = useState<Category[] | null>(null);
  useEffect(() => {
    if (!enabled || categories) return;
    categoriesApi
      .getCategories()
      .then((r) => setCategories(r.data?.data || []))
      .catch(() => setCategories([]));
  }, [enabled, categories]);
  return categories;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const categories = useCategories(megaOpen || menuOpen);

  const otherLocale = locale === 'en' ? 'ar' : 'en';
  const switchLocale = () => router.push(pathname.replace(`/${locale}`, `/${otherLocale}`));
  const catName = (c: Category) => (locale === 'ar' ? c.name_ar : c.name_en);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push(`/${locale}`);
  };

  const dashboardPath =
    user?.role === 'admin'
      ? `/${locale}/admin`
      : user?.role === 'client'
        ? `/${locale}/dashboard/client`
        : `/${locale}/dashboard/freelancer`;

  // Clients go straight to their dashboard to post; everyone else signs up as a client first.
  const postJobHref = user?.role === 'client' ? `/${locale}/dashboard/client` : `/${locale}/register?role=client`;

  const navLinks = [
    { href: `/${locale}/jobs`, label: t('jobs') },
    { href: `/${locale}/freelancers`, label: t('freelancers') },
  ];
  const howItWorksHref = `/${locale}#how-it-works`;

  // Close overlays on route change and on Escape; lock scroll while the mobile sheet is open.
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
        setMegaOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!userMenuOpen && !megaOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (userMenuOpen && !userMenuRef.current?.contains(target)) setUserMenuOpen(false);
      if (megaOpen && !megaRef.current?.contains(target)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [userMenuOpen, megaOpen]);

  const iconBtn =
    'flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors duration-300 ease-fluid hover:bg-sunken hover:text-ink';
  const navItem = 'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ease-fluid';
  const menuItem =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-sunken hover:text-ink';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <div
          ref={megaRef}
          className={cn(
            'relative mx-auto flex h-16 max-w-page items-center justify-between gap-3 rounded-full ps-5 pe-2',
            'bg-surface/75 shadow-soft ring-1 ring-ink/[0.07] backdrop-blur-xl backdrop-saturate-150'
          )}
        >
          <div className="flex items-center gap-6 xl:gap-8">
            <Logo locale={locale} />

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t('mainMenu')}>
              {navLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(navItem, active ? 'bg-ink text-canvas' : 'text-ink-soft hover:bg-sunken hover:text-ink')}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                className={cn(
                  navItem,
                  'inline-flex items-center gap-1.5',
                  megaOpen ? 'bg-sunken text-ink' : 'text-ink-soft hover:bg-sunken hover:text-ink'
                )}
              >
                {t('categories')}
                <CaretDown
                  size={12}
                  weight="bold"
                  aria-hidden
                  className={cn('transition-transform duration-300 ease-fluid', megaOpen && 'rotate-180')}
                />
              </button>

              <Link href={howItWorksHref} className={cn(navItem, 'text-ink-soft hover:bg-sunken hover:text-ink')}>
                {t('howItWorks')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={switchLocale}
              className="hidden h-10 items-center rounded-full px-3.5 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:bg-sunken hover:text-ink sm:flex"
              lang={otherLocale}
            >
              {otherLocale === 'ar' ? 'العربية' : 'English'}
            </button>

            <button onClick={toggleTheme} className={cn(iconBtn, 'hidden sm:flex')} aria-label={t('toggleTheme')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative ms-1" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full p-1 pe-3 transition-colors duration-300 hover:bg-sunken"
                  aria-expanded={userMenuOpen}
                  aria-controls="user-menu"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="hidden max-w-28 truncate text-sm font-semibold text-ink sm:block">{user.name}</span>
                  <CaretDown
                    size={12}
                    weight="bold"
                    aria-hidden
                    className={cn('hidden text-muted transition-transform duration-300 sm:block', userMenuOpen && 'rotate-180')}
                  />
                </button>

                {userMenuOpen && (
                  <div id="user-menu" className="shell absolute end-0 mt-3 w-60 animate-sheet-in bg-surface/60 backdrop-blur-xl">
                    <div className="core p-1.5">
                      <div className="px-3 pb-2 pt-2.5">
                        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                      <Link href={dashboardPath} className={menuItem}>
                        <SquaresFour size={17} aria-hidden />
                        {t('dashboard')}
                      </Link>
                      {user.role === 'client' && (
                        <Link href={postJobHref} className={menuItem}>
                          <Plus size={17} aria-hidden />
                          {t('postJob')}
                        </Link>
                      )}
                      <Link href={`/${locale}/profile`} className={menuItem}>
                        <User size={17} aria-hidden />
                        {t('profile')}
                      </Link>
                      <div className="my-1 h-px bg-line" />
                      <button onClick={handleLogout} className={cn(menuItem, 'hover:text-danger')}>
                        <SignOut size={17} aria-hidden className="rtl:-scale-x-100" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href={`/${locale}/login`}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors duration-300 hover:bg-sunken hover:text-ink"
                >
                  {t('login')}
                </Link>
                <Link href={`/${locale}/register`} className={buttonClasses({ variant: 'ink', size: 'md', className: 'ps-5' })}>
                  {t('register')}
                  <ButtonArrow />
                </Link>
              </div>
            )}

            {/* Hamburger: two bars morph into an X */}
            <button
              className={cn(iconBtn, 'relative lg:hidden')}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={cn(
                  'absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-fluid',
                  menuOpen ? 'rotate-45' : '-translate-y-[4px]'
                )}
              />
              <span
                className={cn(
                  'absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-fluid',
                  menuOpen ? '-rotate-45' : 'translate-y-[4px]'
                )}
              />
            </button>
          </div>

          {/* Desktop mega menu */}
          {megaOpen && (
            <div id="mega-menu" className="absolute inset-x-0 top-full z-10 hidden pt-3 lg:block">
              <div className="shell mx-auto max-w-[920px] animate-sheet-in bg-surface/60 backdrop-blur-xl">
                <div className="core grid grid-cols-[1fr_280px] gap-2 p-2">
                  <div className="p-4">
                    <p className="mb-3 px-2 text-[13px] font-semibold text-muted">{t('categories')}</p>
                    {categories === null ? (
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <Skeleton key={i} className="h-11" />
                        ))}
                      </div>
                    ) : (
                      <ul className="grid grid-cols-3 gap-1">
                        {categories.slice(0, 15).map((c) => {
                          const CatIcon = iconFor(c.name_en);
                          return (
                            <li key={c.id}>
                              <Link
                                href={`/${locale}/jobs?category_id=${c.id}`}
                                className="group flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-sunken hover:text-ink"
                              >
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-soft transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-on">
                                  <CatIcon size={16} aria-hidden />
                                </span>
                                <span className="truncate">{catName(c)}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <Link
                      href={`/${locale}/jobs`}
                      className="group mt-3 inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-ink hover:text-accent"
                    >
                      {t('allCategories')}
                      <ArrowRight
                        size={14}
                        weight="bold"
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                      />
                    </Link>
                  </div>

                  <div className="flex flex-col rounded-[1rem] bg-accent-soft p-6">
                    <p className="text-lg font-semibold tracking-tight text-ink">{t('megaTitle')}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t('megaBody')}</p>
                    <div className="mt-auto space-y-2 pt-6">
                      <Link href={postJobHref} className={buttonClasses({ variant: 'ink', fullWidth: true, className: 'pe-2' })}>
                        {t('postJob')}
                        <ButtonArrow />
                      </Link>
                      <Link
                        href={howItWorksHref}
                        className={buttonClasses({ variant: 'ghost', fullWidth: true, className: 'hover:bg-accent/10' })}
                      >
                        {t('howItWorks')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile and tablet full-screen sheet */}
      <div
        id="mobile-menu"
        className={cn(
          'fixed inset-0 z-30 bg-canvas/90 backdrop-blur-2xl transition-[opacity,visibility] duration-500 ease-fluid lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28">
          <nav className="flex flex-col gap-1" aria-label={t('mainMenu')}>
            {[
              ...navLinks,
              { href: howItWorksHref, label: t('howItWorks') },
              ...(user ? [{ href: dashboardPath, label: t('dashboard') }] : []),
            ].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${100 + i * 60}ms` : '0ms' }}
                className={cn(
                  'py-2.5 text-[2rem] font-semibold leading-tight tracking-tight text-ink transition-[transform,opacity] duration-700 ease-fluid',
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div
            style={{ transitionDelay: menuOpen ? '340ms' : '0ms' }}
            className={cn(
              'mt-8 transition-[transform,opacity] duration-700 ease-fluid',
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            <p className="mb-3 text-[13px] font-semibold text-muted">{t('categories')}</p>
            <ul className="flex flex-wrap gap-2">
              {(categories ?? []).slice(0, 10).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/${locale}/jobs?category_id=${c.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-full bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft ring-1 ring-inset ring-line transition-colors hover:text-ink"
                  >
                    {catName(c)}
                  </Link>
                </li>
              ))}
              {categories === null &&
                [...Array(6)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-9 w-24 rounded-full" />
                  </li>
                ))}
            </ul>
          </div>

          <div
            style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}
            className={cn(
              'mt-auto space-y-3 pt-10 transition-[transform,opacity] duration-700 ease-fluid',
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            <div className="flex gap-2">
              <button onClick={switchLocale} className={buttonClasses({ variant: 'secondary', className: 'flex-1' })} lang={otherLocale}>
                {otherLocale === 'ar' ? 'العربية' : 'English'}
              </button>
              <button onClick={toggleTheme} className={buttonClasses({ variant: 'secondary', className: 'w-11 px-0' })} aria-label={t('toggleTheme')}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            {user ? (
              <button onClick={handleLogout} className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}>
                {t('logout')}
              </button>
            ) : (
              <>
                <Link href={`/${locale}/login`} className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}>
                  {t('login')}
                </Link>
                <Link href={`/${locale}/register`} className={buttonClasses({ variant: 'ink', size: 'lg', fullWidth: true })}>
                  {t('register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
