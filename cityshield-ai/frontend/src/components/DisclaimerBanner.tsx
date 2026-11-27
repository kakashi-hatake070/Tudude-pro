import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Info } from 'lucide-react';

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
  if (variant === 'independent') {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900 font-medium flex items-center justify-center space-x-2">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong>Notice:</strong> CityShield AI is an independent civic technology platform and not an official government website. Verified reports are shared with municipal agencies for prompt action.
        </span>
      </div>
    );
  }

  if (variant === 'weather') {
    return (
      <div className="bg-blue-50 border-y border-blue-200 px-4 py-2.5 text-xs text-blue-900 font-medium flex flex-wrap items-center justify-center gap-2 text-center">
        <AlertTriangle className="w-4 h-4 text-primary flex-shrink-0" />
        {typeof isDemoData === 'boolean' && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isDemoData
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {isDemoData ? 'Demo Alert Data' : 'Live Weather Feed'}
          </span>
        )}
        <span>
          {message || 'Monsoon Advisory: Check live map layers before travelling.'}
        </span>
        {source && (
          <span className="text-[11px] text-blue-700/80 hidden sm:inline">
            ({source})
          </span>
        )}
        {actionLabel && actionTo && (
          <Link to={actionTo} className="text-primary font-bold hover:underline ml-1">
            {actionLabel} &rarr;
          </Link>
        )}
      </div>
    );
  }

  return null;
};
