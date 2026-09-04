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
      'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm dark:bg-blue-600 dark:hover:bg-blue-500',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 dark:bg-[#1D1F23] dark:text-slate-100 dark:hover:bg-[#292B30]',
      outline:
        'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 active:bg-slate-100 dark:border-[#292B30] dark:bg-[#17181B] dark:text-slate-200 dark:hover:bg-[#1D1F23]',
      ghost:
        'text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#1D1F23]',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm dark:bg-red-600 dark:hover:bg-red-500',
      link:
        'text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 p-0 h-auto font-normal',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 gap-1.5 h-7',
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8 font-medium',
      md: 'text-sm px-3.5 py-2 gap-2 h-9',
      lg: 'text-base px-4.5 py-2.5 gap-2.5 h-11',
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
