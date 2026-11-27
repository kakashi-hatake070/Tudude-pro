import React from 'react';
import { Camera, Cpu, Layers, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Snap & Geotag Hazard',
      desc: 'Commuter spots waterlogging, deep potholes, or garbage accumulation. Uploads photo; EXIF GPS is automatically scrubbed for privacy while coarse coordinates place the report on the city grid.',
      icon: Camera
    },
    {
      num: '02',
      title: 'AI Analysis & Citizen Review',
      desc: 'FastAPI microservice runs YOLO detection to locate craters or water coverage, estimates water depth in centimeters, and flags duplicate complaints. The citizen reviews the classification before final dispatch.',
      icon: Cpu
    },
    {
      num: '03',
      title: 'Geospatial Ward Assignment',
      desc: 'The backend matches report coordinates against GeoJSON municipal ward boundaries and routes the issue to the respective division (e.g., Stormwater Drainage or Roads & Infrastructure).',
      icon: Layers
    },
    {
      num: '04',
      title: 'Officer Rectification & Resolution Proof',
      desc: 'Ward engineers update status (In Progress, Resolved) and are required to upload photo evidence of asphalt resurfacing or dewatering before an issue is marked resolved.',
      icon: CheckCircle
    },
    {
      num: '05',
      title: 'Community Verification & Points',
      desc: 'Citizens who commute through the area upvote or verify whether the fix is genuine. Helpful reporters earn Citizen Points and community badges.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <DisclaimerBanner variant="independent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Operational Lifecycle</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How CityShield AI Operates
          </h1>
          <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
            From initial snapshot to municipal work order and community verification.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex items-start space-x-5">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary font-black text-lg flex items-center justify-center flex-shrink-0">
                  {s.num}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">{s.title}</h3>
                    <Icon className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
