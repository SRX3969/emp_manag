import React, { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-4 h-4 ring-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  };

  return (
    <div className={cn('relative inline-flex shrink-0 select-none', className)} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={cn(
            'rounded-full object-cover border border-slate-200 dark:border-[#292B30]',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-medium bg-slate-100 text-slate-700 dark:bg-[#202227] dark:text-slate-200 border border-slate-200 dark:border-[#292B30]',
            sizes[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-white dark:ring-[#17181B]',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
