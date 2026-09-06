import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-sm active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-500',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.98] dark:bg-[#1A1C26] dark:text-slate-100 dark:hover:bg-[#242838] border border-slate-200 dark:border-[#242838]',
      outline:
        'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] dark:border-[#242838] dark:bg-[#12131A] dark:text-slate-200 dark:hover:bg-[#1A1C26] dark:hover:border-[#383E54] shadow-2xs',
      ghost:
        'text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#1A1C26] dark:hover:text-white',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-xs dark:bg-rose-600 dark:hover:bg-rose-500',
      link:
        'text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 p-0 h-auto font-normal',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 gap-1.5 h-7',
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8 font-medium',
      md: 'text-xs sm:text-sm px-3.5 py-2 gap-2 h-9 font-medium',
      lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 h-11 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'link' && sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
