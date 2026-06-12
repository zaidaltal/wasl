'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

const variantStyles = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600/30',
  secondary:
    'border border-ink bg-transparent text-ink hover:bg-ink hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-ink focus-visible:ring-ink/20 dark:focus-visible:ring-white/20',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-night-card focus-visible:ring-gray-400/30',
  danger:
    'border border-primary-600 bg-transparent text-primary-600 hover:bg-primary-600 hover:text-white dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white focus-visible:ring-primary-600/30',
  // alias kept for existing call sites
  outline:
    'border border-ink bg-transparent text-ink hover:bg-ink hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-ink focus-visible:ring-ink/20 dark:focus-visible:ring-white/20',
};

const sizeStyles = {
  sm: 'h-8 px-4 text-sm gap-2',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = 'primary', size = 'md', loading = false, fullWidth = false, className, disabled, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-full',
        'transition-all duration-150 ease-out active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-4',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && <Spinner className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
