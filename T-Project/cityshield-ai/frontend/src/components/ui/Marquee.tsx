import React from 'react';
import { cn } from '../../lib/utils';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  duration?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  duration = '35s',
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2 select-none [--gap:1rem]',
        pauseOnHover && 'hover:[&_.marquee-content]:[animation-play-state:paused]',
        className
      )}
      style={{ '--duration': duration } as React.CSSProperties}
    >
      <div
        className={cn(
          'marquee-content flex shrink-0 items-center justify-around gap-4 min-w-full',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          'marquee-content flex shrink-0 items-center justify-around gap-4 min-w-full',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        )}
      >
        {children}
      </div>
    </div>
  );
};
