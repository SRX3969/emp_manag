import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
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
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'indigo';
  delayMs?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  accentColor = 'blue',
  delayMs = 0,
  className,
}: StatCardProps) {
  const isNumeric = typeof value === 'number';

  const accentStyles = {
    blue: {
      glow: 'group-hover:border-blue-500/40 dark:group-hover:border-blue-500/30',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40',
      tag: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300',
    },
    emerald: {
      glow: 'group-hover:border-emerald-500/40 dark:group-hover:border-emerald-500/30',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/40',
      tag: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    amber: {
      glow: 'group-hover:border-amber-500/40 dark:group-hover:border-amber-500/30',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40',
      tag: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300',
    },
    purple: {
      glow: 'group-hover:border-purple-500/40 dark:group-hover:border-purple-500/30',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/40',
      tag: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300',
    },
    indigo: {
      glow: 'group-hover:border-indigo-500/40 dark:group-hover:border-indigo-500/30',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/40',
      tag: 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300',
    },
  }[accentColor];

  return (
    <div
      className={cn(
        'group relative opacity-0 animate-reveal-up rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:border-[#292B30] dark:bg-[#17181B] dark:hover:bg-[#1C1E22]',
        accentStyles.glow,
        className
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
          {title}
        </p>
        {icon && (
          <div
            className={cn(
              'p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-105 shadow-2xs',
              accentStyles.iconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-heading">
          {isNumeric ? <AnimatedNumber value={value} /> : value}
        </h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border',
              change.trend === 'up' &&
                'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
              change.trend === 'down' &&
                'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50',
              change.trend === 'neutral' &&
                'text-slate-600 bg-slate-100 border-slate-200 dark:bg-[#202227] dark:text-slate-300 dark:border-[#2E3138]'
            )}
          >
            {change.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
