import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info, X } from 'lucide-react';

interface Props {
  variant?: 'independent' | 'weather' | 'disclaimer';
  message?: string;
  isDemoData?: boolean;
  source?: string;
  actionLabel?: string;
  actionTo?: string;
}

export const DisclaimerBanner: React.FC<Props> = ({
  variant = 'independent',
  message,
  isDemoData,
  source,
  actionLabel,
  actionTo
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === 'independent') {
    return (
      <div className="bg-amber-50/90 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center justify-center gap-2 relative">
        <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="text-center pr-6">
          <strong>Nav Bharat AI</strong> is an independent civic safety platform (not an official government website). Verified reports are shared with municipal agencies.
        </span>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-amber-700 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-amber-900/50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (variant === 'weather') {
    return (
      <div className="bg-blue-50/95 dark:bg-slate-900 border-b border-blue-200/80 dark:border-slate-800 px-4 py-2 text-xs text-blue-900 dark:text-blue-200 font-medium flex flex-wrap items-center justify-center gap-2 text-center relative pr-10">
        <AlertTriangle className="w-3.5 h-3.5 text-primary dark:text-blue-400 flex-shrink-0" />
        {typeof isDemoData === 'boolean' && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDemoData
                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700'
                : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700'
            }`}
          >
            {isDemoData ? 'Demo Alert' : 'Live Weather'}
          </span>
        )}
        <span>
          {message || 'Weather Advisory: Check live map layers before travelling.'}
        </span>
        {source && (
          <span className="text-[11px] text-blue-700/80 dark:text-slate-400 hidden md:inline">
            ({source})
          </span>
        )}
        {actionLabel && actionTo && (
          <Link to={actionTo} className="text-primary dark:text-blue-400 font-bold hover:underline ml-1">
            {actionLabel} &rarr;
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss weather alert"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-blue-700 dark:text-slate-400 hover:bg-blue-200/50 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return null;
};
