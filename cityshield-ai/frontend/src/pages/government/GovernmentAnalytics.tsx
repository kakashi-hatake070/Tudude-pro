import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const GovernmentAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Infrastructure Failure Analytics</h1>
          <p className="text-xs text-text-muted mt-0.5">Repeated waterlogging clusters, seasonal pothole frequency, and repair endurance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Chronic Inundation Blackspots</h3>
            <p className="text-xs text-text-muted">Silk Board and Koramangala 80ft road show 85% vulnerability under &gt;20mm/hr precipitation.</p>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold">
              Engineering Recommendation: Desilt Raja Kaluve storm drain culvert.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Road Surface Endurance</h3>
            <p className="text-xs text-text-muted">100 Feet Road Indiranagar reports 4 recurring potholes per quarter due to heavy bus axle load.</p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-bold">
              Engineering Recommendation: Bituminous Concrete overlay replacement.
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Waste Collection Adherence</h3>
            <p className="text-xs text-text-muted">4th Block Koramangala commercial corridor experiences repeat secondary garbage dumps on weekends.</p>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800 font-bold">
              Engineering Recommendation: Increase evening compacting vehicle rounds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
