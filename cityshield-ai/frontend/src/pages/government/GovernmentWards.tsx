import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { WardData } from '../../types';
import { MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

export const GovernmentWards: React.FC = () => {
  const [wards, setWards] = useState<WardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWards().then(res => {
      setWards(res.wards || []);
    }).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Municipal Ward Directory & Risk Indices</h1>
          <p className="text-xs text-text-muted mt-0.5">Geospatial ward polygons, statistics, and vulnerability scoring.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wards.map((w) => (
            <div key={w._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Ward {w.wardNumber}</span>
                  <h3 className="font-extrabold text-lg text-slate-900">{w.name}</h3>
                  <div className="text-xs text-text-muted">{w.zone} • {w.city}</div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl font-extrabold text-xs ${
                  w.statistics.riskIndex > 65 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  Risk Index: {w.statistics.riskIndex}/100
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-text-muted block">Total Reports</span>
                  <strong className="text-base text-slate-900">{w.statistics.totalReports}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-text-muted block">Pending</span>
                  <strong className="text-base text-amber-600">{w.statistics.pendingReports}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-text-muted block">Resolved</span>
                  <strong className="text-base text-emerald-600">{w.statistics.resolvedReports}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
