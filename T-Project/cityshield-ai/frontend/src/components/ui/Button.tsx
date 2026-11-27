import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'saffron' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants: Record<string, string> = {
      default: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm',
      secondary: 'bg-secondary text-white hover:bg-secondary-hover shadow-sm',
      ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
      link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      saffron: 'bg-gradient-to-r from-saffron to-amber-500 text-white hover:brightness-105 shadow-md shadow-saffron/20 font-semibold',
      gradient: 'bg-gradient-to-r from-primary via-blue-600 to-saffron text-white hover:brightness-110 shadow-md shadow-primary/25 font-semibold'
    };

    const sizes: Record<string, string> = {
      default: 'h-10 px-4 py-2 text-sm rounded-xl',
      sm: 'h-8 px-3 text-xs rounded-lg',
      lg: 'h-12 px-6 text-base rounded-xl font-semibold',
      icon: 'h-10 w-10 rounded-xl'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
