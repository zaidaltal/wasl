'use client';

import { MagnifyingGlass, X } from './icons';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonLabel: string;
  onClear?: () => void;
}

/** Large pill search with an inline submit button, used on browse pages. */
export function SearchField({ value, onChange, onSubmit, placeholder, buttonLabel, onClear }: SearchFieldProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="shell"
    >
      <div className="core flex items-center gap-2 p-1.5 ps-5 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent">
        <MagnifyingGlass size={20} className="shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
          >
            <X size={15} weight="bold" />
          </button>
        )}
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center rounded-full bg-ink px-6 text-sm font-semibold text-canvas transition-[background-color,transform] duration-300 ease-fluid hover:bg-ink/90 active:scale-[0.98]"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
}
