import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  locale: string;
  /** 'auto' follows the theme; 'light' forces the white lockup for photo/dark backgrounds */
  variant?: 'auto' | 'light';
  className?: string;
}

export function Logo({ locale, variant = 'auto', className }: LogoProps) {
  const img = 'h-9 w-auto';
  return (
    <Link
      href={`/${locale}`}
      aria-label="Wasl | وصل"
      className={cn('flex shrink-0 items-center rounded-full transition-opacity duration-300 hover:opacity-80', className)}
    >
      {variant === 'light' ? (
        <img src="/wasl-logo-horizontal.svg" alt="Wasl وصل" width={117} height={36} className={cn(img, 'brightness-0 invert')} />
      ) : (
        <>
          <img src="/wasl-logo-horizontal.svg" alt="Wasl وصل" width={117} height={36} className={cn(img, 'dark:hidden')} />
          <img
            src="/wasl-logo-horizontal.svg"
            alt=""
            aria-hidden
            width={117}
            height={36}
            className={cn(img, 'hidden brightness-0 invert dark:block')}
          />
        </>
      )}
    </Link>
  );
}
