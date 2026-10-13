'use client';

import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

/** Segmented pill control. */
export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('no-scrollbar inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-sunken p-1', className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,box-shadow] duration-300 ease-fluid',
            active === tab.id ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
