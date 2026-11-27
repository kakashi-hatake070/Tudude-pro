import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  FilePlus,
  Compass,
  Building2,
  LogOut,
  Menu,
  X,
  Award,
  MessageSquare,
  Sun,
  Moon,
  QrCode
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [citizenUser, setCitizenUser] = useState<any>(null);
  const [govOfficer, setGovOfficer] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const rawUser = localStorage.getItem('cs_user');
    if (rawUser) {
      try { setCitizenUser(JSON.parse(rawUser)); } catch (e) {}
    } else {
      setCitizenUser(null);
    }

    const rawGov = localStorage.getItem('cs_officer');
    if (rawGov) {
      try { setGovOfficer(JSON.parse(rawGov)); } catch (e) {}
    } else {
      setGovOfficer(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    localStorage.removeItem('cs_gov_token');
    localStorage.removeItem('cs_officer');
    setCitizenUser(null);
    setGovOfficer(null);
    navigate('/');
  };

  const navLinks: { label: string; path: string; icon: React.ElementType; isAnchor?: boolean }[] = [
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Safe Routes', path: '/safe-routes', icon: Navigation },
    { label: 'Smart QR', path: '/qr-smart', icon: QrCode },
    { label: 'Community', path: '/community', icon: MessageSquare },
    { label: 'Explore Area', path: '/explore', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs bg-white p-0.5 transition-transform group-hover:scale-105">
              <img
                src="/assets/nav-bharat-logo.jpg"
                alt="Nav Bharat Logo"
                className="w-full h-full object-contain"
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  NAV <span className="bg-gradient-to-r from-saffron to-amber-500 bg-clip-text text-transparent">BHARAT</span>
                </span>
                <span className="bg-saffron-light dark:bg-saffron/20 text-saffron-dark dark:text-saffron text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-saffron/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Your City. Your Safety. Your Intelligence.
              </p>
            </div>
          </Link>

          {/* Streamlined Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              if (link.isAnchor) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-saffron dark:hover:text-saffron hover:bg-slate-100/80 dark:hover:bg-slate-900 transition-colors whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <span>{link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-primary dark:text-blue-400 bg-primary-light dark:bg-primary/20 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Report CTA + Theme Toggle + Account */}
          <div className="hidden lg:flex items-center space-x-2.5 flex-shrink-0">
            <Link
              to="/report"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-saffron to-amber-500 text-white hover:brightness-105 shadow-sm shadow-saffron/30 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <FilePlus className="w-4 h-4" />
              <span>Report Issue</span>
            </Link>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {citizenUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/citizen/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-saffron" />
                  <span>{citizenUser.citizenPoints} pts</span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className="text-primary dark:text-blue-400 font-mono">{citizenUser.anonymousId}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : govOfficer ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/government/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-light dark:bg-primary/20 text-primary dark:text-blue-300 rounded-xl text-xs font-bold"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Gov: {govOfficer.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 pl-1 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/government/login"
                  className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Gov Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls: Theme Toggle + Drawer Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <link.icon className="w-5 h-5 text-slate-400" />
                <span>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <link.icon className="w-5 h-5 text-slate-400" />
                <span>{link.label}</span>
              </Link>
            )
          )}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            {citizenUser ? (
              <>
                <Link
                  to="/citizen/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-primary dark:text-blue-300 bg-primary-light dark:bg-primary/20 rounded-xl"
                >
                  Dashboard ({citizenUser.anonymousId} • {citizenUser.citizenPoints} pts)
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : govOfficer ? (
              <>
                <Link
                  to="/government/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-primary dark:text-blue-300 bg-primary-light dark:bg-primary/20 rounded-xl"
                >
                  Gov Dashboard ({govOfficer.name})
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-primary dark:text-blue-300 bg-primary-light dark:bg-primary/20 rounded-xl"
                >
                  Citizen Sign In
                </Link>
                <Link
                  to="/government/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl"
                >
                  Municipal Gov Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
