import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AnimatedNumber } from '../motion/Motion';

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
  delayMs?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  delayMs = 0,
  className,
}: StatCardProps) {
  const isNumeric = typeof value === 'number';

  return (
    <div
      className={cn(
        'animate-reveal-up opacity-0 rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm dark:border-[#292B30] dark:bg-[#17181B]',
        className
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          {title}
        </p>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600 dark:bg-[#131417] dark:text-slate-300 border border-slate-100 dark:border-[#202227]">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          {isNumeric ? <AnimatedNumber value={value} /> : value}
        </h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded',
              change.trend === 'up' && 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300',
              change.trend === 'down' && 'text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300',
              change.trend === 'neutral' && 'text-slate-600 bg-slate-100 dark:bg-[#1D1F23] dark:text-slate-400'
            )}
          >
            {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
