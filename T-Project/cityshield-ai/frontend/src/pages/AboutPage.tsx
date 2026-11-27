import React from 'react';
import { Shield, Lock, Eye, Cpu, Database, AlertCircle, Building, CheckCircle2, Sparkles, Navigation, Award } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { TeamSection } from '../components/ui/TeamSection';
import { Badge } from '../components/ui/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-saffron-light border border-saffron/30 text-saffron-dark text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Urban Infrastructure & Commuter Safety Platform</span>
          </div>

          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1 border border-slate-200 shadow-sm">
              <img src="/assets/nav-bharat-logo.jpg" alt="Nav Bharat Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              About NAV <span className="bg-gradient-to-r from-saffron to-amber-500 bg-clip-text text-transparent">BHARAT</span> AI
            </h1>
          </div>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            "Your City. Your Safety. Your Intelligence." An open civic technology initiative engineered specifically for the real-world infrastructure challenges of Indian cities (waterlogged roads, submerged underpasses, dangerous potholes, garbage accumulation, and dark street stretches).
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">FastAPI YOLO AI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              5 dedicated AI vision modules for multi-class issue classification, pothole detection, water depth estimation, and ward risk scoring.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-saffron flex items-center justify-center mb-3">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">120m Safe Routing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Penalizes routes with active waterlogging and deep craters within 120-meter corridors, diverting commuters to safer alternatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Citizen Shield</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero public names or phone numbers. EXIF camera metadata is purged, and public pins are fuzzed by ±65m to protect residential privacy.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Municipal SLA</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Geospatial ward routing, automated escalation countdowns, and mandatory before/after photo proof before work orders can be closed.
            </p>
          </div>
        </div>

        {/* Architecture Specs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span>Full-Stack System Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Frontend Layer</span>
              <p className="text-slate-500">React 18, TypeScript, Vite, Tailwind CSS, MapLibre GL JS (OpenStreetMap & Carto Positron Tiles), Socket.IO Client.</p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm">Backend API Gateway</span>
              <p className="text-slate-500">Node.js, Express, Socket.IO, JWT Auth, Multer EXIF sanitizer, MongoDB with 2dsphere Geospatial Indexing.</p>
            </div>

            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-800 text-sm">AI/ML Microservice</span>
              <p className="text-slate-500">Python 3.9+, FastAPI, Uvicorn, YOLO Vision Heuristics, ImageHash Perceptual Deduplication, Area Risk Scoring Engine.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection />

        {/* Civic Disclaimer Statement */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 space-y-2 text-xs text-amber-900">
          <h4 className="font-bold text-sm flex items-center space-x-1.5 text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Platform Status &amp; Civic Notice</span>
          </h4>
          <p className="leading-relaxed">
            Nav Bharat AI is an independent civic technology initiative developed for urban resilience hackathons and municipal safety governance. All community-verified issues are synchronized with civic authorities to facilitate transparent tracking and rapid mitigation.
          </p>
        </div>

      </div>
    </div>
  );
};
