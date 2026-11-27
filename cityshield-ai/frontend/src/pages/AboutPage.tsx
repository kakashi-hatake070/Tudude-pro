import React from 'react';
import { Shield, Lock, Eye, Cpu, Database, AlertCircle, Building, CheckCircle2 } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Civic Intelligence & Urban Safety Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About CityShield AI
          </h1>
          <p className="text-sm text-text-muted max-w-2xl mx-auto leading-relaxed">
            "Your City. Your Safety. Your Intelligence." An open civic technology initiative designed to tackle waterlogging, hazardous road damage, uncollected waste, and municipal infrastructure response across Indian cities.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">AI Hazard Detection</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              FastAPI Python backend with YOLO computer vision and perceptual hashing to assess damage severity, detect duplicates, and score street risk in real time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Citizen Anonymity</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              No public names, phone numbers, or addresses. Automatic EXIF metadata purge from photos and coordinate jitter protecting citizen homes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Municipal Accountability</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Geospatial ward routing assigning complaints directly to responsible municipal divisions with mandatory photographic proof of resolution.
            </p>
          </div>
        </div>

        {/* Civic Disclaimer Statement */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-3 text-xs text-amber-900">
          <h4 className="font-bold text-sm flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Platform Status & Disclaimer</span>
          </h4>
          <p className="leading-relaxed">
            CityShield AI is an independent civic technology platform and is not an official portal of any municipal corporation or state government. Reports verified by community consensus are synchronized with civic authorities to facilitate transparent tracking and rapid mitigation.
          </p>
        </div>

      </div>
    </div>
  );
};
