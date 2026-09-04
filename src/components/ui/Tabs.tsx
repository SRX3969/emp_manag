import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('border-b border-slate-200 dark:border-[#292B30]', className)}>
      <nav className="flex space-x-6 overflow-x-auto no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'group inline-flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-all whitespace-nowrap',
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'
              )}
            >
              {tab.icon && (
                <span
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-500'
                  )}
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-semibold leading-none',
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-[#1D1F23] dark:text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
