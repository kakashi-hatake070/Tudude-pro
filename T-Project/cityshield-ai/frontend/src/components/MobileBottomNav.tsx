import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, PlusCircle, Navigation, MessageSquare } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Report', path: '/report', icon: PlusCircle, isPrimary: true },
    { label: 'Routes', path: '/safe-routes', icon: Navigation },
    { label: 'Community', path: '/community', icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(15,23,42,0.08)]"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-saffron to-amber-500 text-white shadow-lg shadow-saffron/35 flex items-center justify-center border-2 border-white dark:border-slate-950 transition-transform group-active:scale-95">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-saffron mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                isActive
                  ? 'text-primary dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
