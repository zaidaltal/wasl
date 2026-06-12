import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  locale: string;
  /** 'auto' switches between light/dark; 'dark' forces the white lockup (for dark panels/footer) */
  variant?: 'auto' | 'dark';
  className?: string;
}

export function Logo({ locale, variant = 'auto', className }: LogoProps) {
  return (
    <Link href={`/${locale}`} className={cn('flex items-center shrink-0', className)} aria-label="Wasl — وصل">
      {variant === 'dark' ? (
        // Footer / dark panel — invert the horizontal logo to all-white
        <img
          src="/wasl-logo-horizontal.svg"
          alt="Wasl وصل"
          width={104}
          height={32}
          className="h-8 w-auto brightness-0 invert"
        />
      ) : (
        <>
          {/* Light mode: horizontal logo as-is (dark ink text) */}
          <img
            src="/wasl-logo-horizontal.svg"
            alt="Wasl وصل"
            width={104}
            height={32}
            className="h-8 w-auto dark:hidden"
          />
          {/* Dark mode: invert to white */}
          <img
            src="/wasl-logo-horizontal.svg"
            alt="Wasl وصل"
            width={104}
            height={32}
            className="h-8 w-auto hidden dark:block brightness-0 invert"
          />
        </>
      )}
    </Link>
  );
}
