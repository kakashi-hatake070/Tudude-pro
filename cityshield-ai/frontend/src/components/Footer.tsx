import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, ExternalLink, Heart, Globe, Lock, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">
                CITYSHIELD<span className="text-secondary font-black ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              AI-powered civic intelligence, urban hazard mitigation, and road safety platform designed for Indian cities. Connecting citizens, municipal response units, and GIS intelligence.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Civic Technology Notice: </span>
              CityShield AI is an independent open civic platform, not an official government agency. All verified reports are forwarded to relevant municipal bodies.
            </div>
          </div>

          {/* Public Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Urban Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/live-map" className="hover:text-white transition-colors">Interactive GIS Map</Link></li>
              <li><Link to="/safe-routes" className="hover:text-white transition-colors">AI Safe Route Planner</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Anonymous Issue Reporting</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors">Explore Locality Intel</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">Resolution Pipeline</Link></li>
            </ul>
          </div>

          {/* Administration & Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Governance</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/government/login" className="hover:text-white transition-colors">Officer Portal Login</Link></li>
              <li><Link to="/government/dashboard" className="hover:text-white transition-colors">Municipal Command Center</Link></li>
              <li><Link to="/government/departments" className="hover:text-white transition-colors">Department SLA Directory</Link></li>
              <li><Link to="/government/wards" className="hover:text-white transition-colors">Ward Boundary Maps</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Platform Architecture</Link></li>
            </ul>
          </div>

          {/* Emergency Helplines for Indian Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center space-x-1.5 text-secondary">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Helplines</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-slate-800 rounded border border-slate-700">
                <div className="font-semibold text-white">Emergency National Response</div>
                <div className="text-secondary font-mono text-sm font-bold">112</div>
              </div>
              <div className="p-2 bg-slate-800 rounded border border-slate-700">
                <div className="font-semibold text-white">Ambulance & Medical</div>
                <div className="text-secondary font-mono text-sm font-bold">108</div>
              </div>
              <div className="p-2 bg-slate-800 rounded border border-slate-700">
                <div className="font-semibold text-white">Fire & Disaster Rescue</div>
                <div className="text-secondary font-mono text-sm font-bold">101</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CityShield AI. Engineered for smarter, resilient cities.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1"><Lock className="w-3.5 h-3.5 text-emerald-400" /> <span>EXIF-Stripped Privacy</span></span>
            <span className="flex items-center space-x-1"><Cpu className="w-3.5 h-3.5 text-blue-400" /> <span>FastAPI YOLO AI Core</span></span>
            <span className="flex items-center space-x-1"><Globe className="w-3.5 h-3.5 text-amber-400" /> <span>OSM & Bhuvan Layers</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
