import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'saffron' | 'indiaGreen';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors focus:outline-none';

  const variants: Record<string, string> = {
    default: 'bg-primary-light text-primary border border-primary/20',
    secondary: 'bg-secondary-light text-secondary-hover border border-secondary/20',
    destructive: 'bg-red-50 text-red-600 border border-red-200',
    outline: 'border border-slate-300 text-slate-700 bg-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    saffron: 'bg-saffron-light text-saffron-dark border border-saffron/30',
    indiaGreen: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
