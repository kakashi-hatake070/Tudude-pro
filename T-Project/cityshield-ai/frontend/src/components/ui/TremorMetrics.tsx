import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TremorMetricProps {
  title: string;
  metric: React.ReactNode;
  subtext?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ElementType;
  className?: string;
  badge?: string;
}

export const MetricCard: React.FC<TremorMetricProps> = ({
  title,
  metric,
  subtext,
  delta,
  deltaType = 'positive',
  icon: Icon,
  className,
  badge
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-soft hover:shadow-soft-md transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-3">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{metric}</span>
        {delta && (
          <div
            className={cn(
              'flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-md',
              deltaType === 'positive' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400',
              deltaType === 'negative' && 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400',
              deltaType === 'neutral' && 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            )}
          >
            {deltaType === 'positive' ? (
              <TrendingUp className="w-3 h-3" />
            ) : deltaType === 'negative' ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {subtext && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{subtext}</p>}
    </div>
  );
};

export interface TrackerItem {
  status: 'operational' | 'degraded' | 'critical' | 'resolved';
  tooltip?: string;
}

export const StatusTracker: React.FC<{ items: TrackerItem[]; className?: string }> = ({
  items,
  className
}) => {
  const colorMap = {
    operational: 'bg-emerald-500',
    resolved: 'bg-emerald-500',
    degraded: 'bg-amber-400',
    critical: 'bg-red-500'
  };

  return (
    <div className={cn('flex items-center space-x-1 w-full', className)}>
      {items.map((item, i) => (
        <div
          key={i}
          title={item.tooltip || item.status}
          className={cn('h-4 flex-1 rounded-sm transition-all hover:opacity-80', colorMap[item.status])}
        />
      ))}
    </div>
  );
};

export const ProgressBar: React.FC<{ value: number; max?: number; color?: string; className?: string }> = ({
  value,
  max = 100,
  color = 'bg-primary',
  className
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn('w-full bg-slate-100 rounded-full h-2.5 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
