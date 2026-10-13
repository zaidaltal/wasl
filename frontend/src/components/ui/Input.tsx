'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { CaretDown } from './icons';

const fieldStyles = cn(
  'w-full rounded-xl bg-surface px-4 text-[15px] text-ink',
  'ring-1 ring-inset ring-line placeholder:text-muted/80',
  'transition-[box-shadow,background-color] duration-300 ease-fluid',
  'hover:ring-ink/25 focus:outline-none focus:ring-2 focus:ring-accent focus-visible:ring-offset-0',
  'disabled:opacity-60'
);

const errorStyles = 'ring-danger/60 hover:ring-danger focus:ring-danger';

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-semibold text-ink-soft">
      {children}
    </label>
  );
}

function FieldMessages({ id, error, helperText }: { id: string; error?: string; helperText?: string }) {
  if (error)
    return (
      <p id={`${id}-msg`} role="alert" className="mt-2 text-[13px] font-medium text-danger">
        {error}
      </p>
    );
  if (helperText)
    return (
      <p id={`${id}-msg`} className="mt-2 text-[13px] text-muted">
        {helperText}
      </p>
    );
  return null;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  /** Element pinned to the end of the field (e.g. a show-password toggle) */
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, trailing, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error || undefined}
            aria-describedby={error || helperText ? `${inputId}-msg` : undefined}
            className={cn(fieldStyles, 'h-12', error && errorStyles, icon && 'ps-11', trailing && 'pe-12', className)}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 end-1.5 flex items-center">{trailing}</div>}
        </div>
        <FieldMessages id={inputId} error={error} helperText={helperText} />
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          aria-invalid={!!error || undefined}
          aria-describedby={error || helperText ? `${inputId}-msg` : undefined}
          className={cn(fieldStyles, 'resize-none py-3 leading-relaxed', error && errorStyles, className)}
          {...props}
        />
        <FieldMessages id={inputId} error={error} helperText={helperText} />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={!!error || undefined}
            className={cn(fieldStyles, 'h-12 appearance-none pe-10 cursor-pointer', error && errorStyles, className)}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <CaretDown
            aria-hidden
            size={14}
            weight="bold"
            className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
        <FieldMessages id={inputId} error={error} helperText={helperText} />
      </div>
    );
  }
);
Select.displayName = 'Select';
