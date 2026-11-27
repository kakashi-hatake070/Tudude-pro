import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[22rem]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
  background?: React.ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  badge?: string;
  badgeColor?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  badge,
  badgeColor = 'bg-primary-light text-primary',
  ...props
}) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 tilt-card',
        className
      )}
      {...props}
    >
      {/* Crisp Background Artwork with Soft Readability Scrim */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {background}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/15 dark:from-slate-900 dark:via-slate-900/85 dark:to-slate-900/20 transition-opacity duration-500" />
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300 shadow-sm">
          <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
        </div>
        {badge && (
          <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs', badgeColor)}>
            {badge}
          </span>
        )}
      </div>

      <div className="relative z-10 space-y-2 mt-auto">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
          {description}
        </p>

        <Link
          to={href}
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-dark pt-2 group-hover:translate-x-1 transition-transform"
        >
          <span>{cta}</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
