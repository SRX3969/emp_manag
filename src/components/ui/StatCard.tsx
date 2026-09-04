import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all dark:border-[#292B30] dark:bg-[#17181B]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        {icon && (
          <div className="p-2 rounded-md bg-slate-50 text-slate-600 dark:bg-[#1D1F23] dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          {value}
        </h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-medium',
              change.trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
              change.trend === 'down' && 'text-red-600 dark:text-red-400',
              change.trend === 'neutral' && 'text-slate-500 dark:text-slate-400'
            )}
          >
            {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {change.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
