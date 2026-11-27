import React, { useState } from 'react';
import { User, Lock, MapPin, Bell, ShieldCheck } from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const rawUser = localStorage.getItem('cs_user');
  const user = rawUser ? JSON.parse(rawUser) : { anonymousId: 'CityGuardian_4821', citizenPoints: 85 };

  const [nearbyAlerts, setNearbyAlerts] = useState(true);
  const [weatherWarnings, setWeatherWarnings] = useState(true);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Citizen Profile & Privacy</h1>
          <p className="text-xs text-text-muted mt-0.5">Manage your pseudonym, privacy shields, and notifications.</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold text-lg">
              <User className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Public Pseudonym</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">{user.anonymousId}</div>
              <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Personally Identifiable Information Exposed</span>
              </p>
            </div>
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Notification Preferences</h3>
            
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="font-bold text-xs text-slate-800">Nearby Road Hazard Alerts</div>
                <div className="text-[11px] text-text-muted">Receive alerts for hazards reported within 2km of your commute</div>
              </div>
              <input
                type="checkbox"
                checked={nearbyAlerts}
                onChange={(e) => setNearbyAlerts(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <div className="font-bold text-xs text-slate-800">Heavy Rainfall & Inundation Warnings</div>
                <div className="text-[11px] text-text-muted">Get alerts when IMD issues Yellow, Orange, or Red district warnings</div>
              </div>
              <input
                type="checkbox"
                checked={weatherWarnings}
                onChange={(e) => setWeatherWarnings(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
