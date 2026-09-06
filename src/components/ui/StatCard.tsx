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
        'group relative opacity-0 animate-reveal-up rounded-xl border border-[#E8E8E5] bg-white p-5 transition-all duration-200 hover:border-[#D1D1CD] dark:border-[#242427] dark:bg-[#111113] dark:hover:border-[#38383C]',
        className
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B] dark:text-[#A1A1AA] font-mono">
          {title}
        </span>
        {icon && (
          <div className="text-[#6B6B6B] dark:text-[#A1A1AA] p-1.5 rounded-lg bg-[#FAFAF9] dark:bg-[#18181B] border border-[#E8E8E5] dark:border-[#242427]">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111111] dark:text-[#F5F5F5]">
          {isNumeric ? <AnimatedNumber value={value} /> : value}
        </h3>
        {change && (
          <span
            className={cn(
              'inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border',
              change.trend === 'up' &&
                'text-emerald-700 bg-emerald-50/60 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/40',
              change.trend === 'down' &&
                'text-rose-700 bg-rose-50/60 border-rose-200/80 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/40',
              change.trend === 'neutral' &&
                'text-[#6B6B6B] bg-[#FAFAF9] border-[#E8E8E5] dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border-[#242427]'
            )}
          >
            {change.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {change.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#6B6B6B] dark:text-[#A1A1AA]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
