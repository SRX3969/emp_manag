import React from 'react';
import { cn } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-slate-300 dark:border-[#292B30] bg-white/50 dark:bg-[#17181B]/50 my-4',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1D1F23] flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3">
        {icon || <FolderOpen className="w-5 h-5" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-[#202227]',
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex justify-between items-center gap-4 mb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 py-2 border-b border-slate-100 dark:border-[#202227]">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-6 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
