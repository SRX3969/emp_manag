import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
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
        'group relative opacity-0 animate-reveal-up rounded-xl border border-slate-200/90 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:border-[#242838] dark:bg-[#12131A] dark:hover:border-[#383E54] dark:hover:shadow-lg dark:hover:shadow-black/20',
        className
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Top subtle highlight */}
      <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-500/50 group-hover:via-indigo-400 group-hover:to-purple-500/50 transition-all" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          {title}
        </span>
        {icon && (
          <div className="text-slate-600 dark:text-slate-300 p-2 rounded-lg bg-slate-50 dark:bg-[#1A1C26] border border-slate-200/80 dark:border-[#242838] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800/40 transition-colors shadow-2xs">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          {isNumeric ? <AnimatedNumber value={value} /> : value}
        </h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-2xs',
              change.trend === 'up' &&
                'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
              change.trend === 'down' &&
                'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
              change.trend === 'neutral' &&
                'text-slate-600 bg-slate-50 border-slate-200 dark:bg-[#1A1C26] dark:text-slate-400 dark:border-[#242838]'
            )}
          >
            {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />}
            {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />}
            {change.trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5 shrink-0" />}
            {change.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
