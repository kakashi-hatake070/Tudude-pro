import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, ExternalLink, Heart, Globe, Lock, Cpu, Sparkles, Users } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-slate-700">
                <img
                  src="/assets/nav-bharat-logo.jpg"
                  alt="Nav Bharat"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-black text-2xl tracking-tight">
                NAV <span className="bg-gradient-to-r from-saffron to-amber-500 bg-clip-text text-transparent">BHARAT</span>
                <span className="text-xs ml-1 text-slate-400 font-normal">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Advanced AI-powered civic intelligence, urban hazard mitigation, and route safety platform engineered for Indian cities. Bridging citizens and municipal engineering divisions.
            </p>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-saffron">Civic Innovation Initiative: </span>
              Nav Bharat is an independent open civic technology platform developed for Indian metropolitan and tier-2 urban safety governance.
            </div>
          </div>

          {/* Public Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Urban Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/live-map" className="hover:text-saffron transition-colors">Interactive GIS Map</Link></li>
              <li><Link to="/safe-routes" className="hover:text-saffron transition-colors">AI Safe Route Planner</Link></li>
              <li><Link to="/report" className="hover:text-saffron transition-colors">Anonymous Hazard Report</Link></li>
              <li><Link to="/explore" className="hover:text-saffron transition-colors">Locality Risk Intelligence</Link></li>
              <li><Link to="/how-it-works" className="hover:text-saffron transition-colors">5-Stage AI Lifecycle</Link></li>
              <li><a href="/#faqs" className="hover:text-saffron transition-colors">FAQs &amp; AI Roadmap</a></li>
              <li><a href="/#team" className="text-saffron hover:underline flex items-center space-x-1"><Users className="w-3 h-3" /><span>Meet The Team</span></a></li>
            </ul>
          </div>

          {/* Administration & Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Governance & SLA</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/government/login" className="hover:text-saffron transition-colors">Official Portal Login</Link></li>
              <li><Link to="/government/dashboard" className="hover:text-saffron transition-colors">Command Center KPI</Link></li>
              <li><Link to="/government/departments" className="hover:text-saffron transition-colors">Department SLA Workflows</Link></li>
              <li><Link to="/government/wards" className="hover:text-saffron transition-colors">Ward Boundary Risk Maps</Link></li>
              <li><Link to="/government/analytics" className="hover:text-saffron transition-colors">Infrastructure Failure Logs</Link></li>
            </ul>
          </div>

          {/* Emergency Helplines for Indian Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5 text-saffron">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Helplines</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">Emergency National Response</div>
                <div className="text-saffron font-mono text-sm font-bold">112</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">Ambulance & Medical</div>
                <div className="text-saffron font-mono text-sm font-bold">108</div>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">Disaster & Flood Rescue</div>
                <div className="text-saffron font-mono text-sm font-bold">1070 / 1077</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Nav Bharat AI. Built by Kunal Sharma & Team • VICT / Vidya Knowledge Park.</p>
          <div className="flex items-center space-x-5">
            <span className="flex items-center space-x-1"><Lock className="w-3.5 h-3.5 text-emerald-400" /> <span>EXIF-Stripped Privacy</span></span>
            <span className="flex items-center space-x-1"><Cpu className="w-3.5 h-3.5 text-blue-400" /> <span>FastAPI YOLO AI Core</span></span>
            <span className="flex items-center space-x-1"><Globe className="w-3.5 h-3.5 text-amber-400" /> <span>OpenStreetMap GIS</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
