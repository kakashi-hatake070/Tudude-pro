import React, { useRef } from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, Flame, LifeBuoy, Users, ChevronLeft, ChevronRight, Siren } from 'lucide-react';

interface HelplineItem {
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  icon: React.ElementType;
}

export const EmergencyHelplineScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const helplines: HelplineItem[] = [
    { number: '112', title: 'National Emergency', subtitle: 'Police, Fire & Medical unified single response', accent: 'from-red-500 to-rose-600', icon: Siren },
    { number: '1070', title: 'State Disaster Rescue', subtitle: 'Monsoon flooding & severe cyclone response', accent: 'from-saffron to-amber-600', icon: LifeBuoy },
    { number: '108', title: 'Disaster Ambulance', subtitle: 'Rapid paramedic & trauma transport', accent: 'from-emerald-500 to-teal-600', icon: HeartPulse },
    { number: '101', title: 'Fire & Water Rescue', subtitle: 'Urban submerged vehicle & rescue teams', accent: 'from-orange-500 to-red-600', icon: Flame },
    { number: '1091', title: 'Women Safety Helpline', subtitle: '24x7 commuter safety & dark street distress', accent: 'from-purple-500 to-indigo-600', icon: Users },
    { number: '1095', title: 'Traffic Police Helpline', subtitle: 'Waterlogged route barricades & towing', accent: 'from-blue-500 to-cyan-600', icon: ShieldAlert },
    { number: '1077', title: 'District Relief Control', subtitle: 'Local municipal inundation taskforces', accent: 'from-amber-500 to-yellow-600', icon: PhoneCall },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="py-6 bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <PhoneCall className="w-4 h-4 text-saffron" />
            <span>National Emergency &amp; Rapid Disaster Helplines (Swipe Horizontally)</span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal snap scroll */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {helplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={`tel:${item.number}`}
                className="w-[240px] shrink-0 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-saffron/40 dark:hover:border-saffron/50 shadow-xs hover:shadow-soft transition-all duration-200 hover:-translate-y-0.5 snap-start group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${item.accent} text-white flex items-center justify-center shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-lg font-black text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-saffron transition-colors">
                    {item.number}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.subtitle}</p>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
