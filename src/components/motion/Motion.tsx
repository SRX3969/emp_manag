import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: 'up' | 'fade' | 'scale';
  className?: string;
}

export function PageTransition({
  children,
  variant = 'up',
  className,
}: PageTransitionProps) {
  const animationClass =
    variant === 'fade'
      ? 'animate-reveal-fade'
      : variant === 'scale'
      ? 'animate-reveal-scale'
      : 'animate-reveal-up';

  return (
    <div className={cn(animationClass, 'opacity-0', className)}>
      {children}
    </div>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export function FadeIn({ children, delayMs = 0, className }: FadeInProps) {
  return (
    <div
      className={cn('animate-reveal-fade opacity-0', className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delayMs?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = 'up',
  delayMs = 0,
  className,
}: SlideInProps) {
  const directionClass =
    direction === 'down'
      ? 'animate-reveal-down'
      : direction === 'left'
      ? 'animate-reveal-left'
      : direction === 'right'
      ? 'animate-reveal-right'
      : 'animate-reveal-up';

  return (
    <div
      className={cn(directionClass, 'opacity-0', className)}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  formatter?: (val: number) => string;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  durationMs = 400,
  formatter,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startValue = displayValue;
    const targetValue = value;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Smooth cubic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.round(startValue + (targetValue - startValue) * easeProgress);

      setDisplayValue(currentNumber);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, durationMs]);

  const formatted = formatter
    ? formatter(displayValue)
    : `${prefix}${displayValue.toLocaleString()}${suffix}`;

  return <span className={className}>{formatted}</span>;
}

interface RevealCardProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  hoverElevate?: boolean;
}

export function RevealCard({
  children,
  delayMs = 0,
  className,
  hoverElevate = true,
}: RevealCardProps) {
  return (
    <div
      className={cn(
        'animate-reveal-up opacity-0 rounded-xl border border-slate-200 bg-white dark:border-[#292B30] dark:bg-[#17181B] shadow-xs transition-all duration-200',
        hoverElevate && 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm',
        className
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerMs?: number;
  baseDelayMs?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerMs = 40,
  baseDelayMs = 0,
  className,
}: StaggerContainerProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className="animate-reveal-up opacity-0"
          style={{ animationDelay: `${baseDelayMs + index * staggerMs}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface ProfileRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ProfileReveal({ children, className }: ProfileRevealProps) {
  const childArray = React.Children.toArray(children);
  const header = childArray[0];
  const rest = childArray.slice(1);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="animate-reveal-fade opacity-0" style={{ animationDelay: '30ms' }}>
        {header}
      </div>
      <div className="animate-reveal-up opacity-0" style={{ animationDelay: '90ms' }}>
        {rest}
      </div>
    </div>
  );
}
