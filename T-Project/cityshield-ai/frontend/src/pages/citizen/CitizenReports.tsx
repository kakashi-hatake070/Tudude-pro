import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { IssueReport } from '../../types';
import { StatusBadge, CategoryBadge, RiskBadge } from '../../components/HazardBadge';
import { MapPin, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';

export const CitizenReports: React.FC = () => {
  const [reports, setReports] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports({ limit: 50 }).then(res => {
      setReports(res.reports || []);
    }).catch(e => console.error(e)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Civic Reports Timeline</h1>
          <p className="text-xs text-text-muted mt-0.5">Track resolution status and municipal engineer remarks.</p>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.trackingId} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-700">{report.trackingId}</span>
                  <CategoryBadge category={report.category} />
                  <StatusBadge status={report.status} />
                </div>
                <RiskBadge score={report.riskScore} />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{report.description}</p>
                <div className="text-[11px] text-text-muted flex items-center space-x-1 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.address}</span>
                  <span>•</span>
                  <span>Reported {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Audit Trail */}
              {report.auditTrail && report.auditTrail.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <span className="font-bold text-slate-800">Latest Action Log:</span>
                  <div className="text-slate-600">
                    {report.auditTrail[report.auditTrail.length - 1].remarks}
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Logged by {report.auditTrail[report.auditTrail.length - 1].changedBy} on{' '}
                    {new Date(report.auditTrail[report.auditTrail.length - 1].timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
