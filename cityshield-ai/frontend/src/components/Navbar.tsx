import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
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
  HelpCircle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [citizenUser, setCitizenUser] = useState<any>(null);
  const [govOfficer, setGovOfficer] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const navLinks = [
    { label: 'Live Map', path: '/live-map', icon: MapPin },
    { label: 'Safe Routes', path: '/safe-routes', icon: Navigation },
    { label: 'Report Issue', path: '/report', icon: FilePlus, highlight: true },
    { label: 'Community', path: '/community', icon: MessageSquare },
    { label: 'Explore Area', path: '/explore', icon: Compass },
    { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Tagline */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-text-main">
                  CITYSHIELD<span className="text-primary font-black ml-0.5">AI</span>
                </span>
                <span className="bg-primary-light text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Civic AI
                </span>
              </div>
              <p className="text-[10px] text-text-muted hidden sm:block tracking-wide">
                Your City. Your Safety. Your Intelligence.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary-hover shadow-sm transition-all whitespace-nowrap"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-primary bg-primary-light font-semibold'
                      : 'text-text-main hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-text-muted" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Auth Badges */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {citizenUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/citizen/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-text-main transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-secondary" />
                  <span>{citizenUser.citizenPoints} pts</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-primary font-mono">{citizenUser.anonymousId}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-text-muted hover:text-status-danger rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : govOfficer ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/government/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 bg-primary-light text-primary rounded-lg text-xs font-bold"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Gov: {govOfficer.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Log out officer"
                  className="p-1.5 text-text-muted hover:text-status-danger rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-text-main hover:text-primary px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/government/login"
                  className="flex items-center space-x-1 text-xs font-semibold text-primary border border-primary/20 hover:bg-primary-light px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Gov Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet hamburger button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-text-main hover:bg-slate-100"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive ? 'bg-primary-light text-primary font-semibold' : 'text-text-main hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {citizenUser ? (
              <>
                <Link
                  to="/citizen/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium"
                >
                  Dashboard ({citizenUser.anonymousId})
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-left px-3 py-2 text-status-danger text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : govOfficer ? (
              <>
                <Link
                  to="/government/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-primary-light text-primary rounded-lg text-sm font-medium"
                >
                  Gov Dashboard ({govOfficer.name})
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-left px-3 py-2 text-status-danger text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-text-main hover:bg-slate-50 rounded-lg"
                >
                  Citizen Login
                </Link>
                <Link
                  to="/government/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-primary bg-primary-light rounded-lg flex items-center space-x-1.5"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Government Portal</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
