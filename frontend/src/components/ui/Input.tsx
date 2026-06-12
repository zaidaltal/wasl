'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

const fieldStyles = cn(
  'w-full rounded-lg border px-4 py-2.5 text-sm transition-colors duration-150',
  'bg-white dark:bg-night-card text-ink dark:text-white',
  'border-line dark:border-night-border',
  'placeholder:text-muted',
  'focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/30'
);

const errorStyles = 'border-primary-600 focus:ring-primary-600/30';

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
    </label>
  );
}

function FieldMessages({ error, helperText }: { error?: string; helperText?: string }) {
  if (error) return <p className="mt-1.5 text-xs text-primary-600 dark:text-primary-400">{error}</p>;
  if (helperText) return <p className="mt-1.5 text-xs text-muted">{helperText}</p>;
  return null;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(fieldStyles, error && errorStyles, icon && 'ps-10', className)}
            {...props}
          />
        </div>
        <FieldMessages error={error} helperText={helperText} />
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
          className={cn(fieldStyles, 'resize-none', error && errorStyles, className)}
          {...props}
        />
        <FieldMessages error={error} helperText={helperText} />
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
        <select
          ref={ref}
          id={inputId}
          className={cn(fieldStyles, error && errorStyles, className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldMessages error={error} helperText={helperText} />
      </div>
    );
  }
);
Select.displayName = 'Select';
