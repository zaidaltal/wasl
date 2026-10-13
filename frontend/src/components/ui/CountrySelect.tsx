'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import * as Flags from 'country-flag-icons/react/3x2';
import { CaretDown, Check } from './icons';
import { COUNTRIES, cn } from '@/lib/utils';

interface CountrySelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  helperText?: string;
  onBlur?: () => void;
  name?: string;
}

function Flag({ code, className }: { code: string; className?: string }) {
  const Cmp = (Flags as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[code];
  if (!Cmp) return null;
  return (
    <Cmp
      aria-hidden
      className={cn('h-4 w-6 shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgb(var(--ink)/0.1)]', className)}
    />
  );
}

/**
 * Country picker with flags (native <select> cannot render images).
 * Follows the ARIA "select-only combobox" pattern: arrow keys, Home/End, Enter/Space,
 * Escape, and type-to-jump all work, and the active option is announced.
 */
export function CountrySelect({ label, value, onChange, placeholder, error, helperText, onBlur, name }: CountrySelectProps) {
  const locale = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const labelOf = (c: (typeof COUNTRIES)[number]) => (locale === 'ar' ? c.label_ar : c.label_en);
  const selected = COUNTRIES.find((c) => c.value === value);
  const optionId = (i: number) => `${id}-opt-${i}`;

  const openList = () => {
    const i = COUNTRIES.findIndex((c) => c.value === value);
    setActive(i >= 0 ? i : 0);
    setOpen(true);
  };

  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  const choose = (i: number) => {
    onChange(COUNTRIES[i].value);
    close();
  };

  // Keep the active option scrolled into view
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onBlur]);

  const typeahead = (key: string) => {
    const now = Date.now();
    typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
    typed.current.at = now;
    const q = typed.current.text.toLowerCase();
    const i = COUNTRIES.findIndex((c) => labelOf(c).toLowerCase().startsWith(q) || c.label_en.toLowerCase().startsWith(q));
    if (i >= 0) {
      setActive(i);
      if (!open) setOpen(true);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = COUNTRIES.length - 1;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openList();
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
        typeahead(e.key);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) typeahead(e.key);
    }
  };

  return (
    <div className="w-full" ref={rootRef}>
      {label && (
        <label id={`${id}-label`} htmlFor={`${id}-button`} className="mb-2 block text-[13px] font-semibold text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          ref={buttonRef}
          id={`${id}-button`}
          type="button"
          name={name}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={label ? `${id}-label ${id}-button` : undefined}
          aria-activedescendant={open ? optionId(active) : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={error || helperText ? `${id}-msg` : undefined}
          onClick={() => (open ? close() : openList())}
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            if (!rootRef.current?.contains(e.relatedTarget as Node)) onBlur?.();
          }}
          className={cn(
            'flex h-12 w-full items-center gap-3 rounded-xl bg-surface px-4 text-start text-[15px] ring-1 ring-inset transition-[box-shadow] duration-300 ease-fluid',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0',
            error ? 'ring-danger/60 hover:ring-danger' : open ? 'ring-2 ring-accent' : 'ring-line hover:ring-ink/25'
          )}
        >
          {selected ? (
            <>
              <Flag code={selected.code} />
              <span className="truncate text-ink">{labelOf(selected)}</span>
            </>
          ) : (
            <span className="truncate text-muted">{placeholder}</span>
          )}
          <CaretDown
            size={14}
            weight="bold"
            aria-hidden
            className={cn('ms-auto shrink-0 text-muted transition-transform duration-300 ease-fluid', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div className="shell absolute inset-x-0 top-full z-30 mt-2 animate-sheet-in bg-surface/60 backdrop-blur-xl">
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-labelledby={label ? `${id}-label` : undefined}
              tabIndex={-1}
              className="core max-h-72 overflow-y-auto overscroll-contain p-1.5"
            >
              {COUNTRIES.map((c, i) => {
                const isSelected = c.value === value;
                return (
                  <li
                    key={c.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(i)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors duration-150',
                      i === active ? 'bg-sunken text-ink' : 'text-ink-soft',
                      isSelected && 'font-semibold text-ink'
                    )}
                  >
                    <Flag code={c.code} />
                    <span className="truncate">{labelOf(c)}</span>
                    {isSelected && <Check size={16} weight="bold" className="ms-auto shrink-0 text-accent" aria-hidden />}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p
          id={`${id}-msg`}
          role={error ? 'alert' : undefined}
          className={cn('mt-2 text-[13px]', error ? 'font-medium text-danger' : 'text-muted')}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
