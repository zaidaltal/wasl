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

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn('flex gap-6 border-b border-line dark:border-night-border overflow-x-auto', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative pb-3 text-sm font-medium whitespace-nowrap transition-colors duration-150',
            'focus-visible:outline-none focus-visible:text-primary-600',
            active === tab.id
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-ink dark:hover:text-white'
          )}
        >
          {tab.label}
          <span
            className={cn(
              'absolute bottom-0 inset-x-0 h-0.5 rounded-full transition-all duration-150',
              active === tab.id ? 'bg-primary-600' : 'bg-transparent'
            )}
          />
        </button>
      ))}
    </div>
  );
}
