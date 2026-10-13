'use client';

import React, { forwardRef } from 'react';
import { ButtonArrow, buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  arrow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = 'primary', size = 'md', loading = false, fullWidth = false, arrow = false, className, disabled, ...props },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4 shrink-0" />}
      {children}
      {arrow && !loading && <ButtonArrow tone={variant === 'primary' || variant === 'ink' ? 'light' : 'dark'} />}
    </button>
  )
);
Button.displayName = 'Button';
