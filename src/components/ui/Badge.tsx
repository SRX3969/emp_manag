import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'outline'
  | 'purple';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-[#1A1C26] dark:text-slate-300 border border-slate-200 dark:border-[#242838]',
    success:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50',
    warning:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50',
    danger:
      'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50',
    info:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50',
    purple:
      'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50',
    neutral:
      'bg-slate-100 text-slate-600 dark:bg-[#1A1C26] dark:text-slate-400 border border-slate-200/60 dark:border-[#242838]',
    outline:
      'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 bg-transparent',
  };

  const dotColors = {
    default: 'bg-slate-400',
    success: 'bg-emerald-500 shadow-2xs',
    warning: 'bg-amber-500 shadow-2xs',
    danger: 'bg-rose-500 shadow-2xs',
    info: 'bg-indigo-500 shadow-2xs',
    purple: 'bg-purple-500 shadow-2xs',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[10.5px] px-1.5 py-0.5 font-semibold rounded-md',
    md: 'text-xs px-2.5 py-0.5 font-semibold rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 select-none tracking-tight shadow-2xs',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
}
