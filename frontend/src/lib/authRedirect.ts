import type { User } from '@/types';

/** Only same-site, same-locale paths are allowed as a post-login destination (no open redirects). */
export function safeNext(next: string | null, locale: string): string | null {
  if (!next || !next.startsWith(`/${locale}/`) || next.startsWith('//') || next.includes('://')) return null;
  if (/\/(login|register)(\/|\?|$)/.test(next)) return null;
  return next;
}

export function homeFor(user: User, locale: string) {
  if (user.role === 'admin') return `/${locale}/admin`;
  if (user.role === 'client') return `/${locale}/dashboard/client`;
  return `/${locale}/dashboard/freelancer`;
}
