'use client';

import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 384 512" aria-hidden>
      <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 448 512" aria-hidden>
      <path fill="#0a66c2" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
    </svg>
  );
}

const soon = (provider: string) => () => toast(`${provider} sign-in coming soon`, { icon: '🔒' });

/** "Continue with Google" full-width pill + Apple/LinkedIn icon buttons (Sign In page). */
export function SocialSignIn() {
  const t = useTranslations('auth');
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={soon('Google')}
        className="w-full h-12 border border-line dark:border-night-border bg-white dark:bg-night-card text-ink dark:text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-grey dark:hover:bg-night-border transition-all active:scale-[0.98]"
      >
        <GoogleIcon />
        <span>{t('continueGoogle')}</span>
      </button>
      <div className="flex justify-center gap-4">
        <button type="button" onClick={soon('Apple')} title={t('apple')} className="p-2.5 rounded-full border border-line dark:border-night-border text-ink dark:text-white hover:bg-surface-grey dark:hover:bg-night-border transition-colors">
          <AppleIcon />
        </button>
        <button type="button" onClick={soon('LinkedIn')} title="LinkedIn" className="p-2.5 rounded-full border border-line dark:border-night-border hover:bg-surface-grey dark:hover:bg-night-border transition-colors">
          <LinkedInIcon />
        </button>
      </div>
    </div>
  );
}

/** Two-up Google / Apple pills (Create Account page). */
export function SocialRegister() {
  const t = useTranslations('auth');
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={soon('Google')}
        className="flex items-center justify-center gap-2 h-12 border border-line dark:border-night-border rounded-full bg-white dark:bg-night-card text-ink dark:text-white font-bold text-sm hover:bg-surface-grey dark:hover:bg-night-border transition-all active:scale-[0.98]"
      >
        <GoogleIcon />
        <span>{t('google')}</span>
      </button>
      <button
        type="button"
        onClick={soon('Apple')}
        className="flex items-center justify-center gap-2 h-12 border border-line dark:border-night-border rounded-full bg-white dark:bg-night-card text-ink dark:text-white font-bold text-sm hover:bg-surface-grey dark:hover:bg-night-border transition-all active:scale-[0.98]"
      >
        <AppleIcon />
        <span>{t('apple')}</span>
      </button>
    </div>
  );
}
